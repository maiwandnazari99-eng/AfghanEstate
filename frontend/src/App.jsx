import { useEffect, useState } from 'react'

const API = 'http://127.0.0.1:8000'

export default function App() {
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
      <h1>Afghan Estate</h1>
      <p>Latest properties</p>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'tomato' }}>Could not load properties: {error}</p>}
      {!loading && !error && properties.length === 0 && <p>No properties yet.</p>}

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))' }}>
        {properties.map((p) => {
          const cover = p.images?.find((img) => img.is_cover) || p.images?.[0]

          return (
            <div key={p.id} style={{ border: '1px solid #888', borderRadius: 12, overflow: 'hidden' }}>
              {cover ? (
                <img src={API + cover.image_url} alt={p.title} style={{ width: '100%', height: 160, objectFit: 'cover' }} />
              ) : (
                <div style={{ height: 160, background: '#444', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  No photo
                </div>
              )}

              <div style={{ padding: 12 }}>
                <h3 style={{ margin: '0 0 8px' }}>{p.title}</h3>
                <p style={{ margin: '0 0 4px' }}>
                  {p.property_type?.name} · {p.city?.name}
                </p>
                <p style={{ margin: '0 0 4px' }}>
                  {Number(p.price).toLocaleString()} {p.currency} ({p.listing_type === 'sale' ? 'For sale' : 'For rent'})
                </p>
                <p style={{ margin: 0 }}>
                  {p.bedrooms} bed · {p.bathrooms} bath · {Number(p.area_size)} {p.area_unit}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}