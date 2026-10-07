import app, { initServer } from '../server/app.js'

export default async function handler(req, res) {
  try {
    await initServer()
  } catch (error) {
    console.error('Database/startup initialization failed:', error)

    return res.status(500).json({
      error: 'تعذّر الاتصال بقاعدة البيانات.',
      details: error?.message || 'Unknown database error'
    })
  }

  return app(req, res)
}