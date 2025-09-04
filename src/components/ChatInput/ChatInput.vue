<template>
  <div :class="inputClasses" :style="containerStyle">
    <div v-if="type === 'textArea'" class="clear-button-wrapper">
      <a-button
        class="clear-conversation-btn"
        :disabled="disabled || loading"
        @click="handleClearConversation"
      >
        <DeleteOutlined />
        清除对话
      </a-button>
    </div>
    
    <div class="input-container">
      <template v-if="type === 'textArea'">
        <a-textarea
          v-model:value="inputValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :auto-size="{ minRows: 3, maxRows: 6 }"
          class="chat-input-field"
          @press-enter="handleSend"
        />
        <div class="button-row">
          <div class="button-group">
            <button 
              v-if="showMic"
              class="mic-btn" 
              :disabled="disabled || loading"
              @click="handleMicClick"
            >
              <svg class="mic-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 1C10.3431 1 9 2.34315 9 4V12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12V4C15 2.34315 13.6569 1 12 1Z" stroke="currentColor" stroke-width="2"/>
                <path d="M19 10V12C19 16.4183 15.4183 20 11 20H13C13 20 13 20 13 20M5 10V12C5 16.4183 8.58172 20 13 20M13 20V23M10 23H16" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </button>
            <img 
              :src="sendButtonImage"
              :alt="loading ? '停止' : '发送'"
              class="send-btn"
              :class="{ 
                'send-btn--disabled': !loading && (!inputValue.trim() || disabled),
                'send-btn--stop': loading
              }"
              @click="handleButtonClick"
            />
          </div>
        </div>
      </template>
      
      <template v-else-if="type === 'input'">
        <div class="input-row">
          <div 
            class="mode-label"
          >
            @{{ currentModeLabel }}
          </div>
          <a-input
            v-model:value="inputValue"
            :placeholder="placeholder"
            :disabled="disabled"
            class="chat-input-field-single"
            @press-enter="handleSend"
          />
          <img 
            :src="sendButtonImage"
            :alt="loading ? '停止' : '发送'"
            class="send-btn inline-send-btn"
            :class="{ 
              'send-btn--disabled': !loading && (!inputValue.trim() || disabled),
              'send-btn--stop': loading
            }"
            @click="handleButtonClick"
          />
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits, computed } from 'vue'
import { getPlaceholderText, validateInput, createMessagePayload } from '@/components/ChatInput/utils.js'
import { DeleteOutlined } from '@ant-design/icons-vue'

const MODES = [
  {
    key: 'ai-design-generation',
    label: 'AI教学设计生成',
    icon: '🎯'
  },
  {
    key: 'ai-role-generation',
    label: 'AI角色智能生成',
    icon: '📊'
  }
]

