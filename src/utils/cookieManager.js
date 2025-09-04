/**
 * Cookie管理工具
 * 用于管理HTTP-only Cookie和本地存储的登录状态
 */

/**
 * 获取Cookie值
 * @param {string} name - Cookie名称
 * @returns {string|null} Cookie值
 */
export function getCookie(name) {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) {
    return parts.pop().split(';').shift()
  }
  return null
}

/**
 * 设置Cookie
 * @param {string} name - Cookie名称
 * @param {string} value - Cookie值
 * @param {number} days - 过期天数（默认24小时）
 * @param {Object} options - 其他选项
 */
export function setCookie(name, value, days = 1, options = {}) {
  const date = new Date()
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
  
  const defaultOptions = {
    expires: date.toUTCString(),
    path: '/',
    secure: window.location.protocol === 'https:', // 根据当前协议自动设置
    sameSite: 'Lax'
  }
  
  const cookieOptions = { ...defaultOptions, ...options }
  
  let cookieString = `${name}=${value}`
  
  Object.entries(cookieOptions).forEach(([key, val]) => {
    if (val !== null && val !== undefined) {
      cookieString += `; ${key}`
      if (val !== true) {
        cookieString += `=${val}`
      }
    }
  })
  
  document.cookie = cookieString
}

/**
 * 删除Cookie
 * @param {string} name - Cookie名称
 * @param {string} path - Cookie路径
 */
export function deleteCookie(name, path = '/') {
  // 设置过期时间为过去的时间来删除cookie
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}`
}

/**
 * 检查access_token Cookie是否存在
 * @returns {boolean} 是否存在有效的access_token
 */
export function hasAccessToken() {
  const token = getCookie('access_token')
  return !!token
}

/**
 * 清除所有认证相关的Cookie
 */
export function clearAuthCookies() {
  // 清除access_token cookie
  deleteCookie('access_token')
  
  // 清除其他可能的认证相关cookie
  deleteCookie('refresh_token')
  deleteCookie('session_id')
  
  // 清除本地存储的用户状态
  localStorage.removeItem('user_info')
  localStorage.removeItem('login_state')
  sessionStorage.removeItem('user_session')
}

/**
 * 保存用户登录状态到本地存储（非敏感信息）
 * @param {Object} userInfo - 用户信息
 */
export function saveUserState(userInfo) {
  try {
    const userState = {
      username: userInfo.username,
      nickname: userInfo.nickname || userInfo.nikename, // 支持nickname和nikename两种拼写
      loginTime: Date.now(),
      isLoggedIn: true
    }
    localStorage.setItem('user_info', JSON.stringify(userState))
  } catch (error) {
    console.warn('保存用户状态失败:', error)
  }
}

/**
 * 获取本地存储的用户状态
 * @returns {Object|null} 用户状态
 */
export function getUserState() {
  try {
    const stored = localStorage.getItem('user_info')
    if (stored) {
      const userState = JSON.parse(stored)
      
      // 检查登录状态是否过期（24小时）
      const now = Date.now()
      const loginTime = userState.loginTime || 0
      const isExpired = now - loginTime > 24 * 60 * 60 * 1000
      console.log(isExpired, stored , '///123213123')
      if (isExpired) {
        clearAuthCookies()
        return null
      }
      
      return userState
    }
  } catch (error) {
    console.warn('获取用户状态失败:', error)
    // 清除损坏的数据
    localStorage.removeItem('user_info')
  }
  return null
}

/**
 * 检查用户是否已登录（综合检查cookie和本地状态）
 * @returns {boolean} 是否已登录
 */
export function isLoggedIn() {
  // 首先检查HTTP-only cookie是否存在
  const hasCookie = hasAccessToken()
  
  // 检查本地存储的状态
  const userState = getUserState()
  
  // 两者都存在才认为是已登录状态
  return hasCookie && userState && userState.isLoggedIn
}

/**
 * 初始化登录状态检查
 * @returns {Object|null} 用户状态
 */
export function initAuthState() {
  if (isLoggedIn()) {
    return getUserState()
  } else {
    // 清理不一致的状态
    clearAuthCookies()
    return null
  }
}