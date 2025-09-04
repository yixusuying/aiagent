<template>
  <div class="chat-container" :style="containerStyle">
    <div class="chat-messages" ref="chatMessagesRef">
      <div 
        v-for="message in messages" 
        :key="message.id"
        class="message-item"
        :class="{ 'user-message': message.isUser, 'agent-message': !message.isUser }"
      >
        <!-- 用户消息的时间标记 -->
        <div v-if="message.isUser" class="message-timestamp user-timestamp">
          {{ formatMessageTime(message.timestamp || Date.now()) }}
        </div>
        
        <div class="message-content">
          <div v-if="!message.isUser" class="agent-avatar">
            <!-- 如果是URL图片则显示图片，否则显示emoji/文字 -->
            <img 
              v-if="isImageUrl(formatAvatarUrl(agentAvatar))" 
              :src="formatAvatarUrl(agentAvatar)" 
              alt="智能体头像"
              class="avatar-image"
              @error="handleAvatarError"
            />
            <span v-else>{{ getDisplayAvatar(agentAvatar) }}</span>
          </div>
          <div class="message-text" :class="{ 'agent-message-text': !message.isUser }">
            <span>{{ message.content }}</span>
            <!-- 流式加载效果：等待响应时显示"..."，正在接收流式数据时显示动画点 -->
            <span v-if="!message.isUser && isMessageStreaming(message)" class="streaming-indicator">
              <span v-if="!message.content" class="waiting-dots">...</span>
              <span v-else class="typing-dots">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </span>
            </span>
            <!-- 智能体消息的底部区域：时间和操作按钮 -->
            <div v-if="!message.isUser && message.content && !isMessageStreaming(message)" class="message-bottom">
              <div class="message-timestamp agent-timestamp">
                {{ formatMessageTime(message.timestamp || Date.now()) }}
              </div>
              <div class="message-actions">
                <button 
                  class="action-btn copy-btn" 
                  @click="copyMessage(message.content)"
                  title="复制消息"
                >
                  <img src="/images/avatars/copyBtn.png" alt="复制" width="16" height="16" />
                </button>
                <button 
                  class="action-btn voice-btn" 
                  @click="playVoice(message.content)"
                  title="语音播放"
                >
                  <img src="/images/avatars/voiceBtn.png" alt="语音播放" width="16" height="16" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="chat-input-area">
      <ChatInput 
        :placeholder="placeholder"
        :loading="loading"
        :type="showClearButton ? 'textArea' : 'input'"
        @send-message="handleSendMessage"
        @clear-conversation="handleClearConversation"
        @stop-request="handleStopRequest"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, nextTick, defineExpose } from 'vue'
import { message } from 'ant-design-vue'
import ChatInput from '@/components/ChatInput'
import { formatAvatarUrl, isImageUrl } from '@/services/api.js'
import dayjs from 'dayjs'

const props = defineProps({
  messages: {
    type: Array,
    default: () => []
  },
  agentAvatar: {
    type: String,
    default: '🤖'
  },
  loading: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: '输入消息...'
  },
  maxHeight: {
    type: String,
    default: undefined
  },
  minHeight: {
    type: String,
    default: undefined
  },
  showClearButton: {
    type: Boolean,
    default: false
  },
  // 当前正在流式输入的消息ID（用于显示加载状态）
  streamingMessageId: {
    type: [String, Number],
    default: null
  }
})

const emit = defineEmits(['send-message', 'clear-conversation', 'stop-request'])

const chatMessagesRef = ref(null)

// 计算容器样式
const containerStyle = computed(() => {
  const style = {}
  if (props.maxHeight) {
    style.maxHeight = props.maxHeight
  }
  if (props.minHeight) {
    style.minHeight = props.minHeight
  }
  return style
})

// 滚动到聊天底部
const scrollToBottom = () => {
  if (chatMessagesRef.value) {
    chatMessagesRef.value.scrollTop = chatMessagesRef.value.scrollHeight
  }
}

// 处理发送消息
const handleSendMessage = (payload) => {
  emit('send-message', payload)
  // 发送消息后滚动到底部
  nextTick(() => {
    scrollToBottom()
  })
}

// 处理清除对话
const handleClearConversation = () => {
  emit('clear-conversation')
}

// 处理停止请求
const handleStopRequest = () => {
  emit('stop-request')
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

/**
 * 判断消息是否正在流式输入中
 * @param {Object} message - 消息对象
 * @returns {boolean} 是否正在流式输入
 */
const isMessageStreaming = (message) => {
  // 只有智能体消息且消息ID匹配当前流式消息ID时才显示加载状态
  return !message.isUser && props.streamingMessageId && message.id === props.streamingMessageId
}

/**
 * 格式化消息时间戳
 * @param {number|Date} timestamp - 时间戳
 * @returns {string} 格式化后的时间
 */
const formatMessageTime = (timestamp) => {
  return dayjs(timestamp).format('MM-DD-HH:mm')
}

/**
 * 复制消息内容到剪贴板
 * @param {string} content - 要复制的内容
 */
const copyMessage = async (content) => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      // 使用现代的 Clipboard API
      await navigator.clipboard.writeText(content)
    } else {
      // 降级到传统方法
      const textArea = document.createElement('textarea')
      textArea.value = content
      textArea.style.position = 'fixed'
      textArea.style.left = '-9999px'
      textArea.style.top = '-9999px'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }
    // 使用antd的message显示复制成功提示
    message.success('复制成功')
  } catch (error) {
    console.error('复制失败:', error)
    message.error('复制失败')
  }
}

