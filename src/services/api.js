import axios from 'axios'
import lodash from 'lodash'
import dayjs from 'dayjs'
import { clearAuthCookies } from '../utils/cookieManager.js'

// 统一的baseURL配置
export const API_BASE_URL = import.meta.env.MODE === 'production' ? 'yourTestApi' : '/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // 支持跨域Cookie
  headers: {
    'Content-Type': 'application/json'
  }
})

api.interceptors.request.use(
  (config) => {
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] API Request:`, config.url)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    console.log(`[${dayjs().format('YYYY-MM-DD HH:mm:ss')}] API Response:`, response.data)
    return response.data
  },
  (error) => {
    console.error('API Error:', error)
    
    // 处理401未授权错误
    if (error.response?.status === 401) {
      // 清除本地的认证信息和状态
      clearAuthCookies()
      
      // 跳转到登录页，避免无限循环
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
      
      // 触发全局未授权事件（可选，用于其他组件监听）
      window.dispatchEvent(new CustomEvent('api-unauthorized', {
        detail: { message: '登录信息已过期，请重新登录' }
      }))
    }
    
    return Promise.reject(error)
  }
)

export const userAPI = {
  getUsers: () => api.get('/users'),
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post('/users', userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`)
}

export const formatUserData = (users) => {
  return lodash.map(users, user => ({
    ...user,
    createdAt: dayjs(user.createdAt).format('YYYY-MM-DD'),
    fullName: lodash.startCase(`${user.firstName} ${user.lastName}`)
  }))
}

/**
 * 处理头像URL - 将相对路径转换为完整的服务端URL
 * @param {string} avatarPath - 头像路径（可能是相对路径或完整URL）
 * @returns {string} 完整的头像URL
 */
export const formatAvatarUrl = (avatarPath) => {
  if (!avatarPath || typeof avatarPath !== 'string') {
    return ''
  }
  
  // 如果是emoji或很短的字符串，直接返回
  if (avatarPath.length <= 5) {
    return avatarPath
  }
  
  // 如果已经是完整的HTTP/HTTPS URL，直接返回
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath
  }
  
  // 如果不包含路径字符，可能是emoji或文字描述，直接返回
  if (!avatarPath.includes('/') && !avatarPath.includes('.')) {
    return avatarPath
  }
  
  // 如果是相对路径，拼接服务端域名
  const serverBaseUrl = import.meta.env.MODE === 'production' ? 'yourTestApi' : 'yourTestApi'
  
  // 确保路径以 / 开头
  const normalizedPath = avatarPath.startsWith('/') ? avatarPath : `/${avatarPath}`
  
  return `${serverBaseUrl}${normalizedPath}`
}

/**
 * 判断是否为图片URL（包括处理后的完整URL）
 * @param {string} str - 待判断的字符串
 * @returns {boolean} 是否为图片URL
 */
export const isImageUrl = (str) => {
  if (!str || typeof str !== 'string') return false
  
  // 如果字符串很短（比如emoji），直接返回false
  if (str.length <= 5) return false
  
  // 检查是否是HTTP/HTTPS URL
  const urlPattern = /^https?:\/\/.+/i
  if (!urlPattern.test(str)) return false
  
  // 检查是否是常见的图片格式或包含avatar/static路径
  const imageExtensions = /\.(jpg|jpeg|png|gif|bmp|webp|svg)(\?.*)?$/i
  const isImagePath = imageExtensions.test(str) || 
                     str.includes('/avatars/') || 
                     str.includes('/static/') ||
                     str.includes('/avatar/') ||
                     str.includes('avatar')
  
  return isImagePath
}

export default api