import { SAMPLE_QUESTIONS } from './constants.js'
import { agentService, sessionService } from '@/services'
import { formatAvatarUrl } from '@/services/api.js'
import { message } from 'ant-design-vue'
import { cleanDescription } from '@/utils/agentParser.js'
import chatInitializer from '@/utils/chatInitializer.js'

/**
 * 生成智能体预览数据
 */
export const generateAgentPreview = (config) => {
  return {
    id: 'preview',
    title: config.name || '我的智能助手',
    description: cleanDescription(config.backgroundSetting) || '一个专业的智能助手',
    image: formatAvatarUrl(config.avatar) || '🤖',
    personality: config.personality,
    skills: [], // 不再使用技能数组
    openingRemarks: config.openingRemarks,
    sampleQuestions: config.presetQuestions || SAMPLE_QUESTIONS
  }
}

/**
 * 保存智能体配置 - 集成真实API
 * @param {Object} config - 智能体配置
 * @returns {Promise} API响应
 */
export const saveAgentConfig = async (config) => {
  try {
    console.log('正在保存智能体配置...', config)
    
    // 构建配置数据，清理undefined值
    const configData = {
      design: config.design,
      prologue: config.openingRemarks,
      predefined_questions: config.presetQuestions,
      voice: config.voice,
      audience_age: config.audienceAge,
      content_complexity: config.contentComplexity,
      main_style: config.mainStyle,
      auxiliary_traits: Array.isArray(config.auxiliaryTraits) && config.auxiliaryTraits.length > 0 
        ? config.auxiliaryTraits 
        : undefined
    };

    // 调用更新智能体API
    const updateData = {
      agent_id: config.id,
      name: config.name,
      avatar: config.avatar,
      introduction: config.backgroundSetting,
      config: cleanObject(configData), // 清理undefined值
      is_public: false // 默认为私有
    }
    
    const response = await agentService.updateAgent(updateData)
    console.log('智能体配置保存成功:', response)
    message.success('配置保存成功！')
    
    return response
  } catch (error) {
    console.error('保存智能体配置失败:', error)
    message.error(error.response?.data?.detail || '保存配置失败，请重试')
    throw error
  }
}

/**
 * 创建会话并跳转到聊天页面
 * @param {String} agentId - 智能体ID
 * @param {Object} router - 路由器实例
 * @returns {Promise} 会话创建结果
 */
export const createSessionAndNavigateToChat = async (agentId, router, options = {}) => {
  try {
    console.log('正在创建会话并导航...', agentId)
    
    // 使用聊天初始化器创建会话并导航
    const sessionData = await chatInitializer.createSessionAndNavigate(agentId, router, options)
    
    console.log('会话创建并导航成功:', sessionData)
    
    return sessionData
  } catch (error) {
    console.error('创建会话失败:', error)
    message.error(error.response?.data?.detail || '创建会话失败，请重试')
    throw error
  }
}

/**
 * 清理对象中值为undefined的键
 * @param {Object} obj - 需要清理的对象
 * @returns {Object} 清理后的对象（新对象，不修改原对象）
 */
export const cleanObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;
  
  const cleaned = {};
  Object.keys(obj).forEach(key => {
    if (obj[key] !== undefined) {
      cleaned[key] = obj[key];
    }
  });
  
  return cleaned;
};

/**
 * 智能体调试模式对话 - 使用真实API，支持流式回调
 * @param {string} userMessage - 用户消息
 * @param {Object} agentConfig - 智能体配置
 * @param {string} sessionId - 会话ID (可选，调试模式可以不需要)
 * @param {boolean} isFirstMessage - 是否是第一次对话
 * @param {Function} onStreamChunk - 流式数据回调函数
 * @returns {Promise<string>} 智能体回复
 */
