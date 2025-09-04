<template>
  <div id="app">
    <LoadingSkeleton v-if="!isRouterReady" />
    <Layout v-else-if="useMainLayout">
      <keep-alive>
        <router-view />
      </keep-alive>
    </Layout>
    <SimpleLayout v-else>
      <keep-alive>
        <router-view />
      </keep-alive>
    </SimpleLayout>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import Layout from '@/views/Layout.vue'
import SimpleLayout from '@/views/SimpleLayout.vue'
import LoadingSkeleton from '@/components/LoadingSkeleton'
import { useUserStore } from '@/stores/userStore.js'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()
const isRouterReady = ref(false)

const useMainLayout = computed(() => {
  if (!isRouterReady.value) return true
  const layoutType = route.meta?.layout || 'main'
  return layoutType === 'main'
})

// 处理API未授权事件
const handleUnauthorized = (event) => {
  const { message: errorMessage } = event.detail
  message.warning(errorMessage)
  userStore.clearUser()
  router.push('/login')
}

onMounted(async () => {
  await router.isReady()
  // 添加一个短暂延迟确保路由完全解析
  setTimeout(() => {
    isRouterReady.value = true
  }, 100)

  userStore.initUserFromStorage()
  
  // 监听全局未授权事件
  window.addEventListener('api-unauthorized', handleUnauthorized)
})

onUnmounted(() => {
  // 清理事件监听器
  window.removeEventListener('api-unauthorized', handleUnauthorized)
})
</script>

<style lang="scss">
#app {
  min-height: 100vh;
}
</style>
