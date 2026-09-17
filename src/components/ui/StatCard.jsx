const TONE = { primary: 'text-primary-ink', ok: 'text-ok', warn: 'text-warn', danger: 'text-danger' }

export default function StatCard({ label, value, hint, tone }) {
  return (
    <div className="bg-surface border border-line rounded-xl p-4">
      <div className="text-[12.5px] text-muted">{label}</div>
      <div className={`text-[26px] font-bold mt-1 tabular-nums ${TONE[tone] ?? ''}`}>{value}</div>
      {hint && <div className="text-[12px] text-muted mt-0.5">{hint}</div>}
    </div>
  )
}