'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'
import BottomNav from './BottomNav'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMapPage = pathname === '/map'

  return (
    <>
      {!isMapPage && <Header />}
      <main className="flex-grow pb-14 lg:pb-0">
        {children}
      </main>
      {!isMapPage && <Footer />}
      {!isMapPage && <BottomNav />}
    </>
  )
}

