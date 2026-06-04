'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

interface CheckInButtonProps {
  visitId: string
  action: 'entry' | 'exit'
  label: string
}

export default function CheckInButton({ visitId, action, label }: CheckInButtonProps) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const router = useRouter()

  async function handleClick() {
    setLoading(true)
    try {
      const res = await fetch(`/api/visits/${visitId}/checkin`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      if (res.ok) {
        setDone(true)
        setTimeout(() => {
          router.refresh()
          setDone(false)
          setLoading(false)
        }, 1500)
      } else {
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }

  return (
    <Button
      variant={action === 'entry' ? 'primary' : 'secondary'}
      size="xl"
      onClick={handleClick}
      disabled={loading}
      className={`w-full ${done ? '!bg-green-600 !border-green-600' : ''}`}
    >
      {done ? '✓ 記録しました' : loading ? '処理中...' : label}
    </Button>
  )
}
