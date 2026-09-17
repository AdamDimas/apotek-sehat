const VARIANTS = {
  primary: 'bg-primary text-white hover:brightness-95',
  outline: 'border border-line bg-surface text-ink hover:bg-canvas',
  ghost:   'text-ink hover:bg-canvas',
  danger:  'bg-danger text-white hover:brightness-95',
}
const SIZES = { sm: 'px-3 py-1.5 text-[13px]', md: 'px-4 py-2 text-[13px]' }

export default function Button({ variant = 'primary', size = 'md', className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition
        disabled:opacity-50 disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  )
}