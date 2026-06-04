import { createClient } from '@/lib/supabase/server'
import { Visit } from '@/lib/types'
import VisitTable from '@/components/visits/VisitTable'
import Link from 'next/link'

interface SearchParams {
  status?: string
  date?: string
  company?: string
  staff?: string
}

export default async function VisitsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const supabase = await createClient()

  let query = supabase.from('visits').select('*').order('scheduled_date', { ascending: false })

  if (params.status && params.status !== 'all') {
    query = query.eq('status', params.status)
  }
  if (params.date) {
    query = query.eq('scheduled_date', params.date)
  }
  if (params.company) {
    query = query.ilike('company_name', `%${params.company}%`)
  }
  if (params.staff) {
    query = query.ilike('staff_name', `%${params.staff}%`)
  }

  const { data } = await query
  const visits = (data ?? []) as Visit[]

  const hasFilter = params.status || params.date || params.company || params.staff

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">来訪一覧</h1>
        <Link
          href="/visits/new"
          className="inline-flex items-center gap-1 bg-[#007B8A] hover:bg-[#006a77] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          + 新規登録
        </Link>
      </div>

      {/* フィルター */}
      <form className="flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">会社名</label>
          <input
            type="text"
            name="company"
            defaultValue={params.company ?? ''}
            placeholder="部分一致"
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007B8A] w-32"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">担当者名</label>
          <input
            type="text"
            name="staff"
            defaultValue={params.staff ?? ''}
            placeholder="部分一致"
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007B8A] w-32"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">ステータス</label>
          <select
            name="status"
            defaultValue={params.status ?? 'all'}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007B8A]"
          >
            <option value="all">すべて</option>
            <option value="scheduled">予定</option>
            <option value="checked_in">入室中</option>
            <option value="completed">完了</option>
            <option value="cancelled">キャンセル</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">日付</label>
          <input
            type="date"
            name="date"
            defaultValue={params.date ?? ''}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#007B8A]"
          />
        </div>
        <button
          type="submit"
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm transition-colors"
        >
          絞り込み
        </button>
        {hasFilter && (
          <Link
            href="/visits"
            className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            クリア
          </Link>
        )}
      </form>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <VisitTable visits={visits} />
      </div>
    </div>
  )
}
