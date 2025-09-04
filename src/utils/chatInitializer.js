import { sessionService, agentService } from '@/services'

/**
 * 聊天页面初始化器 - 处理创建会话、加载会话列表和智能体信息的可复用逻辑
 */
class ChatInitializer {
  constructor() {
    this.isInitialized = false
    this.initializingPromise = null
    this.currentAgentId = null
    this.currentSessionId = null
  }

  /**
   * 重置初始化状态
   */
  reset() {
    this.isInitialized = false
    this.initializingPromise = null
    this.currentAgentId = null
    this.currentSessionId = null
  }

  /**
   * 创建新会话
   * @param {string} agentId - 智能体ID
   * @param {boolean} debug - 是否为调试模式
   * @param {Array} messages - 初始消息数组
   * @returns {Promise<Object>} 会话数据
   */
  async createSession(agentId, debug = false, messages = []) {
    try {
      // 根据新接口文档，创建会话需要messages参数
      const requestData = {
        agent_id: agentId,
        debug,
        messages: messages.length > 0 ? messages : [
          {
            role: 'user',
            content: '开始新会话'
          }
        ]
      }
      
      const response = await sessionService.create(requestData)
      console.log('创建新会话成功:', response)
      return response
    } catch (error) {
      console.error('创建新会话失败:', error)
      throw error
    }
  }

  /**
   * 获取用户所有会话
   * @returns {Promise<Array>} 会话列表
   */
  async getUserSessions() {
    try {
      const sessions = await sessionService.getMySessions()
      console.log('获取用户会话列表:', sessions)
      return sessions || []
    } catch (error) {
      console.error('获取用户会话失败:', error)
      return []
    }
  }

  /**
   * 获取智能体配置信息
   * @param {string} agentId - 智能体ID
   * @returns {Promise<Object>} 智能体配置
   */
  async getAgentConfig(agentId) {
    try {
      const response = await agentService.getAgentConfig(agentId)
      console.log('获取智能体配置:', response)
      
      // 转换API数据格式，确保包含prologue字段
      const formattedResponse = {
        id: response.id,
        name: response.name,
        avatar: response.avatar,
        introduction: response.introduction,
        description: response.introduction, // 向后兼容
        prologue: response.config?.prologue || '您好，我是您的智能助手！',
        openingRemarks: response.config?.prologue || '您好，我是您的智能助手！', // 向后兼容
        presetQuestions: response.config?.predefined_questions || [],
        config: response.config,
        isOwnedByUser: response.is_owner || false, // 添加is_owner字段
        isAddedToUserAgents: response.is_owner || false // 如果是拥有者，则已添加到用户智能体
      }
      
      return formattedResponse
    } catch (error) {
      console.error('获取智能体配置失败:', error)
      throw error
    }
  }

  /**
   * 转换会话数据格式以适配UI组件
   * @param {Array} sessions - 原始会话数据，包含session_id, agent_id, session_name, agent_name, agent_avatar, created_at, updated_at
   * @returns {Array} 转换后的会话数据
   */
  formatSessionsForUI(sessions) {
    return sessions.map(session => ({
      id: session.session_id,
      agentId: session.agent_id,
      agentName: session.agent_name || '',  // 新接口已包含agent_name
      agentAvatar: session.agent_avatar || '', // 新接口已包含agent_avatar
      lastMessage: session.session_name || '新对话', // 使用session_name
      timestamp: new Date(session.updated_at || session.created_at), // 优先使用updated_at
      isActive: false
    }))
  }