/**
 * 语音播放功能（暂时留空）
 * @param {string} content - 要播放的内容
 */
const playVoice = (content) => {
  console.log('语音播放功能待实现:', content)
  // 后续实现语音播放逻辑
}

// 暴露滚动方法和工具函数给父组件使用
defineExpose({
  scrollToBottom,
  copyMessage,
  playVoice
})
</script>

<style lang="scss" scoped>
.chat-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 780px;
  margin: 0 auto;
  min-height: 0; // 确保flex子元素能正确收缩

  .chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 16px 0;
    margin-bottom: 16px;
    
    /* 隐藏滚动条但保持滚动功能 */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
    
    &::-webkit-scrollbar {
      display: none; /* Chrome/Safari/Webkit */
    }

    .message-item {
      margin-bottom: 16px;
      position: relative;
      
      .message-timestamp {
        font-size: 11px;
        color: #999;
        margin-bottom: 6px;
        
        &.user-timestamp {
          text-align: right;
          padding-right: 0;
        }
      }

      .message-content {
        display: flex;
        align-items: flex-start;
        gap: 12px;

        .agent-avatar {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
          border-radius: 50%;
          flex-shrink: 0;
          overflow: hidden;

          span {
            font-size: 16px;
          }
          
          .avatar-image {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            object-fit: cover;
            object-position: center;
          }
        }

        .message-text {
          background: white;
          color: #181B49;
          padding: 5px 16px;
          border-radius: 12px;
          max-width: 80%;
          word-wrap: break-word;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          position: relative;
          font-family: 'MiSans', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          font-size: 16px;
          line-height: 26px;
          
          &.agent-message-text {
            .message-bottom {
              margin-top: 8px;
              display: flex;
              justify-content: space-between;
              align-items: center;
              
              .message-timestamp {
                font-size: 11px;
                color: #999;
                margin: 0;
                padding: 0;
              }
              
              .message-actions {
                display: flex;
                gap: 4px;
                opacity: 0;
                transition: opacity 0.2s ease;
              }
            }
            
            &:hover .message-bottom .message-actions {
              opacity: 1;
            }
            
            .action-btn {
              width: 16px;
              height: 16px;
              border: none;
              background: none;
              cursor: pointer;
              transition: opacity 0.2s ease;
              padding: 0;
              display: flex;
              align-items: center;
              justify-content: center;
              
              &:hover {
                opacity: 0.7;
              }
              
              img {
                width: 16px;
                height: 16px;
                object-fit: contain;
              }
            }
          }
          
          .streaming-indicator {
            display: inline-block;
            margin-left: 4px;
            
            .waiting-dots {
              color: #666;
              font-weight: bold;
            }
            
            .typing-dots {
              display: inline-flex;
              align-items: center;
              gap: 2px;
              margin-left: 2px;
              
              .dot {
                width: 4px;
                height: 4px;
                background-color: #666;
                border-radius: 50%;
                animation: typing 1.4s infinite;
                
                &:nth-child(1) {
                  animation-delay: 0s;
                }
                
                &:nth-child(2) {
                  animation-delay: 0.2s;
                }
                
                &:nth-child(3) {
                  animation-delay: 0.4s;
                }
              }
              
              @keyframes typing {
                0%, 60%, 100% {
                  transform: scale(1);
                  opacity: 0.5;
                }
                30% {
                  transform: scale(1.2);
                  opacity: 1;
                }
              }
            }
          }
        }
      }

      &.user-message {
        .message-timestamp {
          text-align: right;
          padding-right: 0;
        }
        
        .message-content {
          justify-content: flex-end;

          .message-text {
            background: #4D71FF;
            color: white;
          }
        }
      }
    }
  }

  .chat-input-area {
    flex-shrink: 0;
  }
}

// 当有高度限制时的特殊样式
.chat-container {
  // 有最大高度限制时
  &[style*="max-height"] {
    .chat-messages {
      overflow-y: auto;
    }
  }
  
  // 有最小高度限制时
  &[style*="min-height"] {
    .chat-messages {
      min-height: 25vh; // 为输入区域预留空间
    }
  }
  
  // 同时有最大和最小高度限制时
  &[style*="max-height"][style*="min-height"] {
    .chat-messages {
      min-height: 25vh;
      max-height: 30vh; // 适应不同浏览器高度
    }
  }
}
</style>