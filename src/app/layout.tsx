import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '来訪者受付システム',
  description: 'コベルコ建機 来訪者受付管理システム',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" className="h-full">
      <body className="min-h-full flex flex-col antialiased">{children}</body>
    </html>
  )
}
