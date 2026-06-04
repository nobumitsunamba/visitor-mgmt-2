import { createClient } from '@/lib/supabase/server'
import { Visit } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import VisitForm from '@/components/visits/VisitForm'
import { cancelVisit } from '@/actions/visits'
import { formatDate, formatTime } from '@/lib/utils'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export default async function VisitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('visits').select('*').eq('id', id).single()

  if (!data) notFound()
  const visit = data as Visit

  const isEditable = visit.status === 'scheduled'

  return (
    <div className="max-w-lg space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/visits" className="text-sm text-gray-500 hover:text-gray-700">← 一覧へ</Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900">{visit.company_name}</h1>
          <Badge status={visit.status} />
        </div>

        <dl className="space-y-3 text-sm">
          <Row label="代表来訪者" value={visit.representative_name} />
          <Row label="来訪者人数" value={`${visit.visitor_count}名`} />
          <Row label="当社担当者" value={visit.staff_name} />
          <Row label="来訪予定日" value={formatDate(visit.scheduled_date)} />
          {visit.entry_time && <Row label="入室時間" value={formatTime(visit.entry_time)} />}
          {visit.exit_time && <Row label="退室時間" value={formatTime(visit.exit_time)} />}
          {visit.notes && <Row label="備考" value={visit.notes} />}
        </dl>
      </div>

      {isEditable && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h2 className="text-base font-semibold text-gray-800 mb-4">登録内容を編集</h2>
          <VisitForm initialData={visit} />
        </div>
      )}

      {isEditable && (
        <form action={async () => { 'use server'; await cancelVisit(visit.id) }}>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-red-300 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors"
          >
            この来訪をキャンセルする
          </button>
        </form>
      )}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-4">
      <dt className="w-28 text-gray-500 shrink-0">{label}</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
  )
}
