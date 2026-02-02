/**
 * Phone mask utility for Uzbekistan phone numbers
 * Format: +998 XX XXX XX XX
 */

export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters except +
  const cleaned = value.replace(/[^\d+]/g, '')
  
  // If empty, return empty
  if (!cleaned) return ''
  
  // Ensure it starts with +998
  let formatted = cleaned.startsWith('+') ? cleaned : '+' + cleaned
  if (!formatted.startsWith('+998')) {
    formatted = '+998' + formatted.replace(/^\+?/, '')
  }
  
  // Remove extra +998 if user typed it multiple times
  formatted = '+998' + formatted.replace(/^\+?998/, '')
  
  // Extract digits after +998
  const digits = formatted.slice(4)
  
  // Apply mask: +998 XX XXX XX XX
  let masked = '+998'
  
  if (digits.length > 0) {
    masked += ' ' + digits.slice(0, 2)
  }
  if (digits.length > 2) {
    masked += ' ' + digits.slice(2, 5)
  }
  if (digits.length > 5) {
    masked += ' ' + digits.slice(5, 7)
  }
  if (digits.length > 7) {
    masked += ' ' + digits.slice(7, 9)
  }
  
  return masked
}

export const unformatPhoneNumber = (value: string): string => {
  // Remove all spaces and keep only +998XXXXXXXXX format
  return value.replace(/\s/g, '')
}

export const isValidPhoneNumber = (value: string): boolean => {
  // Check if phone number is valid: +998XXXXXXXXX (9 digits after 998)
  const cleaned = unformatPhoneNumber(value)
  return /^\+998\d{9}$/.test(cleaned)
}

export const getPhoneDigitsOnly = (value: string): string => {
  // Get only the 9 digits after +998
  const cleaned = unformatPhoneNumber(value)
  return cleaned.replace(/^\+998/, '')
}
