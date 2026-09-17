import { useEffect, useState } from 'react'
import Modal from '@/components/ui/Modal'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { rp } from '@/lib/format'

export default function PaymentModal({ open, items, total, onClose, onConfirm, onComplete }) {
  const [step, setStep] = useState('bayar')
  const [method, setMethod] = useState('Tunai')
  const [cash, setCash] = useState('')
  const [receipt, setReceipt] = useState(null)
  const [saving, setSaving] = useState(false)
  const [payErr, setPayErr] = useState('')

  useEffect(() => {
    if (open) { setStep('bayar'); setMethod('Tunai'); setCash(''); setReceipt(null); setPayErr(''); setSaving(false) }
  }, [open])

  const cashNum = Number(cash) || 0
  const kembalian = method === 'Tunai' ? cashNum - total : 0
  const bisaBayar = method === 'Non-tunai' || cashNum >= total

  const selesaikan = async () => {
    setPayErr(''); setSaving(true)
    try {
      const res = await onConfirm({ items, metode: method, bayar: method === 'Tunai' ? cashNum : total, total })
      setReceipt({
        no: res.no, time: new Date().toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' }),
        items, total: res.total ?? total, method,
        cash: method === 'Tunai' ? cashNum : (res.total ?? total),
        kembalian: method === 'Tunai' ? (res.kembalian ?? kembalian) : 0,
      })
      setStep('struk'); onComplete?.()
    } catch (e) { setPayErr(e.message) } finally { setSaving(false) }
  }

  const title = step === 'struk' ? 'Transaksi berhasil' : 'Pembayaran'
  const footer = step === 'struk'
    ? <Button onClick={onClose}>Transaksi baru</Button>
    : <>
        <Button variant="outline" onClick={onClose} disabled={saving}>Batal</Button>
        <Button disabled={!bisaBayar || saving} onClick={selesaikan}>{saving ? 'Memproses…' : 'Selesaikan pembayaran'}</Button>
      </>

  return (
    <Modal open={open} onClose={onClose} title={title} footer={footer}>
      {step === 'bayar' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-xl bg-canvas px-4 py-3">
            <span className="text-[13px] text-muted">Total tagihan</span>
            <span className="text-[20px] font-bold tabular-nums">{rp(total)}</span>
          </div>
          <div>
            <span className="text-[12.5px] font-medium">Metode pembayaran</span>
            <div className="mt-1.5 flex gap-2">
              {['Tunai', 'Non-tunai'].map((m) => (
                <button key={m} onClick={() => setMethod(m)}
                  className={`flex-1 rounded-lg border py-2 text-[13px] font-medium transition
                    ${method === m ? 'border-primary bg-primary-soft text-primary-ink' : 'border-line'}`}>{m}</button>
              ))}
            </div>
          </div>
          {method === 'Tunai' && (
            <div>
              <span className="text-[12.5px] font-medium">Uang diterima</span>
              <div className="mt-1.5"><Input type="number" min="0" value={cash} onChange={(e) => setCash(e.target.value)} placeholder="0" /></div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button onClick={() => setCash(String(total))} className="rounded-md border border-line px-2.5 py-1 text-[12px]">Uang pas</button>
                {[20000, 50000, 100000].filter((v) => v >= total).map((v) => (
                  <button key={v} onClick={() => setCash(String(v))} className="rounded-md border border-line px-2.5 py-1 text-[12px]">{rp(v)}</button>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between text-[13px]">
                <span className="text-muted">Kembalian</span>
                <span className={`font-semibold tabular-nums ${kembalian < 0 ? 'text-danger' : 'text-ink'}`}>{rp(Math.max(0, kembalian))}</span>
              </div>
              {!bisaBayar && <p className="mt-1 text-[11.5px] text-danger">Uang diterima kurang dari total tagihan.</p>}
            </div>
          )}
          {payErr && <div className="rounded-lg bg-danger-soft text-danger px-3 py-2 text-[12.5px]">{payErr}</div>}
        </div>
      ) : (
        <div className="text-[13px]">
          <div className="text-center">
            <div className="w-11 h-11 rounded-full bg-ok-soft text-ok flex items-center justify-center mx-auto text-xl">✓</div>
            <div className="mt-2 font-mono text-[12.5px] text-muted">{receipt.no} · {receipt.time}</div>
          </div>
          <div className="my-4 border-t border-dashed border-line" />
          <ul className="space-y-1.5">
            {receipt.items.map((x) => (
              <li key={x.id} className="flex justify-between gap-3">
                <span>{x.nama} <span className="text-muted">× {x.qty}</span></span>
                <span className="tabular-nums">{rp(x.qty * x.harga)}</span>
              </li>
            ))}
          </ul>
          <div className="my-4 border-t border-dashed border-line" />
          <div className="space-y-1">
            <div className="flex justify-between font-bold text-[15px]"><span>Total</span><span className="tabular-nums">{rp(receipt.total)}</span></div>
            <div className="flex justify-between text-muted"><span>Bayar ({receipt.method})</span><span className="tabular-nums">{rp(receipt.cash)}</span></div>
            {receipt.method === 'Tunai' && <div className="flex justify-between text-muted"><span>Kembalian</span><span className="tabular-nums">{rp(receipt.kembalian)}</span></div>}
          </div>
          <p className="mt-4 text-center text-[11px] text-muted">Prototipe — struk belum benar-benar tercetak.</p>
        </div>
      )}
    </Modal>
  )
}