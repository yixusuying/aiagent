import { MOCK_OFFICIAL_AGENTS, MOCK_PERSONAL_AGENTS, PAGE_CONFIG } from './constants.js'
import { useAppStore } from '@/stores/index.js'
import { agentService } from '@/services'
import { formatAvatarUrl } from '@/services/api.js'
import { cleanDescription } from '@/utils/agentParser.js'

export const getOfficialAgents = async () => {
  const appStore = useAppStore()
  
  // 如果全局状态有管理员智能体数据，使用API数据
  if (appStore.adminAgents.length > 0) {
    await new Promise(resolve => setTimeout(resolve, 100)) // 短暂延迟保持一致性
    return appStore.adminAgents
  }
  
  // 否则使用原来的Mock数据
  await new Promise(resolve => setTimeout(resolve, 300))
  return MOCK_OFFICIAL_AGENTS
}

export const getPersonalAgents = async () => {
  try {
    const response = await agentService.getMyAgents()
    console.log('用户智能体API返回的原始数据:', response)
    
    // 转换API数据为组件需要的格式
    const transformedData = (Array.isArray(response) ? response : []).map(agent => ({
      id: agent.id,
      title: agent.name || '未命名智能体',
      description: cleanDescription(agent.introduction) || '暂无描述',
      image: formatAvatarUrl(agent.avatar) || '🤖'
    }))
    
    return transformedData
  } catch (err) {
    console.error('获取用户智能体失败:', err)
    // 如果API调用失败，回退到Mock数据
    await new Promise(resolve => setTimeout(resolve, 300))
    return MOCK_PERSONAL_AGENTS
  }
}

/**
 * 直接获取管理员智能体数据并存储到全局状态
 */
export const fetchAdminAgents = async () => {
  const appStore = useAppStore()
  
  try {
    const response = await agentService.getAdminAgents()
    console.log('管理员智能体API返回的原始数据:', response)
    
    // 转换API数据为组件需要的格式
    const transformedData = (Array.isArray(response) ? response : []).map(agent => ({
      id: agent.id,
      title: agent.name || '未命名智能体',
      description: cleanDescription(agent.introduction) || '暂无描述',
      image: formatAvatarUrl(agent.avatar) || '🤖'
    }))
    
    // 存储到全局状态
    appStore.setAdminAgents(transformedData)
    return transformedData
  } catch (err) {
    console.error('获取管理员智能体失败:', err)
    throw err
  }
}

export const searchAgents = (agents, keyword) => {
  if (!keyword) return agents
  
  return agents.filter(agent => 
    agent.title.toLowerCase().includes(keyword.toLowerCase()) ||
    agent.description.toLowerCase().includes(keyword.toLowerCase()) ||
    agent.tags.some(tag => tag.includes(keyword))
  )
}

export const filterAgentsByCategory = (agents, category) => {
  if (!category) return agents
  
  return agents.filter(agent => agent.category === category)
}