import { VisitStatus } from '@/lib/types'

const statusConfig: Record<VisitStatus, { label: string; className: string }> = {
  scheduled: { label: '予定', className: 'bg-gray-100 text-gray-700' },
  checked_in: { label: '入室中', className: 'bg-[#007B8A] text-white' },
  completed: { label: '完了', className: 'bg-green-100 text-green-800' },
  cancelled: { label: 'キャンセル', className: 'bg-red-100 text-red-700' },
}

export default function Badge({ status }: { status: VisitStatus }) {
  const { label, className } = statusConfig[status]
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  )
}
