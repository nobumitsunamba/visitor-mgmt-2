'use client'

import { useState, useEffect } from 'react'

export default function KioskClock() {
  const [time, setTime] = useState('')
  const [date, setDate] = useState('')

  useEffect(() => {
    function update() {
      const now = new Date()
      setTime(now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }))
      setDate(now.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' }))
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="text-right">
      <p className="text-3xl font-bold tabular-nums">{time}</p>
      <p className="text-white/80 text-sm">{date}</p>
    </div>
  )
}
