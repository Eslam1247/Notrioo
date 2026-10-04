// Vercel serverless entry point: every request to /api/* lands here and is handed to the
// same Express app used for local development (../server/app.js) — no separate backend host needed.
import app, { ready } from '../server/app.js'

export default async function handler(req, res) {
  try {
    await ready // make sure the DB connection/tables are set up before the first request is served
  } catch (e) {
    console.error('Database/startup init failed:', e)
    res.status(500).json({ error: 'تعذّر الاتصال بقاعدة البيانات. تأكد من قيمة DATABASE_URL في إعدادات Vercel.' })
    return
  }
  app(req, res)
}
