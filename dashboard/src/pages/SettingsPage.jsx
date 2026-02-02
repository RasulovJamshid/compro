import { useState, useEffect } from 'react'
import { 
  Settings, Save, Bell, Lock, Globe, Mail, Smartphone,
  Shield, Database, Palette, Users, Home, DollarSign,
  CheckCircle, XCircle, AlertCircle, Eye, EyeOff, Key
} from 'lucide-react'
import { adminApi } from '../lib/api'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general')
  const [notification, setNotification] = useState(null)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  
  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'Commercial Real Estate',
    siteDescription: 'Платформа коммерческой недвижимости',
    contactEmail: 'info@realestate.uz',
    contactPhone: '+998901234567',
    address: 'Ташкент, Узбекистан',
    timezone: 'Asia/Tashkent',
    language: 'ru',
    currency: 'UZS'
  })

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    newPropertyAlert: true,
    newUserAlert: true,
    newReviewAlert: true,
    paymentAlert: true,
    systemUpdates: true,
    weeklyReport: true
  })

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    maxLoginAttempts: 5,
    requireStrongPassword: true,
    allowMultipleSessions: false
  })

  // Property Settings
  const [propertySettings, setPropertySettings] = useState({
    autoApprove: false,
    moderationRequired: true,
    allowGuestPosting: false,
    maxImagesPerProperty: 20,
    maxVideosPerProperty: 5,
    watermarkImages: true,
    defaultPropertyStatus: 'pending'
  })

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    paymeEnabled: true,
    clickEnabled: true,
    uzumEnabled: false,
    cardPaymentEnabled: true,
    commissionRate: 5,
    minPaymentAmount: 10000,
    currency: 'UZS'
  })

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    setLoading(true)
    try {
      const response = await adminApi.getSettings()
      const settings = response.data
      
      // Parse settings by category
      settings.forEach(setting => {
        const value = setting.value
        
        switch(setting.category) {
          case 'general':
            setGeneralSettings(prev => ({ ...prev, [setting.key.replace('general_', '')]: value }))
            break
          case 'notifications':
            setNotificationSettings(prev => ({ ...prev, [setting.key.replace('notification_', '')]: value }))
            break
          case 'security':
            setSecuritySettings(prev => ({ ...prev, [setting.key.replace('security_', '')]: value }))
            break
          case 'properties':
            setPropertySettings(prev => ({ ...prev, [setting.key.replace('property_', '')]: value }))
            break
          case 'payments':
            setPaymentSettings(prev => ({ ...prev, [setting.key.replace('payment_', '')]: value }))
            break
        }
      })
    } catch (error) {
      console.error('Error loading settings:', error)
      // Use default values if loading fails
    } finally {
      setLoading(false)
    }
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 3000)
  }

  const handleSaveSettings = async (settingsType) => {
    setSaving(true)
    try {
      const user = JSON.parse(localStorage.getItem('dashboard_user') || '{}')
      let settingsToSave = []
      let settingsData
      let prefix
      
      switch(settingsType) {
        case 'general':
          settingsData = generalSettings
          prefix = 'general_'
          break
        case 'notifications':
          settingsData = notificationSettings
          prefix = 'notification_'
          break
        case 'security':
          settingsData = securitySettings
          prefix = 'security_'
          break
        case 'properties':
          settingsData = propertySettings
          prefix = 'property_'
          break
        case 'payments':
          settingsData = paymentSettings
          prefix = 'payment_'
          break
      }
      
      // Convert settings object to array format
      Object.keys(settingsData).forEach(key => {
        settingsToSave.push({
          key: prefix + key,
          value: settingsData[key]
        })
      })
      
      await adminApi.updateSettings(settingsToSave, user.id || 'admin')
      showNotification(`Настройки ${getSettingsLabel(settingsType)} успешно сохранены`)
    } catch (error) {
      console.error('Error saving settings:', error)
      showNotification('Ошибка при сохранении настроек', 'error')
    } finally {
      setSaving(false)
    }
  }
  
  const getSettingsLabel = (type) => {
    const labels = {
      general: 'общие',
      notifications: 'уведомлений',
      security: 'безопасности',
      properties: 'объектов',
      payments: 'платежей'
    }
    return labels[type] || type
  }

  const tabs = [
    { id: 'general', label: 'Общие', icon: Settings },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'security', label: 'Безопасность', icon: Shield },
    { id: 'properties', label: 'Объекты', icon: Home },
    { id: 'payments', label: 'Платежи', icon: DollarSign },
  ]

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-secondary-500">Загрузка настроек...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Notification */}
      {notification && (
        <div className={`mb-4 p-4 rounded-lg border ${notification.type === 'success' ? 'bg-green-50 text-green-800 border-green-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
          <div className="flex items-center gap-2">
            {notification.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            {notification.message}
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Настройки</h1>
        <p className="text-secondary-500">Конфигурация системы и параметры платформы</p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 mb-6">
        <div className="border-b border-secondary-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600'
                      : 'text-secondary-600 hover:text-secondary-900'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="p-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-secondary-900 mb-4">Общие настройки</h2>
                <p className="text-sm text-secondary-500 mb-6">Основная информация о платформе</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Название сайта
                  </label>
                  <input
                    type="text"
                    value={generalSettings.siteName}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, siteName: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Email для связи
                  </label>
                  <input
                    type="email"
                    value={generalSettings.contactEmail}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, contactEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={generalSettings.contactPhone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, contactPhone: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Адрес
                  </label>
                  <input
                    type="text"
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, address: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Часовой пояс
                  </label>
                  <select
                    value={generalSettings.timezone}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, timezone: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 bg-white"
                  >
                    <option value="Asia/Tashkent">Asia/Tashkent (UTC+5)</option>
                    <option value="Asia/Almaty">Asia/Almaty (UTC+6)</option>
                    <option value="Europe/Moscow">Europe/Moscow (UTC+3)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Язык
                  </label>
                  <select
                    value={generalSettings.language}
                    onChange={(e) => setGeneralSettings({ ...generalSettings, language: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 bg-white"
                  >
                    <option value="ru">Русский</option>
                    <option value="uz">O'zbek</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Описание сайта
                </label>
                <textarea
                  value={generalSettings.siteDescription}
                  onChange={(e) => setGeneralSettings({ ...generalSettings, siteDescription: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                />
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSaveSettings('общие')}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  Сохранить
                </button>
              </div>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-secondary-900 mb-4">Настройки уведомлений</h2>
                <p className="text-sm text-secondary-500 mb-6">Управление уведомлениями и оповещениями</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-secondary-600" />
                    <div>
                      <p className="font-medium text-secondary-900">Email уведомления</p>
                      <p className="text-sm text-secondary-500">Получать уведомления на email</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-secondary-600" />
                    <div>
                      <p className="font-medium text-secondary-900">SMS уведомления</p>
                      <p className="text-sm text-secondary-500">Получать SMS на телефон</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notificationSettings.smsNotifications}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, smsNotifications: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>

                <div className="border-t border-secondary-200 pt-4 mt-4">
                  <h3 className="font-semibold text-secondary-900 mb-3">Типы уведомлений</h3>
                  
                  {[
                    { key: 'newPropertyAlert', label: 'Новые объекты', desc: 'Уведомления о новых объектах' },
                    { key: 'newUserAlert', label: 'Новые пользователи', desc: 'Регистрация новых пользователей' },
                    { key: 'newReviewAlert', label: 'Новые отзывы', desc: 'Отзывы требующие модерации' },
                    { key: 'paymentAlert', label: 'Платежи', desc: 'Новые платежи и транзакции' },
                    { key: 'systemUpdates', label: 'Системные обновления', desc: 'Важные обновления системы' },
                    { key: 'weeklyReport', label: 'Еженедельный отчет', desc: 'Статистика за неделю' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between py-3">
                      <div>
                        <p className="font-medium text-secondary-900">{item.label}</p>
                        <p className="text-sm text-secondary-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notificationSettings[item.key]}
                          onChange={(e) => setNotificationSettings({ ...notificationSettings, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSaveSettings('уведомлений')}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  Сохранить
                </button>
              </div>
            </div>
          )}

          {/* Security Settings */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-secondary-900 mb-4">Настройки безопасности</h2>
                <p className="text-sm text-secondary-500 mb-6">Параметры безопасности и аутентификации</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Таймаут сессии (минуты)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.sessionTimeout}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Срок действия пароля (дни)
                  </label>
                  <input
                    type="number"
                    value={securitySettings.passwordExpiry}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, passwordExpiry: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Макс. попыток входа
                  </label>
                  <input
                    type="number"
                    value={securitySettings.maxLoginAttempts}
                    onChange={(e) => setSecuritySettings({ ...securitySettings, maxLoginAttempts: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>
              </div>

              <div className="space-y-4 mt-6">
                {[
                  { key: 'twoFactorAuth', label: 'Двухфакторная аутентификация', desc: 'Требовать 2FA для входа', icon: Key },
                  { key: 'requireStrongPassword', label: 'Сложные пароли', desc: 'Требовать сложные пароли', icon: Lock },
                  { key: 'allowMultipleSessions', label: 'Множественные сессии', desc: 'Разрешить вход с нескольких устройств', icon: Users },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="w-5 h-5 text-secondary-600" />
                        <div>
                          <p className="font-medium text-secondary-900">{item.label}</p>
                          <p className="text-sm text-secondary-500">{item.desc}</p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={securitySettings[item.key]}
                          onChange={(e) => setSecuritySettings({ ...securitySettings, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  )
                })}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSaveSettings('безопасности')}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  Сохранить
                </button>
              </div>
            </div>
          )}

          {/* Property Settings */}
          {activeTab === 'properties' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-secondary-900 mb-4">Настройки объектов</h2>
                <p className="text-sm text-secondary-500 mb-6">Параметры публикации и модерации объектов</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Макс. изображений на объект
                  </label>
                  <input
                    type="number"
                    value={propertySettings.maxImagesPerProperty}
                    onChange={(e) => setPropertySettings({ ...propertySettings, maxImagesPerProperty: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Макс. видео на объект
                  </label>
                  <input
                    type="number"
                    value={propertySettings.maxVideosPerProperty}
                    onChange={(e) => setPropertySettings({ ...propertySettings, maxVideosPerProperty: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Статус по умолчанию
                  </label>
                  <select
                    value={propertySettings.defaultPropertyStatus}
                    onChange={(e) => setPropertySettings({ ...propertySettings, defaultPropertyStatus: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 bg-white"
                  >
                    <option value="pending">На модерации</option>
                    <option value="active">Активный</option>
                    <option value="inactive">Неактивный</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                {[
                  { key: 'autoApprove', label: 'Автоматическое одобрение', desc: 'Публиковать объекты без модерации' },
                  { key: 'moderationRequired', label: 'Требуется модерация', desc: 'Все объекты проходят модерацию' },
                  { key: 'allowGuestPosting', label: 'Публикация гостями', desc: 'Разрешить незарегистрированным пользователям' },
                  { key: 'watermarkImages', label: 'Водяные знаки', desc: 'Добавлять водяные знаки на изображения' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                    <div>
                      <p className="font-medium text-secondary-900">{item.label}</p>
                      <p className="text-sm text-secondary-500">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={propertySettings[item.key]}
                        onChange={(e) => setPropertySettings({ ...propertySettings, [item.key]: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSaveSettings('объектов')}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  Сохранить
                </button>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payments' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-secondary-900 mb-4">Настройки платежей</h2>
                <p className="text-sm text-secondary-500 mb-6">Параметры платежных систем и тарифов</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Комиссия платформы (%)
                  </label>
                  <input
                    type="number"
                    value={paymentSettings.commissionRate}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, commissionRate: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Мин. сумма платежа
                  </label>
                  <input
                    type="number"
                    value={paymentSettings.minPaymentAmount}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, minPaymentAmount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Валюта
                  </label>
                  <select
                    value={paymentSettings.currency}
                    onChange={(e) => setPaymentSettings({ ...paymentSettings, currency: e.target.value })}
                    className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 bg-white"
                  >
                    <option value="UZS">UZS (сум)</option>
                    <option value="USD">USD ($)</option>
                    <option value="RUB">RUB (₽)</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-secondary-900 mb-3">Платежные системы</h3>
                <div className="space-y-4">
                  {[
                    { key: 'paymeEnabled', label: 'Payme', desc: 'Платежная система Payme' },
                    { key: 'clickEnabled', label: 'Click', desc: 'Платежная система Click' },
                    { key: 'uzumEnabled', label: 'Uzum', desc: 'Платежная система Uzum' },
                    { key: 'cardPaymentEnabled', label: 'Банковские карты', desc: 'Оплата банковскими картами' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-secondary-50 rounded-lg">
                      <div>
                        <p className="font-medium text-secondary-900">{item.label}</p>
                        <p className="text-sm text-secondary-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={paymentSettings[item.key]}
                          onChange={(e) => setPaymentSettings({ ...paymentSettings, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => handleSaveSettings('платежей')}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  Сохранить
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
