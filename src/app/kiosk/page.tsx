import { createAdminClient } from '@/lib/supabase/server'
import { Visit } from '@/lib/types'
import { formatTime, todayString } from '@/lib/utils'
import CheckInButton from '@/components/kiosk/CheckInButton'
import KioskClock from '@/components/kiosk/KioskClock'

export const dynamic = 'force-dynamic'

export default async function KioskPage() {
  const supabase = await createAdminClient()
  const today = todayString()

  const { data } = await supabase
    .from('visits')
    .select('*')
    .eq('scheduled_date', today)
    .in('status', ['scheduled', 'checked_in'])
    .order('created_at', { ascending: true })

  const visits = (data ?? []) as Visit[]

  return (
    <div className="flex flex-col min-h-screen">
      {/* ヘッダー */}
      <header className="bg-[#007B8A] text-white px-6 py-4 flex items-center justify-between shadow-md">
        <div>
          <h1 className="text-2xl font-bold">来訪者受付</h1>
          <p className="text-white/80 text-sm mt-0.5">本日の来訪予定</p>
        </div>
        <KioskClock />
      </header>

      {/* メインコンテンツ */}
      <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
        {visits.length === 0 ? (
          <div className="text-center py-24 text-gray-500">
            <div className="text-6xl mb-4">📋</div>
            <p className="text-xl font-medium">本日の来訪予定はありません</p>
          </div>
        ) : (
          <div className="space-y-4">
            {visits.map((visit) => (
              <KioskCard key={visit.id} visit={visit} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function KioskCard({ visit }: { visit: Visit }) {
  const canEntry = visit.status === 'scheduled'
  const canExit = visit.status === 'checked_in'

  return (
    <div className={`bg-white rounded-2xl border-2 p-5 shadow-sm ${visit.status === 'checked_in' ? 'border-[#007B8A]' : 'border-gray-200'}`}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900 truncate">{visit.company_name}</h2>
          <p className="text-gray-600 mt-0.5">{visit.representative_name} ほか{visit.visitor_count}名</p>
          <p className="text-sm text-gray-400 mt-1">担当: {visit.staff_name}</p>
        </div>
        {visit.status === 'checked_in' && (
          <span className="shrink-0 bg-[#007B8A] text-white text-sm font-medium px-3 py-1 rounded-full">
            入室中
          </span>
        )}
      </div>

      {(visit.entry_time || visit.exit_time) && (
        <div className="flex gap-6 text-sm text-gray-500 mb-4">
          {visit.entry_time && <span>入室: {formatTime(visit.entry_time)}</span>}
          {visit.exit_time && <span>退室: {formatTime(visit.exit_time)}</span>}
        </div>
      )}

      <div className="flex gap-3">
        {canEntry && (
          <CheckInButton visitId={visit.id} action="entry" label="入室を記録" />
        )}
        {canExit && (
          <CheckInButton visitId={visit.id} action="exit" label="退室を記録" />
        )}
      </div>
    </div>
  )
}
