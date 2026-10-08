// Vercel serverless entry point: every request to /api/* lands here and is handed to the
// same Express app used for local development (../server/app.js) — no separate backend host needed.
import app, { getReady } from '../server/app.js'

// Removes quoted values (e.g. usernames) so the diagnostic is safe to show in the browser.
const safe = e => String(e?.message || e).replace(/"[^"]*"/g, '"…"').slice(0, 200)

export default async function handler(req, res) {
  try {
    await getReady() // DB connection + tables; retried automatically on the next request if it failed
  } catch (e) {
    console.error('Database/startup init failed:', e)
    res.status(500).json({
      error: 'تعذّر الاتصال بقاعدة البيانات. راجع DATABASE_URL في إعدادات Vercel ثم اعمل Redeploy.',
      detail: safe(e),
      envSeen: { DATABASE_URL: !!process.env.DATABASE_URL, POSTGRES_URL: !!process.env.POSTGRES_URL, STORAGE_URL: !!process.env.STORAGE_URL, JWT_SECRET: !!process.env.JWT_SECRET, ADMIN_KEY: !!process.env.ADMIN_KEY },
    })
    return
  }
  app(req, res)
}
