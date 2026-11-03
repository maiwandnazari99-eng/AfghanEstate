import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { API } from '../api'

const fieldStyle = { padding: 8, boxSizing: 'border-box', width: '100%' }

export default function Home() {
  const { t } = useTranslation()
  const [properties, setProperties] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [types, setTypes] = useState([])
  const [provinces, setProvinces] = useState([])
  const [filters, setFilters] = useState({ city_id: '', property_type_id: '' })
  const [page, setPage] = useState(1)
  const [meta, setMeta] = useState({ current_page: 1, last_page: 1, total: 0 })

  useEffect(() => {
    fetch(`${API}/api/property-types`)
      .then((res) => res.json())
      .then(setTypes)
      .catch(() => {})

    fetch(`${API}/api/cities`)
      .then((res) => res.json())
      .then(setProvinces)
      .catch(() => {})
  }, [])

  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== '') params.set(key, value)
    })
    params.set('page', page)

    setLoading(true)
    setError('')

    fetch(`${API}/api/properties?${params.toString()}`, { headers: { Accept: 'application/json' } })
      .then((res) => {
        if (!res.ok) throw new Error('Server error ' + res.status)
        return res.json()
      })
      .then((data) => {
        setProperties(data.data)
        setMeta({ current_page: data.current_page, last_page: data.last_page, total: data.total })
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [filters, page])

  function changeFilter(name, value) {
    setPage(1)
    setFilters((current) => ({ ...current, [name]: value }))
  }

  function resetFilters() {
    setPage(1)
    setFilters({ city_id: '', property_type_id: '' })
  }

  const hasFilter = filters.city_id !== '' || filters.property_type_id !== ''

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: 24 }}>
      <h1>{t('app.latest')}</h1>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: 16 }}>
        <select value={filters.city_id} onChange={(e) => changeFilter('city_id', e.target.value)} style={fieldStyle}>
          <option value="">{t('home.allProvinces')}</option>
          {provinces.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>

        <select value={filters.property_type_id} onChange={(e) => changeFilter('property_type_id', e.target.value)} style={fieldStyle}>
          <option value="">{t('home.allTypes')}</option>
          {types.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>

      {hasFilter && (
        <p style={{ marginTop: 0 }}>
          <button onClick={resetFilters} style={{ padding: '6px 12px' }}>{t('home.reset')}</button>
        </p>
      )}

      {loading && <p>{t('common.loading')}</p>}
      {error && <p style={{ color: 'tomato' }}>{t('common.loadError', { message: error })}</p>}
      {!loading && !error && properties.length === 0 && <p>{t('home.noResults')}</p>}
      {!loading && !error && properties.length > 0 && <p>{t('home.results', { count: meta.total })}</p>}

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {properties.map((p) => {
          const cover = p.images?.find((img) => img.is_cover) || p.images?.[0]

          return (
            <Link
              key={p.id}
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
                <p style={{ margin: '0 0 4px' }}>
                  {Number(p.price).toLocaleString()} {p.currency} ({p.listing_type === 'sale' ? t('property.forSale') : t('property.forRent')})
                </p>
                <p style={{ margin: 0 }}>
                  {t('property.beds', { value: p.bedrooms })} · {t('property.baths', { value: p.bathrooms })} · {Number(p.area_size)} {p.area_unit}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {meta.last_page > 1 && (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', justifyContent: 'center', marginTop: 24 }}>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} style={{ padding: '8px 14px' }}>
            {t('home.prev')}
          </button>
          <span>{t('home.page', { current: meta.current_page, last: meta.last_page })}</span>
          <button disabled={page >= meta.last_page} onClick={() => setPage(page + 1)} style={{ padding: '8px 14px' }}>
            {t('home.next')}
          </button>
        </div>
      )}
    </div>
  )
}