const props = defineProps({
  activeMode: {
    type: String,
    default: 'ai-role-generation'
  },
  placeholder: {
    type: String,
    default: undefined
  },
  showMic: {
    type: Boolean,
    default: true
  },
  size: {
    type: String,
    default: 'default',
    validator: (value) => ['small', 'default', 'large'].includes(value)
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'minimal', 'bordered'].includes(value)
  },
  maxWidth: {
    type: String,
    default: '800px'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'textArea',
    validator: (value) => ['textArea', 'input'].includes(value)
  },
  clearOnSend: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits(['send-message', 'mic-click', 'clear-conversation', 'stop-request'])

const inputValue = ref('')

const placeholder = computed(() => {
  return props.placeholder || getPlaceholderText(props.activeMode)
})

const currentModeLabel = computed(() => {
  const mode = MODES.find(m => m.key === props.activeMode)
  return mode ? mode.label : 'AI教学生成'
})

const sendButtonImage = computed(() => {
  if (props.loading) {
    return '/images/avatars/stopBtn.png'
  }
  return inputValue.value.trim() 
    ? '/images/avatars/sendBtn_active.png'
    : '/images/avatars/sendBtn_default.png'
})

const handleSend = () => {
  if (props.disabled || props.loading || !inputValue.value.trim()) return
  
  if (validateInput(inputValue.value)) {
    const payload = {
      content: inputValue.value.trim(),
      mode: props.activeMode,
      timestamp: Date.now()
    }
    emit('send-message', payload)
    if (props.clearOnSend) {
      inputValue.value = ''
    }
  }
}

const handleButtonClick = () => {
  if (props.disabled) return
  
  if (props.loading) {
    emit('stop-request')
  } else {
    handleSend()
  }
}

const handleMicClick = () => {
  if (props.disabled || props.loading) return
  emit('mic-click')
}

const handleClearConversation = () => {
  if (props.disabled || props.loading) return
  emit('clear-conversation')
}

const clearInput = () => {
  inputValue.value = ''
}

defineExpose({
  clearInput
})

const inputClasses = computed(() => {
  return [
    'chat-input',
    `chat-input--${props.size}`,
    `chat-input--${props.variant}`,
    {
      'chat-input--disabled': props.disabled,
      'chat-input--loading': props.loading,
      'chat-input--input-type': props.type === 'input'
    }
  ]
})

const containerStyle = computed(() => {
  return {
    maxWidth: props.maxWidth
  }
})
</script>

<style lang="scss">
.chat-input:not(.chat-input--input-type) {
  .ant-input,
  .ant-input-lg,
  .ant-input[size="large"],
  textarea,
  .ant-input-textarea,
  .ant-input-textarea textarea {
    border: 0 !important;
    border-width: 0 !important;
    border-style: none !important;
    border-color: transparent !important;
    background: transparent !important;
    background-color: transparent !important;
    box-shadow: none !important;
    outline: none !important;
    outline-width: 0 !important;
    padding: 8px 16px 0 16px !important;
    vertical-align: top !important;
    text-align: left !important;
    display: block !important;
    
    scrollbar-width: none !important;
    -ms-overflow-style: none !important;
    
    &::-webkit-scrollbar {
      display: none !important;
    }
    
    &::placeholder {
      color: #9A99AA !important;
      font-size: 15px !important;
      line-height: 1.5 !important;
      vertical-align: top !important;
      position: absolute !important;
      top: 8px !important;
      left: 16px !important;
    }
    
    &:focus,
    &:focus-visible,
    &:focus-within,
    &.ant-input-focused {
      border: 0 !important;
      border-width: 0 !important;
      border-style: none !important;
      border-color: transparent !important;
      box-shadow: none !important;
      outline: none !important;
      outline-width: 0 !important;
    }
    
    &:hover {
      border: 0 !important;
      border-width: 0 !important;
      border-style: none !important;
      border-color: transparent !important;
      box-shadow: none !important;
    }
    
    &:focus {
      caret-color: #355EFF !important;
    }
  }
  
  .ant-input-affix-wrapper,
  .ant-input-affix-wrapper-lg,
  .ant-input-textarea-affix-wrapper {
    border: 0 !important;
    border-width: 0 !important;
    border-style: none !important;
    border-color: transparent !important;
    box-shadow: none !important;
    background: transparent !important;
    background-color: transparent !important;
    padding: 0 !important;
    
    &:focus,
    &:hover,
    &.ant-input-affix-wrapper-focused,
    &.ant-input-affix-wrapper-status-error {
      border: 0 !important;
      border-width: 0 !important;
      border-style: none !important;
      border-color: transparent !important;
      box-shadow: none !important;
      background: transparent !important;
      background-color: transparent !important;
    }
  }
}
</style>

<style lang="scss" scoped>
.chat-input {
  width: 100%;
  margin: 0 auto 40px;
  
  .input-container {
    position: relative;
    background: white;
    border-radius: 16px;
    padding: 0;
    transition: all 0.3s ease;
    min-height: 100px;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border-radius: 16px;
      padding: 2px;
      background: transparent;
      mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      mask-composite: xor;
      -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
      -webkit-mask-composite: xor;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover::before,
    &:focus-within::before {
      opacity: 1;
      background: linear-gradient(90deg, #355EFF 0%, #36FFDE 50%, #693FFF 100%);
    }
    
  }
  
  .clear-button-wrapper {
    margin-bottom: 8px;
  }
  
  .clear-button-wrapper .clear-conversation-btn {
    background: #FFFFFF;
    border: 1px solid #E5E7EB;
    color: #6B7280;
    height: 28px;
    padding: 2px 10px;
    border-radius: 14px;
    font-size: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;
  }
  
  .clear-button-wrapper .clear-conversation-btn:hover:not(:disabled) {
    background: #F8F9FA;
    border-color: #D1D5DB;
    color: #374151;
  }
  
  .clear-button-wrapper .clear-conversation-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .clear-button-wrapper .clear-conversation-btn:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(91, 126, 245, 0.2);
  }
  
  .clear-button-wrapper .clear-conversation-btn :deep(.anticon) {
    font-size: 12px;
    color: #8B8B8B;
  }
  
  .clear-button-wrapper .clear-conversation-btn:hover:not(:disabled) :deep(.anticon) {
    color: #374151;
  }
  
  .input-container {
    
    .chat-input-field {
      border: none;
      background: transparent;
      width: 100%;
      display: block;
      padding: 0;
      margin: 0;
      margin-bottom: 8px;
    }
    
    .chat-input-field.chat-input-field.chat-input-field {
      :deep(.ant-input),
      :deep(.ant-input-lg),
      :deep(.ant-input[size="large"]),
      :deep(textarea),
      :deep(.ant-input-textarea),
      :deep(.ant-input-textarea textarea) {
        border: 0 !important;
        border-width: 0 !important;
        border-style: none !important;
        border-color: transparent !important;
        background: transparent !important;
        background-color: transparent !important;
        box-shadow: none !important;
        outline: none !important;
        outline-width: 0 !important;
        padding: 8px 16px 0 16px !important;
        margin: 0 !important;
        font-size: 15px !important;
        line-height: 1.5 !important;
        color: #181B49 !important;
        width: 100% !important;
        min-height: 24px !important;
        resize: none !important;
        vertical-align: top !important;
        text-align: left !important;
        display: block !important;
        
        scrollbar-width: none !important;
        -ms-overflow-style: none !important;
        
        &::-webkit-scrollbar {
          display: none !important;
        }
        
        &:focus,
        &:focus-visible,
        &:focus-within,
        &.ant-input-focused {
          border: 0 !important;
          border-width: 0 !important;
          border-style: none !important;
          border-color: transparent !important;
          box-shadow: none !important;
          outline: none !important;
          outline-width: 0 !important;
        }
        
        &:hover {
          border: 0 !important;
          border-width: 0 !important;
          border-style: none !important;
          border-color: transparent !important;
          box-shadow: none !important;
        }
        
        &::placeholder {
          color: #9A99AA !important;
          font-size: 15px !important;
          line-height: 1.5 !important;
          vertical-align: top !important;
          position: absolute !important;
          top: 8px !important;
          left: 16px !important;
        }
        
        &:disabled {
          color: #999 !important;
          cursor: not-allowed;
        }
      }
      
      :deep(.ant-input-affix-wrapper),
      :deep(.ant-input-affix-wrapper-lg),
      :deep(.ant-input-textarea-affix-wrapper) {
        border: 0 !important;
        border-width: 0 !important;
        border-style: none !important;
        border-color: transparent !important;
        box-shadow: none !important;
        background: transparent !important;
        background-color: transparent !important;
        padding: 0 !important;
        height: 100% !important;
        min-height: 0 !important;
        
        &:focus,
        &:hover,
        &.ant-input-affix-wrapper-focused,
        &.ant-input-affix-wrapper-status-error {
          border: 0 !important;
          border-width: 0 !important;
          border-style: none !important;
          border-color: transparent !important;
          box-shadow: none !important;
          background: transparent !important;
          background-color: transparent !important;
        }
      }
      
      :deep(.ant-input-wrapper) {
        border: 0 !important;
        box-shadow: none !important;
        background: transparent !important;
        background-color: transparent !important;
      }
      
      :deep(.ant-input-group-wrapper) {
        border: 0 !important;
        box-shadow: none !important;
        background: transparent !important;
        background-color: transparent !important;
      }
      
      :deep(.ant-input:focus),
      :deep(textarea:focus),
      :deep(.ant-input-textarea textarea:focus) {
        caret-color: #355EFF !important;
      }
    }
    
    .button-row {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding: 0 16px 8px 16px;
      
      .button-group {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 8px;
        height: 32px;
        
        .mic-btn {
        width: 32px;
        height: 32px;
        border-radius: 50%;
        background: transparent;
        border: none;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.2s ease;
        
        .mic-icon {
          width: 18px;
          height: 18px;
          color: #999999;
          transition: color 0.2s ease;
        }
        
        &:hover:not(:disabled) {
          background: #f8f9fa;
          
          .mic-icon {
            color: #666666;
          }
        }
        
        &:disabled {
          cursor: not-allowed;
          opacity: 0.5;
        }
      }
      
      .send-btn {
        width: 32px;
        height: 32px;
        cursor: pointer;
        transition: all 0.2s ease;
        flex-shrink: 0;
        border: none;
        background: none;
        padding: 0;
        
        &:hover:not(.send-btn--disabled) {
          transform: scale(1.05);
        }
        
        &.send-btn--disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        &.send-btn--stop {
          background: rgba(255, 0, 0, 0.1);
          border-radius: 50%;
          
          &:hover {
            background: rgba(255, 0, 0, 0.2);
            transform: scale(1.1);
          }
        }
        
        &.loading-spinner {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: default;
          
          .spinner {
            width: 16px;
            height: 16px;
            border: 2px solid #e3e3e3;
            border-top: 2px solid #5B7EF5;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
        }
      }
      
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      }
    }
  }
  
  &--small {
    margin-bottom: 20px;
    
    .input-container {
      border-radius: 16px;
      padding: 12px;
      min-height: 70px;
      
      &::before {
        border-radius: 16px;
      }
      
      .chat-input-field {
        margin-bottom: 8px;
        
        :deep(.ant-input) {
          font-size: 13px;
          padding: 6px 12px 0 12px !important;
          vertical-align: top !important;
          text-align: left !important;
          display: block !important;
          
          &::placeholder {
            font-size: 13px;
            color: #9A99AA !important;
            line-height: 1.5 !important;
            vertical-align: top !important;
            position: absolute !important;
            top: 6px !important;
            left: 12px !important;
          }
        }
      }
    }
  }
  
  &--large {
    margin-bottom: 50px;
    
    .input-container {
      border-radius: 16px;
      padding: 20px;
      min-height: 130px;
      
      &::before {
        border-radius: 16px;
      }
      
      .chat-input-field {
        margin-bottom: 8px;
        
        :deep(.ant-input) {
          font-size: 16px;
          padding: 10px 20px 0 20px !important;
          vertical-align: top !important;
          text-align: left !important;
          display: block !important;
          
          &::placeholder {
            font-size: 16px;
            color: #9A99AA !important;
            line-height: 1.5 !important;
            vertical-align: top !important;
            position: absolute !important;
            top: 10px !important;
            left: 20px !important;
          }
        }
      }
      
      .button-group {
        height: 32px;
        
        .mic-btn {
          width: 32px;
          height: 32px;
          
          .mic-icon {
            width: 18px;
            height: 18px;
          }
        }
        
        .send-btn {
          width: 32px;
          height: 32px;
          
        }
      }
    }
  }
  
  &--minimal {
    .input-container {
      background: transparent;
      border: none;
      border-bottom: 1px solid #e8e8e8;
      border-radius: 0;
      padding: 8px 0;
      
      .button-row .button-group {
        .mic-btn {
          border-radius: 4px;
        }
        
        .send-btn {
          border-radius: 4px;
        }
      }
    }
  }
  
  &--bordered {
    .input-container {
      border: 2px solid #5B7EF5;
      box-shadow: 0 2px 8px rgba(91, 126, 245, 0.1);
      
      &:focus-within {
        border-color: #4C6EE5;
        box-shadow: 0 4px 12px rgba(91, 126, 245, 0.2);
      }
    }
  }
  
  &--disabled {
    .input-container {
      background: #f5f5f5;
      border-color: #d9d9d9;
      cursor: not-allowed;
    }
  }
  
  &--loading {
    .input-container {
      opacity: 0.8;
    }
  }
  
  .input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    width: 100%;
    
    .mode-label {
      padding: 6px 12px;
      background: #f0f2ff;
      color: #5B7EF5;
      border-radius: 16px;
      font-size: 13px;
      font-weight: 500;
      white-space: nowrap;
      flex-shrink: 0;
    }
    
    .chat-input-field-single.chat-input-field-single.chat-input-field-single {
      flex: 1;
      border: none;
      background: transparent;
      box-shadow: none;
      
      &:focus,
      &:hover {
        border: none;
        box-shadow: none;
      }
      
      :deep(.ant-input) {
        border: none !important;
        background: transparent !important;
        box-shadow: none !important;
        padding: 0 12px !important;
        font-size: 15px !important;
        color: #181B49 !important;
        height: 32px !important;
        line-height: 1 !important;
        vertical-align: top !important;
        text-align: left !important;
        display: block !important;
        outline: none !important;
        outline-width: 0 !important;
        margin: 0 !important;
        width: 100% !important;
        min-height: 32px !important;
        resize: none !important;
        
        &:focus,
        &:hover,
        &:focus-visible,
        &:focus-within,
        &.ant-input-focused {
          border: none !important;
          border-width: 0 !important;
          border-style: none !important;
          border-color: transparent !important;
          box-shadow: none !important;
          outline: none !important;
          outline-width: 0 !important;
          vertical-align: top !important;
          line-height: 1 !important;
        }
        
        &::placeholder {
          color: #9A99AA !important;
          font-size: 15px !important;
          line-height: 1 !important;
          vertical-align: top !important;
          position: static !important;
          top: auto !important;
          left: auto !important;
        }
        
        &:focus {
          caret-color: #355EFF !important;
        }
      }
    }
    
    .inline-send-btn {
      width: 32px;
      height: 32px;
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
      border: none;
      background: none;
      padding: 0;
      
      &:hover:not(.send-btn--disabled) {
        transform: scale(1.05);
      }
      
      &.send-btn--disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      // 停止按钮特殊样式
      &.send-btn--stop {
        background: rgba(255, 0, 0, 0.1);
        border-radius: 50%;
        
        &:hover {
          background: rgba(255, 0, 0, 0.2);
          transform: scale(1.1);
        }
      }
      
      &.loading-spinner {
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: default;
        
        .spinner {
          width: 16px;
          height: 16px;
          border: 2px solid #e3e3e3;
          border-top: 2px solid #5B7EF5;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
      }
    }
  }
  
  &.chat-input--input-type {
    .input-container {
      min-height: 56px;
      padding: 0;
      display: flex;
      align-items: center;
    }
  }
}
</style>