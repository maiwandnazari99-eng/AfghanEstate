import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { API } from '../api'

function readUser() {
  try {
    return JSON.parse(localStorage.getItem('user')) || null
  } catch {
    return null
  }
}

export default function PropertyDetails() {
  const { id } = useParams()
  const { t } = useTranslation()
  const user = readUser()
  const canSave = user && (user.role === 'buyer' || user.role === 'tenant')

  const [property, setProperty] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState(0)
  const [isFavorite, setIsFavorite] = useState(false)
  const [favBusy, setFavBusy] = useState(false)
  const [favError, setFavError] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const headers = { Accept: 'application/json' }
    if (token) headers.Authorization = `Bearer ${token}`

    fetch(`${API}/api/properties/${id}`, { headers })
      .then((res) => {
        if (res.status === 404) {
          setNotFound(true)
          return null
        }
        if (!res.ok) throw new Error('Server error ' + res.status)
        return res.json()
      })
      .then((data) => {
        if (data) {
          setProperty(data)
          setIsFavorite(Boolean(data.is_favorite))
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false))
  }, [id])

  async function toggleFavorite() {
    const token = localStorage.getItem('token')
    setFavBusy(true)
    setFavError('')

    try {
      const res = await fetch(`${API}/api/properties/${id}/favorite`, {
        method: isFavorite ? 'DELETE' : 'POST',
        headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      })

      if (res.ok) {
        setIsFavorite(!isFavorite)
      } else {
        setFavError(t('property.favoriteError'))
      }
    } catch {
      setFavError(t('common.networkError'))
    } finally {
      setFavBusy(false)
    }
  }

  const wrapStyle = { maxWidth: 900, margin: '0 auto', padding: 24 }
  const backLink = <Link to="/">← {t('property.back')}</Link>

  if (loading) {
    return <div style={wrapStyle}><p>{t('common.loading')}</p></div>
  }

  if (notFound) {
    return (
      <div style={wrapStyle}>
        {backLink}
        <p>{t('property.notFound')}</p>
      </div>
    )
  }

  if (error || !property) {
    return (
      <div style={wrapStyle}>
        {backLink}
        <p style={{ color: 'tomato' }}>{t('common.loadError', { message: error })}</p>
      </div>
    )
  }

  const images = property.images || []
  const main = images[selected] || images[0]

  return (
    <div style={wrapStyle}>
      {backLink}

      <h1 style={{ marginBottom: 8, lineHeight: 1.2 }}>{property.title}</h1>
      <p style={{ marginTop: 0, marginBottom: 16 }}>
        {property.property_type?.name} · {property.city?.name}
        {property.district?.name ? ` · ${property.district.name}` : ''}
      </p>

      {main ? (
        <img
          src={API + main.image_url}
          alt={property.title}
          style={{ width: '100%', height: 360, objectFit: 'cover', borderRadius: 12 }}
        />
      ) : (
        <div style={{ height: 360, background: '#444', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {t('common.noPhoto')}
        </div>
      )}

      {images.length > 1 && (
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          {images.map((img, index) => (
            <img
              key={img.id}
              src={API + img.image_url}
              alt=""
              onClick={() => setSelected(index)}
              style={{
                width: 80,
                height: 60,
                objectFit: 'cover',
                borderRadius: 6,
                cursor: 'pointer',
                border: index === selected ? '2px solid #aa8cff' : '2px solid transparent',
              }}
            />
          ))}
        </div>
      )}

      <h2 style={{ marginBottom: 4 }}>
        {Number(property.price).toLocaleString()} {property.currency}
      </h2>
      <p style={{ marginTop: 0 }}>
        {property.listing_type === 'sale' ? t('property.forSale') : t('property.forRent')} · {t(`property.status_${property.status}`)}
      </p>

      {canSave && (
        <div style={{ margin: '8px 0 16px' }}>
          <button onClick={toggleFavorite} disabled={favBusy} style={{ padding: '8px 14px', cursor: 'pointer' }}>
            {isFavorite ? '♥ ' + t('property.saved') : '♡ ' + t('property.save')}
          </button>
          {favError && <p style={{ color: 'tomato', margin: '8px 0 0' }}>{favError}</p>}
        </div>
      )}

      <div style={{ display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', margin: '16px 0' }}>
        <div><strong>{t('property.bedrooms')}</strong><br />{property.bedrooms ?? '-'}</div>
        <div><strong>{t('property.bathrooms')}</strong><br />{property.bathrooms ?? '-'}</div>
        <div><strong>{t('property.area')}</strong><br />{Number(property.area_size)} {property.area_unit}</div>
      </div>

      <h3>{t('property.description')}</h3>
      <p>{property.description}</p>

      <h3>{t('property.address')}</h3>
      <p>{property.address}</p>

      <h3>{t('property.listedBy')}</h3>
      <p>
        {property.agent?.user?.name}
        {property.agent?.agency_name ? ` · ${property.agent.agency_name}` : ''}
      </p>
    </div>
  )
}