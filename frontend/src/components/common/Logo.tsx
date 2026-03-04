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
      <div className="relative flex items-center justify-center w-10 h-10 bg-primary-600 rounded-xl shadow-lg shadow-primary-600/30 overflow-hidden transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3">
        {/* Subtle geometric overlay for modern look */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black/20 to-transparent" />
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/20 rounded-full blur-sm" />
        
        <Building2 className="w-6 h-6 text-white relative z-10" strokeWidth={2.5} />
      </div>

      {/* Text Container */}
      <div className="flex flex-col">
        <span className={`text-xl font-extrabold tracking-tight leading-none ${isLight ? 'text-white' : 'text-secondary-900'}`}>
          COMPRO<span className="text-primary-600">.UZ</span>
        </span>
        <span className={`text-[10px] font-bold tracking-widest uppercase leading-none mt-0.5 ${isLight ? 'text-white/70' : 'text-secondary-500'}`}>
          Коммерческая
        </span>
      </div>
    </Link>
  )
}
