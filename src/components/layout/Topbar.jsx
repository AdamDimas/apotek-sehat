import { useLocation } from 'react-router-dom'
import { NAV } from '@/lib/nav'
import { useAuth } from '@/context/AuthContext'

export default function Topbar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()
  const current = NAV.find((n) => pathname.startsWith(n.to))
  const roleLabel = user?.role === 'kasir' ? 'Kasir' : 'Apoteker Penanggung Jawab'

  return (
    <header className="h-16 shrink-0 flex items-center justify-between px-7 border-b border-line bg-surface">
      <div>
        <h1 className="text-[17px] font-semibold leading-tight">{current?.label ?? 'Apotek Sehat'}</h1>
        {current?.sub && <p className="text-[12.5px] text-muted">{current.sub}</p>}
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right leading-tight">
          <div className="font-semibold text-[13px]">{user?.nama}</div>
          <div className="text-[11.5px] text-muted">{roleLabel}</div>
        </div>
        <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold">
          {(user?.nama || 'U').charAt(0)}
        </div>
        <button onClick={logout} title="Keluar" className="text-muted hover:text-danger p-2 rounded-lg hover:bg-canvas">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
        </button>
      </div>
    </header>
  )
}