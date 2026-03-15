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

      {/* Hero with Search */}
      <Hero />

      {/* Featured Listings — content first */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-secondary-900">
              Новые объекты
            </h2>
            <Link
              href="/properties"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1"
            >
              Все
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <PropertyList />
        </div>
      </section>

      {/* Simple CTA — one block, no fluff */}
      <section className="py-10 sm:py-14 bg-secondary-50 border-t border-secondary-100">
        <div className="container text-center max-w-lg">
          <h2 className="text-xl sm:text-2xl font-bold text-secondary-900 mb-3">
            Есть объект для размещения?
          </h2>
          <p className="text-sm text-secondary-500 mb-5">
            Разместите объявление бесплатно и получайте заявки от арендаторов и покупателей.
          </p>
          <Link
            href="/announcements/entity"
            className="inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-6 py-3 rounded-xl transition-colors"
          >
            <Plus className="w-4 h-4" />
            Добавить объявление
          </Link>
        </div>
      </section>
    </>
  )
}
