<template>
  <div class="example-cards" :class="{ 'design-layout': activeMode === 'ai-design-generation' }">
    <div v-if="activeMode === 'ai-role-generation'" class="role-cards-grid">
      <div v-if="loading" class="loading-placeholder">
        <div class="loading-text">正在加载智能体...</div>
      </div>
      
      <div v-else-if="error" class="error-placeholder">
        <div class="error-text">{{ error }}</div>
        <a-button size="small" @click="fetchAdminAgents">重试</a-button>
      </div>
      
      <div
        v-else
        v-for="example in currentExamples"
        :key="example.id"
        class="role-card"
        @click="handleCardClick(example)"
      >
        <div class="role-card-image">
          <img 
            v-if="isImageUrl(example.image)" 
            :src="example.image" 
            :alt="example.title + '的头像'"
            class="role-avatar-image"
            @error="handleAvatarError"
          />
          <span v-else class="role-icon">{{ getDisplayAvatar(example.image) }}</span>
        </div>
        <div class="role-card-content">
          <h3 class="role-card-title">{{ example.title }}</h3>
          <p class="role-card-description">{{ example.description }}</p>
        </div>
      </div>
    </div>
    
    <div v-else class="cards-grid">
      <div
        v-for="example in currentExamples"
        :key="example.id"
        class="example-card"
        @click="handleCardClick(example)"
      >
        <div class="card-image">
          <div class="document-preview">
            <div class="doc-header">
              <div class="doc-title">{{ example.title }}</div>
            </div>
            <div class="doc-content">
              <div class="content-line" v-for="line in example.contentLines" :key="line"></div>
            </div>
          </div>
        </div>
        <div class="card-info">
          <h3 class="card-title">{{ example.title }}</h3>
          <p class="card-meta">{{ example.subject }} | {{ example.date }}</p>
        </div>
      </div>
    </div>
    
    <div class="view-more">
      <a-button type="link" class="view-more-btn" @click="handleViewMoreClick">
        {{ viewMoreText }}
      </a-button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/index.js'
import { agentService } from '@/services'
import { formatAvatarUrl, isImageUrl } from '@/services/api.js'
import { cleanDescription } from '@/utils/agentParser.js'
import { getExamplesForMode, handleCardSelection, getViewMoreText } from '@/components/ExampleCards/utils.js'

const props = defineProps({
  activeMode: {
    type: String,
    default: 'ai-role-generation'
  }
})

const emit = defineEmits(['card-select'])
const router = useRouter()
const appStore = useAppStore()

const adminAgents = ref([])
const loading = ref(false)
const error = ref(null)

const fetchAdminAgents = async () => {
  if (props.activeMode !== 'ai-role-generation') return
  
  if (appStore.adminAgents.length > 0) {
    adminAgents.value = appStore.adminAgents
    return
  }
  
  try {
    loading.value = true
    error.value = null
    const response = await agentService.getAdminAgents()
    console.log('API返回的原始数据:', response)
    
    const transformedData = (Array.isArray(response) ? response : []).map(agent => ({
      id: agent.id,
      title: agent.name || '未命名智能体',
      description: cleanDescription(agent.introduction) || '暂无描述',
      image: formatAvatarUrl(agent.avatar) || '🤖'
    }))
    
    adminAgents.value = transformedData
    appStore.setAdminAgents(transformedData)
    
    console.log('转换后的智能体数据:', adminAgents.value)
  } catch (err) {
    console.error('获取管理员智能体失败:', err)
    error.value = err.message || '获取智能体列表失败'
  } finally {
    loading.value = false
  }
}

const currentExamples = computed(() => {
  if (props.activeMode === 'ai-role-generation' && adminAgents.value.length > 0) {
    return adminAgents.value.slice(0, 6)
  }
  
  return getExamplesForMode(props.activeMode)
})

const viewMoreText = computed(() => {
  return getViewMoreText(props.activeMode)
})

const handleCardClick = (example) => {
  handleCardSelection(example, emit, router, props.activeMode)
}

const handleViewMoreClick = () => {
  if (props.activeMode === 'ai-role-generation') {
    router.push('/agents')
  }
}

const handleModeChange = () => {
  if (props.activeMode === 'ai-role-generation') {
    fetchAdminAgents()
  }
}

onMounted(() => {
  fetchAdminAgents()
})

const handleAvatarError = (event) => {
  console.error('头像加载失败:', event.target.src)
  event.target.style.display = 'none'
}

const getDisplayAvatar = (avatar) => {
  if (!avatar) return '🤖'
  
  if (avatar.includes('http') || 
      avatar.includes('/') || 
      avatar.includes('.') ||
      avatar.length > 20 ||
      avatar.startsWith('static') ||
      avatar.includes('avatar')) {
    return '🤖'
  }
  
  return avatar
}

