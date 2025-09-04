<template>
  <div class="chat-list">
    <!-- 主要内容区域 - 侧边栏+内容区 -->
    <div class="main-content">
      <!-- 左侧对话列表 -->
      <div class="conversations-sidebar">
        <!-- 返回按钮和页面标题区域 -->
        <div class="sidebar-header">
          <BackButton class="sidebar-back-btn" @click="handleGoBack" />
          <h1 class="page-title">{{ UI_TEXT.TITLE }}</h1>
        </div>
        
        <div class="conversations-header">
          <div class="conversations-title-with-line">
            <span class="conversations-title">选择您的AI角色</span>
          </div>
        </div>
        
        <div class="conversations-list">
          <div 
            v-for="conversation in conversations" 
            :key="conversation.id"
            class="conversation-item"
            :class="{ 'conversation-item--active': conversation.isActive }"
            @click="handleConversationClick(conversation)"
          >
            <div class="conversation-avatar">
              <!-- 如果是URL图片则显示图片，否则显示emoji/文字 -->
              <img 
                v-if="isImageUrl(formatAvatarUrl(conversation.agentAvatar))" 
                :src="formatAvatarUrl(conversation.agentAvatar)" 
                :alt="conversation.agentName + '的头像'"
                class="avatar-image"
                @error="handleAvatarError"
              />
              <span v-else>{{ getDisplayAvatar(conversation.agentAvatar) }}</span>
            </div>
            <div class="conversation-content">
              <div class="conversation-name">{{ conversation.agentName }}</div>
              <div class="conversation-preview">{{ conversation.lastMessage }}</div>
            </div>
            <div class="conversation-time">
              {{ formatRelativeTime(conversation.timestamp) }}
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧聊天区域 -->
      <div class="chat-area">
        <!-- 顶部导航栏，包含智能体信息 -->
        <div class="top-nav-with-agent">
          <div class="nav-agent-info">
            <div class="agent-avatar-nav">
              <!-- 如果是URL图片则显示图片，否则显示emoji/文字 -->
              <img 
                v-if="isImageUrl(formatAvatarUrl(currentAgent.avatar))" 
                :src="formatAvatarUrl(currentAgent.avatar)" 
                :alt="currentAgent.name + '的头像'"
                class="avatar-image"
                @error="handleAvatarError"
              />
              <span v-else>{{ getDisplayAvatar(currentAgent.avatar) }}</span>
            </div>
            <div class="agent-details-nav">
              <h2 class="agent-name-nav">{{ currentAgent.name }}</h2>
              <a-popover 
                v-if="currentAgent.description && currentAgent.description.length > 60"
                :title="null"
                placement="bottom"
                :mouseEnterDelay="0.3"
                :mouseLeaveDelay="0.1"
                :overlayStyle="{ maxWidth: '690px' }"
              >
                <template #content>
                  <div class="description-popover-content">
                    {{ currentAgent.description }}
                  </div>
                </template>
                <p class="agent-description-nav ellipsis">{{ currentAgent.description }}</p>
              </a-popover>
              <p v-else class="agent-description-nav">{{ currentAgent.description }}</p>
            </div>
          </div>
          <div class="nav-actions">
            <button 
              v-if="currentAgent.isOwnedByUser"
              class="nav-btn secondary"
              @click="handleConfigAgent"
            >
              <img src="/images/avatars/configAgentIcon.png" class="nav-btn-icon" alt="配置智能体" />
              配置智能体
            </button>
            <button 
              v-else
              class="nav-btn secondary"
              @click="handleAddToUserAgents"
              :disabled="addingToUserAgents"
            >
              <span v-if="!addingToUserAgents" class="nav-btn-icon">➕</span>
              <span v-else class="nav-btn-loading">⏳</span>
              {{ addingToUserAgents ? '添加中...' : '添加到我的智能体' }}
            </button>
            <button class="nav-btn secondary">
              <img src="/images/avatars/sharedIcon.png" class="nav-btn-icon" alt="分享" />
              {{ UI_TEXT.NAV.SHARE }}
            </button>
          </div>
        </div>
        
        <!-- 智能体介绍卡片 -->
        <div class="agent-intro-section">
          <AgentIntroCard 
            :agent="agentForIntroCard"
            @question-click="handleQuestionClick"
          />
        </div>
        
        <!-- 对话区域 -->
        <ChatContainer
          :messages="chatMessages"
          :agent-avatar="currentAgent.avatar"
          :loading="chatLoading"
          placeholder="输入消息与智能体对话..."
          :show-clear-button="true"
          @send-message="handleSendMessage"
          @clear-conversation="handleClearConversation"
          @stop-request="handleStopRequest"
          ref="chatContainerRef"
          :showClearButton="true"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onActivated, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/index.js'
