import { useState, useEffect, useCallback, useRef } from 'react'
import { getProperties } from '@/lib/api/properties'
import type { Property, PropertyFilters } from '@/lib/types'

interface UsePropertiesOptions {
  initialFilters?: PropertyFilters
  initialPage?: number
  initialLimit?: number
  initialSortBy?: string
}

export function useProperties(options: UsePropertiesOptions = {}) {
  const [properties, setProperties] = useState<Property[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const [filters, setFilters] = useState<PropertyFilters>(options.initialFilters || {})
  const [searchQuery, setSearchQuery] = useState(options.initialFilters?.q || '')
  const [page, setPage] = useState(options.initialPage || 1)
  const [limit, setLimit] = useState(options.initialLimit || 12)
  const [sortBy, setSortBy] = useState(options.initialSortBy || 'newest')

  const fetchProperties = useCallback(async (currentFilters: PropertyFilters, currentPage: number, currentLimit: number, currentSort: string) => {
    setLoading(true)
    setError(null)
    try {
      const data = await getProperties({ 
        ...currentFilters, 
        page: currentPage, 
        limit: currentLimit, 
        sortBy: currentSort 
      } as any)
      setProperties(data.items || [])
      setTotal(data.total || 0)
    } catch (err: any) {
      setError(err?.message || 'Ошибка при загрузке объектов')
      setProperties([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce search query effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters(prev => {
        if (prev.q === searchQuery) return prev
        return { ...prev, q: searchQuery }
      })
      setPage(1)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Fetch effect for all dependencies
  useEffect(() => {
    fetchProperties(filters, page, limit, sortBy)
  }, [filters, page, limit, sortBy, fetchProperties])

  const handleApplyFilters = useCallback((newFilters: PropertyFilters) => {
    setFilters(newFilters)
    setSearchQuery(newFilters.q || '')
    setPage(1)
  }, [])

  const handleClearFilters = useCallback(() => {
    setFilters({})
    setSearchQuery('')
    setPage(1)
  }, [])

  const handleSetSearch = useCallback((q: string) => {
    setSearchQuery(q)
  }, [])

  return {
    properties,
    total,
    loading,
    error,
    filters,
    searchQuery,
    setFilters: handleApplyFilters,
    clearFilters: handleClearFilters,
    setSearch: handleSetSearch,
    page,
    setPage,
    limit,
    setLimit,
    sortBy,
    setSortBy,
    refresh: () => fetchProperties(filters, page, limit, sortBy)
  }
}
