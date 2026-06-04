'use server'

import { createClient } from '@/lib/supabase/server'
import { VisitFormValues } from '@/lib/types'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createVisit(values: VisitFormValues) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return { error: '認証が必要です。' }

  const { error } = await supabase.from('visits').insert({
    ...values,
    staff_user_id: user.id,
    status: 'scheduled',
  })

  if (error) return { error: '登録に失敗しました。' }

  revalidatePath('/visits')
  revalidatePath('/dashboard')
  redirect('/visits')
}

export async function updateVisit(id: string, values: Partial<VisitFormValues>) {
  const supabase = await createClient()
  const { error } = await supabase.from('visits').update(values).eq('id', id)
  if (error) return { error: '更新に失敗しました。' }
  revalidatePath('/visits')
  revalidatePath(`/visits/${id}`)
  revalidatePath('/dashboard')
  redirect(`/visits/${id}`)
}

export async function cancelVisit(id: string) {
  const supabase = await createClient()
  await supabase.from('visits').update({ status: 'cancelled' }).eq('id', id)
  revalidatePath('/visits')
  revalidatePath('/dashboard')
  redirect('/visits')
}