import ChatContainer from '@/components/ChatContainer'
import BackButton from '@/components/BackButton'
import AgentIntroCard from '@/views/SetupAgent/components/AgentIntroCard.vue'
import { formatAvatarUrl, isImageUrl } from '@/services/api.js'
import { sessionService, agentService } from '@/services'
import { message } from 'ant-design-vue'
import { cleanDescription } from '@/utils/agentParser.js'
import chatInitializer from '@/utils/chatInitializer.js'
import { UI_TEXT, SAMPLE_CONVERSATIONS, AGENT_INFO } from './constants.js'
import { 
  formatRelativeTime, 
  simulateAgentResponse, 
  getAgentInfo,
  addAgentToUserAgents,
  convertToSetupAgentFormat
} from './utils.js'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

// 对话列表数据
const conversations = ref([])

// 当前智能体信息
const currentAgent = reactive({
  id: 'default',
  name: '',
  avatar: '🤖',
  description: '',
  prologue: '',
  openingRemarks: '',
  presetQuestions: [],
  isOwnedByUser: false,
  isAddedToUserAgents: false
})

// 聊天相关状态
const chatMessages = ref([])
const chatLoading = ref(false)
const chatContainerRef = ref(null)

// 当前会话ID
const currentSessionId = ref(null)

// 其他状态
const addingToUserAgents = ref(false)
const loadingSessions = ref(false)

// 为AgentIntroCard组件格式化数据
const agentForIntroCard = computed(() => ({
  id: currentAgent.id,
  image: currentAgent.avatar,
  title: currentAgent.name,
  description: currentAgent.description,
  sampleQuestions: currentAgent.presetQuestions && currentAgent.presetQuestions.length > 0 
    ? currentAgent.presetQuestions 
    : AGENT_INFO.presetQuestions
}))

// 根据agentId加载智能体信息
const loadAgentInfo = async (agentId) => {
  try {
    const agentInfo = await getAgentInfo(agentId)
    Object.assign(currentAgent, agentInfo)
    console.log('加载智能体信息:', agentInfo)
  } catch (error) {
    console.error('加载智能体信息失败:', error)
  }
}


// 处理返回
const handleGoBack = () => {
  router.push('/agents')
}

// 处理配置智能体
const handleConfigAgent = () => {
  if (!currentAgent.id) return
  
  // 将智能体数据转换为SetupAgent页面格式，并通过路由状态传递
  const agentData = convertToSetupAgentFormat(currentAgent)
  router.push({
    path: '/setup-agent',
    query: { 
      agentId: currentAgent.id,
      mode: 'edit' 
    },
    state: { agentData }
  })
}


/**
 * 处理头像加载错误
 * @param {Event} event - 错误事件
 */
const handleAvatarError = (event) => {
  console.error('头像加载失败:', event.target.src)
  // 头像加载失败时隐藏图片，显示默认emoji
  event.target.style.display = 'none'
}

/**
 * 获取显示用的头像内容 - 如果是URL则显示默认emoji，否则显示原内容
 * @param {string} avatar - 头像内容
 * @returns {string} 显示用的头像内容
 */
const getDisplayAvatar = (avatar) => {
  if (!avatar) return '🤖'
  
  // 如果是URL路径（包含http、/或.，或者很长），显示默认emoji
  if (avatar.includes('http') || 
      avatar.includes('/') || 
      avatar.includes('.') ||
      avatar.length > 20 ||
      avatar.startsWith('static') ||
      avatar.includes('avatar')) {
    return '🤖'
  }
  
  // 否则显示原内容（emoji或短文字）
  return avatar
}

