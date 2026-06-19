# Being at Full Potential Academy

Next.js 16 LMS for course previews, enrollment (Clerk + Stripe), and the protected learn experience (Supabase).

## Local development

```bash
cp .env.example .env.local   # fill with test keys
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Seed course content into Supabase (requires `.env.local` with service role key):

```bash
npm run seed
```

## Production (Contabo VPS)

Deploy with **PM2 + Nginx** by pulling from GitHub. Full step-by-step instructions:

**[DEPLOYMENT.md](./DEPLOYMENT.md)**

Quick reference on the server:

```bash
git pull origin main
cp .env.example .env   # first deploy only — fill with live keys
chmod +x scripts/vps-deploy.sh
./scripts/vps-deploy.sh
npm run seed           # first deploy only — loads courses, lessons, assignments
```

### Production checklist

1. **`.env`** — live Clerk keys, Supabase URL/keys, Stripe live keys, `NEXT_PUBLIC_APP_URL=https://your-domain.com`, `NEXT_PUBLIC_USE_LOCAL_DATA=false`
2. **Clerk** — production domain, redirect URLs include `/my-courses`, `/sign-in`, `/sign-up`
3. **Stripe** — live mode; webhook `https://your-domain.com/api/webhooks/stripe` (`checkout.session.completed`)
4. **Build** — run `npm run build` after any `NEXT_PUBLIC_*` change
5. **Seed** — run `npm run seed` once after Supabase migrations are applied

Files involved:

- `ecosystem.config.js` — PM2 process (reads `.env`)
- `.env.example` — environment template
- `deploy/nginx-academy.conf.example` — Nginx reverse proxy sample

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [Clerk](https://clerk.com) — authentication
- [Supabase](https://supabase.com) — database & storage
- [Stripe](https://stripe.com) — payments & webhooks
