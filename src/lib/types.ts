export type VisitStatus = 'scheduled' | 'checked_in' | 'completed' | 'cancelled'

export interface Visit {
  id: string
  company_name: string
  representative_name: string
  visitor_count: number
  staff_name: string
  staff_user_id: string | null
  scheduled_date: string
  entry_time: string | null
  exit_time: string | null
  notes: string | null
  status: VisitStatus
  created_at: string
  updated_at: string
}

export interface VisitFormValues {
  company_name: string
  representative_name: string
  visitor_count: number
  staff_name: string
  scheduled_date: string
  notes?: string
}
