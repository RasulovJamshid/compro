import { apiClient } from './client'

export async function sendVerificationCode(phone: string) {
  const { data } = await apiClient.post('/auth/send-code', { phone })
  return data
}

export async function verifyCode(phone: string, code: string) {
  const { data } = await apiClient.post('/auth/verify-code', { phone, code })
  if (data.accessToken) {
    localStorage.setItem('token', data.accessToken)
  }
  return data
}

export async function getCurrentUser() {
  const { data } = await apiClient.get('/users/me')
  return data
}

export async function logout() {
  localStorage.removeItem('token')
}
