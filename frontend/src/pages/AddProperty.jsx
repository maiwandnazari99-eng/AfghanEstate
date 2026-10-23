import { useEffect, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { API, postJson, firstError } from '../api'

const fieldStyle = { display: 'block', width: '100%', padding: 8, marginTop: 4, boxSizing: 'border-box' }
const rowStyle = { display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))' }

export default function AddProperty({ user }) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [types, setTypes] = useState([])
  const [cities, setCities] = useState([])
  const [districts, setDistricts] = useState([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [typeId, setTypeId] = useState('')
  const [listingType, setListingType] = useState('sale')
  const [price, setPrice] = useState('')
  const [currency, setCurrency] = useState('AFN')
  const [bedrooms, setBedrooms] = useState('')
  const [bathrooms, setBathrooms] = useState('')
  const [areaSize, setAreaSize] = useState('')
  const [areaUnit, setAreaUnit] = useState('sqm')
  const [cityId, setCityId] = useState('')
  const [districtId, setDistrictId] = useState('')
  const [address, setAddress] = useState('')
  const [files, setFiles] = useState([])

  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [createdId, setCreatedId] = useState(null)

  useEffect(() => {
    fetch(`${API}/api/property-types`)
      .then((res) => res.json())
      .then(setTypes)
      .catch(() => {})

    fetch(`${API}/api/cities`)
      .then((res) => res.json())
      .then(setCities)
      .catch(() => {})
  }, [])

  async function handleCityChange(e) {
    const value = e.target.value
    setCityId(value)
    setDistrictId('')
    setDistricts([])

    if (!value) return

    try {
      const res = await fetch(`${API}/api/cities/${value}/districts`)
      setDistricts(await res.json())
    } catch {
      setDistricts([])
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)

    const token = localStorage.getItem('token')

    const body = {
      property_type_id: Number(typeId),
      title,
      description,
      listing_type: listingType,
      price: Number(price),
      currency,
      bedrooms: bedrooms === '' ? null : Number(bedrooms),
      bathrooms: bathrooms === '' ? null : Number(bathrooms),
      area_size: Number(areaSize),
      area_unit: areaUnit,
      city_id: Number(cityId),
      district_id: districtId === '' ? null : Number(districtId),
      address,
    }

    try {
      const { ok, data } = await postJson('/api/properties', body, token)

      if (!ok) {
        setError(firstError(data))
        return
      }

      const id = data.property.id

      if (files.length > 0) {
        const formData = new FormData()
        files.forEach((file) => formData.append('images[]', file))

        const res = await fetch(`${API}/api/properties/${id}/images`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
          body: formData,
        })

        if (!res.ok) {
          setCreatedId(id)
          setError(t('add.photoError'))
          return
        }
      }

      navigate(`/properties/${id}`)
    } catch {
      setError(t('common.networkError'))
    } finally {
      setBusy(false)
    }
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.role !== 'agent') {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: 24 }}>
        <p>{t('add.agentsOnly')}</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 24 }}>
      <h2>{t('add.title')}</h2>

      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          {t('add.fieldTitle')}
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required maxLength={255} style={fieldStyle} />
        </label>

        <label>
          {t('add.description')}
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={4} style={fieldStyle} />
        </label>

        <div style={rowStyle}>
          <label>
            {t('add.type')}
            <select value={typeId} onChange={(e) => setTypeId(e.target.value)} required style={fieldStyle}>
              <option value="">{t('add.selectType')}</option>
              {types.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>

          <label>
            {t('add.listingType')}
            <select value={listingType} onChange={(e) => setListingType(e.target.value)} style={fieldStyle}>
              <option value="sale">{t('property.forSale')}</option>
              <option value="rent">{t('property.forRent')}</option>
            </select>
          </label>
        </div>

        <div style={rowStyle}>
          <label>
            {t('add.price')}
            <input type="number" min="0" step="any" value={price} onChange={(e) => setPrice(e.target.value)} required style={fieldStyle} />
          </label>

          <label>
            {t('add.currency')}
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={fieldStyle}>
              <option value="AFN">AFN</option>
              <option value="USD">USD</option>
            </select>
          </label>
        </div>

        <div style={rowStyle}>
          <label>
            {t('add.bedrooms')}
            <input type="number" min="0" value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} style={fieldStyle} />
          </label>

          <label>
            {t('add.bathrooms')}
            <input type="number" min="0" value={bathrooms} onChange={(e) => setBathrooms(e.target.value)} style={fieldStyle} />
          </label>
        </div>

        <div style={rowStyle}>
          <label>
            {t('add.areaSize')}
            <input type="number" min="0" step="any" value={areaSize} onChange={(e) => setAreaSize(e.target.value)} required style={fieldStyle} />
          </label>

          <label>
            {t('add.areaUnit')}
            <select value={areaUnit} onChange={(e) => setAreaUnit(e.target.value)} style={fieldStyle}>
              <option value="sqm">sqm</option>
              <option value="sqft">sqft</option>
              <option value="jerib">jerib</option>
            </select>
          </label>
        </div>

        <div style={rowStyle}>
          <label>
            {t('add.city')}
            <select value={cityId} onChange={handleCityChange} required style={fieldStyle}>
              <option value="">{t('add.selectCity')}</option>
              {cities.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>

          <label>
            {t('add.district')}
            <select value={districtId} onChange={(e) => setDistrictId(e.target.value)} disabled={districts.length === 0} style={fieldStyle}>
              <option value="">{t('add.selectDistrict')}</option>
              {districts.map((item) => (
                <option key={item.id} value={item.id}>{item.name}</option>
              ))}
            </select>
          </label>
        </div>

        <label>
          {t('add.address')}
          <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} required maxLength={255} style={fieldStyle} />
        </label>

        <label>
          {t('add.photos')}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(e) => setFiles(Array.from(e.target.files))}
            style={fieldStyle}
          />
        </label>

        {error && <p style={{ color: 'tomato', margin: 0 }}>{error}</p>}

        {createdId && (
          <p style={{ margin: 0 }}>
            <Link to={`/properties/${createdId}`}>{t('add.viewProperty')}</Link>
          </p>
        )}

        <button type="submit" disabled={busy} style={{ padding: 10 }}>
          {busy ? t('auth.working') : t('add.submit')}
        </button>
      </form>
    </div>
  )
}