'use client'

import { usePathname } from 'next/navigation'
import Header from './Header'
import Footer from './Footer'

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMapPage = pathname === '/map'

  return (
    <>
      {!isMapPage && <Header />}
      <main className="flex-grow">
        {children}
      </main>
      {!isMapPage && <Footer />}
    </>
  )
}

