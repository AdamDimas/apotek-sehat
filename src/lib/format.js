// Referensi "hari ini" untuk hitung kadaluarsa.
// Saat integrasi API nanti, ganti ke tanggal nyata (new Date()).
const REF_YEAR = 2026;
const REF_MONTH = 9;

export const rp = (n) => "Rp " + Number(n || 0).toLocaleString("id-ID");

const BULAN = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Ags",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
export const expLabel = (ym) => {
  const [y, m] = ym.split("-").map(Number);
  return `${BULAN[m - 1]} ${y}`;
};
export const monthsUntil = (ym) => {
  const [y, m] = ym.split("-").map(Number);
  return (y - REF_YEAR) * 12 + (m - REF_MONTH);
};
export const stokStatus = (o) =>
  o.stok === 0 ? "habis" : o.stok <= o.min ? "menipis" : "aman";
export const expStatus = (o) => {
  const mm = monthsUntil(o.exp);
  return mm < 0 ? "kadaluarsa" : mm <= 6 ? "segera" : "aman";
};
