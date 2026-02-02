'use client'

import { CreditCard, CheckCircle, Clock, XCircle } from 'lucide-react'

export default function DashboardPaymentsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Платежи</h1>
        <p className="text-secondary-500">История транзакций и управление платежами</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-12 text-center">
        <CreditCard className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-secondary-900 mb-2">Раздел в разработке</h2>
        <p className="text-secondary-500">Функционал управления платежами будет доступен в ближайшее время</p>
      </div>
    </div>
  )
}
