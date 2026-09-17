export const NAV = [
  {
    to: "/dashboard",
    label: "Dashboard",
    sub: "Ringkasan stok dan penjualan hari ini",
    icon: "M3 12l9-8 9 8M5 10v10h14V10",
  },
  {
    to: "/kasir",
    label: "Kasir",
    sub: "Transaksi penjualan obat",
    icon: "M3 6h18M6 6l1 13h10l1-13M9 10v5M15 10v5",
  },
  {
    to: "/stok",
    label: "Stok Obat",
    sub: "Kelola persediaan, batch, dan kadaluarsa",
    roles: ["apoteker"],
    icon: "M4 7l8-4 8 4-8 4-8-4zM4 7v10l8 4 8-4V7M12 11v10",
  },
  {
    to: "/pembelian",
    label: "Pembelian",
    sub: "Pesanan dan penerimaan barang dari PBF",
    roles: ["apoteker"],
    icon: "M4 5h2l2 11h9l2-8H7M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z",
  },
  {
    to: "/laporan",
    label: "Laporan",
    sub: "Rekap penjualan, stok, dan kadaluarsa",
    roles: ["apoteker"],
    icon: "M5 3v18h14M9 15v3M13 9v9M17 12v6",
  },
  {
    to: "/pengaturan",
    label: "Pengaturan",
    sub: "Pengguna, hak akses, dan preferensi",
    roles: ["apoteker"],
    icon: "M12 15a3 3 0 100-6 3 3 0 000 6zM4 12h2M18 12h2M12 4v2M12 18v2",
  },
];