import { watch } from 'vue'
watch(() => props.activeMode, handleModeChange)
</script>

<style lang="scss" scoped>
.example-cards {
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  
  &.design-layout {
    max-width: 800px;
    
    .cards-grid {
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 16px;
      min-height: 248px;
      
      .example-card {
        height: 216px;
        
        .card-image {
          height: 140px;
        }
      }
    }
  }
  
  .role-cards-grid {
    display: grid;
    grid-template-columns: repeat(3, 260px);
    grid-template-rows: repeat(2, 100px);
    gap: 16px;
    justify-content: center;
    margin-bottom: 32px;
    height: 216px;
    min-height: 216px;
    position: relative;
  }
  
  .loading-placeholder {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 216px;
    
    .loading-text {
      color: #666;
      font-size: 14px;
    }
  }
  
  .error-placeholder {
    grid-column: 1 / -1;
    grid-row: 1 / -1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 216px;
    gap: 12px;
    
    .error-text {
      color: #ff4d4f;
      font-size: 14px;
      text-align: center;
    }
  }
  
  .role-card {
    width: 260px;
    height: 100px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 8px;
    padding: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
      background: rgba(255, 255, 255, 0.95);
    }
    
    .role-card-image {
      flex-shrink: 0;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: 8px;
      
      .role-icon {
        font-size: 20px;
      }
      
      .role-avatar-image {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        object-fit: cover;
        object-position: center;
      }
    }
    
    .role-card-content {
      position: static;
      left: 72px;
      top: 0px;
      width: 154px;
      height: 61px;
      opacity: 1;
      
      display: flex;
      flex-direction: column;
      padding: 0px;
      gap: 6px;
      
      z-index: 1;
      text-align: left;
      
      .role-card-title {
        position: static;
        left: 0px;
        top: 0px;
        width: 154px;
        height: auto;
        min-height: 16px;
        opacity: 1;
        
        font-family: MiSans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 16px;
        font-weight: 500;
        line-height: 16px;
        letter-spacing: 0px;
        
        font-variation-settings: "opsz" auto;
        color: #181B49;
        
        z-index: 0;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .role-card-description {
          position: static;
        left: 0px;
        top: 22px;
        width: 154px;
        height: 46px;
        opacity: 1;
        
        font-family: MiSans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        font-weight: normal;
        line-height: 20px;
        text-align: justify;
        letter-spacing: 0px;
        
        font-variation-settings: "opsz" auto;
        color: #646479;
        
        z-index: 1;
        margin: 0;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
  }
  
  .cards-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 24px;
    margin-bottom: 32px;
  }
  
  .example-card {
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    
    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);
      background: rgba(255, 255, 255, 0.95);
    }
    
    .card-image {
      width: 100%;
      height: 160px;
      background: white;
      border-radius: 8px;
      margin-bottom: 12px;
      padding: 12px;
      border: 1px solid #e8e8e8;
      
      .document-preview {
        width: 100%;
        height: 100%;
        
        .doc-header {
          height: 20px;
          margin-bottom: 8px;
          
          .doc-title {
            font-size: 10px;
            font-weight: bold;
            color: #333;
            padding: 2px 0;
            border-bottom: 1px solid #e8e8e8;
          }
        }
        
        .doc-content {
          display: flex;
          flex-direction: column;
          gap: 6px;
          
          .content-line {
            height: 8px;
            background: linear-gradient(90deg, #f0f0f0 0%, #e8e8e8 100%);
            border-radius: 2px;
            
            &:nth-child(1) { width: 90%; }
            &:nth-child(2) { width: 85%; }
            &:nth-child(3) { width: 92%; }
            &:nth-child(4) { width: 78%; }
            &:nth-child(5) { width: 88%; }
            &:nth-child(6) { width: 82%; }
            &:nth-child(7) { width: 95%; }
            &:nth-child(8) { width: 87%; }
            &:nth-child(9) { width: 90%; }
          }
        }
      }
    }
    
    .card-info {
      .card-title {
        font-size: 14px;
        font-weight: 600;
        color: #333;
        margin: 0 0 4px 0;
        line-height: 1.4;
      }
      
      .card-meta {
        font-size: 12px;
        color: #666;
        margin: 0;
      }
    }
  }
  
  .view-more {
    text-align: center;
    
    .view-more-btn {
      color: #646479;
      font-size: 14px;
      padding: 8px 0;
      
      &:hover {
        color: #42a5f5;
      }
    }
  }
}
</style>