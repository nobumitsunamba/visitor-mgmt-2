import { createClient } from '@/lib/supabase/server'
import VisitForm from '@/components/visits/VisitForm'

export default async function NewVisitPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  // メタデータからフルネームを取得（なければメールのローカルパート）
  const staffName = user?.user_metadata?.full_name ?? user?.email?.split('@')[0] ?? ''

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">来訪者 事前登録</h1>
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <VisitForm staffName={staffName} />
      </div>
    </div>
  )
}