// 处理添加到我的智能体
const handleAddToUserAgents = async () => {
  if (!currentAgent.id || addingToUserAgents.value) return
  
  console.log('开始复制智能体流程，当前智能体ID:', currentAgent.id)
  console.log('当前智能体信息:', currentAgent)
  
  try {
    addingToUserAgents.value = true
    console.log('调用addAgentToUserAgents函数...')
    
    const result = await addAgentToUserAgents(currentAgent.id)
    console.log('addAgentToUserAgents返回结果:', result)
    
    // 复制成功后，使用新agent_id重新请求配置
    if (result && result.success && result.newAgentId) {
      console.log('✅ 复制成功！新智能体ID:', result.newAgentId)
      
      // 使用新的agent_id直接调用agentService.getAgentConfig获取最新配置
      console.log('正在获取新智能体配置...')
      const newAgentResponse = await agentService.getAgentConfig(result.newAgentId)
      console.log('✅ 新智能体配置响应:', newAgentResponse)
      
      // 转换新智能体配置并应用到当前会话
      const newAgentInfo = {
        id: newAgentResponse.id,
        name: newAgentResponse.name || '智能体',
        avatar: formatAvatarUrl(newAgentResponse.avatar) || '🤖',
        description: newAgentResponse.introduction || '智能助手',
        prologue: newAgentResponse.config?.prologue || '您好，我是您的智能助手！',
        openingRemarks: newAgentResponse.config?.prologue || '您好，我是您的智能助手！',
        presetQuestions: newAgentResponse.config?.predefined_questions || [],
        isOwnedByUser: newAgentResponse.is_owner || false, // 使用新智能体的is_owner
        isAddedToUserAgents: newAgentResponse.is_owner || false,
        // 保留其他可能需要的字段
        backgroundSetting: newAgentResponse.introduction || '',
        voice: newAgentResponse.config?.voice || 'male-cantonese-deep',
        design: newAgentResponse.config?.design || ''
      }
      
      console.log('转换后的新智能体信息:', newAgentInfo)
      console.log('新智能体is_owner值:', newAgentResponse.is_owner)
      
      // 用新智能体配置完全覆盖当前智能体信息
      Object.assign(currentAgent, newAgentInfo)
      
      console.log('✅ 新智能体配置已应用到当前会话')
      console.log('更新后的currentAgent:', currentAgent)
      
      // 显示成功提示
      message.success('智能体已成功添加到我的智能体')
    } else {
      console.error('❌ 复制结果异常:', result)
      throw new Error('复制智能体返回结果异常')
    }
    
  } catch (error) {
    console.error('❌ 复制智能体或获取配置失败:', error)
    message.error('添加智能体失败，请重试')
  } finally {
    addingToUserAgents.value = false
    console.log('复制流程结束，loading状态已重置')
  }
}

// 处理对话点击
const handleConversationClick = async (conversation) => {
  try {
    // 取消之前选中的对话
    conversations.value.forEach(conv => {
      conv.isActive = false
    })
    
    // 设置当前选中的对话
    conversation.isActive = true
    
    // 如果是临时会话，不设置currentSessionId
    if (conversation.isTemporary) {
      currentSessionId.value = null
    } else {
      currentSessionId.value = conversation.id
    }
    
    // 根据会话的agent_id获取智能体信息
    const agentConfig = await agentService.getAgentConfig(conversation.agentId)
    const agentInfo = {
      id: agentConfig.id,
      name: agentConfig.name,
      avatar: agentConfig.avatar,
      description: agentConfig.introduction,
      prologue: agentConfig.config?.prologue || '您好，我是您的智能助手！',
      openingRemarks: agentConfig.config?.prologue || '您好，我是您的智能助手！',
      presetQuestions: agentConfig.config?.predefined_questions || [],
      isOwnedByUser: agentConfig.is_owner || false,
      isAddedToUserAgents: agentConfig.is_owner || false
    }
    Object.assign(currentAgent, agentInfo)
    
    // 如果不是临时会话，获取历史消息
    if (!conversation.isTemporary) {
      const messages = await getSessionMessages(conversation.id)
      
      if (messages.length > 0) {
        chatMessages.value = messages
      } else {
        // 如果没有历史消息，显示智能体的开场白
        chatMessages.value = [{
          id: Date.now(),
          content: agentInfo.prologue || agentInfo.openingRemarks || '你好！',
          isUser: false
        }]
      }
    } else {
      // 临时会话显示智能体的开场白
      chatMessages.value = [{
        id: Date.now(),
        content: agentInfo.prologue || agentInfo.openingRemarks || '你好！',
        isUser: false
      }]
    }
    
  } catch (error) {
    console.error('切换会话失败:', error)
  }
}


