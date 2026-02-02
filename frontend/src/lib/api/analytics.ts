import { apiClient } from './client';

export interface PropertyAnalytics {
  propertyId: string;
  totalViews: number;
  uniqueViewers: number;
  recentViews: number;
  avgViewDuration: number;
  inquiryCount: number;
  shareCount: number;
  conversionRate: string;
  viewsBySource: Record<string, number>;
  viewsOverTime: Array<{ date: string; views: number }>;
  priceHistory: Array<{
    price: number;
    pricePerMonth?: number;
    pricePerSqm?: number;
    changedAt: string;
    reason?: string;
  }>;
  recentInquiries: Array<{
    id: string;
    status: string;
    createdAt: string;
  }>;
}

export interface MarketComparables {
  comparables: Array<{
    id: string;
    title: string;
    area: number;
    price: number;
    pricePerSqm?: number;
    district: string;
    yearBuilt?: number;
    buildingClass?: string;
    coverImage?: string;
  }>;
  marketStats: {
    totalListings: number;
    avgPrice: number;
    avgPricePerSqm: number;
    pricePosition: 'below' | 'average' | 'above';
    priceDifference: number;
  };
}

export const analyticsApi = {
  // Track property view
  trackView: async (propertyId: string, metadata?: { duration?: number; source?: string }): Promise<void> => {
    await apiClient.post(`/properties/${propertyId}/view`, metadata || {});
  },

  // Get property analytics
  getPropertyAnalytics: async (propertyId: string): Promise<PropertyAnalytics> => {
    const { data } = await apiClient.get(`/properties/${propertyId}/analytics`);
    return data;
  },

  // Get market comparables
  getMarketComparables: async (propertyId: string): Promise<MarketComparables> => {
    const { data } = await apiClient.get(`/properties/${propertyId}/comparables`);
    return data;
  },
};
