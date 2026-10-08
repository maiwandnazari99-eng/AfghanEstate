import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { postJson, firstError } from '../api'

const fieldStyle = { display: 'block', width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' }

export default function Login({ onLogin }) {
  const { t } = useTranslation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)

    try {
      const { ok, data } = await postJson('/api/login', { email, password })

      if (ok) {
        onLogin(data)
      } else {
        setError(firstError(data))
      }
    } catch {
      setError(t('common.networkError'))
    } finally {
      setBusy(false)
    }
  }

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: 24 }}>
      <h2>{t('auth.loginTitle')}</h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          {t('auth.email')}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={fieldStyle} />
        </label>

        <label>
          {t('auth.password')}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={fieldStyle} />
        </label>

        {error && <p style={{ color: 'tomato', margin: 0 }}>{error}</p>}

        <button type="submit" disabled={busy} style={{ padding: 10 }}>
          {busy ? t('auth.working') : t('auth.loginButton')}
        </button>
      </form>

      <p>
        {t('auth.noAccount')} <Link to="/register">{t('nav.register')}</Link>
      </p>
    </div>
  )
}