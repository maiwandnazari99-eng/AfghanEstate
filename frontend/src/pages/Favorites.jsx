import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { API } from '../api'

export default function Favorites({ user }) {
  const { t } = useTranslation()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')

    fetch(`${API}/api/favorites`, {
      headers: { Accept: 'application/json', Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error('Server error ' + res.status)
        return res.json()
      })
      .then((data) => setItems(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>{t('favorites.title')}</h1>

      {loading && <p>{t('common.loading')}</p>}
      {error && <p style={{ color: 'tomato' }}>{t('common.loadError', { message: error })}</p>}
      {!loading && !error && items.length === 0 && <p>{t('favorites.empty')}</p>}

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {items.map((item) => {
          const p = item.property
          if (!p) return null
          const cover = p.images?.find((img) => img.is_cover) || p.images?.[0]

          return (
            <Link
              key={item.id}
              to={`/properties/${p.id}`}
              style={{ color: 'inherit', textDecoration: 'none', border: '1px solid #888', borderRadius: 12, overflow: 'hidden', display: 'block' }}
            >
              {cover ? (
                <img src={API + cover.image_url} alt={p.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              ) : (
                <div style={{ height: 160, background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {t('common.noPhoto')}
                </div>
              )}

              <div style={{ padding: 12 }}>
                <h3 style={{ margin: '0 0 8px' }}>{p.title}</h3>
                <p style={{ margin: '0 0 4px' }}>
                  {p.property_type?.name} · {p.city?.name}
                </p>
                <p style={{ margin: 0 }}>
                  {Number(p.price).toLocaleString()} {p.currency} ({p.listing_type === 'sale' ? t('property.forSale') : t('property.forRent')})
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}