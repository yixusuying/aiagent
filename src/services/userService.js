import api from './api.js'
import { clearAuthCookies } from '../utils/cookieManager.js'
import { MOCK_MODE, mockUserService } from '../mock/index.js'

export const userService = {
  register: (userData) => {
    if (MOCK_MODE) {
      console.log("called")
      return mockUserService.register(userData)
    }
    return api.post('/users/register', userData)
  },

  login: (credentials) => {
    if (MOCK_MODE) {
      return mockUserService.login(credentials)
    }
    return api.post('/users/login', credentials)
  },

  logout: async () => {
    if (MOCK_MODE) {
      await mockUserService.logout()
      clearAuthCookies()
      return
    }
    try {
      await api.post('/users/logout')
    } finally {
      // 无论后端返回什么结果，都清空本地的cookie和状态
      clearAuthCookies()
    }
  }
}

export default userService