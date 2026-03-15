import Link from 'next/link'
import { Building2 } from 'lucide-react'

interface LogoProps {
  className?: string
  variant?: 'light' | 'dark'
}

export default function Logo({ className = '', variant = 'dark' }: LogoProps) {
  const isLight = variant === 'light'
  
  return (
    <Link href="/" className={`flex items-center gap-2.5 group ${className}`}>
      {/* Icon Container */}
      <div className="relative flex items-center justify-center w-9 h-9 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl shadow-md shadow-primary-600/25 overflow-hidden transition-transform duration-300 group-hover:scale-105">
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10" />
        <Building2 className="w-5 h-5 text-white relative z-10" strokeWidth={2.5} />
      </div>

      {/* Text Container */}
      <div className="flex flex-col">
        <span className={`text-xl font-extrabold tracking-tight leading-none ${isLight ? 'text-white' : 'text-secondary-900'}`}>
          COMPRO<span className="text-primary-600">.UZ</span>
        </span>
        <span className={`text-[10px] font-bold tracking-widest uppercase leading-none mt-0.5 ${isLight ? 'text-white/60' : 'text-secondary-400'}`}>
          Коммерческая
        </span>
      </div>
    </Link>
  )
}
