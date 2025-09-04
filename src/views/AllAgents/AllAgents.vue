<template>
  <div class="all-agents">
    <!-- 面包屑导航 -->
    <div class="breadcrumb">
      <a-breadcrumb>
        <a-breadcrumb-item>
          <router-link :to="ROUTES.HOME">{{ UI_TEXT.BREADCRUMB.HOME }}</router-link>
        </a-breadcrumb-item>
        <a-breadcrumb-item>{{ UI_TEXT.BREADCRUMB.AGENTS_PLAZA }}</a-breadcrumb-item>
      </a-breadcrumb>
    </div>

    <!-- Header 区域 -->
    <div class="page-header">
      <div class="header-left">
        <div class="custom-tabs">
          <div 
            v-for="tab in Object.values(TAB_CONFIG)"
            :key="tab.key"
            class="tab-item" 
            :class="{ active: activeTab === tab.key }"
            @click="activeTab = tab.key"
          >
            {{ tab.label }}
          </div>
        </div>
      </div>
      <div class="header-right">
        <a-input-search
          v-model:value="searchKeyword"
          :placeholder="UI_TEXT.SEARCH.PLACEHOLDER"
          style="width: 300px; margin-right: 16px"
          @search="handleSearch"
        />
        <a-button type="primary" @click="handleCreateAgent">
          {{ UI_TEXT.BUTTONS.CREATE_AGENT }}
        </a-button>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="isCurrentTabLoading" class="loading-state">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">正在加载数据...</div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="currentTabError" class="error-state">
      <div class="error-content">
        <div class="error-text">{{ currentTabError }}</div>
        <a-button type="primary" @click="retryLoadCurrentTab">重试</a-button>
      </div>
    </div>

    <!-- 智能体卡片列表 -->
    <div v-else-if="filteredAgents.length > 0" class="agents-grid">
      <div
        v-for="agent in filteredAgents"
        :key="agent.id"
        class="agent-card"
        @click="handleAgentClick(agent)"
      >
        <div class="agent-card-image">
          <!-- 如果是URL图片则显示图片，否则显示emoji/文字 -->
          <img 
            v-if="isImageUrl(agent.image)" 
            :src="agent.image" 
            :alt="agent.title + '的头像'"
            class="agent-avatar-image"
            @error="handleAvatarError"
          />
          <span v-else class="agent-icon">{{ getDisplayAvatar(agent.image) }}</span>
        </div>
        <div class="agent-card-content">
          <h3 class="agent-card-title">{{ agent.title }}</h3>
          <p class="agent-card-description">{{ agent.description }}</p>
        </div>
      </div>
    </div>

    <!-- 空状态展示 -->
    <div v-else-if="activeTab === TABS.PERSONAL" class="empty-state">
      <div class="empty-image">
        <img src="/src/images/backgrounds/allAgentEmpty.png" :alt="UI_TEXT.EMPTY_STATE.IMAGE_ALT">
      </div>
      <p class="empty-text">{{ UI_TEXT.EMPTY_STATE.TEXT }}</p>
      <a-button type="primary" size="large" @click="handleCreateAgent" class="empty-create-btn">
        {{ UI_TEXT.EMPTY_STATE.BUTTON }}
      </a-button>
    </div>


    <!-- 创建智能体对话框 -->
    <a-modal
      v-model:open="createAgentModalVisible"
      :footer="null"
      :width="800"
      :centered="true"
      @cancel="handleCloseCreateModal"
      :wrapClassName="'create-agent-modal-wrap'"
    >
      <template #title>
        <div class="modal-title-with-icon">
          <img src="/images/avatars/setupAgentModalTitleIcon.png" alt="图标" class="title-icon" />
          <span>创建智能体</span>
        </div>
      </template>
      <div class="create-agent-modal-content">
        <ChatInput
          ref="chatInputRef"
          :activeMode="'ai-role-generation'"
          :loading="isCreatingAgent"
          type="input"
          placeholder="智能体名称，如：李白"
          :clear-on-send="false"
          @send-message="handleModalSendMessage"
          @stop-request="handleStopRequest"
        />
      </div>
    </a-modal>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '@/stores/index.js'
import { isImageUrl } from '@/services/api.js'
import { getOfficialAgents, getPersonalAgents, fetchAdminAgents } from './utils.js'
import { 
  TABS, 
  TAB_CONFIG, 
  PAGE_CONFIG, 
  UI_TEXT, 
  ROUTES 
} from './constants.js'
import ChatInput from '@/components/ChatInput'
import { handleSendMessage as handleSendMessageUtil, cancelCurrentRequest } from '@/views/Home/utils.js'
import { navigateToAgentChat } from '@/utils/chatNavigator.js'

const router = useRouter()
const appStore = useAppStore()

