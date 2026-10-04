// Local development entry point: run with `npm start`.
// (The deployed-on-Vercel entry point is ../api/index.js, which reuses this same app.)
import app, { ready } from './app.js'
const PORT = process.env.PORT || 4000
ready.then(() => app.listen(PORT, () => console.log('Notrio API on :' + PORT)))
  .catch(e => { console.error('Failed to start:', e.message); process.exit(1) })
