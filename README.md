# Notrio
Arabic/English notebook store. Frontend: React + Vite + Tailwind. Backend: `server/` (Express, PostgreSQL or a local JSON file).

## Run
    npm install && (cd server && npm install && cp .env.example .env)   # edit server/.env
    (cd server && npm start)      # API on :4000
    npm run dev                   # site on :5173 (proxies /api)

## Database
The server uses **PostgreSQL** automatically if `DATABASE_URL` is set in `server/.env` — get this connection string from your host (Railway, Render, Supabase, Neon all give you one from their dashboard, usually under "Connect" or "Connection string"). Paste it in as-is:

    DATABASE_URL=postgres://user:password@host:5432/dbname

Tables are created automatically on first run — no migration step needed. If `DATABASE_URL` is left empty, the server keeps using a local `server/db.json` file instead, which is enough for development but **not for production** (it isn't safe for concurrent writes and isn't backed up).

## Forgot password
Built in — "Forgot password?" on the sign-in form sends a reset link (valid 15 minutes) to the account's email via Resend (see Payment/Email setup below for `RESEND_API_KEY`). Without Resend configured, the reset token is still generated and stored, but no email goes out — fine for local testing (check `server/db.json` or the `users` table for `reset_token`), not usable for real customers until email is set up. Make sure `PUBLIC_URL` in `server/.env` is set to your real deployed URL so the emailed link isn't `localhost`.

## Google Sign-In
Optional — the "Sign in with Google" button only appears once configured:
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials) → Create Credentials → OAuth client ID → Web application.
2. Add your site's URL (e.g. `https://yourdomain.com` and `http://localhost:5173` for local testing) under "Authorized JavaScript origins".
3. Copy the generated Client ID into **two** places:
   - `.env` (frontend root): `VITE_GOOGLE_CLIENT_ID=...`
   - `server/.env`: `GOOGLE_CLIENT_ID=...` (same value)

## Product photos
Drop `public/products/<id>.jpg` (3:4), ids: classic, lined, journal, meeting, interview, todo, daily, weekly, monthly, project, sketch, grid, creative, idea.

## Payment methods
Cash on delivery, plus manual InstaPay / Vodafone Cash transfer. Set the numbers shown at checkout in `.env`:

    VITE_INSTAPAY_NUMBER=01xxxxxxxxx
    VITE_VODAFONE_CASH_NUMBER=01xxxxxxxxx

When a customer pays by transfer, review their reference in `/admin` and click "Mark as paid" once you've confirmed the money arrived.

## Order management & stock
Visit `/admin` in the site and enter your `ADMIN_KEY` (from server/.env). Two tabs: **Orders** (search, filter, change status, mark paid) and **Stock** (edit quantity per product — decrements automatically on each order, restores automatically if an order is cancelled).

## SEO
`public/sitemap.xml` and `public/robots.txt` are generated from the product catalog — replace `YOUR-DOMAIN.example` in both with your real domain once you have one.

## Deploying: everything on Vercel (recommended — genuinely free, one platform)

The backend (`server/app.js`) also runs as a Vercel Serverless Function via `api/index.js`, so the whole site — frontend and backend — deploys as a single free Vercel project. No second host, no bill.

1. New Project on Vercel → import your repo → root directory is the project root (Vercel auto-detects Vite; the included `vercel.json` also sets the build).
2. Add environment variables in the project's Settings → Environment Variables:
   - `JWT_SECRET`, `ADMIN_KEY` — same values you'd use locally, just a real random secret.
   - `DATABASE_URL` — your Supabase (or other Postgres) connection string. **Tip:** serverless functions open a fresh connection often, so prefer Supabase's "Connection pooling" string (port `6543`, uses PgBouncer) over the direct one if your plan offers it — it handles many short-lived connections much better.
   - `VITE_INSTAPAY_NUMBER`, `VITE_VODAFONE_CASH_NUMBER`, and `VITE_GOOGLE_CLIENT_ID` if you use it.
   - Leave `VITE_API_URL` **empty** — frontend and backend share the same domain now, so relative `/api/...` calls just work. `ALLOWED_ORIGIN` isn't needed either for the same reason (no cross-origin request is being made).
3. Deploy. You'll get one URL, e.g. `https://notrio.vercel.app`, serving both the site and the API.

**The trade-off to know about:** like any serverless platform, an API route that hasn't been called in a while has a "cold start" — the first request after idle time takes a bit longer (roughly half a second to a couple of seconds) while the function spins up and reconnects to the database. Every request after that is fast. For a small store this is unnoticeable in practice.

Local development is unaffected by any of this — run `cd server && npm start` and `npm run dev` in two terminals exactly as before; `vite.config.ts` proxies `/api` to `localhost:4000` in dev.

## Alternative: frontend on Vercel, backend on Render

If you'd rather have an always-on backend with no cold starts at all, Render does offer a genuinely free web service tier (it just puts the service to sleep after 15 minutes of no traffic, waking in under a minute on the next request — no payment required for this tier). To use it instead of the Vercel-functions setup above:

- Render: New Web Service → root directory `server` → build command `npm install` → start command `npm start` → add `JWT_SECRET`, `ADMIN_KEY`, `DATABASE_URL`, and `ALLOWED_ORIGIN` (your Vercel URL, once you have it).
- Vercel: same as above, but set `VITE_API_URL` to your Render URL (e.g. `https://notrio-api.onrender.com`, no trailing slash) instead of leaving it empty.

## Before production
- Set a real random `JWT_SECRET` and `ADMIN_KEY` in `server/.env` — the placeholder values must not ship.
- Set `DATABASE_URL` so orders/users/stock persist reliably (see above).
- Serve everything over HTTPS.
- Keep `server/catalog.json` in sync with `src/data/products.ts` if you add/remove products.
- Build the frontend (`npm run build`) and serve the `dist/` folder from your host, with `/api` proxied to the Node server (or on its own subdomain with CORS enabled).
