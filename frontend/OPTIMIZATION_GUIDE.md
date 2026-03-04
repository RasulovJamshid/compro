# Frontend Optimization Guide

This document outlines all the production-ready features that have been added to the frontend application.

## 🎯 Implemented Features

### 1. Error Handling & Boundaries

**Files:**
- `src/components/common/ErrorBoundary.tsx` - React Error Boundary for graceful error handling
- `src/components/common/ApiErrorHandler.tsx` - User-friendly error notifications
- `src/lib/api/errorHandler.ts` - Centralized API error parsing

**Features:**
- Catches React component errors and displays fallback UI
- Handles 401, 403, 404, 429, 500+ HTTP errors with user-friendly messages
- Automatic token cleanup and redirect on 401
- Development error details display
- Error logging infrastructure (ready for Sentry/Rollbar integration)

**Usage:**
```tsx
// Error boundary already wraps your entire app in layout.tsx
// API errors are automatically handled in responses

// Manual error display:
import ApiErrorHandler from '@/components/common/ApiErrorHandler'
const [error, setError] = useState<string | null>(null)

<ApiErrorHandler error={error} onDismiss={() => setError(null)} />
```

### 2. SEO Optimization

**Files:**
- `src/lib/utils/seo.ts` - SEO utilities and structured data generation
- `src/app/sitemap.ts` - Dynamic XML sitemap
- `src/app/layout.tsx` - Global SEO metadata and structured data
- `src/app/page.tsx` - Homepage with rich metadata
- `src/app/not-found.tsx` - 404 page with SEO
- `src/app/error.tsx` - Error page with SEO
- `public/robots.txt` - Robot directives

**Features:**
- Meta tags (title, description, keywords, OG tags)
- Structured data (Schema.org JSON-LD)
- Breadcrumb navigation schema
- Open Graph and Twitter card tags
- Sitemap generation
- Canonical URLs
- Language alternates (Russian/Uzbek)
- Mobile optimization

**Usage:**
```tsx
import { generateMetadata, generateStructuredData } from '@/lib/utils/seo'

export const metadata = generateMetadata({
  title: 'Page Title',
  description: 'Page description',
  url: '/page-path',
})
```

### 3. Analytics Tracking

**Files:**
- `src/components/common/AnalyticsProvider.tsx` - Google Analytics integration
- `src/lib/store/analyticsStore.ts` - Local event tracking store

**Features:**
- Google Analytics v4 integration (GA4)
- Automatic page view tracking
- Custom event tracking (search, filters, property views)
- Event queue for offline support
- Environment-based activation

**Usage:**
```tsx
const { trackSearch, trackFilter, trackPropertyView } = useAnalyticsStore()

// Track search
trackSearch('office space', { city: 'Tashkent' })

// Track filter applied
trackFilter('dealType', 'rent')

// Track property view
trackPropertyView('property-123', 'office')
```

**Configuration:**
- Add `NEXT_PUBLIC_GA_ID` to `.env.local` with your GA4 ID
- Set `NEXT_PUBLIC_ENABLE_ANALYTICS=true` to enable tracking

### 4. Loading States

**Files:**
- `src/components/common/LoadingSkeleton.tsx` - Reusable skeleton loaders

**Components:**
- `CardSkeleton` - Property card skeleton
- `PropertyDetailSkeleton` - Detail page skeleton
- `ListSkeleton` - List of items skeleton
- `HeroSkeleton` - Hero section skeleton

**Usage:**
```tsx
import { CardSkeleton, PropertyDetailSkeleton } from '@/components/common/LoadingSkeleton'

{loading ? (
  <CardSkeleton />
) : (
  <PropertyCard {...props} />
)}
```

### 5. Improved Authentication

**Files:**
- `src/lib/store/authStore.ts` - Enhanced auth store with error handling
- `src/lib/api/client.ts` - Improved API client with auth handling

**Features:**
- Better token management
- Automatic logout on 401
- Refresh token support (ready to implement)
- Error state in auth store
- Prevents redirect loop on /auth pages

**Usage:**
```tsx
const { user, isAuthenticated, error, logout } = useAuthStore()
```

### 6. Environment Configuration

**Files:**
- `frontend/.env.example` - Complete environment template

**Variables:**
```
NEXT_PUBLIC_API_URL=          # API endpoint
NEXT_PUBLIC_MAPBOX_TOKEN=     # Mapbox GL JS token
NEXT_PUBLIC_GA_ID=            # Google Analytics ID
NEXT_PUBLIC_BASE_URL=         # Base URL for SEO
DEPLOYMENT_ENV=               # local/remote
DOMAIN=                       # Domain name
NEXT_PUBLIC_ENABLE_ANALYTICS= # Enable/disable analytics
NEXT_PUBLIC_ENABLE_COMPARISON= # Enable/disable comparison
```

---

## 📋 Next Steps & Enhancements

### To Enable Production Features:

1. **Setup Google Analytics:**
   ```bash
   # Get GA4 ID from Google Analytics console
   echo "NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX" >> .env.local
   ```

2. **Setup Error Tracking (Optional):**
   - Uncomment Sentry/Rollbar integration in `src/lib/api/errorHandler.ts`
   - Add `NEXT_PUBLIC_ERROR_TRACKING_DSN` to `.env.local`

3. **Implement Refresh Token:**
   - Update `src/lib/store/authStore.ts` with refresh logic
   - Create `/api/auth/refresh` endpoint in backend

4. **Add More Metadata:**
   - Update individual page metadata in each route
   - Add structured data for products/articles

5. **Performance Optimization:**
   - Enable image optimization in `next.config.js`
   - Add preconnect tags for external domains
   - Implement route prefetching

---

## 🔒 Security Best Practices

✅ **Implemented:**
- HTTP-only cookie support (auth interceptor ready)
- CORS configuration via Next.js headers
- Environment variable isolation (NEXT_PUBLIC_ prefix)
- Token cleanup on logout
- Automatic redirect on auth errors

**To Add:**
```javascript
// next.config.js - Add security headers
const withSecurityHeaders = (config) => {
  config.headers = async () => {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
      ],
    }]
  }
  return config
}
```

---

## 📊 Monitoring & Debugging

### Available in Development:
- Error boundary shows stack traces
- API errors logged to console
- Auth state accessible via store
- Analytics events stored in memory

### For Production:
- Enable error tracking service (Sentry)
- Setup uptime monitoring
- Configure log aggregation
- Monitor Core Web Vitals via Google Analytics

---

## 🚀 Deployment Checklist

- [ ] Add all environment variables to production
- [ ] Setup Google Analytics
- [ ] Verify robots.txt is served
- [ ] Test sitemap generation
- [ ] Verify error pages work
- [ ] Test auth flow with real tokens
- [ ] Monitor error tracking service
- [ ] Setup performance monitoring
- [ ] Configure CDN caching headers
- [ ] Enable GZIP compression

---

## 📚 References

- [Next.js Documentation](https://nextjs.org/docs)
- [Google Analytics 4](https://support.google.com/analytics)
- [Schema.org](https://schema.org/)
- [Open Graph Protocol](https://ogp.me/)
- [Web Vitals](https://web.dev/vitals/)

---

**Last Updated:** 2024
**Version:** 1.0
