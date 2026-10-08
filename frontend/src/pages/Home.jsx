import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { API } from '../api'

export default function Home() {
  const { t } = useTranslation()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`${API}/api/properties`, { headers: { Accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error('Server error ' + res.status)
        return res.json()
      })
      .then((data) => setProperties(data.data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>{t('app.latest')}</h1>

      {loading && <p>{t('common.loading')}</p>}
      {error && <p style={{ color: 'tomato' }}>{t('common.loadError', { message: error })}</p>}
      {!loading && !error && properties.length === 0 && <p>{t('common.noProperties')}</p>}

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {properties.map((p) => {
          const cover = p.images?.find((img) => img.is_cover) || p.images?.[0]

          return (
            <div key={p.id} style={{ border: '1px solid #888', borderRadius: 12, overflow: 'hidden' }}>
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
                <p style={{ margin: '0 0 4px' }}>
                  {Number(p.price).toLocaleString()} {p.currency} ({p.listing_type === 'sale' ? t('property.forSale') : t('property.forRent')})
                </p>
                <p style={{ margin: 0 }}>
                  {t('property.beds', { value: p.bedrooms })} · {t('property.baths', { value: p.bathrooms })} · {Number(p.area_size)} {p.area_unit}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}