const activeTab = ref(PAGE_CONFIG.DEFAULT_TAB)
const searchKeyword = ref('')

const officialAgents = ref([])
const personalAgents = ref([])
const loadingOfficialAgents = ref(false)
const loadingPersonalAgents = ref(false)
const officialAgentsError = ref(null)
const personalAgentsError = ref(null)

// 创建智能体对话框相关状态
const createAgentModalVisible = ref(false)
const isCreatingAgent = ref(false)
const chatInputRef = ref(null)

const currentAgents = computed(() => {
  return activeTab.value === TABS.OFFICIAL ? officialAgents.value : personalAgents.value
})

const filteredAgents = computed(() => {
  if (!searchKeyword.value) {
    return currentAgents.value
  }
  return currentAgents.value.filter(agent => 
    agent.title.includes(searchKeyword.value) || 
    agent.description.includes(searchKeyword.value)
  )
})

const isCurrentTabLoading = computed(() => {
  return activeTab.value === TABS.OFFICIAL ? loadingOfficialAgents.value : loadingPersonalAgents.value
})

const currentTabError = computed(() => {
  return activeTab.value === TABS.OFFICIAL ? officialAgentsError.value : personalAgentsError.value
})

const handleSearch = (value) => {
  console.log('搜索:', value)
}

const handleCreateAgent = () => {
  createAgentModalVisible.value = true
}

const handleCloseCreateModal = () => {
  createAgentModalVisible.value = false
  isCreatingAgent.value = false
}

const handleModalSendMessage = async (data) => {
  isCreatingAgent.value = true
  try {
    // 使用首页的发送消息逻辑，传入成功回调
    await handleSendMessageUtil(data, appStore, router, () => {
      // 创建成功后清空输入框并关闭对话框
      if (chatInputRef.value) {
        chatInputRef.value.clearInput()
      }
      handleCloseCreateModal()
    })
  } catch (error) {
    console.error('创建智能体失败:', error)
  } finally {
    isCreatingAgent.value = false
  }
}

const handleStopRequest = () => {
  // 取消当前请求
  cancelCurrentRequest()
  isCreatingAgent.value = false
  appStore.setLoading(false)
  console.log('停止创建智能体')
}

const handleAgentClick = async (agent) => {
  console.log('点击智能体:', agent)
  try {
    // 使用统一的导航工具，与首页保持一致
    await navigateToAgentChat(agent.id, router)
  } catch (error) {
    console.error('导航到聊天页面失败:', error)
  }
}


