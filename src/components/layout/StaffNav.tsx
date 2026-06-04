'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/actions/auth'

const navItems = [
  { href: '/dashboard', label: 'ダッシュボード' },
  { href: '/visits', label: '来訪一覧' },
  { href: '/visits/new', label: '事前登録' },
]

export default function StaffNav() {
  const pathname = usePathname()

  return (
    <nav className="bg-[#007B8A] text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-6">
            <span className="font-bold text-lg tracking-tight">来訪者受付</span>
            <div className="hidden sm:flex items-center gap-1">
              {navItems.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                      ? 'bg-white/20 text-white'
                      : 'hover:bg-white/10 text-white/80'
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
          <form action={signOut}>
            <button
              type="submit"
              className="text-sm text-white/80 hover:text-white transition-colors px-3 py-1.5 rounded-md hover:bg-white/10"
            >
              ログアウト
            </button>
          </form>
        </div>
        {/* モバイルナビ */}
        <div className="sm:hidden flex gap-1 pb-2 overflow-x-auto">
          {navItems.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
                pathname === href || (href !== '/dashboard' && pathname.startsWith(href))
                  ? 'bg-white/20 text-white'
                  : 'hover:bg-white/10 text-white/80'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}
