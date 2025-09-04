import { AGENT_DATABASE, AGENT_INFO } from './constants.js'
import { sessionService, agentService } from '@/services'
import { formatAvatarUrl } from '@/services/api.js'
import { message } from 'ant-design-vue'
import { extractBackground, extractPersonality, cleanDescription } from '@/utils/agentParser.js'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/zh-cn'

// 配置dayjs
dayjs.extend(relativeTime)
dayjs.locale('zh-cn')

// 格式化时间戳为相对时间
export const formatRelativeTime = (timestamp) => {
  if (!timestamp) return '刚刚'
  
  const now = dayjs()
  const time = dayjs(timestamp)
  const diffInMinutes = now.diff(time, 'minute')
  const diffInHours = now.diff(time, 'hour')
  const diffInDays = now.diff(time, 'day')

  if (diffInMinutes < 1) {
    return '刚刚'
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes}分钟前`
  } else if (diffInHours < 24) {
    return `${diffInHours}小时前`
  } else if (diffInDays < 7) {
    return `${diffInDays}天前`
  } else {
    // 超过一周显示具体日期
    return time.format('MM/DD')
  }
}

/**
 * 智能体对话 - 使用真实的流式API
 * @param {string} userMessage - 用户消息
 * @param {string} sessionId - 会话ID
 * @param {Array} messageHistory - 消息历史 (可选)
 * @returns {Promise<string>} 智能体回复
 */
export const simulateAgentResponse = async (userMessage, sessionId, messageHistory = []) => {
  try {
    console.log('发送对话请求:', { userMessage, sessionId, messageHistory })
    
    // 构建消息数组 - 包含历史消息和当前用户消息
    const messages = [
      ...messageHistory,
      {
        role: 'user',
        content: userMessage
      }
    ]
    
    const chatData = {
      session_id: sessionId,
      messages: messages
    }
    
    const response = await sessionService.chatStream(chatData)
    const result = await handleStreamResponse(response)
    
    console.log('智能体回复:', result)
    return result
    
  } catch (error) {
    console.error('智能体对话失败:', error)
    message.error('对话失败，请重试')
    
    // API失败时的降级回复
    const fallbackResponses = [
      '抱歉，我现在无法正常回复。请稍后再试。',
      '系统暂时不可用，请稍后重新开始对话。',
      '连接出现问题，请检查网络后重试。'
    ]
    
    return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
  }
}

/**
 * 处理流式响应
 * @param {Response} response - fetch响应对象  
 * @param {Function} onStreamChunk - 流式数据回调函数 (content) => void
 * @returns {Promise<string>} 完整的回复内容
 */
const handleStreamResponse = async (response, onStreamChunk = null) => {
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let result = ''
  let isFinished = false
  
  try {
    while (true && !isFinished) {
      const { done, value } = await reader.read()
      if (done) break
      
      const chunk = decoder.decode(value, { stream: true })
      const lines = chunk.split('\n')
      
      for (const line of lines) {
        if (line.trim()) {
          // 处理新的流式格式: event: message_chunk
          if (line.startsWith('event: message_chunk')) {
            continue // 跳过事件行，处理下一行的data
          }
          
          if (line.startsWith('data: ')) {
            try {
              const jsonStr = line.slice(6).trim()
              if (jsonStr === '[DONE]') {
                isFinished = true
                break
              }
              
              const data = JSON.parse(jsonStr)
              console.log('收到流式数据:', data)
              
              if (data.content) {
                result += data.content
                // 如果有回调函数，立即调用以更新UI
                if (onStreamChunk && typeof onStreamChunk === 'function') {
                  onStreamChunk(data.content)
                }
              }
              
              if (data.finish_reason === '__END__') {
                console.log('流式响应结束')
                isFinished = true
                break
              }
              
              if (data.error) {
                console.error('流式响应中的错误:', data.error)
                throw new Error(data.error)
              }
            } catch (e) {
              console.warn('JSON解析错误:', e, '原始行:', line)
            }
          }
        }
      }
    }
    
    return result || '抱歉，我现在无法回复，请稍后再试。'
  } finally {
    reader.releaseLock()
  }
}

// 生成智能体预览数据
export const generateAgentPreview = (agentConfig) => {
  return {
    name: agentConfig.name || '智能体',
    avatar: agentConfig.avatar || '🤖',
    description: agentConfig.backgroundSetting || '这是一个智能助手',
    openingRemarks: agentConfig.openingRemarks || '您好，我是您的智能助手，有什么可以帮助您的吗？',
    presetQuestions: agentConfig.presetQuestions?.filter(q => q.trim()) || []
  }
}

/**
 * 根据ID获取智能体信息 - 集成真实API
 * @param {string} agentId - 智能体ID
 * @returns {Promise<Object>} 智能体信息
 */
export const getAgentInfo = async (agentId) => {
  try {
    if (!agentId || agentId === 'default') {
      return { ...AGENT_INFO }
    }
    
    console.log('获取智能体信息:', agentId)
    
    // 调用获取智能体详细配置API
    const response = await agentService.getAgentConfig(agentId)
    console.log('智能体配置响应:', response)
    
    // 转换API数据格式为页面所需格式
    const agentInfo = {
      id: response.id,
      name: response.name || '智能体',
      avatar: formatAvatarUrl(response.avatar) || '🤖',
      description: response.introduction || '智能助手',
      backgroundSetting: response.config?.design ? extractBackground(response.config.design) : '',
      personality: response.config?.design ? extractPersonality(response.config.design) : '',
      prologue: response.config?.prologue || '您好，我是您的智能助手！',
      openingRemarks: response.config?.prologue || '您好，我是您的智能助手！', // 向后兼容
      presetQuestions: response.config?.predefined_questions || [],
      voice: response.config?.voice || 'male-cantonese-deep',
      audienceAge: response.config?.audience_age || '',
      contentComplexity: response.config?.content_complexity || '',
      mainStyle: response.config?.main_style || '',
      auxiliaryTraits: response.config?.auxiliary_traits || [],
      createdAt: response.created_at,
      isOwnedByUser: response.is_owner || false, // 使用API返回的is_owner字段
      isAddedToUserAgents: response.is_owner || false, // 如果是拥有者，则已添加到用户智能体
      design: response.config?.design || '',
    }
    
    return agentInfo
    
  } catch (error) {
    console.error('获取智能体信息失败:', error)
    
    // API失败时尝试从本地数据库获取
    const agent = AGENT_DATABASE[agentId]
    if (agent) {
      return { ...agent }
    }
    
    // 如果都没找到，返回默认信息
    return { ...AGENT_INFO }
  }
}


// 检查智能体是否可以配置
export const canConfigureAgent = (agent) => {
  return agent.isOwnedByUser || agent.isAddedToUserAgents
}

// 添加智能体到我的智能体（通过复制智能体）
export const addAgentToUserAgents = async (agentId) => {
  try {
    console.log('🔄 开始调用agentService.copyAgent，agentId:', agentId)
    
    // 调用复制智能体API
    const response = await agentService.copyAgent(agentId)
    console.log('🔄 copyAgent API响应:', response)
    console.log('🔄 response.id:', response.id)
    console.log('🔄 response.new_agent_id:', response.new_agent_id)
    
    const newAgentId = response.new_agent_id
    console.log('🔄 解析出的newAgentId:', newAgentId)
    
    if (!newAgentId) {
      console.error('❌ API响应中没有找到新智能体ID')
      throw new Error('API响应中没有找到新智能体ID')
    }
    
    const result = { 
      success: true, 
      newAgentId: newAgentId
    }
    
    console.log('✅ addAgentToUserAgents函数返回结果:', result)
    return result
  } catch (error) {
    console.error('❌ 复制智能体失败:', error)
    message.error('复制智能体失败，请重试')
    throw error
  }
}

// 将智能体数据转换为SetupAgent页面所需的格式
export const convertToSetupAgentFormat = (agent) => {
  return {
    id: agent.id,
    name: agent.name,
    avatar: agent.avatar,
    backgroundSetting: agent.backgroundSetting || agent.description,
    personality: agent.personality || '',
    voice: agent.voice || 'male-cantonese-deep',
    openingRemarks: agent.openingRemarks,
    presetQuestions: agent.presetQuestions || [],
    audienceAge: agent.audienceAge || 'adult',
    contentComplexity: agent.contentComplexity || 'medium',
    mainStyle: agent.mainStyle || 'warm',
    auxiliaryTraits: agent.auxiliaryTraits || []
  }
}