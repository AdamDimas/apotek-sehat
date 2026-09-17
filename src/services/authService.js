import { api, setToken, USE_MOCK } from './api'
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export async function login(username, password) {
  if (USE_MOCK) {
    await delay(400)
    const akun = {
      apoteker: { password: 'apoteker', user: { nama: 'Apt. Gee, S.Farm', role: 'apoteker' } },
      kasir:    { password: 'kasir',    user: { nama: 'Rina (Kasir)',     role: 'kasir' } },
    }[username]
    if (!akun || akun.password !== password) throw new Error('Username atau password salah.')
    setToken('mock-token-' + username)
    return akun.user
  }
  const { token, user } = await api('/auth/login', { method: 'POST', auth: false, body: { username, password } })
  setToken(token)
  return user
}