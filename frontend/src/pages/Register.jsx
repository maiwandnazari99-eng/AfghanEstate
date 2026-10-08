import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { postJson, firstError } from '../api'

const fieldStyle = { display: 'block', width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' }

export default function Register({ onLogin }) {
  const { t } = useTranslation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [role, setRole] = useState('buyer')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)

    try {
      const { ok, data } = await postJson('/api/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role,
      })

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
      <h2>{t('auth.registerTitle')}</h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          {t('auth.name')}
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required style={fieldStyle} />
        </label>

        <label>
          {t('auth.email')}
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={fieldStyle} />
        </label>

        <label>
          {t('auth.password')}
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} style={fieldStyle} />
        </label>

        <label>
          {t('auth.confirmPassword')}
          <input type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} required minLength={8} style={fieldStyle} />
        </label>

        <label>
          {t('auth.role')}
          <select value={role} onChange={(e) => setRole(e.target.value)} style={fieldStyle}>
            <option value="buyer">{t('auth.roleBuyer')}</option>
            <option value="tenant">{t('auth.roleTenant')}</option>
            <option value="agent">{t('auth.roleAgent')}</option>
          </select>
        </label>

        {error && <p style={{ color: 'tomato', margin: 0 }}>{error}</p>}

        <button type="submit" disabled={busy} style={{ padding: 10 }}>
          {busy ? t('auth.working') : t('auth.registerButton')}
        </button>
      </form>

      <p>
        {t('auth.haveAccount')} <Link to="/login">{t('nav.login')}</Link>
      </p>
    </div>
  )
}