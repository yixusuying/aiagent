import { agentService, avatarService } from '@/services'
import { formatAvatarUrl } from '@/services/api.js'
import { message } from 'ant-design-vue'
import { navigateToAgentChat } from '@/utils/chatNavigator.js'

// 存储当前的取消控制器
let currentAbortController = null

// 缓存默认智能体ID
let defaultAgentId = null

export const handleModeChange = (mode, appStore) => {
  appStore.setActiveMode(mode)
}

/**
 * 获取默认的聊天智能体ID
 * 优先获取管理员智能体列表中的第一个
 */
const getDefaultAgentId = async () => {
  try {
    if (defaultAgentId) {
      return defaultAgentId
    }
    
    // 获取管理员智能体列表
    const adminAgents = await agentService.getAdminAgents()
    
    if (adminAgents && adminAgents.length > 0) {
      defaultAgentId = adminAgents[0].id
      console.log('使用管理员智能体作为默认聊天智能体:', defaultAgentId)
      return defaultAgentId
    }
    
    // 如果没有管理员智能体，尝试获取用户的智能体
    const userAgents = await agentService.getMyAgents()
    
    if (userAgents && userAgents.length > 0) {
      defaultAgentId = userAgents[0].id
      console.log('使用用户智能体作为默认聊天智能体:', defaultAgentId)
      return defaultAgentId
    }
    
    console.warn('没有找到可用的智能体')
    return null
  } catch (error) {
    console.error('获取默认智能体失败:', error)
    return null
  }
}

/**
 * 取消当前的创建请求
 */
export const cancelCurrentRequest = () => {
  if (currentAbortController) {
    currentAbortController.abort()
    currentAbortController = null
    console.log('已取消创建智能体请求')
  }
}

/**
 * 处理首页发送消息 - 创建智能体并跳转到设置页面
 * @param {Object} data - 消息数据 { content, mode, timestamp }
 * @param {Object} appStore - 应用状态管理
 * @param {Object} router - 路由器
 * @param {Function} onSuccess - 成功回调（可选）
 */
export const handleSendMessage = async (data, appStore, router, onSuccess) => {
  // 添加用户消息到store
  appStore.addMessage({
    type: 'user',
    content: data.content,
    mode: data.mode
  })
  
  // 根据不同模式进行不同的处理
  if (data.mode === 'ai-role-generation') {
    // AI角色智能生成模式：调用创建智能体API
    let loadingMessage = null
    
    // 先取消之前的请求（如果有）
    cancelCurrentRequest()
    
    // 创建新的AbortController
    currentAbortController = new AbortController()
    
    try {
      appStore.setLoading(true)
      
      // 第一步：创建智能体
      loadingMessage = message.loading('正在创建智能体...', 0)
      const agentData = {
        agent_type: 'roleplay', // 角色扮演类型
        prompt: data.content.trim() // 用户输入的智能体描述
      }
      
      console.log('正在创建智能体...', agentData)
      const response = await agentService.create(agentData)
      console.log('智能体创建成功:', response)
      
      // 更新loading提示
      loadingMessage()
      loadingMessage = message.loading('正在生成智能体头像...', 0)
      
      let finalAgentConfig = { ...response.config }
      
      // 第二步：如果返回的avatar字段是描述文本，调用头像生成接口
      if (response.config.avatar && typeof response.config.avatar === 'string' && response.config.avatar.length > 10) {
        try {
          console.log('正在生成智能体头像...', response.config.avatar)
          
          const avatarData = {
            agent_id: response.config.id,
            prompt: response.config.avatar // 使用返回的avatar描述作为生成提示
          }
          
          const avatarResponse = await avatarService.create(avatarData)
          console.log('智能体头像生成成功:', avatarResponse)
          
          // 更新智能体配置中的头像URL，确保是完整的服务端URL
          finalAgentConfig.avatar = formatAvatarUrl(avatarResponse.avatar_url)
          
        } catch (avatarError) {
          console.error('头像生成失败，使用默认头像:', avatarError)
          // 头像生成失败时，保持原有的emoji或描述
          message.warning('头像生成失败，已使用默认样式')
        }
      }
      
      // 关闭loading提示
      loadingMessage()
      message.success('智能体创建完成！')
      
      // 清理AbortController
      currentAbortController = null
      
      // 跳转到智能体设置页面，传递智能体配置（不包含头像）
      console.log('跳转到设置页面，传递配置:', response.config)
      router.push({
        path: '/setup-agent',
        query: { 
          agentId: finalAgentConfig.id,
          mode: 'debug' // 明确设置为调试模式
        },
        state: {
          agentConfig: { ...response.config }, // 传递原始配置（不包含生成的头像）
          fromCreate: true, // 标记来源
          needAvatarGeneration: response.config.avatar && typeof response.config.avatar === 'string' && response.config.avatar.length > 10 // 标记是否需要生成头像
        }
      })
      
      // 调用成功回调（如果提供）
      if (onSuccess) {
        onSuccess(finalAgentConfig)
      }
      
    } catch (error) {
      // 检查是否是取消请求
      if (error.name === 'AbortError' || error.code === 'ABORT_ERR') {
        console.log('创建智能体请求已取消')
        message.info('创建智能体已取消')
      } else {
        console.error('创建智能体失败:', error)
        message.error(
          error.response?.data?.detail || '创建智能体失败，请重试'
        )
      }
      
      // 关闭loading提示
      if (loadingMessage) {
        loadingMessage()
      }
      
      // 清理AbortController
      currentAbortController = null
      appStore.setLoading(false)
    }
  } else if (data.mode === 'ai-design-generation') {
    // AI教学设计生成模式：使用默认智能体进行聊天
    try {
      appStore.setLoading(true)
      
      const agentId = await getDefaultAgentId()
      if (!agentId) {
        message.error('没有可用的智能体，请先创建智能体')
        appStore.setLoading(false)
        return
      }
      
      await navigateToAgentChat(agentId, router, {
        initialMessage: data.content,
        createNewSession: true
      })
      
    } catch (error) {
      console.error('导航到聊天页面失败:', error)
      message.error('跳转到聊天页面失败，请重试')
      appStore.setLoading(false)
    }
  } else {
    // 默认行为：使用默认智能体进行聊天
    try {
      appStore.setLoading(true)
      
      const agentId = await getDefaultAgentId()
      if (!agentId) {
        message.error('没有可用的智能体，请先创建智能体')
        appStore.setLoading(false)
        return
      }
      
      await navigateToAgentChat(agentId, router, {
        initialMessage: data.content,
        createNewSession: true
      })
      
    } catch (error) {
      console.error('导航到聊天页面失败:', error)
      message.error('跳转到聊天页面失败，请重试')
      appStore.setLoading(false)
    }
  }
}

export const handleCardSelect = (example) => {
  // 处理示例卡片选择逻辑
  console.log('Selected example:', example)
}