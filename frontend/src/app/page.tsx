import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import Hero from '@/components/home/Hero'
import Logo from '@/components/common/Logo'
import PropertyList from '@/components/properties/PropertyList'
import { generateStructuredData } from '@/lib/utils/seo'
import { ArrowRight, Mail, MapPin, Phone, Plus } from 'lucide-react'
import { getTranslations } from 'next-intl/server'

async function getMobilePromoImage(apiBaseUrl: string) {
  const fallbackImage = `${apiBaseUrl}/uploads/images/insta360_sample.jpg`

  try {
    const response = await fetch(`${apiBaseUrl}/api/properties?limit=12`, {
      next: { revalidate: 300 },
    })

    if (!response.ok) {
      return fallbackImage
    }

    const payload = (await response.json()) as {
      data?: Array<{
        images?: Array<{
          url: string
          watermarkedUrl?: string
          isCover: boolean
        }>
      }>
    }

    const propertyWithImage = payload.data?.find((property) => property.images?.length)
    const promoImage = propertyWithImage?.images?.find((image) => image.isCover) || propertyWithImage?.images?.[0]

    return promoImage?.watermarkedUrl || promoImage?.url || fallbackImage
  } catch {
    return fallbackImage
  }
}

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

export default async function Home() {
  const t = await getTranslations('HomePage')
  const tFooter = await getTranslations('Footer')
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'
  const mobilePromoImage = await getMobilePromoImage(apiBaseUrl)
  const mobileStats = [
    { value: '400+', label: t('mobileStatListings') },
    { value: '1,000+', label: t('mobileStatClients') },
    { value: '90%', label: t('mobileStatSuccess') },
  ]

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

      <div className="sm:hidden bg-secondary-50">
        <section className="pt-3 pb-8">
          <div className="container">
            <div className="mb-4 flex items-end justify-between gap-3">
              <h2 className="min-w-0 text-lg font-bold text-secondary-950 leading-tight">
                {t('newProperties')}
              </h2>
              <Link
                href="/properties"
                className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1 flex-shrink-0"
              >
                {t('all')}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <PropertyList limit={6} variant="compact" className="grid grid-cols-1 gap-3.5" />
          </div>
        </section>

        <section className="pb-8">
          <div className="container">
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 p-4 shadow-[0_18px_40px_rgba(37,99,181,0.35)]">
              <div className="absolute -top-16 -left-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
              <div className="absolute -bottom-10 right-0 h-40 w-40 rounded-full bg-accent-400/20 blur-3xl" />
              <div className="relative z-10">
                <div className="relative mb-4 h-44 w-full overflow-hidden rounded-2xl border border-white/10 bg-white/10 shadow-lg">
                  <Image
                    src={mobilePromoImage}
                    alt={t('mobilePromoImageAlt')}
                    fill
                    sizes="(max-width: 639px) calc(100vw - 48px)"
                    className="object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent" />
                </div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
                  {t('mobileCtaEyebrow')}
                </p>
                <h2 className="mb-2 max-w-[16ch] text-[28px] font-extrabold leading-[1.05] text-white">
                  {t('haveProperty')}
                </h2>
                <p className="mb-5 max-w-[34ch] text-base leading-6 text-white/82">
                  {t('postFree')}
                </p>
                <Link
                  href="/auth/register"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-primary-900 shadow-lg transition-all duration-300 hover:bg-secondary-50"
                >
                  <Plus className="w-4 h-4" />
                  {t('addAd')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-8">
          <div className="container grid grid-cols-1 gap-3">
            {mobileStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl bg-gradient-to-r from-primary-500 to-primary-600 px-5 py-4 text-white shadow-[0_10px_24px_rgba(37,99,181,0.22)]"
              >
                <div className="text-[28px] font-extrabold leading-none">{stat.value}</div>
                <div className="mt-1 pr-6 text-sm leading-5 text-primary-50/90">{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-primary-900 text-white">
          <div className="container py-8">
            <Logo variant="light" />
            <p className="mt-4 max-w-sm text-sm leading-6 text-primary-100/75">
              {tFooter('desc')}
            </p>

            <div className="mt-6 space-y-3">
              <a href="tel:+998901234567" className="flex items-start gap-3 text-sm text-white/90">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Phone className="h-4 w-4" />
                </span>
                <span className="min-w-0 break-words pt-2">+998 (90) 123-45-67</span>
              </a>
              <a href="mailto:info@compro.uz" className="flex items-start gap-3 text-sm text-white/90">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <Mail className="h-4 w-4" />
                </span>
                <span className="min-w-0 break-all pt-2">info@compro.uz</span>
              </a>
              <div className="flex items-start gap-3 text-sm text-white/90">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  <MapPin className="h-4 w-4" />
                </span>
                <span className="min-w-0 break-words pt-2">{tFooter('address')}</span>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/properties" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90">
                {tFooter('properties')}
              </Link>
              <Link href="/map" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90">
                {tFooter('map')}
              </Link>
              <Link href="/pricing" className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/90">
                {tFooter('pricing')}
              </Link>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4 text-xs text-primary-100/55">
              &copy; {new Date().getFullYear()} COMPRO.UZ. {tFooter('rights')}
            </div>
          </div>
        </section>
      </div>

      <div className="hidden sm:block">

      {/* Featured Listings — content first */}
      <section className="py-10 sm:py-14 bg-white">
        <div className="container">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-secondary-900">
              {t('newProperties')}
            </h2>
            <Link
              href="/properties"
              className="text-sm font-semibold text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1 flex-shrink-0"
            >
              {t('all')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <PropertyList />
        </div>
      </section>

      {/* Dynamic Gradient CTA */}
      <section className="py-14 sm:py-24 bg-gradient-to-br from-primary-900 via-primary-800 to-accent-900 relative overflow-hidden">
        {/* Abstract shapes */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-full h-1/2 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>
        <div className="container relative z-10 text-center max-w-2xl px-6 sm:px-4">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white mb-3 sm:mb-4 tracking-tight">
            {t('haveProperty')}
          </h2>
          <p className="text-sm sm:text-lg text-primary-100 mb-7 sm:mb-8 max-w-xl mx-auto">
            {t('postFree')}
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-white hover:bg-secondary-50 text-primary-900 font-bold text-sm sm:text-base px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            {t('addAd')}
          </Link>
        </div>
      </section>
      </div>
    </>
  )
}