const retryLoadCurrentTab = async () => {
  if (activeTab.value === TABS.OFFICIAL) {
    await fetchOfficialAgents()
  } else if (activeTab.value === TABS.PERSONAL) {
    await fetchPersonalAgents()
  }
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
 * 获取官方推荐数据
 */
const fetchOfficialAgents = async () => {
  try {
    loadingOfficialAgents.value = true
    officialAgentsError.value = null
    
    // 如果全局状态没有数据，先获取管理员智能体数据
    if (appStore.adminAgents.length === 0) {
      await fetchAdminAgents()
    }
    
    officialAgents.value = await getOfficialAgents()
  } catch (err) {
    console.error('获取官方推荐数据失败:', err)
    officialAgentsError.value = err.message || '获取数据失败'
  } finally {
    loadingOfficialAgents.value = false
  }
}

/**
 * 获取个人智能体数据
 */
const fetchPersonalAgents = async () => {
  try {
    loadingPersonalAgents.value = true
    personalAgentsError.value = null
    personalAgents.value = await getPersonalAgents()
  } catch (err) {
    console.error('获取个人智能体数据失败:', err)
    personalAgentsError.value = err.message || '获取数据失败'
  } finally {
    loadingPersonalAgents.value = false
  }
}

/**
 * 监听Tab切换
 */
watch(activeTab, async (newTab, oldTab) => {
  if (newTab === oldTab) return
  
  if (newTab === TABS.OFFICIAL) {
    // 每次切换到官方推荐都重新获取数据
    await fetchOfficialAgents()
  } else if (newTab === TABS.PERSONAL) {
    // 每次切换到我的创建都重新获取数据
    await fetchPersonalAgents()
  }
})

onMounted(async () => {
  // 根据当前激活的Tab加载对应数据
  if (activeTab.value === TABS.OFFICIAL) {
    await fetchOfficialAgents()
  } else if (activeTab.value === TABS.PERSONAL) {
    await fetchPersonalAgents()
  }
})
</script>

<style lang="scss" scoped>
.all-agents {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;

  .breadcrumb {
    margin-bottom: 24px;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    
    .header-left {
      flex: 1;
      
      .custom-tabs {
        display: inline-flex;
        background: rgba(255, 255, 255, 0.48);
        border-radius: 8px;
        padding: 4px;
        
        .tab-item {
          padding: 8px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 14px;
          font-weight: 500;
          color: #646479;
          background: transparent;
          
          &.active {
            background: #ffffff;
            color: #355EFF;
            box-shadow: 0 4px 16px rgba(53, 94, 255, 0.16);
          }
          
          &:hover:not(.active) {
            background: rgba(255, 255, 255, 0.6);
            color: #355EFF;
          }
        }
      }
    }
    
    .header-right {
      display: flex;
      align-items: center;
    }
  }

  .agents-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 24px;
    margin-bottom: 48px;
    max-height: 600px; /* 设置固定最大高度 */
    overflow-y: auto; /* 垂直滚动 */
    
    /* 优化滚动性能 */
    -webkit-overflow-scrolling: touch; /* iOS 平滑滚动 */
    scroll-behavior: smooth; /* 平滑滚动 */
    will-change: scroll-position; /* 优化滚动性能 */
    
    /* 隐藏滚动条但保持滚动功能 */
    &::-webkit-scrollbar {
      display: none;
    }
    
    /* Firefox 隐藏滚动条 */
    scrollbar-width: none;
    -ms-overflow-style: none;
  }

  .agent-card {
    width: 100%;
    height: 120px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 8px;
    padding: 16px;
    cursor: pointer;
    border: 1px solid rgba(255, 255, 255, 0.3);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    display: flex;
    align-items: center;
    gap: 16px;
    transform: translateZ(0); /* 强制硬件加速 */
    backface-visibility: hidden; /* 优化渲染性能 */
    transition: transform 0.2s ease, box-shadow 0.2s ease; /* 只对需要的属性使用transition */
    
    &:hover {
      transform: translateY(-1px) translateZ(0);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    }
    
    .agent-card-image {
      flex-shrink: 0;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
      border-radius: 8px;
      transform: translateZ(0); /* 强制硬件加速 */
      
      .agent-icon {
        font-size: 24px;
      }
      
      .agent-avatar-image {
        width: 100%;
        height: 100%;
        border-radius: 8px;
        object-fit: cover;
        object-position: center;
        transform: translateZ(0); /* 强制硬件加速 */
      }
    }
    
    .agent-card-content {
      flex: 1;
      min-width: 0;
      transform: translateZ(0); /* 强制硬件加速 */
      
      .agent-card-title {
        font-family: MiSans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 16px;
        font-weight: 500;
        line-height: 20px;
        color: #181B49;
        margin: 0 0 8px 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-rendering: optimizeSpeed; /* 优化文本渲染 */
      }
      
      .agent-card-description {
        font-family: MiSans, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 12px;
        font-weight: normal;
        line-height: 18px;
        color: #646479;
        margin: 0;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        text-rendering: optimizeSpeed; /* 优化文本渲染 */
      }
    }
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 24px;
    text-align: center;
    
    .empty-image {
      margin-bottom: 24px;
      opacity: 0.8;
    }
    
    .empty-text {
      font-size: 16px;
      color: #646479;
      margin-bottom: 32px;
      line-height: 1.5;
      max-width: 400px;
    }
    
    .empty-create-btn {
      min-width: 120px;
    }
  }


  .loading-state, .error-state {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
    padding: 40px;
  }

  .loading-content, .error-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    text-align: center;
  }

  .loading-spinner {
    width: 32px;
    height: 32px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #355EFF;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .loading-text {
    color: #646479;
    font-size: 14px;
  }

  .error-text {
    color: #ff4d4f;
    font-size: 14px;
    margin-bottom: 8px;
  }

  
}

// 创建智能体对话框样式 - 使用全局选择器确保生效

.create-agent-modal-content {
  background: transparent !important;

  :deep(.chat-input) {
    margin-bottom: 0;
    max-width: unset;
    margin: unset;
    margin-top: 40px;
    margin-bottom: 60px;

    .input-container {
      &::before {
        border: 1px solid #D0D5DC;
        opacity: 1;
      }
    }
  }
}
</style>

<style lang="scss">
/* 创建智能体模态框背景 - 全局样式 */
.create-agent-modal-wrap .ant-modal-content {
  background-image: url('/images/backgrounds/setupAgentTitleBg.png') !important;
  background-size: cover !important;
  background-position: top !important;
  background-repeat: no-repeat !important;
}

.create-agent-modal-wrap .ant-modal-header {
  background: transparent !important;
  border-bottom: none !important;
}

.modal-title-with-icon {
  display: flex !important;
  align-items: center !important;
  font-weight: 600 !important;
}

.modal-title-with-icon .title-icon {
  width: 20px !important;
  height: 20px !important;
  margin-right: 5px !important;
}

.create-agent-modal-wrap .ant-modal-body {
  background: transparent !important;
}
</style>