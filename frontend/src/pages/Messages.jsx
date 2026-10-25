import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { API, firstError } from '../api'

function authHeaders(json) {
  const token = localStorage.getItem('token')
  const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` }
  if (json) headers['Content-Type'] = 'application/json'
  return headers
}

export default function Messages({ user }) {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [thread, setThread] = useState(null)
  const [reply, setReply] = useState('')
  const [busy, setBusy] = useState(false)
  const [replyError, setReplyError] = useState('')

  async function loadList() {
    try {
      const res = await fetch(`${API}/api/inquiries`, { headers: authHeaders() })
      if (!res.ok) throw new Error('Server error ' + res.status)
      const data = await res.json()
      setItems(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function openThread(id) {
    setReplyError('')
    setReply('')

    try {
      const res = await fetch(`${API}/api/inquiries/${id}`, { headers: authHeaders() })
      if (!res.ok) throw new Error('Server error ' + res.status)
      setThread(await res.json())
    } catch (err) {
      setReplyError(err.message)
    }
  }

  async function sendReply(e) {
    e.preventDefault()
    setReplyError('')
    setBusy(true)

    try {
      const res = await fetch(`${API}/api/inquiries/${thread.id}/messages`, {
        method: 'POST',
        headers: authHeaders(true),
        body: JSON.stringify({ message: reply }),
      })

      if (!res.ok) {
        let data = {}
        try {
          data = await res.json()
        } catch {
          data = {}
        }
        setReplyError(firstError(data))
        return
      }

      setReply('')
      await openThread(thread.id)
      await loadList()
    } catch {
      setReplyError(t('common.networkError'))
    } finally {
      setBusy(false)
    }
  }

  async function closeThread() {
    setReplyError('')

    try {
      const res = await fetch(`${API}/api/inquiries/${thread.id}/close`, {
        method: 'PATCH',
        headers: authHeaders(),
      })

      if (res.ok) {
        await openThread(thread.id)
        await loadList()
      }
    } catch {
      setReplyError(t('common.networkError'))
    }
  }

  useEffect(() => {
    loadList()
  }, [])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const boxStyle = { border: '1px solid #888', borderRadius: 12, padding: 12 }

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: 24 }}>
      <h1>{t('messages.title')}</h1>

      {loading && <p>{t('common.loading')}</p>}
      {error && <p style={{ color: 'tomato' }}>{t('common.loadError', { message: error })}</p>}
      {!loading && !error && items.length === 0 && <p>{t('messages.empty')}</p>}

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ flex: '1 1 260px', display: 'grid', gap: 8 }}>
          {items.map((item) => (
            <div
              key={item.id}
              onClick={() => openThread(item.id)}
              style={{
                ...boxStyle,
                cursor: 'pointer',
                borderColor: thread && thread.id === item.id ? '#aa8cff' : '#888',
              }}
            >
              <strong>{item.property?.title}</strong>
              <br />
              <span>{item.subject || t('messages.noSubject')}</span>
              <br />
              <small>
                {t('messages.from', { name: item.inquirer?.name })} · {t(`messages.${item.status}`)}
              </small>
            </div>
          ))}
        </div>

        <div style={{ flex: '2 1 360px' }}>
          {!thread && items.length > 0 && <p>{t('messages.select')}</p>}

          {thread && (
            <div style={boxStyle}>
              <h3 style={{ marginTop: 0 }}>{thread.property?.title}</h3>
              <p style={{ margin: '0 0 8px' }}>
                <small>{thread.subject || t('messages.noSubject')} · {t(`messages.${thread.status}`)}</small>
              </p>

              <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
                <div style={{ borderBottom: '1px solid #444', paddingBottom: 8 }}>
                  <strong>{thread.inquirer?.name}</strong>
                  <p style={{ margin: '4px 0 0' }}>{thread.message}</p>
                </div>

                {thread.messages?.map((m) => (
                  <div key={m.id} style={{ borderBottom: '1px solid #444', paddingBottom: 8 }}>
                    <strong>{m.sender?.name}</strong>
                    <p style={{ margin: '4px 0 0' }}>{m.message}</p>
                  </div>
                ))}
              </div>

              {thread.status === 'closed' ? (
                <p>{t('messages.closedInfo')}</p>
              ) : (
                <form onSubmit={sendReply} style={{ display: 'grid', gap: 8 }}>
                  <textarea
                    placeholder={t('messages.reply')}
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    required
                    rows={3}
                    maxLength={2000}
                    style={{ padding: 8, boxSizing: 'border-box', width: '100%' }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button type="submit" disabled={busy} style={{ padding: 8 }}>
                      {busy ? t('auth.working') : t('messages.send')}
                    </button>
                    <button type="button" onClick={closeThread} style={{ padding: 8 }}>
                      {t('messages.close')}
                    </button>
                  </div>
                </form>
              )}

              {replyError && <p style={{ color: 'tomato', margin: '8px 0 0' }}>{replyError}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}