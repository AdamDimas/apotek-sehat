const TONES = {
  ok:      'bg-ok-soft text-ok',
  warn:    'bg-warn-soft text-warn',
  danger:  'bg-danger-soft text-danger',
  info:    'bg-brandblue-soft text-brandblue',
  primary: 'bg-primary-soft text-primary-ink',
  neutral: 'bg-canvas text-muted',
}
export default function Badge({ tone = 'neutral', dot = false, className = '', children }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[12px] font-semibold
      ${TONES[tone]} ${className}`}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  )
}