'use client'

import { ArrowRight, Building2, Users } from 'lucide-react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'

export default function CTA() {
  const tCTA = useTranslations('CTA')

  return (
    <section className="py-16 sm:py-20 bg-slate-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary-100/30 rounded-full blur-[120px] pointer-events-none" />

      <div className="container relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14 lg:mb-16">
          <p className="text-sm font-bold text-primary-600 uppercase tracking-wider mb-3">{tCTA('title')}</p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-secondary-900 mb-3 sm:mb-4">
            {tCTA('subtitle')}
          </h2>
          <p className="text-base sm:text-lg text-secondary-500 max-w-xl mx-auto">
            {tCTA('desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 max-w-6xl mx-auto">
          
          {/* For Tenants/Buyers Card */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl group min-h-[340px] sm:min-h-[400px] lg:min-h-[420px] flex flex-col justify-end">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=2069&auto=format&fit=crop")',
              }}
            ></div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-950 via-secondary-950/70 to-secondary-900/20"></div>

            {/* Content */}
            <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col h-full justify-end">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-primary-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 sm:mb-6 border border-primary-400/20">
                <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-primary-300" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                {tCTA('tenantTitle')}
              </h3>
              
              <p className="text-white/70 text-base sm:text-lg mb-6 sm:mb-8 max-w-md leading-relaxed">
                {tCTA('tenantDesc')}
              </p>

              <Link
                href="/properties"
                className="btn btn-lg btn-primary group/btn"
              >
                {tCTA('tenantBtn')}
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* For Landlords/Sellers Card */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl group min-h-[340px] sm:min-h-[400px] lg:min-h-[420px] flex flex-col justify-end">
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-700 group-hover:scale-105"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1600880292203-757bb62b4baf?q=80&w=2070&auto=format&fit=crop")',
              }}
            ></div>
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-secondary-950 via-secondary-950/70 to-secondary-900/20"></div>

            {/* Content */}
            <div className="relative z-10 p-6 sm:p-8 lg:p-10 flex flex-col h-full justify-end">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-accent-500/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-5 sm:mb-6 border border-accent-400/20">
                <Users className="w-6 h-6 sm:w-7 sm:h-7 text-accent-300" />
              </div>
              
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white mb-3">
                {tCTA('landlordTitle')}
              </h3>
              
              <p className="text-white/70 text-base sm:text-lg mb-6 sm:mb-8 max-w-md leading-relaxed">
                {tCTA('landlordDesc')}
              </p>

              <Link
                href="/auth/register"
                className="btn btn-lg bg-white text-secondary-900 hover:bg-secondary-50 group/btn"
              >
                {tCTA('landlordBtn')}
                <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
