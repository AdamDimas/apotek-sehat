# Apotek Sehat — Frontend (Stok & Kasir)

Antarmuka web untuk manajemen stok obat dan kasir (POS) apotek.
Dibangun dengan React + Vite + Tailwind CSS v4.

## Fitur
- Dashboard ringkasan stok & penjualan
- Kasir (POS) dengan pencarian siap-barcode dan alur pembayaran
- Manajemen stok obat: cari, filter, tambah/edit/hapus, penanda kadaluarsa
- Laporan penjualan dengan filter tanggal dan ekspor CSV
- Autentikasi + tampilan per peran (apoteker / kasir)

## Teknologi
React, Vite, React Router, Tailwind CSS v4.

## Menjalankan secara lokal
```bash
npm install
copy .env.example .env
npm run dev
```
Selama `VITE_USE_MOCK=true`, aplikasi berjalan penuh dengan data contoh
tanpa memerlukan backend.
