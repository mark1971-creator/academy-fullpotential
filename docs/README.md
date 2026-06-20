# Being at Full Potential Academy — Platform Documentation

Documentation for the academy LMS at [academy.beingatfullpotential.com](https://academy.beingatfullpotential.com).

## Documentation index

| Document | Description |
|----------|-------------|
| [Architecture](./ARCHITECTURE.md) | System design, components, data flows, security model, and routing |
| [Curriculum & content](./CURRICULUM.md) | Course catalog, seeding scripts, adding lessons and assignment files |
| [Operations](./OPERATIONS.md) | Deployment, environment variables, monitoring, and troubleshooting |
| [Deployment guide](../DEPLOYMENT.md) | Step-by-step Contabo VPS setup (PM2 + Nginx + SSL) |

## Platform overview

The Being at Full Potential Academy is a learning management system (LMS) for certification programs and courses offered by Being at Full Potential. It provides:

- **Public course catalog** — browse programs, read marketing content, and start enrollment
- **Protected learn experience** — video lessons, reading content, assignments, quizzes, and progress tracking
- **Paid enrollment** — Stripe Checkout for priced courses; free enrollment for $0 programs
- **Legacy student migration** — returning HPCC students from the previous WordPress site reclaim access by signing up with their original email

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4, shadcn/ui, Radix UI |
| Authentication | Clerk |
| Database | Supabase (PostgreSQL) |
| File storage | Supabase Storage (assignment downloads) |
| Payments | Stripe Checkout + webhooks |
| Video | YouTube embeds via react-player |
| Hosting | Contabo VPS, PM2, Nginx |

## Course catalog

Programs are defined in `supabase/seed-data/courses.mjs` and seeded into Supabase.

| Slug | Title | Price | Content status |
|------|-------|-------|----------------|
| `human-potential-coach-certification` | Human Potential Development Coach Certification (HPCC) | $995 | Full curriculum (11 modules) |
| `idg-coach-certification` | IDG Coach Certification | TBD | Placeholder lessons |
| `from-fragmentation-to-wholeness` | From Fragmentation to Wholeness | TBD | 6 modules; videos on modules 1, 3, 4 |
| `breakthroughs-employee-experience` | Breakthroughs in Employee Experience | $99 | Full curriculum (7 modules) |
| `human-potential-team-coach-certification` | Human Potential Team Coach Certification | TBD | Full curriculum (6 modules) |

## Quick start (local development)

```bash
cp .env.example .env.local   # fill with test keys
npm install
npm run dev
```

Seed course content (requires Supabase service role key in `.env.local`):

```bash
npm run seed
```

Open [http://localhost:3000](http://localhost:3000).

## Repository layout

```
academy-fullpotential/
├── app/                    # Next.js App Router pages and API routes
├── components/             # React UI (course-preview, course-learn, course, catalog, ui)
├── lib/                    # Server logic (actions, Supabase, Stripe, Clerk helpers)
├── types/                  # TypeScript types (database.ts, lms.ts)
├── supabase/
│   ├── migrations/         # SQL schema migrations
│   ├── seed-data/          # Course definitions and curriculum content
│   └── seed_*.mjs          # Database seed scripts
├── scripts/                # Ops utilities (deploy, image generation, file uploads)
├── deploy/                 # Nginx configuration sample
├── public/                 # Static assets (logos, course images, OG image)
├── docs/                   # This documentation
├── proxy.ts                # Clerk auth middleware (Next.js 16)
├── ecosystem.config.js     # PM2 process definition
├── DEPLOYMENT.md           # VPS deployment guide
└── .env.example            # Environment variable template
```

## Key npm scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start:prod` | Start production server on `$PORT` |
| `npm run seed` | Full content seed (meta → lessons → assignments → placeholders) |
| `npm run seed:curriculum` | Re-seed lessons and assignments only |
| `npm run seed:legacy-enrollments` | Seed HPCC legacy student placeholder profiles |
| `npm run deploy:vps` | Build and reload PM2 on the server |
| `npm run generate:og-image` | Regenerate social share preview image |

## Support contacts

- **Production URL:** https://academy.beingatfullpotential.com
- **Clerk dashboard:** Authentication and user management
- **Supabase dashboard:** Database, storage, and migrations
- **Stripe dashboard:** Payments and webhook configuration
