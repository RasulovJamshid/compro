/**
 * File Upload Utilities
 * Handles image and video uploads to cloud storage or backend
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

/**
 * Upload a single file to the server
 * @param {File} file - The file to upload
 * @param {string} type - Type of file ('image' or 'video')
 * @returns {Promise<Object>} Upload result with URL
 */
export async function uploadFile(file, type = 'image') {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('type', type)

  const token = localStorage.getItem('dashboard_token')
  
  try {
    const response = await fetch(`${API_URL}/api/upload`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    })

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error('Upload error:', error)
    throw error
  }
}

/**
 * Upload multiple files
 * @param {File[]} files - Array of files to upload
 * @param {string} type - Type of files ('image' or 'video')
 * @returns {Promise<Object[]>} Array of upload results
 */
export async function uploadMultipleFiles(files, type = 'image') {
  const uploadPromises = files.map(file => uploadFile(file, type))
  return Promise.all(uploadPromises)
}

/**
 * Validate image file
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export function validateImage(file) {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Неподдерживаемый формат изображения. Используйте JPG, PNG, WEBP или GIF'
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Размер изображения превышает 10MB'
    }
  }

  return { valid: true }
}

/**
 * Validate video file
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export function validateVideo(file) {
  const maxSize = 100 * 1024 * 1024 // 100MB
  const allowedTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm']

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: 'Неподдерживаемый формат видео. Используйте MP4, MOV, AVI или WEBM'
    }
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: 'Размер видео превышает 100MB'
    }
  }

  return { valid: true }
}

/**
 * Create a thumbnail from an image file
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width
 * @param {number} maxHeight - Maximum height
 * @returns {Promise<Blob>} Thumbnail blob
 */
export function createThumbnail(file, maxWidth = 300, maxHeight = 300) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = (e) => {
      const img = new Image()
      
      img.onload = () => {
        const canvas = document.createElement('canvas')
        let width = img.width
        let height = img.height

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width
            width = maxWidth
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height
            height = maxHeight
          }
        }

        canvas.width = width
        canvas.height = height

        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0, width, height)

        canvas.toBlob((blob) => {
          resolve(blob)
        }, 'image/jpeg', 0.8)
      }

      img.onerror = reject
      img.src = e.target.result
    }

    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Format file size for display
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes'

  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))

  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}
