import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import PropertyList from '@/components/properties/PropertyList'
import { generateStructuredData } from '@/lib/utils/seo'
import Link from 'next/link'
import { ArrowRight, Plus } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Коммерческая недвижимость в Ташкенте | Аренда и продажа офисов, складов, магазинов',
  description: 'Найдите коммерческую недвижимость в Ташкенте. 2500+ проверенных объектов: офисы, склады, магазины, кафе и рестораны. Профессиональная платформа для бизнеса.',
  keywords: ['коммерческая недвижимость', 'аренда офиса', 'продажа', 'Ташкент', 'склады', 'магазины'],
  openGraph: {
    title: 'Коммерческая недвижимость в Ташкенте',
    description: 'Найдите идеальное помещение для вашего бизнеса',
    url: 'https://compro.uz',
    type: 'website',
  },
}
import { getTranslations } from 'next-intl/server'

export default async function Home() {
  const t = await getTranslations('HomePage')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            generateStructuredData({
              type: 'LocalBusiness',
              name: 'Коммерческая недвижимость',
              description: 'B2B маркетплейс коммерческой недвижимости',
              url: 'https://compro.uz',
              aggregateRating: {
                ratingValue: 4.9,
                ratingCount: 15000,
              },
            })
          ),
        }}
      />

      {/* Hero with Search */}
      <Hero />

      {/* Featured Listings — content first */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-secondary-900">
              {t('newProperties')}
            </h2>
            <Link
              href="/properties"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
            >
              {t('all')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <PropertyList />
        </div>
      </section>

      {/* Dynamic Gradient CTA */}
      <section className="py-16 sm:py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="container relative z-10 text-center max-w-2xl">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-4 tracking-tight">
            {t('haveProperty')}
          </h2>
          <p className="text-base sm:text-lg text-primary-100 mb-8 max-w-xl mx-auto">
            {t('postFree')}
          </p>
          <Link
            href="/announcements/entity"
            className="inline-flex items-center gap-2 bg-white hover:bg-secondary-50 text-primary-900 font-bold text-base px-8 py-4 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            {t('addAd')}
          </Link>
        </div>
      </section>
    </>
  )
}
