import { storageManager } from './mockData.js'
import { agentTemplates } from './agentTemplates.js'
import dayjs from 'dayjs'

// 模拟延迟
const delay = (ms = 300) => new Promise(resolve => setTimeout(resolve, ms))

// 生成唯一ID
const generateId = (prefix) => `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

// 模拟用户服务
export const mockUserService = {
  async register(userData) {
    await delay()
    const users = storageManager.getUsers()
    
    // 检查用户名是否已存在
    if (users.find(u => u.username === userData.username)) {
      throw new Error('用户名已存在')
    }
    
    const newUser = {
      id: generateId('user'),
      ...userData,
      avatar: userData.avatar || '👤',
      created_at: dayjs().toISOString()
    }
    
    users.push(newUser)
    storageManager.setUsers(users)
    storageManager.setCurrentUser(newUser)
    
    return {
      success: true,
      message: '注册成功',
      user: newUser
    }
  },

  async login(credentials) {
    await delay()
    const users = storageManager.getUsers()
    const user = users.find(u => 
      u.username === credentials.username && 
      u.password === credentials.password
    )
    
    if (!user) {
      throw new Error('用户名或密码错误')
    }
    
    storageManager.setCurrentUser(user)
    
    return {
      success: true,
      message: '登录成功',
      user: {
        id: user.id,
        username: user.username,
        nikename: user.nikename,
        avatar: user.avatar
      }
    }
  },

  async logout() {
    await delay(100)
    storageManager.setCurrentUser(null)
    return {
      success: true,
      message: '已退出登录'
    }
  },

  getCurrentUser() {
    return storageManager.getCurrentUser()
  }
}

// 模拟智能体服务
export const mockAgentService = {
  async create(agentData) {
    await delay(800) // 增加延迟模拟真实API
    const currentUser = storageManager.getCurrentUser()
    if (!currentUser) {
      throw new Error('请先登录')
    }
    
    let agentConfig = {}
    
    // 如果是从创建页面来的（有targetAudience等表单字段）
    if (agentData.targetAudience && agentData.mainStyle) {
      agentConfig = agentTemplates.generateAgentConfig(agentData)
    } 
    // 如果是一句话生成（有prompt字段）
    else if (agentData.prompt) {
      agentConfig = this.generateAgentFromPrompt(agentData)
    } 
    // 直接传入配置
    else {
      agentConfig = agentData
    }
    
    const agents = storageManager.getAgents()
    const newAgent = {
      id: generateId('agent'),
      ...agentConfig,
      owner_id: currentUser.id,
      is_public: agentConfig.is_public || false,
      is_admin: false,
      created_at: dayjs().toISOString(),
      updated_at: dayjs().toISOString()
    }
    
    agents.push(newAgent)
    storageManager.setAgents(agents)
    
    // 返回符合原始API格式的响应
    return {
      config: newAgent
    }
  },

  // 根据用户输入的prompt生成智能体配置
  generateAgentFromPrompt(agentData) {
    const prompt = agentData.prompt.toLowerCase()
    
    // 根据关键词分析生成不同的智能体
    let generatedConfig = {
      agent_type: agentData.agent_type || 'roleplay',
      avatar: '🤖' // 默认头像
    }
    
    // 历史人物相关
    if (prompt.includes('李白') || prompt.includes('诗仙')) {
      generatedConfig = {
        name: '李白诗仙',
        avatar: '📜',
        design: '我是唐代浪漫主义诗人李白，字太白，号青莲居士。我性格豪放洒脱，热爱自然，诗风飘逸奔放，想象瑰丽。',
        prologue: '在下李白，有酒诗自成！举杯邀明月，对影成三人。今日有缘相见，不如共饮一杯如何？',
        agent_type: 'roleplay'
      }
    } else if (prompt.includes('杜甫') || prompt.includes('诗圣')) {
      generatedConfig = {
        name: '杜甫诗圣',
        avatar: '🎭',
        design: '我是唐代现实主义诗人杜甫，字子美，自号少陵野老。我的诗作关注民生疾苦，诗风沉郁顿挫，被誉为"诗圣"。',
        prologue: '老夫杜甫，字子美。安史之乱后，见证了太多民生疾苦。愿以诗为史，记录这个时代的真实。',
        agent_type: 'roleplay'
      }
    } 
    // 技术相关
    else if (prompt.includes('python') || prompt.includes('编程') || prompt.includes('代码')) {
      generatedConfig = {
        name: 'Python编程助手',
        avatar: '🐍',
        design: '我是专业的Python编程助手，精通Python语言及其生态系统。可以帮助解决编程问题、代码优化、框架使用等技术难题。',
        prologue: '你好！我是Python编程助手。无论是语法问题、算法实现还是框架使用，我都可以帮助你。让我们一起编写优雅的Python代码！',
        agent_type: 'assistant'
      }
    } else if (prompt.includes('前端') || prompt.includes('vue') || prompt.includes('react') || prompt.includes('javascript')) {
      generatedConfig = {
        name: '前端开发专家',
        avatar: '💻',
        design: '我是前端开发专家，精通JavaScript、Vue、React等现代前端技术栈。能够帮助解决前端开发中的各种技术问题。',
        prologue: '嗨！我是前端开发专家。无论你遇到什么前端技术难题，从基础的HTML/CSS到高级的框架应用，我都能为你提供专业的解决方案！',
        agent_type: 'assistant'
      }
    }
    // 教育相关
    else if (prompt.includes('老师') || prompt.includes('教学') || prompt.includes('学习')) {
      generatedConfig = {
        name: '智能学习导师',
        avatar: '👨‍🏫',
        design: '我是智能学习导师，擅长个性化教学和学习指导。我会根据你的学习需求和风格，提供最适合的学习方案和知识讲解。',
        prologue: '你好！我是你的学习导师。无论你想学习什么知识，我都会用最适合你的方式来教授。让我们一起开启愉快的学习之旅！',
        agent_type: 'assistant'
      }
    }
    // 健康相关
    else if (prompt.includes('健康') || prompt.includes('医生') || prompt.includes('养生')) {
      generatedConfig = {
        name: '健康生活顾问',
        avatar: '🏥',
        design: '我是健康生活顾问，专注于健康知识普及和生活方式指导。我会为你提供科学的健康建议，帮助你维持良好的身心状态。',
        prologue: '你好！我是你的健康生活顾问。健康是最大的财富，让我帮助你建立健康的生活习惯，享受高质量的生活！',
        agent_type: 'assistant'
      }
    }
    // 心理相关
    else if (prompt.includes('心理') || prompt.includes('情感') || prompt.includes('陪伴')) {
      generatedConfig = {
        name: '心灵陪伴师',
        avatar: '💝',
        design: '我是温暖的心灵陪伴师，善于倾听和理解。我会陪伴你度过人生的各种时刻，提供情感支持和心理疏导。',
        prologue: '你好，很高兴遇见你。我是你的心灵陪伴师，无论你现在的心情如何，我都愿意静静倾听你的故事，陪伴你度过每一个时刻。',
        agent_type: 'roleplay'
      }
    }
    // 创意相关
    else if (prompt.includes('创意') || prompt.includes('设计') || prompt.includes('艺术')) {
      generatedConfig = {
        name: '创意设计师',
        avatar: '🎨',
        design: '我是创意设计师，拥有敏锐的艺术直觉和丰富的设计经验。我能帮你激发创意灵感，提供专业的设计建议和创作指导。',
        prologue: '你好！我是创意设计师。创意无处不在，让我们一起探索无限的可能性，将想象力转化为令人惊艳的作品！',
        agent_type: 'creator'
      }
    }
    // 商务相关
    else if (prompt.includes('商务') || prompt.includes('商业') || prompt.includes('管理') || prompt.includes('投资')) {
      generatedConfig = {
        name: '商业策略顾问',
        avatar: '💼',
        design: '我是资深商业策略顾问，拥有丰富的商业分析和管理经验。我能为你提供专业的商业建议、市场分析和战略规划。',
        prologue: '您好！我是商业策略顾问。在这个瞬息万变的商业世界中，让我为您提供专业的洞察和战略指导，助您在商海中乘风破浪！',
        agent_type: 'assistant'
      }
    }
    // 默认情况 - 通用助手
    else {
      // 基于prompt内容生成个性化的通用助手
      const promptLength = prompt.length
      const avatars = ['🤖', '🧠', '✨', '🎯', '🌟', '🚀', '💡', '🎪']
      const avatar = avatars[promptLength % avatars.length]
      
      generatedConfig = {
        name: '智能助手',
        avatar: avatar,
        design: `我是根据你的需求"${agentData.prompt}"定制的智能助手。我会尽我所能帮助你解决相关问题，提供有用的建议和支持。`,
        prologue: `你好！我是专门为你创建的智能助手。你提到了"${agentData.prompt}"，让我来帮助你处理相关的事务吧！`,
        agent_type: 'assistant'
      }
    }
    
    return generatedConfig
  },

  // 获取推荐的智能体模板
  async getRecommendedTemplates() {
    await delay(200)
    return agentTemplates.getRecommendedAgents()
  },

  // 根据参数生成智能体配置（用于预览）
  async generateAgentPreview(formData) {
    await delay(500)
    return agentTemplates.generateAgentConfig(formData)
  },

  async getMyAgents() {
    await delay()
    const currentUser = storageManager.getCurrentUser()
    if (!currentUser) {
      return []
    }
    
    const agents = storageManager.getAgents()
    return agents.filter(agent => agent.owner_id === currentUser.id)
  },

  async getAgentConfig(agentId) {
    await delay()
    const agents = storageManager.getAgents()
    const agent = agents.find(a => a.id === agentId)
    
    if (!agent) {
      throw new Error('智能体不存在')
    }
    
    return agent
  },

  async updateAgent(agentData) {
    await delay()
    const agents = storageManager.getAgents()
    
    // 根据agent_id查找智能体
    const agentId = agentData.agent_id || agentData.id
    const index = agents.findIndex(a => a.id === agentId)
    
    if (index === -1) {
      throw new Error('智能体不存在')
    }
    
    // 更新智能体配置，保持原有字段并更新新字段
    const updatedAgent = {
      ...agents[index],
      name: agentData.name || agents[index].name,
      avatar: agentData.avatar || agents[index].avatar,
      design: agentData.introduction || agentData.design || agents[index].design,
      prologue: agentData.config?.prologue || agents[index].prologue,
      is_public: agentData.is_public !== undefined ? agentData.is_public : agents[index].is_public,
      updated_at: dayjs().toISOString(),
      
      // 扩展配置字段
      voice: agentData.config?.voice || agents[index].voice,
      audience_age: agentData.config?.audience_age || agents[index].audience_age,
      content_complexity: agentData.config?.content_complexity || agents[index].content_complexity,
      main_style: agentData.config?.main_style || agents[index].main_style,
      auxiliary_traits: agentData.config?.auxiliary_traits || agents[index].auxiliary_traits,
      predefined_questions: agentData.config?.predefined_questions || agents[index].predefined_questions
    }
    
    agents[index] = updatedAgent
    storageManager.setAgents(agents)
    
    console.log('智能体更新成功:', updatedAgent)
    return updatedAgent
  },

  async deleteAgent(agentId) {
    await delay()
    const agents = storageManager.getAgents()
    const filteredAgents = agents.filter(a => a.id !== agentId)
    
    if (agents.length === filteredAgents.length) {
      throw new Error('智能体不存在')
    }
    
    storageManager.setAgents(filteredAgents)
    return {
      success: true,
      message: '删除成功'
    }
  },

  async getPublicAgents(agentType) {
    await delay()
    const agents = storageManager.getAgents()
    let publicAgents = agents.filter(a => a.is_public)
    
    if (agentType && agentType !== 'all') {
      publicAgents = publicAgents.filter(a => a.agent_type === agentType)
    }
    
    return publicAgents
  },

  async getAdminAgents() {
    await delay()
    const agents = storageManager.getAgents()
    return agents.filter(a => a.is_admin)
  },

  async copyAgent(agentId) {
    await delay()
    const currentUser = storageManager.getCurrentUser()
    if (!currentUser) {
      throw new Error('请先登录')
    }
    
    const agents = storageManager.getAgents()
    const sourceAgent = agents.find(a => a.id === agentId)
    
    if (!sourceAgent) {
      throw new Error('源智能体不存在')
    }
    
    const newAgent = {
      ...sourceAgent,
      id: generateId('agent'),
      name: `${sourceAgent.name} - 副本`,
      owner_id: currentUser.id,
      is_public: false,
      is_admin: false,
      created_at: dayjs().toISOString(),
      updated_at: dayjs().toISOString()
    }
    
    agents.push(newAgent)
    storageManager.setAgents(agents)
    
    return {
      success: true,
      agent: newAgent
    }
  }
}

// 模拟会话服务
export const mockSessionService = {
  async create(sessionData) {
    await delay()
    const currentUser = storageManager.getCurrentUser()
    if (!currentUser) {
      throw new Error('请先登录')
    }
    
    const agents = storageManager.getAgents()
    const agent = agents.find(a => a.id === sessionData.agent_id)
    
    if (!agent) {
      throw new Error('智能体不存在')
    }
    
    const sessions = storageManager.getSessions()
    
    // 根据sessionData的结构调整会话创建逻辑
    const initialMessages = []
    
    // 如果智能体有开场白，添加为助手消息
    if (agent.prologue) {
      initialMessages.push({ 
        role: 'assistant', 
        content: agent.prologue 
      })
    }
    
    // 如果有提供的初始消息，添加到消息列表
    if (sessionData.messages && sessionData.messages.length > 0) {
      initialMessages.push(...sessionData.messages)
    }
    
    const sessionId = generateId('session')
    const newSession = {
      id: sessionId,
      session_id: sessionId, // 确保两个字段一致
      session_name: sessionData.session_name || `与${agent.name}的对话`,
      agent_id: agent.id,
      agent_name: agent.name,
      agent_avatar: agent.avatar,
      user_id: currentUser.id,
      debug: sessionData.debug || false,
      messages: initialMessages,
      created_at: dayjs().toISOString(),
      updated_at: dayjs().toISOString()
    }
    
    sessions.push(newSession)
    storageManager.setSessions(sessions)
    
    console.log('创建会话成功:', newSession)
    
    return {
      session_id: newSession.id,
      session_name: newSession.session_name
    }
  },

  async deleteSession(sessionId) {
    await delay()
    const sessions = storageManager.getSessions()
    const filteredSessions = sessions.filter(s => s.id !== sessionId)
    
    if (sessions.length === filteredSessions.length) {
      throw new Error('会话不存在')
    }
    
    storageManager.setSessions(filteredSessions)
    return {
      success: true,
      message: '删除成功'
    }
  },

  async getMySessions() {
    await delay()
    const currentUser = storageManager.getCurrentUser()
    if (!currentUser) {
      return []
    }
    
    const sessions = storageManager.getSessions()
    return sessions
      .filter(s => s.user_id === currentUser.id)
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
  },

  async getSessionMessages(sessionId) {
    await delay()
    const sessions = storageManager.getSessions()
    const session = sessions.find(s => s.id === sessionId)
    
    if (!session) {
      throw new Error('会话不存在')
    }
    
    return session.messages || []
  },

  // 模拟流式对话
  async* chatStream(chatData) {
    const sessions = storageManager.getSessions()
    const session = sessions.find(s => s.id === chatData.session_id)
    
    if (!session) {
      throw new Error('会话不存在')
    }
    
    const agents = storageManager.getAgents()
    const agent = agents.find(a => a.id === session.agent_id)
    
    // 保存用户消息
    const userMessage = chatData.messages[chatData.messages.length - 1]
    session.messages.push(userMessage)
    
    // 生成AI回复
    const responses = this.generateResponse(agent, userMessage.content)
    const fullResponse = responses.join('')
    
    // 逐字流式输出
    for (const chunk of responses) {
      await delay(50)
      yield {
        event: 'message_chunk',
        data: { content: chunk }
      }
    }
    
    // 保存AI回复
    session.messages.push({
      role: 'assistant',
      content: fullResponse
    })
    
    session.updated_at = dayjs().toISOString()
    storageManager.setSessions(sessions)
    
    yield {
      event: 'message_end',
      data: { content: fullResponse }
    }
  },

  // 模拟调试模式流式对话
  async* chatStreamDebug(debugData) {
    // 使用提供的agent_config生成回复
    const responses = this.generateResponse(debugData.agent_config, debugData.messages[debugData.messages.length - 1].content)
    const fullResponse = responses.join('')
    
    for (const chunk of responses) {
      await delay(50)
      yield {
        event: 'message_chunk',
        data: { content: chunk }
      }
    }
    
    yield {
      event: 'message_end',
      data: { content: fullResponse }
    }
  },

  // 生成回复内容
  generateResponse(agent, userInput) {
    const responses = {
      '李白诗人': [
        '哈哈，', '好问题！', '让我', '想想...', '\n\n',
        '若论', userInput.includes('诗') ? '诗词' : '此事', '，',
        '当真是', '妙不可言', '。',
        agent.agent_type === 'roleplay' ? '依我之见，' : '',
        '此中真意', '，须得', '细细品味', '方能', '领会', '。',
        '\n\n', '正如我曾', '言道：', '"人生', '得意', '须尽欢', '，',
        '莫使', '金樽', '空对月', '。"', 
        '人生', '短暂', '，当', '及时', '行乐', '啊！'
      ],
      'Python编程助手': [
        '关于', '您的问题', '，', '我来', '解释一下', '：\n\n',
        '这是一个', '很好的', '编程问题', '。',
        '在Python中', '，我们', '可以', '这样', '实现', '：\n\n',
        '```python\n',
        '# 示例代码\n',
        'def example():\n',
        '    return "Hello World"\n',
        '```\n\n',
        '这种方法', '的优点是', '简洁', '高效', '，',
        '希望', '对您', '有所', '帮助', '！'
      ],
      default: [
        '感谢', '您的', '提问', '！',
        '让我', '来', '为您', '解答', '：\n\n',
        '根据', '我的', '理解', '，',
        userInput.length > 10 ? userInput.substring(0, 10) + '...' : userInput,
        '这个问题', '很有', '意思', '。',
        '\n\n', '我的', '建议是', '：',
        '可以', '尝试', '从', '不同', '角度', '来', '思考', '这个', '问题', '。',
        '\n\n', '希望', '这个', '回答', '对您', '有所', '帮助', '！'
      ]
    }
    
    return responses[agent.name] || responses.default
  }
}

// 模拟头像服务
export const mockAvatarService = {
  async create(avatarData) {
    await delay()
    // 模拟创建头像，返回一个emoji或URL
    const avatars = ['🎨', '🎭', '🎪', '🎯', '🎲', '🎸', '🎺', '🎻']
    return {
      success: true,
      avatar: avatars[Math.floor(Math.random() * avatars.length)]
    }
  },

  async upload(agentId, file) {
    await delay(500)
    // 模拟上传，实际使用FileReader读取并保存到localStorage
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        const agents = storageManager.getAgents()
        const agent = agents.find(a => a.id === agentId)
        
        if (agent) {
          agent.avatar = e.target.result // 保存为base64
          agent.updated_at = dayjs().toISOString()
          storageManager.setAgents(agents)
          resolve({
            success: true,
            avatar_url: e.target.result
          })
        } else {
          reject(new Error('智能体不存在'))
        }
      }
      reader.onerror = () => reject(new Error('文件读取失败'))
      reader.readAsDataURL(file)
    })
  }
}