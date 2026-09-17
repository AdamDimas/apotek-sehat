export default function Select({ options = [], className = '', ...props }) {
  return (
    <select
      className={`rounded-lg border border-line bg-surface px-3 py-2 text-[13px] ${className}`}
      {...props}
    >
      {options.map((o) =>
        typeof o === 'string'
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
      )}
    </select>
  )
}