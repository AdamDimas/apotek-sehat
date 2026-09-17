import { api, USE_MOCK } from './api'
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export async function createTransaksi({ items, metode, bayar, total }) {
  if (USE_MOCK) {
    await delay(400)
    return { no: '#TRX-' + String(Date.now()).slice(-5), total,
      kembalian: metode === 'Tunai' ? Math.max(0, bayar - total) : 0 }
  }
  return api('/transaksi', { method: 'POST', body: { items, metode, bayar } })
}