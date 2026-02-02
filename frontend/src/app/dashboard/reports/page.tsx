'use client'

import { FileText } from 'lucide-react'

export default function DashboardReportsPage() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-900 mb-2">Отчеты</h1>
        <p className="text-secondary-500">Генерация и просмотр отчетов</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-secondary-100 p-12 text-center">
        <FileText className="w-16 h-16 text-secondary-300 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-secondary-900 mb-2">Раздел в разработке</h2>
        <p className="text-secondary-500">Функционал отчетов будет доступен в ближайшее время</p>
      </div>
    </div>
  )
}
