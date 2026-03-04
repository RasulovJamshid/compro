import { create } from 'zustand'

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: number
}

interface AnalyticsState {
  events: AnalyticsEvent[]
  addEvent: (name: string, properties?: Record<string, any>) => void
  clearEvents: () => void
  trackPageView: (path: string) => void
  trackPropertyView: (propertyId: string, propertyType: string) => void
  trackSearch: (query: string, filters: Record<string, any>) => void
  trackFilter: (filterName: string, filterValue: any) => void
}

export const useAnalyticsStore = create<AnalyticsState>((set) => ({
  events: [],
  
  addEvent: (name, properties) =>
    set((state) => ({
      events: [
        ...state.events,
        {
          name,
          properties,
          timestamp: Date.now(),
        },
      ],
    })),

  clearEvents: () => set({ events: [] }),

  trackPageView: (path) =>
    set((state) => ({
      events: [
        ...state.events,
        {
          name: 'page_view',
          properties: { path },
          timestamp: Date.now(),
        },
      ],
    })),

  trackPropertyView: (propertyId, propertyType) =>
    set((state) => ({
      events: [
        ...state.events,
        {
          name: 'property_view',
          properties: { propertyId, propertyType },
          timestamp: Date.now(),
        },
      ],
    })),

  trackSearch: (query, filters) =>
    set((state) => ({
      events: [
        ...state.events,
        {
          name: 'search',
          properties: { query, filters },
          timestamp: Date.now(),
        },
      ],
    })),

  trackFilter: (filterName, filterValue) =>
    set((state) => ({
      events: [
        ...state.events,
        {
          name: 'filter_applied',
          properties: { filterName, filterValue },
          timestamp: Date.now(),
        },
      ],
    })),
}))
