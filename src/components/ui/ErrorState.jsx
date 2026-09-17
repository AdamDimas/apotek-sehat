import Button from './Button'
export default function ErrorState({ message, onRetry }) {
  return (
    <div className="py-14 text-center">
      <div className="text-[14px] font-semibold text-danger">Gagal memuat data</div>
      <p className="mt-1 text-[13px] text-muted">{message}</p>
      {onRetry && <div className="mt-4 flex justify-center"><Button variant="outline" onClick={onRetry}>Coba lagi</Button></div>}
    </div>
  )
}