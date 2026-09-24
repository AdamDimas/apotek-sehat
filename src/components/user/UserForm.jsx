import { useState } from 'react'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Button from '@/components/ui/Button'

const KOSONG = { name: '', email: '', username: '', password: '', role: 'staff' }
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)

function Field({ label, error, hint, children }) {
  return (
    <label className="block">
      <span className="text-[12.5px] font-medium">{label}</span>
      <div className="mt-1">{children}</div>
      {hint && !error && <span className="text-[11.5px] text-muted">{hint}</span>}
      {error && <span className="text-[11.5px] text-danger">{error}</span>}
    </label>
  )
}

export default function UserForm({ initial, lockRole = false, onSubmit, onCancel }) {
  const isEdit = !!initial
  const [f, setF] = useState(initial
    ? { name: initial.name, email: initial.email, username: initial.username, password: '', role: initial.role }
    : { ...KOSONG })
  const [err, setErr] = useState({})
  const [saving, setSaving] = useState(false)
  const set = (k) => (e) => setF((prev) => ({ ...prev, [k]: e.target.value }))

  const submit = async () => {
    const e = {}
    if (!f.name.trim()) e.name = 'Nama wajib diisi'
    if (!isEdit) {
      if (!f.email.trim()) e.email = 'Email wajib diisi'
      else if (!isEmail(f.email)) e.email = 'Format email tidak valid'
      if (!f.username.trim()) e.username = 'Username wajib diisi'
      else if (/\s/.test(f.username)) e.username = 'Username tidak boleh mengandung spasi'
      else if (f.username.length > 30) e.username = 'Username maksimal 30 karakter'
      if (f.password.length < 4) e.password = 'Password minimal 4 karakter'
    } else if (f.password && f.password.length < 4) {
      e.password = 'Password minimal 4 karakter'
    }
    setErr(e)
    if (Object.keys(e).length) return

    setSaving(true)
    try {
      if (isEdit) {
        const payload = { name: f.name.trim(), role: f.role }
        if (f.password) payload.password = f.password   // hanya kirim bila direset
        await onSubmit(payload)
      } else {
        await onSubmit({
          name: f.name.trim(),
          email: f.email.trim().toLowerCase(),
          username: f.username.trim().toLowerCase(),
          password: f.password,
          role: f.role,
        })
      }
    } catch (ex) {
      setErr({ _form: ex.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-4">
      <Field label="Nama lengkap" error={err.name}>
        <Input value={f.name} onChange={set('name')} placeholder="mis. Budi Santoso" />
      </Field>
      <Field label="Email" error={err.email} hint={isEdit ? 'Email tidak dapat diubah' : undefined}>
        <Input type="email" value={f.email} onChange={set('email')} placeholder="mis. budi@apotek.com"
          disabled={isEdit} className="disabled:opacity-70 disabled:cursor-not-allowed" />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Username" error={err.username} hint={isEdit ? 'Tidak dapat diubah' : undefined}>
          <Input value={f.username} onChange={set('username')} placeholder="mis. budi"
            disabled={isEdit} className="disabled:opacity-70 disabled:cursor-not-allowed" />
        </Field>
        <Field label="Role" hint={lockRole ? 'Tidak bisa mengubah role sendiri' : undefined}>
          <Select value={f.role} onChange={set('role')} disabled={lockRole}
            className="disabled:opacity-70 disabled:cursor-not-allowed"
            options={[{ value: 'staff', label: 'Staff' }, { value: 'admin', label: 'Admin' }]} />
        </Field>
      </div>
      <Field label={isEdit ? 'Password baru' : 'Password awal'} error={err.password}
        hint={isEdit ? 'Kosongkan jika tidak ingin mengubah password' : undefined}>
        <Input type="text" value={f.password} onChange={set('password')}
          placeholder={isEdit ? 'biarkan kosong…' : 'minimal 4 karakter'} />
      </Field>
      {!isEdit && (
        <p className="text-[11.5px] text-muted">
          Sampaikan email dan password ini ke staff baru, dan sarankan menggantinya setelah login pertama.
        </p>
      )}
      {err._form && <div className="rounded-lg bg-danger-soft text-danger px-3 py-2 text-[12.5px]">{err._form}</div>}
      <div className="flex justify-end gap-2 pt-2">
        <Button variant="outline" onClick={onCancel} disabled={saving}>Batal</Button>
        <Button onClick={submit} disabled={saving}>
          {saving ? (isEdit ? 'Menyimpan…' : 'Membuat…') : (isEdit ? 'Simpan perubahan' : 'Buat akun')}
        </Button>
      </div>
    </div>
  )
}