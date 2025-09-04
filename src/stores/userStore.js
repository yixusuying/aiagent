import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { userService } from '@/services'
import { saveUserState, getUserState } from '@/utils/cookieManager.js'

export const useUserStore = defineStore('user', () => {
  const user = ref(null)
  const isLoading = ref(false)

  const isLoggedIn = computed(() => !!user.value)
  const displayName = computed(() => {
    if (!user.value) return '登录'
    // 优先显示nickname，其次是username
    return user.value.nickname || user.value.nikename || user.value.username || '登录'
  })

  const setUser = (userData) => {
    user.value = userData
  }

  const clearUser = () => {
    user.value = null
    // 同时清除本地存储
    console.log('calledddd')
    localStorage.removeItem('user_info')
  }

  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await userService.login(credentials)
      
      // 登录成功后设置用户状态
      const userData = {
        username: response.username || credentials.username,
        nickname: response.nickname || response.nikename, // 支持两种拼写
      }
      
      setUser(userData)
      
      // 保存用户信息到本地存储
      saveUserState(userData)
      
      return response
    } catch (error) {
      clearUser()
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      await userService.logout()
    } catch (error) {
      console.error('Logout API failed:', error)
      // 即使API调用失败，也清除本地用户状态
    } finally {
      clearUser()
      setLoading(false)
    }
  }

  // 从本地存储初始化用户状态
  const initUserFromStorage = () => {
    const storedUserState = getUserState()
    if (storedUserState && storedUserState.isLoggedIn) {
      setUser({
        username: storedUserState.username,
        nickname: storedUserState.nickname
      })
      return true
    }
    return false
  }

  return {
    user,
    isLoading,
    isLoggedIn,
    displayName,
    setUser,
    clearUser,
    setLoading,
    login,
    logout,
    initUserFromStorage
  }
})