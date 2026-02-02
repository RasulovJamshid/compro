export interface User {
  id: string
  phone: string
  role: 'guest' | 'free' | 'premium' | 'moderator' | 'admin'
  firstName?: string
  lastName?: string
  email?: string
  isPremium: boolean
  isAdmin: boolean
}

export interface Property {
  id: string
  title: string
  description: string
  propertyType: 'office' | 'warehouse' | 'shop' | 'cafe_restaurant' | 'industrial' | 'salon' | 'recreation' | 'other'
  dealType: 'rent' | 'sale'
  area: number
  price: number
  pricePerMonth?: number
  hasCommission: boolean
  city: string
  district: string
  address?: string
  latitude: number
  longitude: number
  floor?: number
  totalFloors?: number
  hasParking?: boolean
  hasVideo: boolean
  hasTour360: boolean
  isVerified: boolean
  isTop: boolean
  status: string
  viewCount: number
  createdAt: string
  updatedAt: string
  images?: PropertyImage[]
  videos?: PropertyVideo[]
  tour360Url?: string
  contactName?: string
  contactPhone?: string
  contactEmail?: string
}

export interface PropertyImage {
  id: string
  url: string
  thumbnailUrl?: string
  watermarkedUrl?: string
  isCover: boolean
  order: number
}

export interface PropertyVideo {
  id: string
  url: string
  thumbnailUrl?: string
  title?: string
  duration: number
}

export interface PropertyFilters {
  dealType?: string
  propertyType?: string
  city?: string
  district?: string
  minArea?: number
  maxArea?: number
  minPrice?: number
  maxPrice?: number
  hasCommission?: boolean
  hasVideo?: boolean
  hasTour360?: boolean
  isVerified?: boolean
  isTop?: boolean
  q?: string
  minLat?: number
  maxLat?: number
  minLng?: number
  maxLng?: number
}

export interface SubscriptionPlan {
  id: string
  code: string
  name: string
  description: string
  price: number
  durationDays: number
  features: string[]
}
