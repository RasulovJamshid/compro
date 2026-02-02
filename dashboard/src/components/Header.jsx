import { useState, useEffect, useRef } from 'react'
import { 
  Search, Bell, User, LogOut, Settings, ChevronDown, 
  Menu, X, MessageSquare, Shield, HelpCircle
} from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function Header({ onMenuClick }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showNotifications, setShowNotifications] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [user, setUser] = useState(null)
  
  const notificationRef = useRef(null)
  const userMenuRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Load user from localStorage
    const userData = localStorage.getItem('dashboard_user')
    if (userData) {
      setUser(JSON.parse(userData))
    }

    // Mock notifications - replace with real API
    setNotifications([
      {
        id: 1,
        type: 'property',
        title: 'Новый объект на модерации',
        message: 'Офис в центре Ташкента',
        time: '5 минут назад',
        read: false
      },
      {
        id: 2,
        type: 'user',
        title: 'Новый пользователь',
        message: 'Зарегистрирован новый пользователь',
        time: '1 час назад',
        read: false
      },
      {
        id: 3,
        type: 'review',
        title: 'Новый отзыв',
        message: 'Отзыв требует модерации',
        time: '2 часа назад',
        read: true
      }
    ])

    // Close dropdowns on outside click
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false)
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/properties?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('dashboard_token')
    localStorage.removeItem('dashboard_user')
    navigate('/login')
  }

  const markAsRead = (notificationId) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <header className="bg-white border-b border-secondary-200 sticky top-0 z-40">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left Section - Menu & Search */}
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-secondary-100 rounded-lg transition-colors"
          >
            <Menu className="w-5 h-5 text-secondary-600" />
          </button>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск объектов, пользователей..."
                className="w-full pl-10 pr-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300 bg-secondary-50"
              />
            </div>
          </form>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center gap-3">
          {/* Help Button */}
          <button className="hidden sm:flex p-2 hover:bg-secondary-100 rounded-lg transition-colors">
            <HelpCircle className="w-5 h-5 text-secondary-600" />
          </button>

          {/* Notifications */}
          <div ref={notificationRef} className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <Bell className="w-5 h-5 text-secondary-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-secondary-200 overflow-hidden">
                <div className="p-4 border-b border-secondary-200">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-secondary-900">Уведомления</h3>
                    {unreadCount > 0 && (
                      <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
                        {unreadCount} новых
                      </span>
                    )}
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-8 text-center text-secondary-500">
                      <Bell className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p>Нет уведомлений</p>
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-4 border-b border-secondary-100 hover:bg-secondary-50 cursor-pointer transition-colors ${
                          !notification.read ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className={`p-2 rounded-lg ${
                            notification.type === 'property' ? 'bg-yellow-100' :
                            notification.type === 'user' ? 'bg-blue-100' :
                            'bg-purple-100'
                          }`}>
                            {notification.type === 'property' ? (
                              <Shield className="w-4 h-4 text-yellow-600" />
                            ) : notification.type === 'user' ? (
                              <User className="w-4 h-4 text-blue-600" />
                            ) : (
                              <MessageSquare className="w-4 h-4 text-purple-600" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-secondary-900 mb-1">
                              {notification.title}
                            </p>
                            <p className="text-xs text-secondary-600 mb-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-secondary-400">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                <div className="p-3 border-t border-secondary-200 text-center">
                  <Link
                    to="/notifications"
                    className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Посмотреть все
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Menu */}
          <div ref={userMenuRef} className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-2 hover:bg-secondary-100 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary-600" />
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-secondary-900">
                  {user?.firstName || 'Admin'}
                </p>
                <p className="text-xs text-secondary-500">
                  {user?.role === 'admin' ? 'Администратор' : 'Модератор'}
                </p>
              </div>
              <ChevronDown className="w-4 h-4 text-secondary-600" />
            </button>

            {/* User Dropdown */}
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-secondary-200 overflow-hidden">
                <div className="p-4 border-b border-secondary-200">
                  <p className="font-medium text-secondary-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-sm text-secondary-500">{user?.phone}</p>
                </div>
                <div className="p-2">
                  <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-secondary-50 rounded-lg transition-colors"
                  >
                    <User className="w-4 h-4 text-secondary-600" />
                    <span className="text-sm text-secondary-700">Профиль</span>
                  </Link>
                  <Link
                    to="/settings"
                    className="flex items-center gap-3 px-3 py-2 hover:bg-secondary-50 rounded-lg transition-colors"
                  >
                    <Settings className="w-4 h-4 text-secondary-600" />
                    <span className="text-sm text-secondary-700">Настройки</span>
                  </Link>
                </div>
                <div className="p-2 border-t border-secondary-200">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-3 py-2 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span className="text-sm text-red-600">Выйти</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search */}
      <div className="md:hidden px-6 pb-4">
        <form onSubmit={handleSearch}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск..."
              className="w-full pl-10 pr-4 py-2.5 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 bg-secondary-50"
            />
          </div>
        </form>
      </div>
    </header>
  )
}
