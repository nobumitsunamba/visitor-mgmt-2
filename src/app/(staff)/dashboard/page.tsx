import { createClient } from '@/lib/supabase/server'
import { Visit } from '@/lib/types'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import { formatDate, formatTime, todayString } from '@/lib/utils'

export default async function DashboardPage() {
  const supabase = await createClient()
  const today = todayString()

  const { data: todayVisits } = await supabase
    .from('visits')
    .select('*')
    .eq('scheduled_date', today)
    .neq('status', 'cancelled')
    .order('created_at', { ascending: true })

  const { data: upcomingVisits } = await supabase
    .from('visits')
    .select('*')
    .gt('scheduled_date', today)
    .eq('status', 'scheduled')
    .order('scheduled_date', { ascending: true })
    .limit(5)

  const { count: totalCount } = await supabase
    .from('visits')
    .select('*', { count: 'exact', head: true })
    .neq('status', 'cancelled')

  const visits = (todayVisits ?? []) as Visit[]
  const upcoming = (upcomingVisits ?? []) as Visit[]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
        <p className="text-gray-500 text-sm mt-1">{formatDate(today)}</p>
      </div>

      {/* サマリーカード */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="本日の来訪" value={visits.length} unit="件" />
        <StatCard label="入室中" value={visits.filter(v => v.status === 'checked_in').length} unit="件" highlight />
        <StatCard label="完了" value={visits.filter(v => v.status === 'completed').length} unit="件" />
        <StatCard label="累計来訪" value={totalCount ?? 0} unit="件" />
      </div>

      {/* 本日の来訪 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-gray-800">本日の来訪</h2>
          <Link href="/visits/new" className="text-sm text-[#007B8A] hover:underline">
            + 新規登録
          </Link>
        </div>
        {visits.length === 0 ? (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center text-gray-500">
            本日の来訪予定はありません
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {visits.map((visit, i) => (
              <Link
                key={visit.id}
                href={`/visits/${visit.id}`}
                className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${i > 0 ? 'border-t border-gray-100' : ''}`}
              >
                <div>
                  <p className="font-medium text-gray-900">{visit.company_name}</p>
                  <p className="text-sm text-gray-500">{visit.representative_name} ほか{visit.visitor_count}名 / 担当: {visit.staff_name}</p>
                  {visit.entry_time && (
                    <p className="text-xs text-gray-400 mt-0.5">
                      入室: {formatTime(visit.entry_time)}
                      {visit.exit_time && ` → 退室: ${formatTime(visit.exit_time)}`}
                    </p>
                  )}
                </div>
                <Badge status={visit.status} />
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 今後の来訪 */}
      {upcoming.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">今後の来訪予定</h2>
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            {upcoming.map((visit, i) => (
              <Link
                key={visit.id}
                href={`/visits/${visit.id}`}
                className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${i > 0 ? 'border-t border-gray-100' : ''}`}
              >
                <div>
                  <p className="font-medium text-gray-900">{visit.company_name}</p>
                  <p className="text-sm text-gray-500">{formatDate(visit.scheduled_date)} / {visit.representative_name}</p>
                </div>
                <Badge status={visit.status} />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

function StatCard({ label, value, unit, highlight }: { label: string; value: number; unit: string; highlight?: boolean }) {
  return (
    <div className={`rounded-xl p-4 border ${highlight ? 'bg-[#007B8A] border-[#007B8A] text-white' : 'bg-white border-gray-200'}`}>
      <p className={`text-sm ${highlight ? 'text-white/80' : 'text-gray-500'}`}>{label}</p>
      <p className={`text-3xl font-bold mt-1 ${highlight ? 'text-white' : 'text-gray-900'}`}>
        {value}<span className={`text-base font-normal ml-1 ${highlight ? 'text-white/80' : 'text-gray-500'}`}>{unit}</span>
      </p>
    </div>
  )
}
