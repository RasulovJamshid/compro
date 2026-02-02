import { apiClient } from './client'
import type { SubscriptionPlan } from '../types'

export async function getSubscriptionPlans() {
  const { data } = await apiClient.get<SubscriptionPlan[]>('/subscriptions/plans')
  return data
}

export async function getMySubscription() {
  const { data } = await apiClient.get('/subscriptions/my')
  return data
}

export async function createSubscription(planId: string) {
  const { data } = await apiClient.post('/subscriptions', { planId })
  return data
}
