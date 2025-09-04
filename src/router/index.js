import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes.js'
import { checkAuth } from '../mock/index.js'

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫 - 检查认证状态
router.beforeEach(async (to, from, next) => {
  // 登录页无需认证
  if (to.path === '/login') {
    next()
    return
  }
  
  // 检查是否已登录
  const isAuthenticated = checkAuth()
  
  if (!isAuthenticated && to.path !== '/login') {
    // 未登录且不是登录页，重定向到登录页
    next('/login')
  } else {
    // 已登录或是登录页，直接放行
    next()
  }
})

export default router