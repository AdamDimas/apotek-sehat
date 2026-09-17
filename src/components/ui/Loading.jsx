export default function Loading({ label = 'Memuat…' }) {
  return (
    <div className="py-16 flex flex-col items-center justify-center gap-3 text-muted">
      <span className="w-6 h-6 rounded-full border-2 border-line border-t-primary animate-spin" />
      <span className="text-[13px]">{label}</span>
    </div>
  )
}