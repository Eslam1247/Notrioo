import { FormEvent, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../i18n'
import { useSEO } from '../hooks/useSEO'

export default function ResetPassword() {
  const [sp] = useSearchParams(); const token = sp.get('token') || ''
  const { resetPassword } = useAuth(); const { t, pick } = useLang(); const nav = useNavigate()
  useSEO(t('reset_password_title'), t('reset_password_title'))
  const [err, setErr] = useState<string | null>(null); const [busy, setBusy] = useState(false); const [done, setDone] = useState(false)
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); setBusy(true); setErr(null)
    const r = await resetPassword(token, `${new FormData(e.currentTarget).get('pw')}`)
    if (r) setErr(r); else setDone(true)
    setBusy(false)
  }
  if (!token) return <section className="max-w-sm mx-auto px-5 pt-24 text-center"><p className="text-magenta">{t('reset_invalid')}</p><Link to="/account" className="btn btn-blue mt-6 inline-block">{t('back_to_login')}</Link></section>
  if (done) return <section className="max-w-sm mx-auto px-5 pt-24 text-center"><div className="text-5xl">✅</div><p className="mt-4">{t('reset_done')}</p><button onClick={() => nav('/account')} className="btn btn-blue mt-6">{pick('تمام', 'Great')}</button></section>
  return (
    <section className="max-w-sm mx-auto px-5 pt-12 pb-20">
      <div className="card p-7 border-t-4 border-t-blue shadow-sm">
        <h1 className="text-xl font-bold">{t('reset_password_title')}</h1>
        <form onSubmit={submit} className="mt-5 flex flex-col gap-3">
          <div className="field"><input name="pw" required minLength={6} type="password" placeholder={t('new_password')} autoComplete="new-password" className="input" dir="ltr" />
            <span className="field-msg err">{pick('٦ أحرف على الأقل من فضلك.', 'At least 6 characters, please.')}</span>
            <span className="field-msg ok">{pick('كلمة مرور قوية 👍', 'Good password 👍')}</span></div>
          {err && <p role="alert" className="text-sm text-magenta bg-[#fff3fa] border border-magenta/30 rounded-lg px-3 py-2">{err}</p>}
          <button disabled={busy} className="btn btn-blue disabled:opacity-40">{busy ? t('sending') : t('reset_password_btn')}</button>
        </form>
      </div>
    </section>
  )
}
