import type { Metadata } from 'next'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/800.css'
import '@fontsource/source-sans-3/400.css'
import '@fontsource/source-sans-3/600.css'
import './globals.css'
import AuthProvider from '@/components/auth/AuthProvider'
import LayoutShell from '@/components/layout/LayoutShell'
import ErrorBoundary from '@/components/common/ErrorBoundary'
import AnalyticsProvider from '@/components/common/AnalyticsProvider'
import { generateStructuredData } from '@/lib/utils/seo'

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://compro.uz'),
  title: {
    template: '%s | Коммерческая недвижимость',
    default: 'Коммерческая недвижимость | №1 маркетплейс в Ташкенте',
  },
  description: 'Профессиональная платформа для поиска коммерческой недвижимости в Ташкенте и Ташкентской области. Офисы, склады, магазины, кафе и рестораны.',
  keywords: ['коммерческая недвижимость', 'аренда офиса', 'аренда склада', 'Ташкент', 'недвижимость', 'маркетплейс'],
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
  alternates: {
    languages: {
      'ru': 'https://compro.uz',
      'uz': 'https://compro.uz/uz',
    },
    canonical: 'https://compro.uz',
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://compro.uz',
    siteName: 'Коммерческая недвижимость',
    title: 'Коммерческая недвижимость | №1 маркетплейс в Ташкенте',
    description: 'Профессиональная платформа для поиска коммерческой недвижимости в Ташкенте и Ташкентской области.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Коммерческая недвижимость',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Коммерческая недвижимость | №1 маркетплейс в Ташкенте',
    description: 'Профессиональная платформа для поиска коммерческой недвижимости.',
    images: ['/og-image.png'],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        {/* Google Analytics */}
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `,
              }}
            />
          </>
        )}

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              generateStructuredData({
                type: 'Organization',
                name: 'Коммерческая недвижимость',
                description: 'B2B маркетплейс коммерческой недвижимости',
                url: 'https://compro.uz',
                email: 'support@compro.uz',
                telephone: '+998 (71) 230-00-00',
                address: {
                  streetAddress: 'ул. Мирабад, 50',
                  addressLocality: 'Ташкент',
                  postalCode: '100000',
                  addressCountry: 'UZ',
                },
              })
            ),
          }}
        />
      </head>
      <body className="font-sans antialiased min-h-screen flex flex-col bg-secondary-50 selection:bg-primary-100 selection:text-primary-900">
        <ErrorBoundary>
          <AuthProvider>
            <AnalyticsProvider>
              <LayoutShell>
                {children}
              </LayoutShell>
            </AnalyticsProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
