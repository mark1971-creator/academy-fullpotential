# Operations Guide

Deployment, environment configuration, monitoring, and troubleshooting for the academy platform.

## Table of contents

1. [Environment variables](#environment-variables)
2. [Production deployment](#production-deployment)
3. [Routine operations](#routine-operations)
4. [Database migrations](#database-migrations)
5. [Third-party service configuration](#third-party-service-configuration)
6. [Troubleshooting](#troubleshooting)
7. [Runbooks](#runbooks)

For initial VPS setup, see the full [Deployment guide](../DEPLOYMENT.md).

---

## Environment variables

Copy `.env.example` to `.env` (production) or `.env.local` (development).

### Required in production

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_APP_URL` | Canonical public URL, no trailing slash (e.g. `https://academy.beingatfullpotential.com`) |
| `PORT` | Port Next.js listens on (default `3000`; Nginx proxies here) |
| `NEXT_PUBLIC_USE_LOCAL_DATA` | Must be `false` in production |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key (live instance) |
| `CLERK_SECRET_KEY` | Clerk secret key (live instance) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key — **required for enrollments, progress, legacy claim** |
| `STRIPE_SECRET_KEY` | Stripe secret key (live mode) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |

### Clerk redirect URLs (optional overrides)

| Variable | Default |
|----------|---------|
| `NEXT_PUBLIC_CLERK_SIGN_IN_URL` | `/sign-in` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_URL` | `/sign-up` |
| `NEXT_PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL` | `/my-courses` |
| `NEXT_PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL` | `/my-courses` |

### Build-time vs runtime

`NEXT_PUBLIC_*` variables are **inlined at build time**. After changing any `NEXT_PUBLIC_*` value:

```bash
npm run build
pm2 reload academy-fullpotential
```

Server-only variables (`CLERK_SECRET_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_*`) are read at runtime and do not require a rebuild.

---

## Production deployment

### Infrastructure

| Component | Details |
|-----------|---------|
| Server | Contabo VPS (Ubuntu 22.04+) |
| Process manager | PM2 (`ecosystem.config.js`) |
| Reverse proxy | Nginx (`deploy/nginx-academy.conf.example`) |
| SSL | Let's Encrypt (certbot) |
| Domain | `academy.beingatfullpotential.com` |

### Deploy script

On the server, after `git pull`:

```bash
chmod +x scripts/vps-deploy.sh   # first time only
./scripts/vps-deploy.sh
```

The script runs:

1. `npm ci` — clean install dependencies
2. `npm run build` — production build
3. `pm2 reload ecosystem.config.js` — zero-downtime reload

Equivalent npm command: `npm run deploy:vps`

### First-time deploy checklist

1. Clone repository to `/var/www/academy-fullpotential`
2. Copy and fill `.env` from `.env.example`
3. Apply Supabase migrations (SQL editor or CLI)
4. Run `npm run seed` to load course content
5. Run `npm run seed:legacy-enrollments` for HPCC legacy students
6. Configure Nginx using `deploy/nginx-academy.conf.example`
7. Set up SSL with certbot
8. Start PM2: `pm2 start ecosystem.config.js`
9. Configure PM2 startup: `pm2 startup` + `pm2 save`
10. Configure Stripe webhook pointing to `/api/webhooks/stripe`
11. Configure Clerk production domain and redirect URLs

### PM2 commands

```bash
pm2 status                          # process health
pm2 logs academy-fullpotential      # live logs
pm2 reload academy-fullpotential    # zero-downtime reload after build
pm2 restart academy-fullpotential   # hard restart
```

---

## Routine operations

### Deploy a code update

```bash
cd /var/www/academy-fullpotential
git pull origin main
./scripts/vps-deploy.sh
```

### Update course content

```bash
# On dev machine: edit seed files, commit, push
# On server:
git pull origin main
node supabase/seed_lessons.mjs --slug <course-slug>
node supabase/seed_assignments.mjs --slug <course-slug>
# No rebuild needed for content-only changes
```

### Upload new assignment files

```bash
node scripts/upload-assignment-file.mjs \
  --course <slug> --module <n> --file <path> --primary
```

### Regenerate OG image

```bash
npm run generate:og-image
npm run build
./scripts/vps-deploy.sh
```

### Check legacy enrollment status

```bash
node scripts/check-legacy-enrollments.mjs
```

---

## Database migrations

Migrations are SQL files in `supabase/migrations/`. Apply them in chronological order via the Supabase dashboard SQL editor or Supabase CLI.

### Apply a new migration

1. Add the SQL file to `supabase/migrations/`
2. Run it in Supabase SQL editor (or `supabase db push` if using CLI)
3. Verify with a test query
4. Run seed scripts if the migration affects content structure

### Migration history

| File | Description |
|------|-------------|
| `20250611000000_initial_schema.sql` | Core LMS tables |
| `20250612000000_assignments_and_youtube.sql` | Assignments; `youtube_url` rename |
| `20250613000000_quizzes_and_item_progress.sql` | Quizzes and item progress tables |
| `20250614000000_course_metadata_and_lesson_types.sql` | Course marketing fields; lesson types |
| `20250615000000_api_role_grants.sql` | API role grants fix |
| `20250617000000_course_preview_fields.sql` | Preview page fields |
| `20250618000000_assignment_resources.sql` | Multi-file assignment support |

---

## Third-party service configuration

### Clerk

**Dashboard:** [clerk.com](https://dashboard.clerk.com)

| Setting | Value |
|---------|-------|
| Instance | Production (live keys) |
| Allowed origins | `https://academy.beingatfullpotential.com` |
| Sign-in URL | `/sign-in` |
| Sign-up URL | `/sign-up` |
| After sign-in redirect | `/my-courses` |
| After sign-up redirect | `/my-courses` |

### Supabase

**Dashboard:** [supabase.com](https://supabase.com/dashboard)

| Setting | Notes |
|---------|-------|
| API URL | `NEXT_PUBLIC_SUPABASE_URL` |
| Anon key | Public reads (catalog) |
| Service role key | Server writes — **must be on VPS `.env`** |
| Storage | Bucket for assignment files |
| RLS | Enabled; published courses readable by anon |

### Stripe

**Dashboard:** [stripe.com](https://dashboard.stripe.com)

| Setting | Value |
|---------|-------|
| Mode | Live (production) |
| Webhook endpoint | `https://academy.beingatfullpotential.com/api/webhooks/stripe` |
| Webhook events | `checkout.session.completed` |
| Success URL | Set dynamically in checkout session |
| Cancel URL | Set dynamically in checkout session |

---

## Troubleshooting

### User cannot access enrolled course

1. Check Clerk session — is the user signed in?
2. Check Supabase `enrollments` table for `user_id` + `course_id` row
3. For legacy students: verify email matches `hpcc-legacy-enrollees.mjs` entry
4. Check VPS logs for claim errors: `pm2 logs academy-fullpotential | grep claim`
5. Verify `SUPABASE_SERVICE_ROLE_KEY` is set on VPS

### Legacy enrollment not claimed

| Symptom | Likely cause | Fix |
|---------|--------------|-----|
| User signed up but no HPCC access | Email mismatch | User must sign up with original purchase email |
| Claim silently fails | Missing service role key | Add `SUPABASE_SERVICE_ROLE_KEY` to `.env`, rebuild |
| No legacy profile exists | Seed not run | Run `npm run seed:legacy-enrollments` |
| User tried to sign in (not sign up) | Old WP password won't work | User must create new account via sign-up |

### Payment succeeded but no enrollment

1. Check Stripe dashboard for the checkout session status
2. Check webhook delivery logs in Stripe
3. Check PM2 logs for webhook errors: `pm2 logs | grep stripe`
4. Verify `STRIPE_WEBHOOK_SECRET` matches the endpoint secret in Stripe
5. Manually grant enrollment in Supabase if needed (see runbook below)

### Build fails after env change

`NEXT_PUBLIC_*` changes require a full rebuild:

```bash
npm run build
```

If build fails, check for missing required env vars.

### Course content not showing

1. Verify `NEXT_PUBLIC_USE_LOCAL_DATA=false` in production
2. Check Supabase connectivity from server
3. Verify seed was run: query `lessons` table for the course's modules
4. Check PM2 logs for Supabase errors

### OG image not updating on social media

Social platforms cache OG images aggressively:

1. Regenerate: `npm run generate:og-image`
2. Rebuild and deploy
3. Use Facebook Sharing Debugger to scrape fresh metadata
4. Use LinkedIn Post Inspector for LinkedIn

---

## Runbooks

### Manually grant enrollment

When automatic enrollment fails (e.g. webhook missed):

```sql
-- 1. Ensure profile exists
INSERT INTO profiles (id, email, first_name, last_name)
VALUES ('clerk_user_id_here', 'user@example.com', 'First', 'Last')
ON CONFLICT (id) DO NOTHING;

-- 2. Grant enrollment
INSERT INTO enrollments (user_id, course_id, progress_percent)
VALUES (
  'clerk_user_id_here',
  (SELECT id FROM courses WHERE slug = 'human-potential-coach-certification'),
  0
)
ON CONFLICT (user_id, course_id) DO NOTHING;
```

Find the Clerk user ID in the Clerk dashboard.

### Add a legacy student manually

1. Add entry to `hpcc-legacy-enrollees.mjs`
2. Run `npm run seed:legacy-enrollments`
3. Confirm with `node scripts/check-legacy-enrollments.mjs`

### Roll back a deploy

```bash
git log --oneline -5                    # find previous commit
git checkout <previous-commit-hash>
./scripts/vps-deploy.sh
# After verifying, return to main:
git checkout main
```

### Verify environment on server

```bash
node scripts/check-env.mjs   # if available, or manually:
grep -E '^[A-Z]' .env | sed 's/=.*$/=***/'   # list keys without values
```

Critical keys to verify: `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_USE_LOCAL_DATA=false`.

---

## Related documentation

- [Deployment guide](../DEPLOYMENT.md) — full VPS setup from scratch
- [Architecture](./ARCHITECTURE.md) — system design and data flows
- [Curriculum](./CURRICULUM.md) — content management