// 处理问题点击
const handleQuestionClick = (question) => {
  handleSendMessage({ content: question })
}

// 处理发送消息
const handleSendMessage = async (payload) => {
  const message = payload.content
  if (!message.trim()) return

  // 检查是否是临时会话，如果是则需要先创建真实会话
  if (!currentSessionId.value || (currentSessionId.value && currentSessionId.value.toString().startsWith('temp_'))) {
    try {
      // 创建真实会话
      const sessionData = await sessionService.create({
        agent_id: currentAgent.id,
        debug: false,
        messages: [{
          role: 'user',
          content: message
        }]
      })

      console.log('创建新会话成功:', sessionData)
      currentSessionId.value = sessionData.session_id

      // 更新临时会话为真实会话
      const tempConversation = conversations.value.find(conv => conv.isTemporary && conv.agentId === currentAgent.id)
      if (tempConversation) {
        tempConversation.id = sessionData.session_id
        tempConversation.isTemporary = false
        tempConversation.lastMessage = message
        tempConversation.timestamp = new Date()
        
        // 重新按时间排序，确保新会话在最前面
        conversations.value.sort((a, b) => {
          const timeA = new Date(a.timestamp).getTime()
          const timeB = new Date(b.timestamp).getTime()
          return timeB - timeA
        })
      }

    } catch (error) {
      console.error('创建会话失败:', error)
      // 使用ant-design-vue的message组件显示错误
      const { message: antMessage } = await import('ant-design-vue')
      antMessage.error('创建会话失败，请重试')
      return
    }
  }
  
  // 添加用户消息
  const userMessage = {
    id: Date.now(),
    content: message,
    isUser: true
  }
  chatMessages.value.push(userMessage)
  
  // 滚动到底部
  await nextTick()
  scrollToBottom()
  
  // 调用智能体对话API
  chatLoading.value = true
  try {
    // 根据接口文档要求构建消息数组
    let messages = []
    
    // 检查是否是首次对话（只有一条用户消息且前面有智能体开场白）
    const isFirstConversation = chatMessages.value.length === 2 && 
                               !chatMessages.value[0].isUser && 
                               chatMessages.value[1].isUser
    
    if (isFirstConversation) {
      // 首次对话：包含开场白和用户消息
      messages = [
        {
          role: 'assistant',
          content: chatMessages.value[0].content // 开场白
        },
        {
          role: 'user', 
          content: message // 用户最新消息
        }
      ]
    } else {
      // 后续对话：只发送用户最新消息
      messages = [
        {
          role: 'user',
          content: message
        }
      ]
    }
    
    const response = await sessionService.chatStream({
      session_id: currentSessionId.value,
      messages: messages
    })
    
    if (!response.ok) {
      throw new Error('发送消息失败')
    }
    
    // 处理流式响应
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    
    // 创建assistant消息 - 使用reactive确保响应式更新
    const assistantMessage = reactive({
      id: Date.now() + 1,
      content: '',
      isUser: false
    })
    chatMessages.value.push(assistantMessage)
    
    // 立即滚动到新消息位置
    await nextTick()
    scrollToBottom()
    
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
                
                if (data.finish_reason === '__END__') {
                  console.log('流式响应结束')
                  isFinished = true
                  break
                } else if (data.content) {
                  // 直接更新assistant消息内容，实现流式效果
                  assistantMessage.content += data.content
                  
                  // 强制触发Vue组件的重新渲染以立即显示新内容
                  // 使用$forceUpdate()确保立即更新，但这可能有性能影响
                  // 更好的方法是确保Vue的响应式系统正常工作
                  
                  // 非阻塞滚动
                  requestAnimationFrame(() => {
                    scrollToBottom()
                  })
                }
                
                if (data.error) {
                  console.error('流式响应中的错误:', data.error)
                  throw new Error(data.error)
                }
              } catch (e) {
                console.warn('解析流式响应数据失败:', e, '原始行:', line)
              }
            }
          }
        }
      }
    } finally {
      reader.releaseLock()
    }
    
  } catch (error) {
    console.error('获取回复失败:', error)
    // 出错时添加错误消息
    chatMessages.value.push({
      id: Date.now() + 2,
      content: '抱歉，我现在无法回复您的消息，请稍后再试。',
      isUser: false
    })
    await nextTick()
    scrollToBottom()
  } finally {
    chatLoading.value = false
  }
}

