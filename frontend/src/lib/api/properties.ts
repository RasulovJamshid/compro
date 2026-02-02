import { apiClient } from './client'
import type { Property, PropertyFilters } from '../types'

export async function getProperties(filters?: PropertyFilters & { page?: number; limit?: number }) {
  const { data } = await apiClient.get<{
    data: Property[]
    total: number
    page: number
    limit: number
    totalPages: number
  }>('/properties', { params: filters })
  return {
    items: data.data || [],
    total: data.total || 0,
    page: data.page || 1,
    limit: data.limit || 20,
    totalPages: data.totalPages || 0
  }
}

export async function getProperty(id: string) {
  const { data } = await apiClient.get<Property>(`/properties/${id}`)
  return data
}

export async function saveProperty(id: string) {
  const { data } = await apiClient.post(`/properties/${id}/save`)
  return data
}

export async function unsaveProperty(id: string) {
  const { data } = await apiClient.delete(`/properties/${id}/save`)
  return data
}

export async function getSavedProperties() {
  const { data } = await apiClient.get('/properties/saved/list')
  return data
}
