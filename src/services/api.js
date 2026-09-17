const BASE = import.meta.env.VITE_API_URL
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const getToken = () => localStorage.getItem('token')
export const setToken = (t) => localStorage.setItem('token', t)
export const clearToken = () => localStorage.removeItem('token')

export async function api(path, { method = 'GET', body, auth = true } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (auth) {
    const t = getToken()
    if (t) headers.Authorization = `Bearer ${t}`
  }
  const res = await fetch(`${BASE}${path}`, {
    method, headers, body: body ? JSON.stringify(body) : undefined,
  })
  if (res.status === 401) {
    clearToken(); localStorage.removeItem('user')
    window.location.href = '/login'
    throw new Error('Sesi berakhir. Silakan masuk kembali.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || `Terjadi kesalahan (${res.status}).`)
  return data
}