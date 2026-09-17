import { useState } from 'react'
import { Card, CardHeader } from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import BarChart from '@/components/ui/BarChart'
import Button from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'
import ErrorState from '@/components/ui/ErrorState'
import useFetch from '@/hooks/useFetch'
import { getPenjualan } from '@/services/laporanService'
import { OBAT_TERLARIS } from '@/lib/laporan'
import { rp } from '@/lib/format'

export default function Laporan() {
  const [dari, setDari] = useState('2026-09-10')
  const [sampai, setSampai] = useState('2026-09-16')
  const { data, loading, error, reload } = useFetch(() => getPenjualan(dari, sampai), [dari, sampai])
  const rows = data ?? []

  const sumTotal = rows.reduce((s, d) => s + d.total, 0)
  const sumTrx = rows.reduce((s, d) => s + d.transaksi, 0)
  const avg = sumTrx ? Math.round(sumTotal / sumTrx) : 0
  const chart = rows.map((d) => ({ label: d.tanggal.slice(8), value: d.total, hint: `${d.tanggal}: ${rp(d.total)}` }))

  const exportCsv = () => {
    const out = [['Tanggal', 'Jumlah Transaksi', 'Total Penjualan'], ...rows.map((d) => [d.tanggal, d.transaksi, d.total])]
    const url = URL.createObjectURL(new Blob([out.map((r) => r.join(',')).join('\n')], { type: 'text/csv;charset=utf-8;' }))
    const a = document.createElement('a'); a.href = url; a.download = `laporan-penjualan-${dari}-sd-${sampai}.csv`; a.click(); URL.revokeObjectURL(url)
  }

  const DateField = ({ label, value, onChange }) => (
    <label className="text-[13px]"><span className="text-muted mr-2">{label}</span>
      <input type="date" value={value} onChange={(e) => onChange(e.target.value)} className="rounded-lg border border-line bg-surface px-3 py-1.5" /></label>
  )

  return (
    <div className="p-7 space-y-5">
      <Card>
        <div className="px-5 py-4 flex flex-wrap items-center gap-4">
          <DateField label="Dari" value={dari} onChange={setDari} />
          <DateField label="Sampai" value={sampai} onChange={setSampai} />
          <Button variant="outline" className="ml-auto" onClick={exportCsv} disabled={loading || !!error || !rows.length}>Ekspor CSV</Button>
        </div>
      </Card>

      {loading ? <Card><Loading label="Memuat laporan…" /></Card>
       : error ? <Card><ErrorState message={error} onRetry={reload} /></Card>
       : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total penjualan" value={rp(sumTotal)} hint={`${rows.length} hari`} tone="primary" />
            <StatCard label="Jumlah transaksi" value={sumTrx} />
            <StatCard label="Rata-rata / transaksi" value={rp(avg)} />
          </div>
          <Card>
            <CardHeader title="Grafik penjualan harian" />
            <div className="p-5">{rows.length ? <BarChart data={chart} height={180} />
              : <p className="text-[13px] text-muted py-8 text-center">Tidak ada data pada rentang tanggal ini.</p>}</div>
          </Card>
          <Card>
            <CardHeader title="Obat terlaris" right={<span className="text-[12px] text-muted">periode contoh</span>} />
            <table className="w-full text-[13px]">
              <thead><tr className="text-left text-[12px] text-muted bg-canvas">
                <th className="px-5 py-2.5 font-medium">Nama obat</th>
                <th className="px-3 py-2.5 font-medium text-right">Terjual</th>
                <th className="px-5 py-2.5 font-medium text-right">Total</th></tr></thead>
              <tbody>{OBAT_TERLARIS.map((o) => (
                <tr key={o.nama} className="border-t border-line">
                  <td className="px-5 py-3 font-medium">{o.nama}</td>
                  <td className="px-3 py-3 text-right tabular-nums">{o.qty} pcs</td>
                  <td className="px-5 py-3 text-right tabular-nums">{rp(o.total)}</td></tr>))}</tbody>
            </table>
          </Card>
        </>
      )}
    </div>
  )
}