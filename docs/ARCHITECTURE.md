# Architecture Design

This document describes the system architecture of the Being at Full Potential Academy platform: components, data flows, security boundaries, and design decisions.

## Table of contents

1. [High-level architecture](#high-level-architecture)
2. [Application layers](#application-layers)
3. [Routing and access control](#routing-and-access-control)
4. [Authentication](#authentication)
5. [Enrollment and payments](#enrollment-and-payments)
6. [Learn experience](#learn-experience)
7. [Data architecture](#data-architecture)
8. [External integrations](#external-integrations)
9. [Security model](#security-model)
10. [Design decisions](#design-decisions)

---

## High-level architecture

The platform is a **monolithic Next.js application** deployed on a single VPS. All server-side logic runs in the Next.js process; there is no separate API server or microservices layer.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              End users                                   │
│                    (browsers, social link previews)                      │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │ HTTPS
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Nginx (reverse proxy)                            │
│              academy.beingatfullpotential.com → :3000                    │
│                    SSL termination (Let's Encrypt)                       │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Next.js 16 (PM2 managed)                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐ │
│  │ App Router   │  │ Server       │  │ Route        │  │ proxy.ts    │ │
│  │ (pages)      │  │ Actions      │  │ Handlers     │  │ (Clerk MW)  │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └─────────────┘ │
│         └─────────────────┴─────────────────┘                          │
│                              │                                           │
│                    lib/ (business logic)                                 │
└──────────┬──────────────────┬──────────────────┬──────────────────────┘
           │                  │                  │
           ▼                  ▼                  ▼
    ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
    │   Clerk     │   │  Supabase   │   │   Stripe    │
    │   (auth)    │   │  (Postgres  │   │  (payments) │
    │             │   │  + storage) │   │             │
    └─────────────┘   └─────────────┘   └─────────────┘
                              │
                              ▼
                      ┌─────────────┐
                      │  YouTube    │
                      │  (videos)   │
                      └─────────────┘
```

### Runtime topology

| Component | Role |
|-----------|------|
| **Nginx** | TLS, static caching headers, reverse proxy to Node |
| **PM2** | Process manager; auto-restart, log rotation, startup on boot |
| **Next.js** | SSR/SSG pages, server actions, API routes, middleware |
| **Clerk** | Identity provider; session tokens; sign-in/sign-up UI |
| **Supabase** | Authoritative data store; RLS for public reads; service role for writes |
| **Stripe** | Hosted checkout; webhook for payment confirmation |
| **YouTube** | Video hosting; URLs stored in lesson records |

---

## Application layers

### Presentation layer (`app/`, `components/`)

| Area | Path | Responsibility |
|------|------|----------------|
| Marketing home | `app/page.tsx` | Landing page with vision, testimonials, CTA |
| Course catalog | `app/courses/page.tsx` | Grid of published programs |
| Course preview | `app/courses/[slug]/page.tsx` | Public marketing page per course |
| Learn experience | `app/my-courses/[slug]/page.tsx` | Protected course player |
| My Learning | `app/my-courses/page.tsx` | Enrolled courses dashboard |
| Auth pages | `app/sign-in/`, `app/sign-up/` | Clerk-hosted authentication |
| Preview UI | `components/course-preview/` | Hero, curriculum overview, enroll CTA |
| Learn UI | `components/course-learn/`, `components/course/` | `CoursePlayer`, progress sidebar, item rendering |

### Application layer (`lib/`)

Server-side business logic organized by domain:

```
lib/
├── actions/
│   ├── courses.ts       # Catalog queries, preview vs full curriculum loaders
│   ├── enrollments.ts   # Enrollment grants, progress tracking, access guards
│   └── users.ts         # Clerk → Supabase profile sync
├── supabase/
│   ├── server.ts        # Cookie-based anon client (public reads)
│   ├── admin.ts         # Service-role client (privileged writes)
│   ├── mappers.ts       # DB snake_case → LMS camelCase
│   └── errors.ts        # Connectivity detection, safe fallbacks
├── stripe/
│   ├── checkout.ts      # Create Checkout sessions
│   ├── fulfill.ts       # Verify and grant on success redirect
│   └── server.ts        # Stripe SDK singleton
├── clerk/
│   └── routes.ts        # Auth URL constants, redirect sanitization
├── legacy-enrollments.ts  # WordPress migration claim logic
├── courses/
│   ├── fixtures.ts      # Local dev fallback data
│   ├── utils.ts         # Progress calculation, navigation
│   ├── placeholders.ts  # "Coming soon" lesson detection
│   └── catalog-order.ts # Canonical catalog sort order
└── env.ts               # Environment validation helpers
```

### Data layer (`supabase/`)

- **Migrations** (`supabase/migrations/`) — versioned SQL schema
- **Seed scripts** (`supabase/seed_*.mjs`) — idempotent content loading
- **Seed data** (`supabase/seed-data/`) — course definitions and curriculum as JavaScript modules

### Types (`types/`)

- `database.ts` — Supabase-generated table types
- `lms.ts` — Application domain types (`CourseWithCurriculum`, `CurriculumItem`, etc.)

---

## Routing and access control

### Route map

```
/                           Public     Marketing home
/courses                    Public     Program catalog
/courses/[slug]             Public     Course preview (marketing)
/courses/[slug]/enroll      Auth*      Enrollment entry (route handler)
/courses/[slug]/enroll/success  Auth*  Stripe success fulfillment
/my-courses                 Protected  Enrolled courses dashboard
/my-courses/[slug]          Protected  Learn experience (requires enrollment)
/dashboard                  Protected  Redirects to /my-courses
/sign-in                    Public     Clerk sign-in
/sign-up                    Public     Clerk sign-up

/api/auth/sync              Auth*      Profile sync + legacy claim
/api/webhooks/stripe        Public**   Stripe webhook (signature verified)
/api/courses                Public     JSON course list
```

\* Requires Clerk session (enroll route redirects unauthenticated users to sign-up).  
\** Public endpoint; secured by Stripe webhook signature verification.

### Middleware (`proxy.ts`)

Next.js 16 uses `proxy.ts` (not `middleware.ts`) for Clerk middleware. It protects:

- `/my-courses(.*)`
- `/dashboard(.*)`

Unauthenticated requests to protected routes redirect to `/sign-in`.

### Preview vs learn split

The platform deliberately separates **marketing preview** from **learning**:

| Concern | Preview (`/courses/[slug]`) | Learn (`/my-courses/[slug]`) |
|---------|----------------------------|------------------------------|
| Access | Public | Authenticated + enrolled |
| Data loader | `getCoursePreviewBySlug` | `getCourseWithCurriculumBySlug` |
| Query depth | Modules + lesson titles/IDs only | Full nested curriculum with content |
| UI | Hero, testimonials, outcomes, curriculum outline | `CoursePlayer` with videos, assignments, quizzes |
| Primary CTA | Enroll | Continue learning / mark complete |

This split keeps preview pages fast and avoids exposing lesson content to non-enrolled users.

---

## Authentication

### Clerk integration

Clerk owns all identity. User IDs from Clerk are stored as `profiles.id` (text primary key) in Supabase. There is no Supabase Auth — Clerk sessions are validated in middleware and server components via `@clerk/nextjs/server`.

### Profile sync flow

After sign-in or sign-up, the client component `components/auth-complete-redirect.tsx` calls `POST /api/auth/sync`, which:

1. Upserts the user's profile in Supabase (`lib/actions/users.ts` → `syncCurrentUserProfile`)
2. Attempts legacy enrollment claim (see below)
3. Redirects to the intended destination (default: `/my-courses`)

```
User signs in/up (Clerk)
        │
        ▼
AuthCompleteRedirect (client)
        │
        ▼
POST /api/auth/sync
        │
        ├── syncCurrentUserProfile()
        │       └── UPSERT profiles (id, email, name, avatar)
        │
        └── claimLegacyEnrollmentsForUser()
                └── Move enrollments from legacy:<email> → Clerk user id
```

### Legacy enrollment migration

Students who purchased HPCC on the previous WordPress site were migrated with placeholder profiles:

- Profile ID format: `legacy:<normalized-email>` (e.g. `legacy:jane@example.com`)
- Enrollments attached to these placeholder profiles
- Seeded via `npm run seed:legacy-enrollments` from `supabase/seed-data/hpcc-legacy-enrollees.mjs`

When a user signs up with a matching email:

1. `claimLegacyEnrollmentsForUser` finds the `legacy:<email>` profile
2. Reassigns all enrollments to the Clerk user ID
3. Reassigns `lesson_progress`, `assignment_progress`, `quiz_progress`
4. Deletes the legacy placeholder profile

**Requirements for claim to work in production:**

- `SUPABASE_SERVICE_ROLE_KEY` must be set on the VPS
- User must **sign up** (create a new Clerk account) with the same email used at purchase
- Legacy enrollments must be seeded in Supabase

---

## Enrollment and payments

### Enrollment flow

```
User clicks "Enroll" on preview page
        │
        ▼
GET /courses/[slug]/enroll
        │
        ├── Not signed in? → redirect /sign-up?redirect_url=...
        ├── Already enrolled? → redirect /my-courses/[slug]
        ├── price === 0? → enrollInCourse() → redirect /my-courses/[slug]
        └── price > 0? → createStripeCheckoutSession() → redirect Stripe
                                    │
                    ┌───────────────┴───────────────┐
                    ▼                               ▼
        Success redirect                    Webhook (async)
        /courses/[slug]/enroll/success        POST /api/webhooks/stripe
                    │                               │
                    └── fulfillCheckoutSession() ───┘
                                    │
                                    ▼
                        grantCourseEnrollment()
                                    │
                                    ▼
                        redirect /my-courses/[slug]?payment=success
```

### Dual fulfillment

Paid enrollments are granted through **two paths** for reliability:

1. **Success redirect** — user returns from Stripe; `fulfillCheckoutSession` verifies the session and grants enrollment immediately
2. **Webhook** — `checkout.session.completed` event grants enrollment if the redirect path fails (browser closed, network issue)

Both paths call `grantCourseEnrollment`, which upserts the profile and creates the enrollment row. Duplicate grants are safe because enrollments have a unique constraint on `(user_id, course_id)`.

### Stripe Checkout metadata

Each session includes metadata used for fulfillment:

- `userId` — Clerk user ID
- `courseId` — Supabase course UUID
- `courseSlug` — for redirect URLs

### Free enrollment

Courses with `price = 0` skip Stripe entirely. `enrollInCourse` grants access directly via the service-role Supabase client.

---

## Learn experience

### Course player (`components/course/CoursePlayer.tsx`)

The learn UI renders a curriculum sidebar and a main content area. Curriculum items are unified into a flat navigable list:

| Item type | Source table | Rendering |
|-----------|--------------|-----------|
| Lesson (video) | `lessons` where `lesson_type = 'video'` | Reading content above YouTube embed |
| Lesson (resource) | `lessons` where `lesson_type = 'resource'` | Markdown/HTML reading content |
| Assignment | `assignments` | Instructions + downloadable files |
| Quiz | `quizzes` | Multiple-choice questions |

### Progress tracking

Progress is tracked at two levels:

1. **Item level** — `lesson_progress`, `assignment_progress`, `quiz_progress` record completion timestamps per user per item
2. **Course level** — `enrollments.progress_percent` is recalculated when items are marked complete

`markCurriculumItemComplete` (in `lib/actions/enrollments.ts`) handles marking items and updating aggregate progress.

### Content coming soon

Courses without full curriculum show placeholder lessons (`lib/courses/placeholders.ts`). The learn layout displays a `ContentComingSoonBanner` when placeholder content is detected.

---

## Data architecture

### Entity relationship diagram

```
profiles (id = Clerk user id)
    │
    ├── enrollments ──────────► courses
    │       │                       │
    │       │                       └── modules ──► lessons
    │       │                       │                  ├── assignments (lesson_id)
    │       │                       │                  └── quizzes (lesson_id)
    │       │                       │
    │       │                       └── assignments (module_id)
    │       │                       └── quizzes (module_id)
    │       │
    │       ├── lesson_progress ──► lessons
    │       ├── assignment_progress ► assignments
    │       └── quiz_progress ────► quizzes
```

### Core tables

| Table | Primary key | Purpose |
|-------|-------------|---------|
| `profiles` | `id` (text) | User records synced from Clerk; legacy IDs use `legacy:<email>` |
| `courses` | `id` (uuid) | Program catalog with marketing metadata and price |
| `modules` | `id` (uuid) | Course sections, ordered by `sort_order` |
| `lessons` | `id` (uuid) | Video or reading content within a module |
| `assignments` | `id` (uuid) | Downloadable resources; linked to module or lesson |
| `quizzes` | `id` (uuid) | JSON `questions` array; linked to module or lesson |
| `enrollments` | `id` (uuid) | User ↔ course access; `progress_percent`, `completed_at` |
| `lesson_progress` | `id` (uuid) | Per-user lesson completion |
| `assignment_progress` | `id` (uuid) | Per-user assignment completion |
| `quiz_progress` | `id` (uuid) | Per-user quiz completion |

### Course metadata fields

Beyond title and description, courses store marketing content in Supabase:

| Field | Type | Used on preview |
|-------|------|-----------------|
| `tagline` | text | Hero subtitle |
| `hero_video_url` | text | Intro video embed |
| `duration_label` | text | e.g. "7 weeks" |
| `level` | text | e.g. "Expert" |
| `rating`, `rating_count` | numeric | Star rating display |
| `what_you_will_learn` | jsonb | Bullet list of outcomes |
| `who_this_is_for` | jsonb | Target audience bullets |
| `testimonials` | jsonb | Student quotes |
| `tags` | jsonb | Category badges |

### Migrations

Schema is versioned in `supabase/migrations/`:

| Migration | Purpose |
|-----------|---------|
| `20250611000000_initial_schema.sql` | Core tables: profiles, courses, modules, lessons, enrollments, lesson_progress |
| `20250612000000_assignments_and_youtube.sql` | Rename `video_url` → `youtube_url`; assignments table |
| `20250613000000_quizzes_and_item_progress.sql` | Quizzes; assignment_progress; quiz_progress |
| `20250614000000_course_metadata_and_lesson_types.sql` | Marketing fields; `lesson_type`, `duration_label` |
| `20250615000000_api_role_grants.sql` | Grant API roles access to public schema |
| `20250617000000_course_preview_fields.sql` | `tagline`, `who_this_is_for`, `testimonials` |
| `20250618000000_assignment_resources.sql` | `resource_files` JSONB for multiple downloads |

Apply migrations via the Supabase SQL editor or CLI before running seed scripts.

---

## External integrations

### Clerk

- **Publishable key** — client-side; embedded at build time
- **Secret key** — server-side; validates sessions in middleware and server actions
- **Redirect URLs** — must include production domain paths (`/my-courses`, `/sign-in`, `/sign-up`)
- **Configuration** — `lib/clerk/routes.ts` centralizes auth URL constants

### Supabase

Two clients are used:

| Client | File | Key | Usage |
|--------|------|-----|-------|
| Server (anon) | `lib/supabase/server.ts` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public catalog reads; respects RLS |
| Admin | `lib/supabase/admin.ts` | `SUPABASE_SERVICE_ROLE_KEY` | Enrollments, progress, profile sync, legacy claim |

RLS policies allow anonymous reads of published courses. All writes use the service role to bypass RLS, with authorization enforced in application code (Clerk session checks).

### Stripe

- **Checkout** — hosted payment page; success/cancel URLs point back to the academy domain
- **Webhook** — `POST /api/webhooks/stripe` verifies signature with `STRIPE_WEBHOOK_SECRET`
- **Live mode** — production uses live keys; test mode for local development

### YouTube

Lesson videos are YouTube URLs stored in `lessons.youtube_url`. The player (`react-player`) embeds them. No video files are hosted on the academy server.

### Supabase Storage

Assignment files (PDF, DOCX) are uploaded to Supabase Storage and referenced in `assignments.file_url` or `assignments.resource_files`. Upload via `scripts/upload-assignment-file.mjs`.

---

## Security model

### Authentication boundary

- Clerk middleware protects `/my-courses` and `/dashboard`
- Server actions call `auth()` from Clerk before any privileged operation
- `requireEnrollmentForSlug` guards learn routes — redirects non-enrolled users to the public preview

### Authorization

| Operation | Check |
|-----------|-------|
| View catalog | Public (RLS: `is_published = true`) |
| View lesson content | Clerk session + active enrollment |
| Grant enrollment | Stripe payment verification OR free enroll action |
| Update progress | Clerk session + active enrollment |
| Profile sync | Clerk session (user can only sync own profile) |
| Legacy claim | Email match between Clerk account and legacy profile |

### Secrets handling

- `.env` / `.env.local` are gitignored
- `SUPABASE_SERVICE_ROLE_KEY` and `CLERK_SECRET_KEY` are server-only (never prefixed with `NEXT_PUBLIC_`)
- Stripe webhook signature verification prevents forged payment events
- `NEXT_PUBLIC_*` variables are embedded at build time — not runtime secrets, but should not contain private keys

### Data exposure

- Preview queries intentionally exclude lesson `content` and `youtube_url`
- Full curriculum is only loaded for enrolled users on `/my-courses/[slug]`
- API route `/api/courses` returns published course metadata only (no curriculum)

---

## Design decisions

### Why Clerk + Supabase (not Supabase Auth)?

Clerk provides polished sign-in/sign-up UI, social login options, and session management with minimal custom code. Supabase is used purely as a database, keeping auth concerns separated.

### Why service-role writes?

Server actions run trusted code on the server. Using the Supabase service role avoids complex RLS policies for enrollment and progress writes, while keeping authorization logic explicit in application code.

### Why route handler for enrollment?

Next.js 16 disallows `revalidatePath` during Server Component render. The enroll flow is implemented as `GET /courses/[slug]/enroll` (route handler) so cache revalidation can run before redirects.

### Why seed scripts instead of admin UI?

Course content changes infrequently and is version-controlled in `supabase/seed-data/`. JavaScript seed modules allow rich content (markdown, YouTube URLs, assignment metadata) to live in git alongside the application code.

### Why dual Stripe fulfillment?

Webhook delivery can be delayed or the user may close the browser before the success redirect completes. Granting enrollment on both paths ensures users get access reliably.

### Why legacy profile IDs?

Migrating from WordPress required pre-creating enrollments before users signed up on the new platform. The `legacy:<email>` pattern provides a stable foreign key that gets claimed when the real Clerk profile is created.

### Local development fallback

When Supabase is unreachable in development, `lib/courses/fixtures.ts` serves static course data. Controlled by `NEXT_PUBLIC_USE_LOCAL_DATA` (defaults to `true` in dev, must be `false` in production).

---

## Related documentation

- [Curriculum & content](./CURRICULUM.md) — adding and updating course content
- [Operations](./OPERATIONS.md) — deployment and troubleshooting
- [Deployment guide](../DEPLOYMENT.md) — VPS setup instructions
