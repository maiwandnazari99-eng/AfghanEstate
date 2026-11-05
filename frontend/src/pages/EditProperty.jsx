import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { API, firstError } from '../api'

const fieldStyle = { display: 'block', width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' }
const rowStyle = { display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }

function authHeaders(json) {
  const token = localStorage.getItem('token')
  const headers = { Accept: 'application/json', Authorization: `Bearer ${token}` }
  if (json) headers['Content-Type'] = 'application/json'
  return headers
}

export default function EditProperty({ user }) {
  const { id } = useParams()
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [types, setTypes] = useState([])
  const [cities, setCities] = useState([])
  const [districts, setDistricts] = useState([])
  const [amenityList, setAmenityList] = useState([])

  const [form, setForm] = useState(null)
  const [selectedAmenities, setSelectedAmenities] = useState([])
  const [images, setImages] = useState([])
  const [newFiles, setNewFiles] = useState([])
  const [fileKey, setFileKey] = useState(0)

  const [status, setStatus] = useState('loading')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function loadDistricts(cityId) {
    try {
      const res = await fetch(`${API}/api/cities/${cityId}/districts`)
      setDistricts(await res.json())
    } catch {
      setDistricts([])
    }
  }

  async function loadProperty() {
    try {
      const res = await fetch(`${API}/api/properties/${id}`, { headers: { Accept: 'application/json' } })

      if (res.status === 404) {
        setStatus('notfound')
        return
      }
      if (!res.ok) throw new Error('Server error ' + res.status)

      const p = await res.json()

      if (!user || Number(p.agent_id) !== Number(user.id)) {
        setStatus('forbidden')
        return
      }

      setForm({
        title: p.title ?? '',
        description: p.description ?? '',
        property_type_id: String(p.property_type_id ?? ''),
        listing_type: p.listing_type ?? 'sale',
        price: String(p.price ?? ''),
        currency: p.currency ?? 'AFN',
        bedrooms: p.bedrooms == null ? '' : String(p.bedrooms),
        bathrooms: p.bathrooms == null ? '' : String(p.bathrooms),
        area_size: String(p.area_size ?? ''),
        area_unit: p.area_unit ?? 'sqm',
        city_id: String(p.city_id ?? ''),
        district_id: p.district_id == null ? '' : String(p.district_id),
        address: p.address ?? '',
      })
      setSelectedAmenities((p.amenities || []).map((item) => item.id))
      setImages(p.images || [])

      if (p.city_id) loadDistricts(p.city_id)

      setStatus('ready')
    } catch (err) {
      setError(err.message)
      setStatus('error')
    }
  }

  async function reloadImages() {
    try {
      const res = await fetch(`${API}/api/properties/${id}`, { headers: { Accept: 'application/json' } })
      if (res.ok) {
        const p = await res.json()
        setImages(p.images || [])
      }
    } catch {
      // keep the current list if the reload fails
    }
  }

  useEffect(() => {
    fetch(`${API}/api/property-types`).then((res) => res.json()).then(setTypes).catch(() => {})
    fetch(`${API}/api/cities`).then((res) => res.json()).then(setCities).catch(() => {})
    fetch(`${API}/api/amenities`).then((res) => res.json()).then(setAmenityList).catch(() => {})
    loadProperty()
  }, [id])

  function setField(name, value) {
    setForm((current) => ({ ...current, [name]: value }))
  }

  function handleCityChange(e) {
    const value = e.target.value
    setField('city_id', value)
    setField('district_id', '')
    setDistricts([])
    if (value) loadDistricts(value)
  }

  function toggleAmenity(amenityId) {
    setSelectedAmenities((current) =>
      current.includes(amenityId)
        ? current.filter((value) => value !== amenityId)
        : [...current, amenityId]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)

    const body = {
      property_type_id: Number(form.property_type_id),
      title: form.title,
      description: form.description,
      listing_type: form.listing_type,
      price: Number(form.price),
      currency: form.currency,
      bedrooms: form.bedrooms === '' ? null : Number(form.bedrooms),
      bathrooms: form.bathrooms === '' ? null : Number(form.bathrooms),
      area_size: Number(form.area_size),
      area_unit: form.area_unit,
      city_id: Number(form.city_id),
      district_id: form.district_id === '' ? null : Number(form.district_id),
      address: form.address,
      amenities: selectedAmenities,
    }

    try {
      const res = await fetch(`${API}/api/properties/${id}`, {
        method: 'PUT',
        headers: authHeaders(true),
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        let data = {}
        try {
          data = await res.json()
        } catch {
          data = {}
        }
        setError(firstError(data))
        return
      }

      navigate(`/properties/${id}`)
    } catch {
      setError(t('common.networkError'))
    } finally {
      setBusy(false)
    }
  }

  async function deleteImage(imageId) {
    if (!window.confirm(t('edit.confirmDeletePhoto'))) return

    try {
      await fetch(`${API}/api/property-images/${imageId}`, { method: 'DELETE', headers: authHeaders() })
      await reloadImages()
    } catch {
      setError(t('common.networkError'))
    }
  }

  async function makeCover(imageId) {
    try {
      await fetch(`${API}/api/property-images/${imageId}/cover`, { method: 'PATCH', headers: authHeaders() })
      await reloadImages()
    } catch {
      setError(t('common.networkError'))
    }
  }

  async function uploadPhotos() {
    if (newFiles.length === 0) return
    setError('')

    try {
      const formData = new FormData()
      newFiles.forEach((file) => formData.append('images[]', file))

      const res = await fetch(`${API}/api/properties/${id}/images`, {
        method: 'POST',
        headers: authHeaders(),
        body: formData,
      })

      if (!res.ok) {
        let data = {}
        try {
          data = await res.json()
        } catch {
          data = {}
        }
        setError(firstError(data))
        return
      }

      setNewFiles([])
      setFileKey((value) => value + 1)
      await reloadImages()
    } catch {
      setError(t('common.networkError'))
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const wrapStyle = { maxWidth: 700, margin: '0 auto', padding: 24 }

  if (status === 'loading') {
    return <div style={wrapStyle}><p>{t('common.loading')}</p></div>
  }

  if (status === 'notfound') {
    return <div style={wrapStyle}><p>{t('property.notFound')}</p></div>
  }

  if (status === 'forbidden') {
    return <div style={wrapStyle}><p>{t('edit.notOwner')}</p></div>
  }

  if (status === 'error') {
    return <div style={wrapStyle}><p style={{ color: 'tomato' }}>{t('common.loadError', { message: error })}</p></div>
  }

  return (
    <div style={wrapStyle}>
      <h2>{t('edit.title')}</h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          {t('add.fieldTitle')}
          <input type="text" value={form.title} onChange={(e) => setField('title', e.target.value)} required maxLength={255} style={fieldStyle} />
        </label>

        <label>
          {t('add.description')}
          <textarea value={form.description} onChange={(e) => setField('description', e.target.value)} required rows={4} style={fieldStyle} />
        </label>

        <div style={rowStyle}>
          <label>
            {t('add.type')}
            <select value={form.property_type_id} onChange={(e) => setField('property_type_id', e.target.value)} required style={fieldStyle}>
              <option value="">{t('add.selectType')}</option>
              {types.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>

          <label>
            {t('add.listingType')}
            <select value={form.listing_type} onChange={(e) => setField('listing_type', e.target.value)} style={fieldStyle}>
              <option value="sale">{t('property.forSale')}</option>
              <option value="rent">{t('property.forRent')}</option>
            </select>
          </label>
        </div>

        <div style={rowStyle}>
          <label>
            {t('add.price')}
            <input type="number" min="0" step="any" value={form.price} onChange={(e) => setField('price', e.target.value)} required style={fieldStyle} />
          </label>

          <label>
            {t('add.currency')}
            <select value={form.currency} onChange={(e) => setField('currency', e.target.value)} style={fieldStyle}>
              <option value="AFN">AFN</option>
              <option value="USD">USD</option>
            </select>
          </label>
        </div>

        <div style={rowStyle}>
          <label>
            {t('add.bedrooms')}
            <input type="number" min="0" value={form.bedrooms} onChange={(e) => setField('bedrooms', e.target.value)} style={fieldStyle} />
          </label>

          <label>
            {t('add.bathrooms')}
            <input type="number" min="0" value={form.bathrooms} onChange={(e) => setField('bathrooms', e.target.value)} style={fieldStyle} />
          </label>
        </div>

        <div style={rowStyle}>
          <label>
            {t('add.areaSize')}
            <input type="number" min="0" step="any" value={form.area_size} onChange={(e) => setField('area_size', e.target.value)} required style={fieldStyle} />
          </label>

          <label>
            {t('add.areaUnit')}
            <select value={form.area_unit} onChange={(e) => setField('area_unit', e.target.value)} style={fieldStyle}>
              <option value="sqm">sqm</option>
              <option value="sqft">sqft</option>
              <option value="jerib">jerib</option>
            </select>
          </label>
        </div>

        <div style={rowStyle}>
          <label>
            {t('add.city')}
            <select value={form.city_id} onChange={handleCityChange} required style={fieldStyle}>
              <option value="">{t('add.selectCity')}</option>
              {cities.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>

          <label>
            {t('add.district')}
            <select value={form.district_id} onChange={(e) => setField('district_id', e.target.value)} disabled={districts.length === 0} style={fieldStyle}>
              <option value="">{t('add.selectDistrict')}</option>
              {districts.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>
        </div>

        <label>
          {t('add.address')}
          <input type="text" value={form.address} onChange={(e) => setField('address', e.target.value)} required maxLength={255} style={fieldStyle} />
        </label>

        <fieldset style={{ border: '1px solid #888', borderRadius: 8, padding: 12 }}>
          <legend>{t('add.amenities')}</legend>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {amenityList.map((item) => (
              <label key={item.id} style={{ display: 'flex', gap: 6, alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={selectedAmenities.includes(item.id)} onChange={() => toggleAmenity(item.id)} />
                {item.icon} {item.name}
              </label>
            ))}
          </div>
        </fieldset>

        {error && <p style={{ color: 'tomato', margin: 0 }}>{error}</p>}

        <div style={{ display: 'flex', gap: 8 }}>
          <button type="submit" disabled={busy} style={{ padding: 10 }}>
            {busy ? t('auth.working') : t('edit.save')}
          </button>
          <Link to="/my-properties" style={{ padding: 10 }}>{t('edit.cancel')}</Link>
        </div>
      </form>

      <h3 style={{ marginTop: 32 }}>{t('edit.photos')}</h3>

      {images.length === 0 && <p>{t('edit.noPhotos')}</p>}

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
        {images.map((img) => (
          <div key={img.id} style={{ border: '1px solid #888', borderRadius: 8, padding: 8 }}>
            <img src={API + img.image_url} alt="" style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 6 }} />
            <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              {img.is_cover ? (
                <strong>{t('edit.cover')}</strong>
              ) : (
                <button type="button" onClick={() => makeCover(img.id)} style={{ padding: '4px 8px' }}>{t('edit.makeCover')}</button>
              )}
              <button type="button" onClick={() => deleteImage(img.id)} style={{ padding: '4px 8px' }}>{t('edit.deletePhoto')}</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 16, display: 'grid', gap: 8 }}>
        <label>
          {t('edit.addPhotos')}
          <input
            key={fileKey}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => setNewFiles(Array.from(e.target.files))}
            style={fieldStyle}
          />
        </label>
        <button type="button" onClick={uploadPhotos} disabled={newFiles.length === 0} style={{ padding: 10 }}>
          {t('edit.upload')}
        </button>
      </div>
    </div>
  )
}