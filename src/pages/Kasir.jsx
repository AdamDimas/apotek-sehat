import { useState } from 'react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import EmptyState from '@/components/ui/EmptyState'
import GolonganBadge from '@/components/obat/GolonganBadge'
import PaymentModal from '@/components/kasir/PaymentModal'
import { IconSearch } from '@/components/ui/icons'
import { createTransaksi } from '@/services/transaksiService'
import { OBAT } from '@/lib/obat'
import { rp } from '@/lib/format'

export default function Kasir() {
  const [q, setQ] = useState("");
  const [cart, setCart] = useState([]);
  const [pay, setPay] = useState(false);

  const handleConfirm = ({ items, metode, bayar, total }) =>
    createTransaksi({
      items: items.map((x) => ({ id: x.id, qty: x.qty })),
      metode,
      bayar,
      total,
    });

  const list = OBAT.filter(
    (o) => o.stok > 0 && o.nama.toLowerCase().includes(q.trim().toLowerCase()),
  );

  const add = (o) =>
    setCart((c) => {
      const found = c.find((x) => x.id === o.id);
      if (found) {
        if (found.qty >= o.stok) return c;
        return c.map((x) => (x.id === o.id ? { ...x, qty: x.qty + 1 } : x));
      }
      return [
        ...c,
        {
          id: o.id,
          nama: o.nama,
          gol: o.gol,
          harga: o.harga,
          stok: o.stok,
          qty: 1,
        },
      ];
    });
  const setQty = (id, d) =>
    setCart((c) =>
      c.map((x) =>
        x.id === id
          ? { ...x, qty: Math.max(1, Math.min(x.stok, x.qty + d)) }
          : x,
      ),
    );
  const del = (id) => setCart((c) => c.filter((x) => x.id !== id));

  const total = cart.reduce((s, x) => s + x.qty * x.harga, 0);

  const onSearchKey = (e) => {
    if (e.key === "Enter" && list.length > 0) {
      add(list[0]);
      setQ("");
    }
  };

  return (
    <div className="p-7 h-full">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 h-full">
        {/* katalog */}
        <div className="bg-surface border border-line rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-line">
            <Input
              autoFocus
              icon={<IconSearch />}
              value={q}
              onKeyDown={onSearchKey}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Scan barcode atau ketik nama obat, lalu Enter…"
              className="py-2.5 text-[14px]"
            />
          </div>
          <div className="p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto content-start">
            {list.map((o) => (
              <button
                key={o.id}
                onClick={() => add(o)}
                className="text-left rounded-xl border border-line p-3 hover:border-primary transition-colors"
              >
                <div className="font-medium text-[13px] leading-snug">
                  {o.nama}
                </div>
                <div className="mt-1">
                  <GolonganBadge gol={o.gol} />
                </div>
                <div className="mt-2 flex items-center justify-between">
                  <span className="font-semibold tabular-nums">
                    {rp(o.harga)}
                  </span>
                  <span className="text-[11.5px] text-muted">
                    stok {o.stok}
                  </span>
                </div>
              </button>
            ))}
            {list.length === 0 && (
              <div className="col-span-full">
                <EmptyState
                  title="Obat tidak ditemukan"
                  note="Coba kata kunci lain."
                />
              </div>
            )}
          </div>
        </div>

        {/* keranjang */}
        <div className="bg-surface border border-line rounded-xl flex flex-col overflow-hidden">
          <div className="px-4 py-3.5 border-b border-line flex items-center justify-between">
            <h2 className="font-semibold">Keranjang</h2>
            <span className="text-[12px] text-muted">{cart.length} item</span>
          </div>

          <div className="flex-1 overflow-y-auto">
            {cart.length === 0 ? (
              <EmptyState
                title="Keranjang kosong"
                note="Pilih obat dari daftar untuk memulai transaksi."
              />
            ) : (
              cart.map((x) => (
                <div
                  key={x.id}
                  className="px-4 py-3 border-b border-line last:border-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="font-medium text-[13px] leading-snug">
                      {x.nama}
                    </div>
                    <button
                      onClick={() => del(x.id)}
                      className="text-muted hover:text-danger text-[16px] leading-none"
                    >
                      ×
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center border border-line rounded-lg">
                      <button
                        onClick={() => setQty(x.id, -1)}
                        className="w-7 h-7 text-[15px]"
                      >
                        −
                      </button>
                      <span className="w-8 text-center tabular-nums text-[13px]">
                        {x.qty}
                      </span>
                      <button
                        onClick={() => setQty(x.id, 1)}
                        className="w-7 h-7 text-[15px]"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-semibold tabular-nums">
                      {rp(x.qty * x.harga)}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-line p-4 space-y-3">
            <div className="flex items-center justify-between text-[17px] font-bold">
              <span>Total</span>
              <span className="tabular-nums">{rp(total)}</span>
            </div>
            <Button
              className="w-full py-3 text-[15px]"
              disabled={cart.length === 0}
              onClick={() => setPay(true)}
            >
              Proses pembayaran
            </Button>
          </div>
        </div>
      </div>

      <PaymentModal
        open={pay}
        items={cart}
        total={total}
        onConfirm={handleConfirm}
        onClose={() => setPay(false)}
        onComplete={() => setCart([])}
      />
    </div>
  );
}
