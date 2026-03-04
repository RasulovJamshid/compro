import { Metadata } from 'next'

export interface SEOMetadata {
  title: string
  description: string
  image?: string
  url?: string
  type?: 'website' | 'article' | 'product'
  author?: string
  publishedDate?: string
  modifiedDate?: string
}

export function generateMetadata(seo: SEOMetadata): Metadata {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://compro.uz'
  const imageUrl = seo.image || '/og-image.png'

  return {
    title: seo.title,
    description: seo.description,
    keywords: extractKeywords(seo.description),
    authors: seo.author ? [{ name: seo.author }] : undefined,
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: seo.url || baseUrl,
      siteName: 'Коммерческая недвижимость',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
      type: seo.type === 'article' ? 'article' : 'website',
      ...(seo.type === 'article' && {
        publishedTime: seo.publishedDate,
        modifiedTime: seo.modifiedDate,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.title,
      description: seo.description,
      images: [imageUrl],
    },
    alternates: {
      canonical: seo.url || baseUrl,
      languages: {
        'ru': `${baseUrl}${seo.url || '/'}`,
        'uz': `${baseUrl}/uz${seo.url || '/'}`,
      },
    },
  }
}

export function generateStructuredData(data: {
  type: 'Organization' | 'LocalBusiness' | 'Product' | 'Article'
  name: string
  description?: string
  image?: string
  url?: string
  telephone?: string
  email?: string
  address?: {
    streetAddress?: string
    addressLocality?: string
    postalCode?: string
    addressCountry?: string
  }
  price?: number
  priceCurrency?: string
  aggregateRating?: {
    ratingValue: number
    ratingCount: number
  }
}) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://compro.uz'

  const structuredData: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': data.type,
    name: data.name,
    url: data.url || baseUrl,
  }

  if (data.description) structuredData.description = data.description
  if (data.image) structuredData.image = data.image
  if (data.telephone) structuredData.telephone = data.telephone
  if (data.email) structuredData.email = data.email

  if (data.address) {
    structuredData.address = {
      '@type': 'PostalAddress',
      ...data.address,
    }
  }

  if (data.price && data.priceCurrency) {
    structuredData.offers = {
      '@type': 'Offer',
      price: data.price,
      priceCurrency: data.priceCurrency,
    }
  }

  if (data.aggregateRating) {
    structuredData.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: data.aggregateRating.ratingValue,
      ratingCount: data.aggregateRating.ratingCount,
    }
  }

  return structuredData
}

export function extractKeywords(text: string): string[] {
  // Extract important keywords from description
  const keywords = text
    .toLowerCase()
    .split(/[\s,\.]+/)
    .filter(word => word.length > 3)
    .slice(0, 5)

  return keywords
}

export function generateBreadcrumbs(
  paths: Array<{ name: string; url: string }>
) {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://compro.uz'

  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: paths.map((path, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: path.name,
      item: `${baseUrl}${path.url}`,
    })),
  }
}
