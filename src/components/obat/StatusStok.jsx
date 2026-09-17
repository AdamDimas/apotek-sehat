import Badge from '@/components/ui/Badge'
import { stokStatus } from '@/lib/format'

const LABEL = { aman: 'Aman', menipis: 'Menipis', habis: 'Habis' }
const TONE  = { aman: 'ok', menipis: 'warn', habis: 'danger' }

export default function StatusStok({ obat }) {
  const s = stokStatus(obat)
  return <Badge tone={TONE[s]}>{LABEL[s]}</Badge>
}