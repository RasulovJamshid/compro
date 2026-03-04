'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  BarChart3, 
  Settings, 
  FileText,
  MessageSquare,
  CreditCard,
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/lib/store/authStore'

const menuItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Обзор', roles: ['admin', 'moderator'] },
  { href: '/dashboard/properties', icon: Building2, label: 'Объекты', roles: ['admin', 'moderator'] },
  { href: '/dashboard/users', icon: Users, label: 'Пользователи', roles: ['admin'] },
  { href: '/dashboard/analytics', icon: BarChart3, label: 'Аналитика', roles: ['admin', 'moderator'] },
  { href: '/dashboard/payments', icon: CreditCard, label: 'Платежи', roles: ['admin'] },
  { href: '/dashboard/reviews', icon: MessageSquare, label: 'Отзывы', roles: ['admin', 'moderator'] },
  { href: '/dashboard/reports', icon: FileText, label: 'Отчеты', roles: ['admin'] },
  { href: '/dashboard/settings', icon: Settings, label: 'Настройки', roles: ['admin'] },
]

export default function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuthStore()
  const desktopCollapsed = collapsed

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'guest')
  )

  return (
    <aside className={`bg-white border-b lg:border-b-0 lg:border-r border-secondary-200 flex flex-col transition-all duration-300 w-full ${desktopCollapsed ? 'lg:w-20' : 'lg:w-64'}`}>
      {/* Logo */}
      <div className="p-3 lg:p-4 border-b border-secondary-200 flex items-center justify-between">
        {!desktopCollapsed && (
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-bold text-secondary-900">Dashboard</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:inline-flex p-2 hover:bg-secondary-50 rounded-lg text-secondary-500 transition-colors"
        >
          {desktopCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* User Info */}
      <div className="hidden lg:block p-4 border-b border-secondary-200">
        <div className={`flex items-center gap-3 ${desktopCollapsed ? 'justify-center' : ''}`}>
          <div className="bg-primary-100 text-primary-600 rounded-full p-2">
            <Users className="w-5 h-5" />
          </div>
          {!desktopCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">{user?.phone}</p>
              <p className="text-xs text-secondary-500 capitalize">{user?.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 lg:p-4 overflow-x-auto lg:overflow-y-auto">
        <div className="flex lg:flex-col items-center lg:items-stretch gap-2 lg:gap-1 min-w-max lg:min-w-0">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2 lg:gap-3 px-3 py-2 lg:py-2.5 rounded-lg transition-all whitespace-nowrap ${
                isActive
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
              } ${desktopCollapsed ? 'lg:justify-center' : ''}`}
              title={desktopCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className={`text-sm ${desktopCollapsed ? 'lg:hidden' : ''}`}>{item.label}</span>
            </Link>
          )
        })}
        </div>
      </nav>

      {/* Footer Actions */}
      <div className="hidden lg:block p-4 border-t border-secondary-200 space-y-1">
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 transition-all ${desktopCollapsed ? 'justify-center' : ''}`}
          title={desktopCollapsed ? 'На главную' : undefined}
        >
          <Building2 className="w-5 h-5 flex-shrink-0" />
          {!desktopCollapsed && <span className="text-sm">На главную</span>}
        </Link>
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all ${desktopCollapsed ? 'justify-center' : ''}`}
          title={desktopCollapsed ? 'Выйти' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!desktopCollapsed && <span className="text-sm">Выйти</span>}
        </button>
      </div>
    </aside>
  )
}