// 处理清除对话
const handleClearConversation = () => {
  chatMessages.value = [
    {
      id: Date.now(),
      content: currentAgent.prologue || currentAgent.openingRemarks || '您好，我是您的智能助手！',
      isUser: false
    }
  ]
}

// 处理停止请求
const handleStopRequest = () => {
  chatLoading.value = false
  console.log('停止生成回复')
  // 这里可以添加实际的停止API调用逻辑
}

// 同步全局loading状态
const syncGlobalLoadingState = () => {
  // 如果chat页面的loading状态改变，同步到全局
  watch(chatLoading, (newValue) => {
    appStore.setLoading(newValue)
  })
}

// 创建新的对话记录
const createNewConversation = (initialMessage) => {
  // 取消之前选中的对话
  conversations.value.forEach(conv => {
    conv.isActive = false
  })
  
  // 创建新的对话记录
  const newConversation = {
    id: `conv_${Date.now()}`,
    agentId: currentAgent.id,
    agentName: currentAgent.name,
    agentAvatar: currentAgent.avatar,
    lastMessage: initialMessage.content,
    timestamp: new Date(),
    isActive: true
  }
  
  // 添加到对话列表的开头
  conversations.value.unshift(newConversation)
}

// 开始与消息的对话
const startConversationWithMessage = async (initialMessage) => {
  // 清空当前聊天消息
  chatMessages.value = []
  
  // 添加用户消息
  chatMessages.value.push({
    id: Date.now(),
    content: initialMessage.content,
    isUser: true
  })
  
  // 滚动到底部
  await nextTick()
  scrollToBottom()
  
  // 模拟智能体回复
  chatLoading.value = true
  try {
    const response = await simulateAgentResponse(initialMessage.content, currentAgent)
    chatMessages.value.push({
      id: Date.now() + 1,
      content: response,
      isUser: false
    })
    
    await nextTick()
    scrollToBottom()
  } catch (error) {
    console.error('获取回复失败:', error)
  } finally {
    chatLoading.value = false
  }
}

// 滚动到聊天底部
const scrollToBottom = () => {
  if (chatContainerRef.value) {
    chatContainerRef.value.scrollToBottom()
  }
}

// 获取会话历史消息的辅助方法
const getSessionMessages = async (sessionId) => {
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
          if (line.startsWith('event: message_chunk')) {
            continue
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
    
    return messages
  } catch (error) {
    console.error('获取会话历史消息失败:', error)
    return []
  }
}

