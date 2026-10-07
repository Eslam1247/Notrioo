import app, { ready } from '../server/app.js'

export default async function handler(req, res) {
  try {
    await ready
  } catch (error) {
    console.error('Database/startup init failed:', error)

    return res.status(500).json({
      error: 'تعذّر الاتصال بقاعدة البيانات.',
      details:
        error?.message ||
        'تحقق من DATABASE_URL في Vercel.'
    })
  }

  return app(req, res)
}