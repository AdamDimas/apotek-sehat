import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function Login() {
  const { login } = useAuth()
  const nav = useNavigate()
  const loc = useLocation()
  const [u, setU] = useState(''); const [p, setP] = useState('')
  const [err, setErr] = useState(''); const [loading, setLoading] = useState(false)

  const submit = async () => {
    setErr(''); setLoading(true)
    try {
      await login(u.trim(), p)
      nav(loc.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (e) { setErr(e.message) } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm bg-surface border border-line rounded-2xl p-8">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round"><path d="M12 6v12M6 12h12"/></svg>
          </div>
          <div>
            <h1 className="text-lg font-semibold">Apotek Sehat</h1>
            <p className="text-sm text-muted">Masuk untuk melanjutkan</p>
          </div>
        </div>

        <div className="mt-6 space-y-3" onKeyDown={(e) => e.key === 'Enter' && submit()}>
          <label className="block">
            <span className="text-[12.5px] font-medium">Username</span>
            <div className="mt-1"><Input value={u} onChange={(e) => setU(e.target.value)} placeholder="apoteker" /></div>
          </label>
          <label className="block">
            <span className="text-[12.5px] font-medium">Password</span>
            <div className="mt-1"><Input type="password" value={p} onChange={(e) => setP(e.target.value)} placeholder="••••••" /></div>
          </label>
          {err && <div className="rounded-lg bg-danger-soft text-danger px-3 py-2 text-[12.5px]">{err}</div>}
          <Button className="w-full py-2.5" disabled={loading} onClick={submit}>
            {loading ? 'Memproses…' : 'Masuk'}
          </Button>
        </div>

        <p className="mt-4 text-[11.5px] text-muted text-center">
          Mode contoh — coba <span className="font-mono">apoteker/apoteker</span> atau <span className="font-mono">kasir/kasir</span>
        </p>
      </div>
    </div>
  )
}