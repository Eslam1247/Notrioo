import app, { ready } from '../server/app.js'

export default async function handler(req, res) {
  try {
    await ready
  } catch (error) {
    console.error('Database/startup initialization failed:', error)

    return res.status(500).json({
      error: 'تعذّر الاتصال بقاعدة البيانات.',
      details:
        process.env.NODE_ENV === 'production'
          ? 'تحقق من DATABASE_URL في Vercel وأنه رابط PostgreSQL صحيح من Supabase.'
          : error?.message || 'Unknown database error'
    })
  }

  return app(req, res)
}