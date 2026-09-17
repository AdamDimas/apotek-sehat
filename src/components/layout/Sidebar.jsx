import { NavLink } from 'react-router-dom'
import { NAV } from '@/lib/nav'
import { useAuth } from '@/context/AuthContext'

export default function Sidebar() {
  const { user } = useAuth();
  const items = NAV.filter((n) => !n.roles || n.roles.includes(user?.role));

  return (
    <aside
      className="w-[236px] shrink-0 flex flex-col text-[13px]"
      style={{
        background:
          "linear-gradient(180deg, var(--color-sidebar), var(--color-sidebar-2))",
      }}
    >
      <div className="px-5 py-5 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#fff"
            strokeWidth="2.4"
            strokeLinecap="round"
          >
            <path d="M12 6v12M6 12h12" />
          </svg>
        </div>
        <div className="leading-tight">
          <div className="text-white font-semibold text-[15px]">
            Apotek Sehat
          </div>
          <div className="text-[11px] text-white/60">
            Sistem Stok &amp; Kasir
          </div>
        </div>
      </div>

      <nav className="px-3 mt-1 flex flex-col gap-0.5">
        {items.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                isActive
                  ? "bg-white/10 text-white font-semibold"
                  : "text-white/75 hover:bg-white/5"
              }`
            }
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d={n.icon} />
            </svg>
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto px-5 py-4 text-[11px] text-white/50 border-t border-white/10">
        v0.1 · Frontend
      </div>
    </aside>
  );
}
