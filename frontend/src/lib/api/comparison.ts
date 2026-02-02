import { apiClient } from './client';

export interface PropertyComparison {
  id: string;
  userId: string;
  name: string;
  propertyIds: string[];
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ComparisonResult {
  properties: any[];
  summary: {
    avgPrice: number;
    avgPricePerSqm: number;
    avgArea: number;
    lowestPrice: number;
    highestPrice: number;
  };
}

export const comparisonApi = {
  // Compare properties instantly (no auth required)
  compareProperties: async (propertyIds: string[]): Promise<ComparisonResult> => {
    const { data } = await apiClient.post('/properties/compare', { propertyIds });
    return data;
  },

  // Get user's saved comparisons
  getUserComparisons: async (): Promise<PropertyComparison[]> => {
    const { data } = await apiClient.get('/properties/comparisons');
    return data;
  },

  // Create a new comparison
  createComparison: async (name: string, propertyIds: string[]): Promise<PropertyComparison> => {
    const { data } = await apiClient.post('/properties/comparisons', { name, propertyIds });
    return data;
  },

  // Get comparison details
  getComparisonDetails: async (id: string): Promise<PropertyComparison & { properties: any[] }> => {
    const { data } = await apiClient.get(`/properties/comparisons/${id}`);
    return data;
  },

  // Update comparison
  updateComparison: async (id: string, updates: { name?: string; propertyIds?: string[]; notes?: string }): Promise<PropertyComparison> => {
    const { data } = await apiClient.put(`/properties/comparisons/${id}`, updates);
    return data;
  },

  // Delete comparison
  deleteComparison: async (id: string): Promise<void> => {
    await apiClient.delete(`/properties/comparisons/${id}`);
  },
};
