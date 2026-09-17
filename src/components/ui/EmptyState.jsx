export default function EmptyState({ title = 'Tidak ada data', note, action }) {
  return (
    <div className="py-12 text-center">
      <div className="text-[14px] font-semibold">{title}</div>
      {note && <p className="mt-1 text-[13px] text-muted">{note}</p>}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  )
}