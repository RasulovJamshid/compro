import { Link, useLocation } from 'react-router-dom'
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
  ChevronRight,
  ExternalLink
} from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'

const menuItems = [
  { href: '/', icon: LayoutDashboard, label: 'Обзор', roles: ['admin', 'moderator'] },
  { href: '/properties', icon: Building2, label: 'Объекты', roles: ['admin', 'moderator'] },
  { href: '/users', icon: Users, label: 'Пользователи', roles: ['admin'] },
  { href: '/analytics', icon: BarChart3, label: 'Аналитика', roles: ['admin', 'moderator'] },
  { href: '/payments', icon: CreditCard, label: 'Платежи', roles: ['admin'] },
  { href: '/reviews', icon: MessageSquare, label: 'Отзывы', roles: ['admin', 'moderator'] },
  { href: '/reports', icon: FileText, label: 'Отчеты', roles: ['admin'] },
  { href: '/settings', icon: Settings, label: 'Настройки', roles: ['admin'] },
]

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const { user, logout } = useAuth()

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || 'guest')
  )

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        ></div>
      )}
      
      {/* Sidebar */}
      <aside className={`
        bg-white border-r border-secondary-200 flex flex-col transition-all duration-300
        fixed lg:static inset-y-0 left-0 z-50
        ${collapsed ? 'w-20' : 'w-64'}
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
      {/* Logo */}
      <div className="p-4 border-b border-secondary-200 flex items-center justify-between">
        {!collapsed && (
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-primary-600 p-2 rounded-lg text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="font-bold text-secondary-900">Dashboard</span>
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-secondary-50 rounded-lg text-secondary-500 transition-colors"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-secondary-200">
        <div className={`flex items-center gap-3 ${collapsed ? 'justify-center' : ''}`}>
          <div className="bg-primary-100 text-primary-600 rounded-full p-2">
            <Users className="w-5 h-5" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-secondary-900 truncate">{user?.phone}</p>
              <p className="text-xs text-secondary-500 capitalize">{user?.role}</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredMenuItems.map((item) => {
          const Icon = item.icon
          const isActive = location.pathname === item.href
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary-50 text-primary-600 font-medium'
                  : 'text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900'
              } ${collapsed ? 'justify-center' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t border-secondary-200 space-y-1">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-secondary-600 hover:bg-secondary-50 hover:text-secondary-900 transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'На главную' : undefined}
        >
          <ExternalLink className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm">На главную</span>}
        </a>
        <button
          onClick={logout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Выйти' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm">Выйти</span>}
        </button>
      </div>
    </aside>
    </>
  )
}