// 统一的初始化方法
const initializePage = async (agentId) => {
  if (!agentId) return
  
  try {
    // 同步全局loading状态
    syncGlobalLoadingState()
    
    // 1. 获取用户所有会话列表
    const sessions = await sessionService.getMySessions()
    const formattedSessions = sessions.map(session => ({
      id: session.session_id,
      agentId: session.agent_id,
      agentName: session.agent_name || '',
      agentAvatar: session.agent_avatar || '',
      lastMessage: session.session_name || '新对话',
      timestamp: new Date(session.updated_at || session.created_at),
      isActive: false,
      isTemporary: false // 标记为真实会话
    }))
    
    // 2. 获取智能体配置信息
    const agentConfig = await agentService.getAgentConfig(agentId)
    const agentInfo = {
      id: agentConfig.id,
      name: agentConfig.name,
      avatar: agentConfig.avatar,
      description: agentConfig.introduction,
      prologue: agentConfig.config?.prologue || '您好，我是您的智能助手！',
      openingRemarks: agentConfig.config?.prologue || '您好，我是您的智能助手！',
      presetQuestions: agentConfig.config?.predefined_questions || [],
      isOwnedByUser: agentConfig.is_owner || false,
      isAddedToUserAgents: agentConfig.is_owner || false
    }
    
    // 3. 检查是否有指定的sessionId
    let activeSession = null
    if (route.query.sessionId) {
      activeSession = formattedSessions.find(s => s.id === route.query.sessionId)
      if (activeSession) {
        activeSession.isActive = true
        currentSessionId.value = route.query.sessionId
      }
    }
    
    // 4. 如果没有指定sessionId或找不到对应会话，创建一个临时会话
    if (!activeSession) {
      const tempSession = {
        id: `temp_${Date.now()}`,
        agentId: agentId,
        agentName: agentInfo.name,
        agentAvatar: agentInfo.avatar,
        lastMessage: '新对话',
        timestamp: new Date(),
        isActive: true,
        isTemporary: true // 标记为临时会话
      }
      formattedSessions.unshift(tempSession)
      activeSession = tempSession
      currentSessionId.value = null // 临时会话没有真实的sessionId
    }
    
    // 5. 按时间排序：最新的在前面
    const sortedSessions = [...formattedSessions].sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime()
      const timeB = new Date(b.timestamp).getTime()
      return timeB - timeA
    })
    
    // 6. 更新组件状态
    Object.assign(currentAgent, agentInfo)
    conversations.value = sortedSessions
    
    // 7. 处理消息显示逻辑
    if (history.state?.initialMessage) {
      // 有初始消息时，显示初始消息（但不发送）
      chatMessages.value = [{
        id: Date.now(),
        content: history.state.initialMessage.content,
        isUser: true,
        isPending: true // 标记为待发送
      }]
    } else if (activeSession && !activeSession.isTemporary) {
      // 如果是真实会话，获取历史消息
      const messages = await getSessionMessages(activeSession.id)
      if (messages.length > 0) {
        chatMessages.value = messages
      } else {
        // 显示智能体开场白
        chatMessages.value = [{
          id: Date.now(),
          content: agentInfo.prologue || agentInfo.openingRemarks,
          isUser: false
        }]
      }
    } else {
      // 临时会话显示智能体开场白
      chatMessages.value = [{
        id: Date.now(),
        content: agentInfo.prologue || agentInfo.openingRemarks,
        isUser: false
      }]
    }
    
  } catch (error) {
    console.error('页面初始化失败:', error)
  }
}

// 监听路由变化，加载对应的智能体信息
watch(() => route.params.agentId, async (newAgentId, oldAgentId) => {
  // 只有当agentId真正发生变化时才重新初始化
  if (newAgentId && newAgentId !== oldAgentId) {
    // 清空当前聊天消息
    chatMessages.value = []
    
    // 重新初始化
    await initializePage(newAgentId)
  }
}, { immediate: false })

// 初始化
onMounted(async () => {
  await initializePage(route.params.agentId)
})
</script>

