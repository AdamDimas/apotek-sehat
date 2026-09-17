export function Card({ className = '', children }) {
  return <div className={`bg-surface border border-line rounded-xl ${className}`}>{children}</div>
}

export function CardHeader({ title, right }) {
  return (
    <div className="px-5 py-3.5 border-b border-line flex items-center justify-between">
      <h2 className="font-semibold">{title}</h2>
      {right}
    </div>
  )
}