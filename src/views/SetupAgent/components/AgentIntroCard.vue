<template>
  <div class="agent-intro-card">
    <div class="agent-header">
      <div class="agent-avatar">
        <!-- 如果是URL图片则显示图片，否则显示emoji/文字 -->
        <img 
          v-if="isImageUrl(formatAvatarUrl(agent.image))" 
          :src="formatAvatarUrl(agent.image)" 
          :alt="agent.title + '的头像'"
          class="avatar-image"
          @error="handleAvatarError"
        />
        <span v-else class="avatar-icon">{{ getDisplayAvatar(agent.image) }}</span>
      </div>
      <div class="agent-details">
        <h3 class="agent-title">{{ agent.title }}</h3>
        <p class="agent-description">{{ agent.description }}</p>
      </div>
    </div>

    <div class="question-section">
      <h4 class="section-title">{{ UI_TEXT.INTRO_CARD.YOU_CAN_ASK }}</h4>
      <div class="question-list">
        <div 
          v-for="(question, index) in agent.sampleQuestions" 
          :key="index"
          class="question-item"
          @click="handleQuestionClick(question)"
        >
          <span class="question-text">{{ question }}</span>
          <span class="question-icon">→</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { UI_TEXT } from '../constants.js'
import { formatAvatarUrl, isImageUrl } from '@/services/api.js'

const props = defineProps({
  agent: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['question-click'])


// 处理问题点击
const handleQuestionClick = (question) => {
  emit('question-click', question)
}

/**
 * 获取显示用的头像内容 - 如果是URL则显示默认emoji，否则显示原内容
 */
const getDisplayAvatar = (avatar) => {
  if (!avatar) return '🤖'
  
  // 如果是URL路径相关内容，显示默认emoji
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
 * 处理头像加载错误
 */
const handleAvatarError = (event) => {
  console.error('头像加载失败:', event.target.src)
  // 头像加载失败时隐藏图片，显示默认emoji
  event.target.style.display = 'none'
}
</script>

<style lang="scss" scoped>
.agent-intro-card {
  width: 780px;
  background: white;
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 16px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);

  .agent-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;

    .agent-avatar {
      flex-shrink: 0;
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #FFE7D9 0%, #FFD4C4 100%);
      border-radius: 16px;
      overflow: hidden;

      .avatar-icon {
        font-size: 40px;
      }
      
      .avatar-image {
        width: 100%;
        height: 100%;
        border-radius: 16px;
        object-fit: cover;
        object-position: center;
      }
    }

    .agent-details {
      flex: 1;
      min-width: 0;

      .agent-title {
        font-family: MiSans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 24px;
        font-weight: 600;
        line-height: 32px;
        color: #1a1a1a;
        margin: 0 0 8px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .agent-description {
        font-family: MiSans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 16px;
        font-weight: normal;
        line-height: 24px;
        color: #666;
        margin: 0;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
      }
    }
  }

  .question-section {
    .section-title {
      font-size: 14px;
      font-weight: 500;
      color: #999;
      margin: 0 0 12px 0;
    }

    .question-list {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;

      .question-item {
        width: 152px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        background: #FFFFFF;
        border-radius: 999px;
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid #E4E8EE;
        box-sizing: border-box;

        .question-text {
          font-size: 14px;
          color: #333;
          font-weight: normal;
          flex: 1;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .question-icon {
          font-size: 14px;
          color: #999;
          opacity: 0.8;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        &:hover .question-icon {
          opacity: 1;
          transform: translateX(2px);
        }
      }
    }
  }
}
</style>