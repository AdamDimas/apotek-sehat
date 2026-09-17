import { api, USE_MOCK } from './api'
import { OBAT } from '../lib/obat'
const delay = (ms) => new Promise((r) => setTimeout(r, ms))
let store = OBAT.map((o) => ({ ...o }))   // salinan mutable untuk mode mock

export async function getObat() {
  if (USE_MOCK) { await delay(500); return store.map((o) => ({ ...o })) }
  return api('/obat')
}
export async function createObat(obat) {
  if (USE_MOCK) {
    await delay(300)
    const id = store.reduce((m, o) => Math.max(m, o.id), 0) + 1
    const baru = { ...obat, id }; store = [baru, ...store]; return baru
  }
  return api('/obat', { method: 'POST', body: obat })
}
export async function updateObat(id, obat) {
  if (USE_MOCK) {
    await delay(300)
    const merged = { ...obat, id }; store = store.map((o) => (o.id === id ? merged : o)); return merged
  }
  return api(`/obat/${id}`, { method: 'PUT', body: obat })
}
export async function deleteObat(id) {
  if (USE_MOCK) { await delay(300); store = store.filter((o) => o.id !== id); return { ok: true } }
  return api(`/obat/${id}`, { method: 'DELETE' })
}