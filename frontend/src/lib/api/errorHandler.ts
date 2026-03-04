import { AxiosError } from 'axios'

export interface ApiError {
  message: string
  code?: string
  status?: number
  details?: Record<string, any>
}

export class ApiErrorHandler {
  static handle(error: unknown): ApiError {
    if (error instanceof AxiosError) {
      const status = error.response?.status
      const data = error.response?.data as Record<string, any>

      // Handle specific error codes
      switch (status) {
        case 400:
          return {
            message: data?.message || 'Неверный запрос. Пожалуйста, проверьте введенные данные.',
            code: data?.code || 'BAD_REQUEST',
            status,
            details: data?.details,
          }
        case 401:
          // Token expired or invalid - handled by interceptor
          return {
            message: 'Сеанс истек. Пожалуйста, авторизуйтесь заново.',
            code: 'UNAUTHORIZED',
            status,
          }
        case 403:
          return {
            message: 'У вас нет прав доступа к этому ресурсу.',
            code: 'FORBIDDEN',
            status,
          }
        case 404:
          return {
            message: 'Ресурс не найден.',
            code: 'NOT_FOUND',
            status,
          }
        case 429:
          return {
            message: 'Слишком много запросов. Пожалуйста, подождите несколько минут.',
            code: 'RATE_LIMITED',
            status,
          }
        case 500:
          return {
            message: 'Ошибка сервера. Пожалуйста, попробуйте позже.',
            code: 'INTERNAL_SERVER_ERROR',
            status,
          }
        case 503:
          return {
            message: 'Сервис временно недоступен. Пожалуйста, попробуйте позже.',
            code: 'SERVICE_UNAVAILABLE',
            status,
          }
        default:
          return {
            message: data?.message || 'Произошла ошибка. Пожалуйста, попробуйте позже.',
            code: data?.code || 'UNKNOWN_ERROR',
            status,
            details: data?.details,
          }
      }
    }

    if (error instanceof Error) {
      return {
        message: error.message || 'Произошла неизвестная ошибка.',
        code: 'CLIENT_ERROR',
      }
    }

    return {
      message: 'Произошла неизвестная ошибка.',
      code: 'UNKNOWN_ERROR',
    }
  }

  static isNetworkError(error: unknown): boolean {
    if (error instanceof AxiosError) {
      return !error.response && error.code !== 'ERR_CANCELED'
    }
    return false
  }

  static isClientError(error: unknown): boolean {
    if (error instanceof AxiosError) {
      return error.response?.status ? error.response.status >= 400 && error.response.status < 500 : false
    }
    return false
  }

  static isServerError(error: unknown): boolean {
    if (error instanceof AxiosError) {
      return error.response?.status ? error.response.status >= 500 : false
    }
    return false
  }
}
