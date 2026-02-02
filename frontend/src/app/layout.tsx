import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import AuthProvider from '@/components/auth/AuthProvider'
import LayoutShell from '@/components/layout/LayoutShell'

const inter = Inter({ 
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Коммерческая недвижимость | №1 маркетплейс в Ташкенте',
  description: 'Профессиональная платформа для поиска коммерческой недвижимости в Ташкенте и Ташкентской области. Офисы, склады, магазины, кафе и рестораны.',
  keywords: 'коммерческая недвижимость, аренда офиса, аренда склада, Ташкент, недвижимость Узбекистан',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className={inter.variable}>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-secondary-50">
        <AuthProvider>
          <LayoutShell>
            {children}
          </LayoutShell>
        </AuthProvider>
      </body>
    </html>
  )
}

