// One place for the backend address and small helpers
export const API = 'http://127.0.0.1:8000'

// Sends a POST request with JSON and returns { ok, status, data }
export async function postJson(path, body, token) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(API + path, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  let data = {}
  try {
    data = await res.json()
  } catch {
    data = {}
  }

  return { ok: res.ok, status: res.status, data }
}

// Picks the first error message from a Laravel response
export function firstError(data) {
  if (data?.errors) {
    const first = Object.values(data.errors)[0]
    if (first && first.length) {
      return first[0]
    }
  }
  return data?.message || ''
}