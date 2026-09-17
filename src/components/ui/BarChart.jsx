export default function BarChart({ data, height = 150 }) {
  const max = Math.max(1, ...data.map((d) => d.value))
  const labelH = 18                 // ruang untuk label tanggal di bawah
  const plotH = height - labelH     // tinggi area batang saja

  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center justify-end min-w-0" style={{ height }}>
          <div
            className="w-full rounded-t bg-primary/80 hover:bg-primary transition-colors"
            style={{ height: Math.max(2, (d.value / max) * plotH) }}
            title={d.hint}
          />
          <span className="mt-1.5 text-[10px] text-muted truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  )
}