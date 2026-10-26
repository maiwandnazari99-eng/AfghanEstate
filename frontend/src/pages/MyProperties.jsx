import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { API } from '../api'

function authHeaders(json) {
  const token = localStorage.getItem('token')
  const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` }
  if (json) headers['Content-Type'] = 'application/json'
  return headers
}

export default function MyProperties({ user }) {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'agent') {
      setLoading(false)
      return
    }

    fetch(`${API}/api/my-properties`, { headers: authHeaders() })
      .then((res) => {
        if (!res.ok) throw new Error('Server error ' + res.status)
        return res.json()
      })
      .then((data) => setItems(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [user])

  async function changeStatus(id, status) {
    setError('')

    try {
      const res = await fetch(`${API}/api/properties/${id}`, {
        method: 'PUT',
        headers: authHeaders(true),
        body: JSON.stringify({ status }),
      })

      if (res.ok) {
        setItems((list) => list.map((item) => (item.id === id ? { ...item, status } : item)))
      } else {
        setError(t('mine.updateError'))
      }
    } catch {
      setError(t('common.networkError'))
    }
  }

  async function deleteItem(id) {
    if (!window.confirm(t('mine.confirmDelete'))) return
    setError('')

    try {
      const res = await fetch(`${API}/api/properties/${id}`, {
        method: 'DELETE',
        headers: authHeaders(),
      })

      if (res.ok) {
        setItems((list) => list.filter((item) => item.id !== id))
      } else {
        setError(t('mine.updateError'))
      }
    } catch {
      setError(t('common.networkError'))
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'agent') {
    return (
      <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
        <p>{t('mine.agentsOnly')}</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>{t('mine.title')}</h1>

      {loading && <p>{t('common.loading')}</p>}
      {error && <p style={{ color: 'tomato' }}>{error}</p>}
      {!loading && !error && items.length === 0 && <p>{t('mine.empty')}</p>}

      <div style={{ display: 'grid', gap: 12 }}>
        {items.map((p) => {
          const cover = p.images?.find((img) => img.is_cover) || p.images?.[0]

          return (
            <div
              key={p.id}
              style={{ border: '1px solid #888', borderRadius: 12, padding: 12, display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}
            >
              {cover ? (
                <img src={API + cover.image_url} alt={p.title} style={{ width: 120, height: 90, objectFit: 'cover', borderRadius: 8 }} />
              ) : (
                <div style={{ width: 120, height: 90, background: '#444', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {t('common.noPhoto')}
                </div>
              )}

              <div style={{ flex: '1 1 220px' }}>
                <h3 style={{ margin: '0 0 4px' }}>{p.title}</h3>
                <p style={{ margin: '0 0 4px' }}>
                  {p.property_type?.name} · {p.city?.name}
                </p>
                <p style={{ margin: 0 }}>
                  {Number(p.price).toLocaleString()} {p.currency} ({p.listing_type === 'sale' ? t('property.forSale') : t('property.forRent')})
                </p>
              </div>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <select value={p.status} onChange={(e) => changeStatus(p.id, e.target.value)} style={{ padding: 6 }}>
                  <option value="available">{t('property.status_available')}</option>
                  <option value="sold">{t('property.status_sold')}</option>
                  <option value="rented">{t('property.status_rented')}</option>
                </select>
                <Link to={`/properties/${p.id}`}>{t('mine.view')}</Link>
                <button onClick={() => deleteItem(p.id)} style={{ padding: '6px 10px' }}>
                  {t('mine.delete')}
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}