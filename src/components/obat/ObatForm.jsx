import { useState } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

const KOSONG = { nama:'', bentuk:'Tablet', gol:'Bebas', batch:'', exp:'', stok:0, min:0, harga:0 }

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="text-[12.5px] font-medium">{label}</span>
      <div className="mt-1">{children}</div>
      {error && <span className="text-[11.5px] text-danger">{error}</span>}
    </label>
  )
}

export default function ObatForm({ initial, onSubmit, onCancel }) {
  const [f, setF] = useState(initial ? { ...initial } : { ...KOSONG })
  const [err, setErr] = useState({})
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }))

  const submit = async () => {
    const e = {}
    if (!f.nama.trim()) e.nama = 'Nama obat wajib diisi'
    if (!f.batch.trim()) e.batch = 'Nomor batch wajib diisi'
    if (!f.exp) e.exp = 'Tanggal kadaluarsa wajib diisi'
    if (Number(f.harga) < 0) e.harga = 'Harga tidak boleh negatif'
    setErr(e)
    if (Object.keys(e).length) return
    setSaving(true)
    try {
      await onSubmit({ ...f, stok: Number(f.stok) || 0, min: Number(f.min) || 0, harga: Number(f.harga) || 0 })
    } catch (ex) {
      setErr({ _form: ex.message })
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-4">
      <Field label="Nama obat" error={err.nama}><Input value={f.nama} onChange={set('nama')} placeholder="mis. Paracetamol 500 mg" /></Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Bentuk sediaan"><Select value={f.bentuk} onChange={set('bentuk')} options={['Tablet','Kaplet','Kapsul','Sirup','Cairan','Sachet','Inhaler','Salep']} /></Field>
        <Field label="Golongan"><Select value={f.gol} onChange={set('gol')} options={['Bebas','Bebas Terbatas','Keras']} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Nomor batch" error={err.batch}><Input value={f.batch} onChange={set('batch')} placeholder="mis. PCT-2405" /></Field>
        <Field label="Kadaluarsa" error={err.exp}><Input type="month" value={f.exp} onChange={set('exp')} /></Field>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <Field label="Stok"><Input type="number" min="0" value={f.stok} onChange={set('stok')} /></Field>
        <Field label="Stok minimum"><Input type="number" min="0" value={f.min} onChange={set('min')} /></Field>
        <Field label="Harga (Rp)" error={err.harga}><Input type="number" min="0" value={f.harga} onChange={set('harga')} /></Field>
      </div>
      {err._form && <div className="rounded-lg bg-danger-soft text-danger px-3 py-2 text-[12.5px]">{err._form}</div>}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={saving}>Batal</Button>
        <Button onClick={submit} disabled={saving}>{saving ? 'Menyimpan…' : 'Simpan'}</Button>
      </div>
    </div>
  )
}