export const simulateAgentResponse = async (userMessage, agentConfig, sessionId = null, isFirstMessage = false, onStreamChunk = null) => {
  try {
    // 如果有会话ID，使用正常模式
    if (sessionId) {
      const messages = []
      
      // 如果是第一次对话且有开场白，将开场白添加到消息历史中
      if (isFirstMessage && agentConfig.openingRemarks) {
        messages.push({
          role: 'assistant',
          content: agentConfig.openingRemarks
        })
      }
      
      // 添加用户消息
      messages.push({
        role: 'user',
        content: userMessage
      })
      
      const chatData = {
        session_id: sessionId,
        messages: messages
      }
      
      const response = await sessionService.chatStream(chatData)
      return await handleStreamResponse(response, onStreamChunk)
    } else {
      // 调试模式 - 使用调试接口
      const messages = []
      
      // 如果是第一次对话且有开场白，将开场白添加到消息历史中  
      if (isFirstMessage && agentConfig.openingRemarks) {
        messages.push({
          role: 'assistant',
          content: agentConfig.openingRemarks
        })
      }
      
      // 添加用户消息
      messages.push({
        role: 'user', 
        content: userMessage
      })
      
      // 构建agent_config，只包含有效值
      const agentConfigData = {
        name: agentConfig.name || '测试助手',
        design: agentConfig.design || `##【背景设定】${agentConfig.backgroundSetting || '一个专业的AI助手'}\n##【性格特征】${agentConfig.personality || '友好、专业'}`,
        introduction: agentConfig.backgroundSetting || '一个专业的AI助手',
        user_age: agentConfig.audienceAge,
        content_complexity: agentConfig.contentComplexity, 
        main_style: agentConfig.mainStyle,
        auxiliary_feature: Array.isArray(agentConfig.auxiliaryTraits) && agentConfig.auxiliaryTraits.length > 0 
          ? agentConfig.auxiliaryTraits.join(', ') 
          : undefined
      };

      const debugData = {
        agent_id: agentConfig.id || 'debug-agent', // 智能体ID
        messages: messages,
        agent_config: cleanObject(agentConfigData) // 清理undefined值
      }
      
      console.log('调试模式对话请求:', JSON.stringify(debugData, null, 2))
      
      // 验证必需字段
      if (!debugData.agent_id) {
        console.warn('警告: agent_id 为空')
      }
      if (!debugData.agent_config.name) {
        console.warn('警告: agent_config.name 为空')
      }
      if (!debugData.agent_config.design) {
        console.warn('警告: agent_config.design 为空')
      }
      if (!debugData.agent_config.introduction) {
        console.warn('警告: agent_config.introduction 为空')
      }
      
      const response = await sessionService.chatStreamDebug(debugData)
      return await handleStreamResponse(response, onStreamChunk)
    }
  } catch (error) {
    console.error('智能体对话失败:', error)
    console.error('错误详情:', error.response?.data || error.message)
    
    // API失败时的降级回复
    const fallbackResponses = [
      `作为${agentConfig.name}，我很高兴回答您的问题。`,
      `根据我的理解，您想了解的是...`,
      `基于我的性格特点：${agentConfig.personality}，我建议...`,
      `这是一个很好的问题！让我为您详细解答...`,
      `感谢您的提问，我来帮您分析一下...`
    ]
    
    // 简单的关键词回复逻辑
    if (userMessage.includes('你好') || userMessage.includes('您好')) {
      return `您好！我是${agentConfig.name}，${agentConfig.openingRemarks || '很高兴为您服务！'}`
    }
    
    if (userMessage.includes('你是谁') || userMessage.includes('介绍')) {
      return `我是${agentConfig.name}。${agentConfig.backgroundSetting}。我的性格特点是${agentConfig.personality}。`
    }
    
    // 默认回复
    const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)]
    return randomResponse
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
    const errorText = await response.text()
    console.error('HTTP错误:', response.status, errorText)
    throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
  }
  
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let result = ''
  let hasContent = false
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
                hasContent = true
                // 如果有回调函数，立即调用以更新UI，实现真正的流式效果
                if (onStreamChunk && typeof onStreamChunk === 'function') {
                  onStreamChunk(data.content)
                }
              }
              
              if (data.finish_reason === '__END__') {
                console.log('流式响应结束，总内容:', result)
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
    
    console.log('流式响应完成，是否有内容:', hasContent, '结果:', result)
    return result || (hasContent ? '' : '抱歉，我现在无法回复，请稍后再试。')
  } catch (error) {
    console.error('处理流式响应时出错:', error)
    throw error
  } finally {
    reader.releaseLock()
  }
}

/**
 * 验证配置数据
 */
export const validateAgentConfig = (config) => {
  const errors = []
  
  if (!config.name?.trim()) {
    errors.push('智能体名称不能为空')
  }
  
  if (!config.description?.trim()) {
    errors.push('智能体描述不能为空')
  }
  
  if (!config.personality?.trim()) {
    errors.push('性格特征不能为空')
  }
  
  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * 格式化技能列表
 */
export const formatSkillsList = (skills) => {
  if (!skills || skills.length === 0) return '暂无特长'
  return skills.join(' · ')
}

/**
 * 根据ID加载智能体配置数据
 */
export const loadAgentConfigById = async (agentId) => {
  if (!agentId) return null
  
  // 这里可以调用API获取智能体配置
  // 暂时使用模拟数据，从ChatList的数据库获取
  try {
    const { getAgentInfo } = await import('@/views/ChatList/utils.js')
    const agentInfo = await getAgentInfo(agentId)
    
    // 转换为SetupAgent需要的格式
    return {
      name: agentInfo.name || '',
      backgroundSetting: agentInfo.backgroundSetting || agentInfo.description || '',
      personality: agentInfo.personality || '',
      avatar: agentInfo.avatar || '🤖',
      voice: agentInfo.voice || 'male-cantonese-deep',
      openingRemarks: agentInfo.openingRemarks || '',
      presetQuestions: agentInfo.presetQuestions || [],
      audienceAge: agentInfo.audienceAge || '',
      contentComplexity: agentInfo.contentComplexity || '',
      mainStyle: agentInfo.mainStyle || '',
      auxiliaryTraits: agentInfo.auxiliaryTraits || [],
      design: agentInfo.design || '',
    }
  } catch (error) {
    console.error('加载智能体配置失败:', error)
    return null
  }
}