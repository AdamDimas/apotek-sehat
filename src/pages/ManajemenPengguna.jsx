import { useState } from 'react'
import { Card } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Loading from '@/components/ui/Loading'
import ErrorState from '@/components/ui/ErrorState'
import EmptyState from '@/components/ui/EmptyState'
import UserForm from '@/components/user/UserForm'
import { IconPlus } from '@/components/ui/icons'
import useFetch from '@/hooks/useFetch'
import { useAuth } from '@/context/AuthContext'
import { getUsers, createUser, updateUser, setUserActive, deleteUser } from '@/services/userService'

const RoleBadge = ({ role }) =>
  role === 'admin' ? <Badge tone="primary">Admin</Badge> : <Badge tone="info">Staff</Badge>

export default function ManajemenPengguna() {
  const { data, loading, error, reload, setData } = useFetch(getUsers, [])
  const { user: me } = useAuth()
  const [modal, setModal] = useState(null)   // null | {mode:'add'} | {mode:'edit', user}
  const [busyId, setBusyId] = useState(null)

  const isSelf = (u) => me?.email?.toLowerCase() === u.email.toLowerCase()

  const handleCreate = async (payload) => {
    const baru = await createUser(payload)
    setData((d) => [...(d ?? []), baru])
    setModal(null)
  }
  const handleUpdate = async (payload) => {
    const updated = await updateUser(modal.user.id, payload)
    setData((d) => d.map((x) => (x.id === updated.id ? { ...x, ...updated } : x)))
    setModal(null)
  }
  const handleToggle = async (u) => {
    setBusyId(u.id)
    try {
      const updated = await setUserActive(u.id, !u.is_active)
      setData((d) => d.map((x) => (x.id === u.id ? { ...x, is_active: updated.is_active } : x)))
    } catch (e) { window.alert(e.message) } finally { setBusyId(null) }
  }
  const handleDelete = async (u) => {
    if (!window.confirm(`Hapus akun "${u.name}" (${u.email}) secara permanen? Tindakan ini tidak bisa dibatalkan.`)) return
    setBusyId(u.id)
    try {
      await deleteUser(u.id)
      setData((d) => d.filter((x) => x.id !== u.id))
    } catch (e) { window.alert(e.message) } finally { setBusyId(null) }
  }

  return (
    <div className="p-7">
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-line flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Daftar pengguna</h2>
            <p className="text-[12.5px] text-muted">Akun yang bisa masuk ke sistem</p>
          </div>
          <Button onClick={() => setModal({ mode: 'add' })} disabled={loading || !!error}>
            <IconPlus /> Tambah pengguna
          </Button>
        </div>

        {loading ? <Loading label="Memuat pengguna…" />
         : error ? <ErrorState message={error} onRetry={reload} />
         : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-[12px] text-muted bg-canvas">
                  <th className="px-5 py-2.5 font-medium">Nama</th>
                  <th className="px-3 py-2.5 font-medium">Email</th>
                  <th className="px-3 py-2.5 font-medium">Username</th>
                  <th className="px-3 py-2.5 font-medium">Role</th>
                  <th className="px-3 py-2.5 font-medium">Status</th>
                  <th className="px-5 py-2.5 font-medium text-right">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {(data ?? []).map((u) => {
                  const self = isSelf(u)
                  const busy = busyId === u.id
                  return (
                    <tr key={u.id} className={`border-t border-line ${u.is_active === false ? 'opacity-60' : ''}`}>
                      <td className="px-5 py-3 font-medium">
                        {u.name}{self && <span className="ml-2 text-[11px] text-muted">(Anda)</span>}
                      </td>
                      <td className="px-3 py-3">{u.email}</td>
                      <td className="px-3 py-3 font-mono text-[12.5px]">{u.username}</td>
                      <td className="px-3 py-3"><RoleBadge role={u.role} /></td>
                      <td className="px-3 py-3">
                        {u.is_active === false ? <Badge tone="neutral">Nonaktif</Badge> : <Badge tone="ok">Aktif</Badge>}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex justify-end gap-1">
                          <Button variant="ghost" size="sm" disabled={busy}
                            onClick={() => setModal({ mode: 'edit', user: u })}>Edit</Button>
                          <Button variant="ghost" size="sm" disabled={self || busy}
                            title={self ? 'Tidak bisa mengubah akun sendiri' : ''}
                            onClick={() => handleToggle(u)}>
                            {u.is_active === false ? 'Aktifkan' : 'Nonaktifkan'}
                          </Button>
                          <Button variant="ghost" size="sm" className="text-danger" disabled={self || busy}
                            title={self ? 'Tidak bisa menghapus akun sendiri' : ''}
                            onClick={() => handleDelete(u)}>Hapus</Button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            {(data ?? []).length === 0 &&
              <EmptyState title="Belum ada pengguna" note="Tambahkan akun pertama." />}
          </div>
        )}
      </Card>

      <Modal open={!!modal} onClose={() => setModal(null)}
        title={modal?.mode === 'edit' ? 'Edit pengguna' : 'Tambah pengguna'}>
        {modal?.mode === 'edit'
          ? <UserForm key={`edit-${modal.user.id}`} initial={modal.user} lockRole={isSelf(modal.user)}
              onSubmit={handleUpdate} onCancel={() => setModal(null)} />
          : modal && <UserForm key="add" onSubmit={handleCreate} onCancel={() => setModal(null)} />}
      </Modal>
    </div>
  )
}