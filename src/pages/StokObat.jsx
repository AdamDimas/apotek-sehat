import { useMemo, useState } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Pagination from '@/components/ui/Pagination'
import EmptyState from '@/components/ui/EmptyState'
import Loading from '@/components/ui/Loading'
import ErrorState from '@/components/ui/ErrorState'
import Modal from '@/components/ui/Modal'
import GolonganBadge from '@/components/obat/GolonganBadge'
import StatusStok from '@/components/obat/StatusStok'
import ObatForm from '@/components/obat/ObatForm'
import { IconSearch, IconPlus } from '@/components/ui/icons'
import useFetch from '@/hooks/useFetch'
import { getObat, createObat, updateObat, deleteObat } from '@/services/obatService'
import { rp, expLabel, expStatus, stokStatus } from '@/lib/format'

const PAGE_SIZE = 8

export default function StokObat() {
  const { data, loading, error, reload, setData } = useFetch(getObat, [])
  const [q, setQ] = useState('')
  const [gol, setGol] = useState('Semua')
  const [stat, setStat] = useState('Semua')
  const [page, setPage] = useState(1)
  const [modal, setModal] = useState(null)

  const filtered = useMemo(() => (data ?? []).filter((o) => {
    const term = q.trim().toLowerCase()
    if (term && !o.nama.toLowerCase().includes(term) && !o.batch.toLowerCase().includes(term)) return false
    if (gol !== 'Semua' && o.gol !== gol) return false
    if (stat !== 'Semua' && stokStatus(o) !== stat) return false
    return true
  }), [data, q, gol, stat])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const rows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleSave = async (obat) => {
    if (obat.id) {
      const updated = await updateObat(obat.id, obat)
      setData((d) => d.map((o) => (o.id === updated.id ? updated : o)))
    } else {
      const created = await createObat(obat)
      setData((d) => [created, ...d])
    }
    setModal(null); setPage(1)
  }
  const handleDelete = async (o) => {
    if (!window.confirm(`Hapus "${o.nama}" dari daftar stok?`)) return
    try { await deleteObat(o.id); setData((d) => d.filter((x) => x.id !== o.id)) }
    catch (e) { window.alert(e.message) }
  }

  return (
    <div className="p-7">
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-line flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[220px]">
            <Input icon={<IconSearch />} placeholder="Cari nama obat atau nomor batch…"
              value={q} onChange={(e) => { setQ(e.target.value); setPage(1) }} disabled={loading || !!error} />
          </div>
          <Select value={gol} onChange={(e) => { setGol(e.target.value); setPage(1) }}
            options={['Semua', 'Bebas', 'Bebas Terbatas', 'Keras']} />
          <Select value={stat} onChange={(e) => { setStat(e.target.value); setPage(1) }}
            options={[{ value: 'Semua', label: 'Semua status' }, { value: 'aman', label: 'Aman' },
              { value: 'menipis', label: 'Menipis' }, { value: 'habis', label: 'Habis' }]} />
          <Button className="ml-auto" onClick={() => setModal({ mode: 'add' })} disabled={loading || !!error}>
            <IconPlus /> Tambah obat
          </Button>
        </div>

        {loading ? <Loading label="Memuat data obat…" />
         : error ? <ErrorState message={error} onRetry={reload} />
         : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-[13px]">
                <thead>
                  <tr className="text-left text-[12px] text-muted bg-canvas">
                    <th className="px-5 py-2.5 font-medium">Nama obat</th>
                    <th className="px-3 py-2.5 font-medium">Golongan</th>
                    <th className="px-3 py-2.5 font-medium">Batch</th>
                    <th className="px-3 py-2.5 font-medium">Kadaluarsa</th>
                    <th className="px-3 py-2.5 font-medium text-right">Stok</th>
                    <th className="px-3 py-2.5 font-medium">Status</th>
                    <th className="px-3 py-2.5 font-medium text-right">Harga</th>
                    <th className="px-5 py-2.5 font-medium text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((o) => (
                    <tr key={o.id} className="border-t border-line hover:bg-canvas">
                      <td className="px-5 py-3"><div className="font-medium">{o.nama}</div><div className="text-[12px] text-muted">{o.bentuk}</div></td>
                      <td className="px-3 py-3"><GolonganBadge gol={o.gol} /></td>
                      <td className="px-3 py-3 font-mono text-[12.5px]">{o.batch}</td>
                      <td className="px-3 py-3">
                        <span className={expStatus(o) !== 'aman' ? 'text-danger font-medium' : ''}>{expLabel(o.exp)}</span>
                        {expStatus(o) === 'segera' && <span className="ml-1 text-[11px] text-warn">• dekat</span>}
                        {expStatus(o) === 'kadaluarsa' && <span className="ml-1 text-[11px] text-danger">• lewat</span>}
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">{o.stok}</td>
                      <td className="px-3 py-3"><StatusStok obat={o} /></td>
                      <td className="px-3 py-3 text-right tabular-nums">{rp(o.harga)}</td>
                      <td className="px-5 py-3"><div className="flex justify-end gap-1">
                        <Button variant="ghost" size="sm" onClick={() => setModal({ mode: 'edit', obat: o })}>Edit</Button>
                        <Button variant="ghost" size="sm" className="text-danger" onClick={() => handleDelete(o)}>Hapus</Button>
                      </div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && <EmptyState title="Tidak ada obat yang cocok" note="Coba ubah kata kunci atau filter, atau tambahkan obat baru." />}
            </div>
            <div className="px-5 py-3 border-t border-line text-[12px] text-muted flex items-center justify-between">
              <span>Menampilkan {rows.length} dari {filtered.length} item</span>
              {totalPages > 1 && <Pagination page={safePage} totalPages={totalPages} onChange={setPage} />}
            </div>
          </>
        )}
      </Card>

      <Modal open={!!modal} onClose={() => setModal(null)} title={modal?.mode === 'edit' ? 'Edit obat' : 'Tambah obat'}>
        {modal && <ObatForm key={modal.mode === 'edit' ? `edit-${modal.obat.id}` : 'add'}
          initial={modal.mode === 'edit' ? modal.obat : null} onSubmit={handleSave} onCancel={() => setModal(null)} />}
      </Modal>
    </div>
  )
}