  /**
   * 根据session_id获取会话历史消息
   * @param {string} sessionId - 会话ID
   * @returns {Promise<Array>} 历史消息数组
   */
  async getSessionMessages(sessionId) {
    try {
      const response = await sessionService.getSessionMessages(sessionId)
      
      if (!response.ok) {
        throw new Error('获取会话历史失败')
      }
      
      const messages = []
      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        
        const chunk = decoder.decode(value)
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.trim()) {
            // 处理新的流式格式: event: message_chunk
            if (line.startsWith('event: message_chunk')) {
              continue // 跳过事件行，处理下一行的data
            }
            
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.role && data.content) {
                  messages.push({
                    id: data.id || Date.now() + Math.random(),
                    content: data.content.content || data.content,
                    isUser: data.role === 'user'
                  })
                }
              } catch (e) {
                console.log('解析历史消息数据失败:', e)
              }
            }
          }
        }
      }
      
      console.log('获取会话历史消息:', messages)
      return messages
    } catch (error) {
      console.error('获取会话历史消息失败:', error)
      return []
    }
  }

  /**
   * 根据agent_id获取智能体信息并更新会话数据
   * @param {Array} sessions - 会话数组
   * @param {string} currentAgentId - 当前智能体ID
   * @returns {Promise<Object>} 当前智能体信息
   */
  async loadAgentInfoForSessions(sessions, currentAgentId) {
    try {
      // 获取当前智能体的详细信息
      const agentInfo = await this.getAgentConfig(currentAgentId)
      
      // 更新包含相同agent_id的会话信息
      sessions.forEach(session => {
        if (session.agentId === currentAgentId) {
          session.agentName = agentInfo.name
          session.agentAvatar = agentInfo.avatar
        }
      })
      console.log(agentInfo, 'agentInfo ////')
      return agentInfo
    } catch (error) {
      console.error('加载智能体信息失败:', error)
      throw error
    }
  }

  /**
   * 初始化聊天页面的完整逻辑
   * @param {Object} options - 初始化选项
   * @param {string} options.agentId - 智能体ID
   * @param {Object} options.initialMessage - 来自其他页面的初始消息
   * @param {string} options.sessionId - 预设的会话ID（如果有）
   * @param {boolean} options.debug - 是否为调试模式
   * @returns {Promise<Object>} 初始化结果
   */
  async initializeChatPage(options = {}) {
    const { agentId, initialMessage, sessionId, debug = false } = options

    if (!agentId) {
      throw new Error('agentId is required')
    }

    // 防止重复初始化
    if (this.isInitialized && this.currentAgentId === agentId) {
      return {
        success: true,
        message: 'Already initialized',
        skipInitialization: true
      }
    }

    // 如果正在初始化，等待之前的初始化完成
    if (this.initializingPromise) {
      return await this.initializingPromise
    }

    // 创建初始化Promise
    this.initializingPromise = this._performInitialization({
      agentId,
      initialMessage,
      sessionId,
      debug
    })

    try {
      const result = await this.initializingPromise
      this.isInitialized = true
      this.currentAgentId = agentId
      return result
    } finally {
      this.initializingPromise = null
    }
  }

  /**
   * 执行实际的初始化逻辑
   * @private
   */
  async _performInitialization({ agentId, initialMessage, sessionId, debug }) {
    try {
      // 1. 获取用户所有会话列表
      const sessions = await this.getUserSessions()
      const formattedSessions = this.formatSessionsForUI(sessions)

      // 2. 处理会话创建和选择逻辑
      let currentSession = null
      let newSession = false

      if (sessionId) {
        // 如果指定了会话ID，查找对应会话
        currentSession = formattedSessions.find(s => s.id === sessionId)
        if (currentSession) {
          this.currentSessionId = sessionId
        }
      }

      if (!currentSession && (initialMessage || formattedSessions.length === 0)) {
        // 需要创建新会话的情况：
        // 1. 有初始消息
        // 2. 没有现有会话
        const sessionData = await this.createSession(agentId, debug)
        this.currentSessionId = sessionData.session_id
        newSession = true

        // 创建新的会话记录
        const newConversation = {
          id: sessionData.session_id,
          agentId: agentId,
          agentName: '', // 稍后根据agent_id获取
          agentAvatar: '', // 稍后根据agent_id获取
          lastMessage: initialMessage?.content || '新对话',
          timestamp: new Date(),
          isActive: true
        }

        // 添加到会话列表开头
        formattedSessions.unshift(newConversation)
        currentSession = newConversation
      } else if (!currentSession) {
        // 没有指定sessionId且没有初始消息时，创建新会话使用传入的agentId
        const sessionData = await this.createSession(agentId, debug)
        this.currentSessionId = sessionData.session_id
        newSession = true

        // 创建新的会话记录
        const newConversation = {
          id: sessionData.session_id,
          agentId: agentId,
          agentName: '', 
          agentAvatar: '', 
          lastMessage: '新对话',
          timestamp: new Date(),
          isActive: true
        }

        // 添加到会话列表开头
        formattedSessions.unshift(newConversation)
        currentSession = newConversation
      }

      // 3. 根据当前会话的agent_id获取智能体信息
      let agentInfo = null
      if (currentSession) {
        agentInfo = await this.loadAgentInfoForSessions(formattedSessions, currentSession.agentId)
      }

      // 4. 根据当前会话的session_id获取历史消息
      let messages = []
      if (currentSession && !newSession) {
        messages = await this.getSessionMessages(currentSession.id)
      }

      return {
        success: true,
        agentInfo,
        sessions: formattedSessions,
        currentSession,
        currentSessionId: this.currentSessionId,
        initialMessage,
        newSession,
        messages
      }
    } catch (error) {
      console.error('聊天页面初始化失败:', error)
      throw error
    }
  }

  /**
   * 创建会话并导航到聊天页面
   * @param {string} agentId - 智能体ID
   * @param {Object} router - Vue Router实例
   * @param {Object} options - 额外选项
   */
  async createSessionAndNavigate(agentId, router, options = {}) {
    try {
      const { debug = false, initialMessage } = options

      // 创建新会话
      const sessionData = await this.createSession(agentId, debug)
      
      // 构建导航参数
      const routeParams = {
        path: `/chat/${agentId}`,
        query: {
          sessionId: sessionData.session_id
        }
      }

      // 如果有初始消息，通过路由状态传递
      if (initialMessage) {
        routeParams.state = { initialMessage }
      }

      // 跳转到聊天页面
      router.push(routeParams)
      
      return sessionData
    } catch (error) {
      console.error('创建会话并导航失败:', error)
      throw error
    }
  }
}

// 创建单例实例
export const chatInitializer = new ChatInitializer()

// 导出工具函数
export default chatInitializer