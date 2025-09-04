// 模拟API服务入口
import { mockUserService, mockAgentService, mockSessionService, mockAvatarService } from './mockApi.js'

// 启用模拟模式的标志
export const MOCK_MODE = true

// 导出所有模拟服务
export {
  mockUserService,
  mockAgentService,
  mockSessionService,
  mockAvatarService
}

// 模拟认证状态检查
export const checkAuth = () => {
  const currentUser = mockUserService.getCurrentUser()
  return !!currentUser
}

// 模拟获取当前用户信息
export const getCurrentUserInfo = () => {
  return mockUserService.getCurrentUser()
}