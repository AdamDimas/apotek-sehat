import { api, setToken, USE_MOCK } from './api'
import { mockFindByCredentials } from './userService'
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export async function login(email, password) {
  if (USE_MOCK) {
    await delay(400)
    const u = mockFindByCredentials(email, password)
    if (!u) throw new Error('Email atau password salah.')
    if (u.is_active === false) throw new Error('Akun dinonaktifkan. Hubungi admin apotek.')
    setToken('mock-token-' + u.username)
    return { name: u.name, email: u.email, role: u.role }
  }
  const { token, user } = await api('/auth/login', { method: 'POST', auth: false, body: { email, password } })
  setToken(token)
  return user
}