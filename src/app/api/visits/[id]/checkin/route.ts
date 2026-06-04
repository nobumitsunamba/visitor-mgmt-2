import { createAdminClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const body = await request.json()
  const { action } = body

  if (action !== 'entry' && action !== 'exit') {
    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  }

  const supabase = await createAdminClient()

  // 現在のvisitを取得
  const { data: visit, error: fetchError } = await supabase
    .from('visits')
    .select('id, status, entry_time, exit_time')
    .eq('id', id)
    .single()

  if (fetchError || !visit) {
    return NextResponse.json({ error: 'Visit not found' }, { status: 404 })
  }

  let updates: Record<string, unknown> = {}

  if (action === 'entry') {
    if (visit.status !== 'scheduled') {
      return NextResponse.json({ error: 'Already checked in' }, { status: 400 })
    }
    updates = { entry_time: new Date().toISOString(), status: 'checked_in' }
  } else {
    if (visit.status !== 'checked_in') {
      return NextResponse.json({ error: 'Not checked in yet' }, { status: 400 })
    }
    updates = { exit_time: new Date().toISOString(), status: 'completed' }
  }

  const { data, error } = await supabase
    .from('visits')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }

  return NextResponse.json(data)
}
