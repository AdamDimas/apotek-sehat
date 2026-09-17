import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AppLayout from '@/components/layout/AppLayout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Kasir from './pages/Kasir'
import StokObat from './pages/StokObat'
import Pembelian from './pages/Pembelian'
import Laporan from './pages/Laporan'
import Pengaturan from './pages/Pengaturan'

const ApotekerOnly = ({ children }) => <ProtectedRoute roles={['apoteker']}>{children}</ProtectedRoute>

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kasir" element={<Kasir />} />
        <Route path="/stok" element={<ApotekerOnly><StokObat /></ApotekerOnly>} />
        <Route path="/pembelian" element={<ApotekerOnly><Pembelian /></ApotekerOnly>} />
        <Route path="/laporan" element={<ApotekerOnly><Laporan /></ApotekerOnly>} />
        <Route path="/pengaturan" element={<ApotekerOnly><Pengaturan /></ApotekerOnly>} />
        <Route path="*" element={<div className="p-7 text-muted">Halaman tidak ditemukan.</div>} />
      </Route>
    </Routes>
  )
}