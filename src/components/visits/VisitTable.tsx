import { Visit } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { formatDate, formatTime } from '@/lib/utils'

interface VisitTableProps {
  visits: Visit[]
}

export default function VisitTable({ visits }: VisitTableProps) {
  if (visits.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">来訪予定はありません</p>
      </div>
    )
  }

  return (
    <>
      {/* デスクトップ表 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="text-left px-4 py-3 font-medium text-gray-600">来訪日</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">会社名</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">代表者</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">人数</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">担当者</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">入室</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">退室</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600">状態</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {visits.map((visit) => (
              <tr key={visit.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 whitespace-nowrap">{formatDate(visit.scheduled_date)}</td>
                <td className="px-4 py-3 font-medium">{visit.company_name}</td>
                <td className="px-4 py-3">{visit.representative_name}</td>
                <td className="px-4 py-3 text-center">{visit.visitor_count}名</td>
                <td className="px-4 py-3">{visit.staff_name}</td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {visit.entry_time ? formatTime(visit.entry_time) : '—'}
                </td>
                <td className="px-4 py-3 text-center text-gray-600">
                  {visit.exit_time ? formatTime(visit.exit_time) : '—'}
                </td>
                <td className="px-4 py-3 text-center">
                  <Badge status={visit.status} />
                </td>
                <td className="px-4 py-3">
                  <Link href={`/visits/${visit.id}`} className="text-[#007B8A] hover:underline text-xs">
                    詳細
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* モバイルカード */}
      <div className="md:hidden space-y-3">
        {visits.map((visit) => (
          <Link key={visit.id} href={`/visits/${visit.id}`} className="block bg-white border border-gray-200 rounded-lg p-4 hover:border-[#007B8A] transition-colors">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-gray-900">{visit.company_name}</p>
                <p className="text-sm text-gray-600">{visit.representative_name} ほか{visit.visitor_count}名</p>
              </div>
              <Badge status={visit.status} />
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
              <span>{formatDate(visit.scheduled_date)}</span>
              <span>担当: {visit.staff_name}</span>
            </div>
            {(visit.entry_time || visit.exit_time) && (
              <div className="mt-1 flex gap-4 text-xs text-gray-500">
                {visit.entry_time && <span>入室: {formatTime(visit.entry_time)}</span>}
                {visit.exit_time && <span>退室: {formatTime(visit.exit_time)}</span>}
              </div>
            )}
          </Link>
        ))}
      </div>
    </>
  )
}
