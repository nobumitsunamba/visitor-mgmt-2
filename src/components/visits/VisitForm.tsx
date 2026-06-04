'use client'

import { useState } from 'react'
import { createVisit, updateVisit } from '@/actions/visits'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { Visit } from '@/lib/types'

interface VisitFormProps {
  initialData?: Visit
  staffName?: string
}

export default function VisitForm({ initialData, staffName = '' }: VisitFormProps) {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isEditing = !!initialData

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const form = e.currentTarget
    const data = {
      company_name: (form.elements.namedItem('company_name') as HTMLInputElement).value,
      representative_name: (form.elements.namedItem('representative_name') as HTMLInputElement).value,
      visitor_count: parseInt((form.elements.namedItem('visitor_count') as HTMLInputElement).value),
      staff_name: (form.elements.namedItem('staff_name') as HTMLInputElement).value,
      scheduled_date: (form.elements.namedItem('scheduled_date') as HTMLInputElement).value,
      notes: (form.elements.namedItem('notes') as HTMLTextAreaElement).value || undefined,
    }

    let result
    if (isEditing) {
      result = await updateVisit(initialData.id, data)
    } else {
      result = await createVisit(data)
    }

    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <Input
        id="company_name"
        name="company_name"
        label="会社名"
        required
        defaultValue={initialData?.company_name}
        placeholder="株式会社〇〇"
      />

      <Input
        id="representative_name"
        name="representative_name"
        label="代表来訪者名"
        required
        defaultValue={initialData?.representative_name}
        placeholder="山田 太郎"
      />

      <Input
        id="visitor_count"
        name="visitor_count"
        label="来訪者人数"
        type="number"
        min={1}
        required
        defaultValue={initialData?.visitor_count ?? 1}
      />

      <Input
        id="staff_name"
        name="staff_name"
        label="当社担当者名"
        required
        defaultValue={initialData?.staff_name ?? staffName}
        placeholder="鈴木 花子"
      />

      <Input
        id="scheduled_date"
        name="scheduled_date"
        label="来訪予定日"
        type="date"
        required
        defaultValue={initialData?.scheduled_date}
      />

      <div className="flex flex-col gap-1">
        <label htmlFor="notes" className="text-sm font-medium text-gray-700">備考</label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          defaultValue={initialData?.notes ?? ''}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#007B8A] focus:border-transparent resize-none"
          placeholder="任意の備考"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={loading} className="flex-1 sm:flex-none">
          {loading ? '送信中...' : isEditing ? '更新する' : '登録する'}
        </Button>
        <Button type="button" variant="secondary" onClick={() => history.back()}>
          キャンセル
        </Button>
      </div>
    </form>
  )
}
