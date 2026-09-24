import { api, USE_MOCK } from './api'
import { USERS } from '@/lib/users'
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

let store = USERS.map((u) => ({ ...u }))
const tanpaPassword = ({ password, ...u }) => u

// Mode mock: dipanggil authService saat login.
export const mockFindByCredentials = (email, password) =>
  store.find((u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password)

export async function getUsers() {
  if (USE_MOCK) { await delay(400); return store.map(tanpaPassword) }
  return api('/users')
}

export async function createUser(payload) {
  if (USE_MOCK) {
    await delay(300)
    if (store.some((u) => u.email.toLowerCase() === payload.email.toLowerCase()))
      throw new Error('Email sudah terdaftar, gunakan yang lain.')
    if (store.some((u) => u.username.toLowerCase() === payload.username.toLowerCase()))
      throw new Error('Username sudah dipakai, pilih yang lain.')
    const id = store.reduce((m, u) => Math.max(m, u.id), 0) + 1
    const baru = { ...payload, id, is_active: true }
    store = [...store, baru]
    return tanpaPassword(baru)
  }
  return api('/users', { method: 'POST', body: payload })
}

export async function updateUser(id, payload) {
  if (USE_MOCK) {
    await delay(300)
    const u = store.find((x) => x.id === id)
    if (!u) throw new Error('Pengguna tidak ditemukan.')
    // cek duplikat hanya bila email/username ikut diubah (dikecualikan diri sendiri)
    if (payload.email && store.some((x) => x.id !== id && x.email.toLowerCase() === payload.email.toLowerCase()))
      throw new Error('Email sudah terdaftar, gunakan yang lain.')
    if (payload.username && store.some((x) => x.id !== id && x.username.toLowerCase() === payload.username.toLowerCase()))
      throw new Error('Username sudah dipakai, pilih yang lain.')
    Object.assign(u, payload)   // payload umumnya {name, role, password?}
    return tanpaPassword(u)
  }
  return api(`/users/${id}`, { method: 'PUT', body: payload })
}

export async function setUserActive(id, is_active) {
  if (USE_MOCK) {
    await delay(300)
    const u = store.find((x) => x.id === id)
    if (!u) throw new Error('Pengguna tidak ditemukan.')
    u.is_active = is_active
    return tanpaPassword(u)
  }
  return api(`/users/${id}`, { method: 'PATCH', body: { is_active } })
}

export async function deleteUser(id) {
  if (USE_MOCK) {
    await delay(300)
    store = store.filter((x) => x.id !== id)
    return { ok: true }
  }
  return api(`/users/${id}`, { method: 'DELETE' })
}