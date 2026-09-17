import { api, USE_MOCK } from './api'
import { PENJUALAN_HARIAN } from '../lib/laporan'
const delay = (ms) => new Promise((r) => setTimeout(r, ms))

export async function getPenjualan(dari, sampai) {
  if (USE_MOCK) {
    await delay(400)
    return PENJUALAN_HARIAN.filter((d) => d.tanggal >= dari && d.tanggal <= sampai)
  }
  const qs = new URLSearchParams({ dari, sampai }).toString()
  return api(`/laporan/penjualan?${qs}`)
}