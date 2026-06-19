# Production deployment (Contabo VPS + PM2 + Nginx)

Self-host the Being at Full Potential Academy by pulling from GitHub, building on the server, and running with PM2 behind Nginx.

## Requirements

- Ubuntu 22.04+ (or similar Linux) on Contabo VPS
- **Node.js 20 LTS** or newer (`node -v`)
- **npm** 10+
- **PM2** (`npm install -g pm2`)
- **Nginx** with SSL (Let's Encrypt)
- Git access to the GitHub repository
- Accounts: [Clerk](https://clerk.com), [Supabase](https://supabase.com), [Stripe](https://stripe.com)

## 1. One-time server setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node 20 (NodeSource example)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs git nginx

# PM2
sudo npm install -g pm2

# PM2 starts on boot
pm2 startup systemd
# Run the command PM2 prints, then:
pm2 save
```

Create an app user and directory (recommended):

```bash
sudo adduser --disabled-password --gecos "" academy
sudo mkdir -p /var/www/academy-fullpotential
sudo chown academy:academy /var/www/academy-fullpotential
sudo -iu academy
cd /var/www/academy-fullpotential
```

## 2. Clone the repository

```bash
cd /var/www/academy-fullpotential

# First time
git clone https://github.com/YOUR_ORG/academy-fullpotential.git .

# Later updates
git pull origin main
```

## 3. Configure environment (`.env`)

Copy the template and edit on the server:

```bash
cp .env.example .env
nano .env
```

**Required variables** (see `.env.example`):

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Public URL, e.g. `https://academy.beingatfullpotential.com` (no trailing slash) |
| `PORT` | Port Next.js listens on (default `3000`) |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key |
| `CLERK_SECRET_KEY` | Clerk secret key |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role (server only) |
| `STRIPE_SECRET_KEY` | Stripe secret key (live mode in production) |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook signing secret |
| `NEXT_PUBLIC_USE_LOCAL_DATA` | Must be `false` in production |

> **Important:** `NEXT_PUBLIC_*` values are embedded at **build time**. After changing them, run `npm run build` again.

## 4. Install, build, and start

```bash
cd /var/www/academy-fullpotential

npm ci
npm run build

pm2 start ecosystem.config.js
pm2 save
```

Or use the deploy script after the first setup:

```bash
chmod +x scripts/vps-deploy.sh
./scripts/vps-deploy.sh
```

## 5. Nginx reverse proxy

Point your domain to the VPS IP, then configure Nginx to proxy to `127.0.0.1:3000` (or your `PORT`).

See `deploy/nginx-academy.conf.example` for a full sample including Stripe webhook headers.

```bash
sudo cp deploy/nginx-academy.conf.example /etc/nginx/sites-available/academy
sudo nano /etc/nginx/sites-available/academy   # set server_name, SSL paths
sudo ln -s /etc/nginx/sites-available/academy /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

## 6. Clerk (custom domain)

In [Clerk Dashboard](https://dashboard.clerk.com) → your application → **Configure**:

1. **Domains** — add your production domain (e.g. `academy.beingatfullpotential.com`).
2. **Paths** — sign-in `/sign-in`, sign-up `/sign-up` (defaults match this app).
3. **Allowed redirect URLs** — include:
   - `https://YOUR_DOMAIN/my-courses`
   - `https://YOUR_DOMAIN/sign-in`
   - `https://YOUR_DOMAIN/sign-up`
4. Use **live** API keys (`pk_live_…`, `sk_live_…`) in production `.env`.

Clerk middleware protects `/my-courses` and `/dashboard`; no extra VPS config needed.

## 7. Stripe (checkout + webhooks)

1. **API keys** — use live keys in `.env` for production.
2. **Webhook endpoint** — Stripe Dashboard → Developers → Webhooks → Add endpoint:
   - URL: `https://YOUR_DOMAIN/api/webhooks/stripe`
   - Events: `checkout.session.completed`
3. Copy the **signing secret** into `STRIPE_WEBHOOK_SECRET`.
4. `NEXT_PUBLIC_APP_URL` must match your public HTTPS URL (used for checkout success/cancel redirects).

Test webhook delivery from the Stripe Dashboard after deploy.

## 8. Supabase

1. Use the same project URL and keys as development (or a dedicated production project).
2. Run migrations in the Supabase SQL editor if not already applied (`supabase/migrations/`).
3. Seed course data once if needed: `npm run seed` (requires `.env` with service role key).
4. Supabase does not require your domain in CORS for server-side + anon client usage; RLS policies apply as configured.

## 9. Routine deploy (after code changes)

```bash
cd /var/www/academy-fullpotential
git pull origin main
./scripts/vps-deploy.sh
```

Manual equivalent:

```bash
git pull origin main
npm ci
npm run build
pm2 reload ecosystem.config.js --update-env
pm2 save
```

## 10. PM2 commands

```bash
pm2 status
pm2 logs academy-fullpotential
pm2 restart academy-fullpotential
pm2 stop academy-fullpotential
pm2 monit
```

## 11. Verify production

- `https://YOUR_DOMAIN/` — catalog loads
- `https://YOUR_DOMAIN/courses/human-potential-coach-certification` — preview page
- Sign in / sign up — Clerk redirects to `/my-courses`
- Paid enrollment — Stripe Checkout returns to `/courses/.../enroll/success`
- Stripe Dashboard → Webhooks — recent `checkout.session.completed` events succeed

## Troubleshooting

| Issue | Check |
|-------|--------|
| 502 Bad Gateway | `pm2 status`, app listening on `PORT`, Nginx upstream port |
| Clerk auth fails | Live keys, domain added in Clerk, HTTPS working |
| Stripe redirect wrong | `NEXT_PUBLIC_APP_URL`, rebuild after changing |
| Webhook 400/503 | `STRIPE_WEBHOOK_SECRET`, endpoint URL, Nginx not stripping body |
| Course data missing | Supabase keys, `NEXT_PUBLIC_USE_LOCAL_DATA=false`, run seeds |
| Build OOM on small VPS | Add swap or build locally and rsync `.next` (not recommended long-term) |

## Local development

```bash
cp .env.example .env.local   # fill with test keys
npm install
npm run dev
```
