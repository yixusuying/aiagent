import chatInitializer from './chatInitializer.js'

/**
 * 聊天导航工具 - 处理从不同页面导航到聊天页面的逻辑
 */

/**
 * 从首页点击智能体卡片导航到聊天页面
 * @param {string} agentId - 智能体ID
 * @param {Object} router - Vue Router实例
 * @param {Object} options - 导航选项
 * @param {string} options.initialMessage - 初始消息内容
 * @param {boolean} options.createNewSession - 是否强制创建新会话
 */
export const navigateToAgentChat = async (agentId, router, options = {}) => {
  const { initialMessage, createNewSession = false } = options
  console.log(initialMessage, 'initialMessage')
  try {
    if (initialMessage) {
      // 有初始消息时，通过路由状态传递消息，但不预先创建会话
      router.push({
        path: `/chat/${agentId}`,
        state: { 
          initialMessage: { content: initialMessage },
          shouldCreateSession: true // 标记需要在用户首次发送消息时创建会话
        }
      })
    } else {
      // 直接导航到聊天页面，不创建会话，让ChatList处理加载逻辑
      router.push(`/chat/${agentId}`)
    }
  } catch (error) {
    console.error('导航到聊天页面失败:', error)
    throw error
  }
}

/**
 * 从SetupAgent页面点击"去运行"导航到聊天页面
 * @param {string} agentId - 智能体ID
 * @param {Object} router - Vue Router实例
 * @param {Object} options - 导航选项
 */
export const navigateFromSetupAgent = async (agentId, router, options = {}) => {
  return await chatInitializer.createSessionAndNavigate(agentId, router, {
    debug: false,
    ...options
  })
}

/**
 * 从调试页面导航到聊天页面
 * @param {string} agentId - 智能体ID
 * @param {Object} router - Vue Router实例
 * @param {Object} agentConfig - 智能体配置（用于调试模式）
 */
export const navigateFromDebug = async (agentId, router, agentConfig) => {
  return await chatInitializer.createSessionAndNavigate(agentId, router, {
    debug: true,
    agentConfig
  })
}

export default {
  navigateToAgentChat,
  navigateFromSetupAgent,
  navigateFromDebug
}