<style lang="scss" scoped>
.chat-list {
  height: 100vh;
  background: #F3F8FF;
  overflow: hidden;

  .main-content {
    display: flex;
    height: 100%;
  }

  .conversations-sidebar {
    width: 320px;
    flex-shrink: 0;
    background: white;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-right: 1px solid #f0f0f0;

    .sidebar-header {
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 16px 20px;
      background: white;
      
      .sidebar-back-btn {
        border: none;
        background: none;
        padding: 8px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
        
        &:hover {
          background: #f8f9fa;
        }
      }
      
      .page-title {
        font-size: 18px;
        font-weight: 600;
        color: #1a1a1a;
        margin: 0;
        flex: 1;
      }
    }

    .conversations-header {
      background: white;
      
      .conversations-title-with-line {
        position: relative;
        text-align: center;
        
        &::before,
        &::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 85px;
          height: 1px;
          background: #e0e0e0;
        }
        
        &::before {
          left: 0;
        }
        
        &::after {
          right: 0;
        }
        
        .conversations-title {
          font-size: 12px;
          font-weight: normal;
          color: #646479;
          margin: 0;
          padding: 0 12px;
          background: white;
          display: inline-block;
        }
      }
    }

    .conversations-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;
      background: white;
      
      /* 隐藏滚动条但保持滚动功能 */
      scrollbar-width: none;
      -ms-overflow-style: none;
      
      &::-webkit-scrollbar {
        display: none;
      }

      .conversation-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 20px;
        cursor: pointer;
        transition: all 0.2s ease;
        border-left: 4px solid transparent;
        background: white;

        &:hover {
          background: #f8f9fa;
        }

        &--active {
          background: #f0f9ff;
          border-left-color: #355EFF;
          
          .conversation-name {
            color: #355EFF;
            font-weight: 600;
          }
        }

        .conversation-avatar {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 50%;
          flex-shrink: 0;
          overflow: hidden;

          span {
            font-size: 20px;
          }
          
          .avatar-image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            object-position: center;
          }
        }

        .conversation-content {
          flex: 1;
          min-width: 0;

          .conversation-name {
            font-size: 14px;
            font-weight: 500;
            color: #333;
            margin-bottom: 4px;
          }

          .conversation-preview {
            font-size: 12px;
            color: #999;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }

        .conversation-time {
          font-size: 11px;
          color: #999;
          flex-shrink: 0;
        }
      }
    }
  }

  .chat-area {
    flex: 1;
    background: transparent;
    display: flex;
    flex-direction: column;
    min-height: 0; // 确保flex子元素能正确收缩

    .top-nav-with-agent {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 80px;
      padding: 0 32px;
      background: white;
      border-bottom: 1px solid #e8e8e8;
      
      .nav-agent-info {
        display: flex;
        align-items: center;
        gap: 16px;
        
        .agent-avatar-nav {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          flex-shrink: 0;
          overflow: hidden;

          span {
            font-size: 24px;
          }
          
          .avatar-image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            object-position: center;
          }
        }

        .agent-details-nav {
          .agent-name-nav {
            font-size: 18px;
            font-weight: 600;
            color: #333;
            margin: 0 0 4px 0;
          }

          .agent-description-nav {
            font-size: 14px;
            color: #666;
            margin: 0;
            line-height: 1.4;
            max-width: 690px;
            
            &.ellipsis {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              cursor: pointer;
              
              &:hover {
                color: #333;
              }
            }
          }
        }
      }
      
      .nav-actions {
        display: flex;
        gap: 12px;
        
        .nav-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          height: 36px;
          padding: 0 16px;
          border: 1px solid #d9d9d9;
          border-radius: 6px;
          background: white;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.2s ease;
          
          .nav-btn-icon {
            width: 16px;
            height: 16px;
            object-fit: contain;
          }
          
          .nav-btn-loading {
            display: inline-block;
            animation: spin 1s linear infinite;
          }
          
          &:hover {
            border-color: #355EFF;
            color: #355EFF;
          }
        }
      }
    }

    .agent-intro-section {
      padding: 24px 32px 0;
      flex-shrink: 0; // 固定大小，不允许收缩
      
      :deep(.agent-intro-card) {
        width: 100%;
        max-width: 780px;
        margin: 0 auto;
      }
    }

    :deep(.chat-container) {
      padding: 0 32px;
      flex: 1; // 占用剩余空间
      min-height: 0; // 确保能正确收缩
      max-height: calc(100vh - 280px); // 为顶部导航和介绍卡片预留空间
    }
  }
}

// Popover样式
.description-popover-content {
  padding: 8px 0;
  font-size: 14px;
  color: #333;
  line-height: 1.5;
  word-wrap: break-word;
  word-break: break-all;
}

// Loading动画
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>