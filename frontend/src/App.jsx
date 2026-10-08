import './i18n'
import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { postJson } from './api'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
}

function Shell() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [user, setUser] = useState(readUser)

  function handleLogin(data) {
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    setUser(data.user)
    navigate('/')
  }

  async function handleLogout() {
    const token = localStorage.getItem('token')

    try {
      await postJson('/api/logout', {}, token)
    } catch {
      // even if the server is unreachable, we still log out here
    }

    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    navigate('/')
  }

  return (
    <>
      <nav style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid #444' }}>
        <Link to="/" style={{ fontWeight: 700 }}>{t('app.title')}</Link>
        <span style={{ flex: 1 }} />
        {user ? (
          <>
            <span>{t('nav.hello', { name: user.name })}</span>
            <button onClick={handleLogout}>{t('nav.logout')}</button>
          </>
        ) : (
          <>
            <Link to="/login">{t('nav.login')}</Link>
            <Link to="/register">{t('nav.register')}</Link>
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />} />
        <Route path="/register" element={user ? <Navigate to="/" replace /> : <Register onLogin={handleLogin} />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Shell />
    </BrowserRouter>
  )
}