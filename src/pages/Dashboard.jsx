import { Card, CardHeader } from '@/components/ui/Card'
import StatCard from '@/components/ui/StatCard'
import BarChart from '@/components/ui/BarChart'
import Badge from '@/components/ui/Badge'
import StatusStok from '@/components/obat/StatusStok'
import Loading from '@/components/ui/Loading'
import ErrorState from '@/components/ui/ErrorState'
import useFetch from '@/hooks/useFetch'
import { getObat } from '@/services/obatService'
import { getPenjualan } from '@/services/laporanService'
import { TRANSAKSI_TERAKHIR } from '@/lib/laporan'
import { rp, expLabel, expStatus, stokStatus } from '@/lib/format'

export default function Dashboard() {
  const obat = useFetch(getObat, [])
  const jual = useFetch(() => getPenjualan('2026-09-10', '2026-09-16'), [])

  if (obat.loading || jual.loading) return <div className="p-7"><Card><Loading label="Memuat dashboard…" /></Card></div>
  if (obat.error || jual.error) return <div className="p-7"><Card><ErrorState message={obat.error || jual.error} onRetry={() => { obat.reload(); jual.reload() }} /></Card></div>

  const daftar = obat.data ?? []
  const penjualan = jual.data ?? []
  const hariIni = penjualan[penjualan.length - 1] ?? { total: 0, transaksi: 0 }
  const menipis = daftar.filter((o) => stokStatus(o) !== 'aman')
  const kadaluarsa = daftar.filter((o) => expStatus(o) !== 'aman')
  const perhatian = daftar.filter((o) => stokStatus(o) !== 'aman' || expStatus(o) !== 'aman')
  const chart = penjualan.slice(-7).map((d) => ({ label: d.tanggal.slice(8), value: d.total, hint: `${d.tanggal}: ${rp(d.total)} · ${d.transaksi} transaksi` }))

  return (
    <div className="p-7 space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total item obat" value={daftar.length} hint="4 golongan" />
        <StatCard label="Penjualan hari ini" value={rp(hariIni.total)} hint={`${hariIni.transaksi} transaksi`} tone="primary" />
        <StatCard label="Stok menipis / habis" value={menipis.length} hint="perlu restock" tone="warn" />
        <StatCard label="Akan kadaluarsa" value={kadaluarsa.length} hint="≤ 6 bulan" tone="danger" />
      </div>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <div className="xl:col-span-2 space-y-5">
          <Card>
            <CardHeader title="Penjualan 7 hari terakhir" right={<span className="text-[12px] text-muted">Total {rp(chart.reduce((s, d) => s + d.value, 0))}</span>} />
            <div className="p-5"><BarChart data={chart} /></div>
          </Card>
          <Card>
            <CardHeader title="Perlu perhatian" right={<span className="text-[12px] text-muted">{perhatian.length} item</span>} />
            <ul>{perhatian.map((o) => (
              <li key={o.id} className="px-5 py-3 border-b border-line last:border-0 flex items-center justify-between gap-3">
                <div className="min-w-0"><div className="font-medium truncate">{o.nama}</div>
                  <div className="text-[12px] text-muted"><span className="font-mono">{o.batch}</span> · exp {expLabel(o.exp)}</div></div>
                <div className="flex items-center gap-2 shrink-0">
                  {expStatus(o) !== 'aman' && <Badge tone="danger">Exp {expStatus(o) === 'kadaluarsa' ? 'lewat' : 'dekat'}</Badge>}
                  {stokStatus(o) !== 'aman' && <StatusStok obat={o} />}
                  <span className="tabular-nums text-[13px] w-14 text-right">{o.stok} pcs</span></div>
              </li>))}</ul>
          </Card>
        </div>
        <Card className="self-start">
          <CardHeader title="Transaksi terakhir" />
          <ul>{TRANSAKSI_TERAKHIR.map((t) => (
            <li key={t.no} className="px-5 py-3 border-b border-line last:border-0 flex items-center justify-between">
              <div><div className="font-mono text-[12.5px]">{t.no}</div><div className="text-[12px] text-muted">{t.jam} · {t.pelanggan}</div></div>
              <div className="font-semibold tabular-nums">{rp(t.total)}</div>
            </li>))}</ul>
        </Card>
      </div>
    </div>
  )
}