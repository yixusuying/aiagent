import { defineStore } from 'pinia'
import { ref } from 'vue'

// 导出所有store
export { useUserStore } from './userStore.js'

export const useAppStore = defineStore('app', () => {
  const activeMode = ref('ai-role-generation')
  const messages = ref([])
  const isLoading = ref(false)
  const adminAgents = ref([])

  const setActiveMode = (mode) => {
    activeMode.value = mode
  }

  const addMessage = (message) => {
    messages.value.push({
      id: Date.now(),
      timestamp: new Date(),
      ...message
    })
  }

  const setLoading = (loading) => {
    isLoading.value = loading
  }

  const setAdminAgents = (agents) => {
    adminAgents.value = agents
  }

  return {
    activeMode,
    messages,
    isLoading,
    adminAgents,
    setActiveMode,
    addMessage,
    setLoading,
    setAdminAgents
  }
})

export const useMainStore = defineStore('main', {
  state: () => ({
    counter: 0,
    user: null
  }),
  
  getters: {
    doubleCounter: (state) => state.counter * 2
  },
  
  actions: {
    increment() {
      this.counter++
    },
    
    setUser(user) {
      this.user = user
    }
  }
})