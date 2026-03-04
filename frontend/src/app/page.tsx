import type { Metadata } from 'next'
import Hero from '@/components/home/Hero'
import Categories from '@/components/home/Categories'
import MarketInsights from '@/components/home/MarketInsights'
import CTA from '@/components/home/CTA'
import PropertyList from '@/components/properties/PropertyList'
import { generateStructuredData } from '@/lib/utils/seo'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

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

export default function Home() {
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

      {/* Hero with Search - LoopNet Style */}
      <Hero />

      {/* Featured Listings */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-secondary-900 mb-3">
                Рекомендуемые объекты
              </h2>
              <p className="text-xl text-secondary-600">
                Новые и популярные предложения для вашего бизнеса
              </p>
            </div>
            <Link
              href="/properties"
              className="hidden md:inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-semibold text-lg transition-colors"
            >
              Смотреть все объекты
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <PropertyList />
          <div className="mt-10 text-center md:hidden">
            <Link
              href="/properties"
              className="inline-flex items-center gap-2 px-6 py-4 bg-secondary-50 border border-secondary-200 rounded-xl font-bold text-secondary-900 hover:bg-secondary-100 hover:border-secondary-300 transition-all w-full justify-center text-lg"
            >
              Смотреть все объекты
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Property Types with Images */}
      <Categories />

      {/* Market Insights & Statistics */}
      <MarketInsights />

      {/* CTA Section */}
      <CTA />
    </>
  )
}
