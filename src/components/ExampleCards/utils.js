import { EXAMPLE_DATA, UI_TEXT } from '@/components/ExampleCards/constants.js'
import { navigateToAgentChat } from '@/utils/chatNavigator.js'

export const getExamplesForMode = (activeMode) => {
  return EXAMPLE_DATA[activeMode] || EXAMPLE_DATA['ai-resource-search']
}

export const getViewMoreText = (activeMode) => {
  return UI_TEXT.VIEW_MORE_BY_MODE[activeMode] || UI_TEXT.DEFAULT_VIEW_MORE
}

export const formatExampleDate = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

export const generateContentLines = (count) => {
  return Array.from({ length: count }, (_, index) => index + 1)
}

export const handleCardSelection = async (example, emit, router = null, activeMode = null) => {
  // 如果是AI角色智能生成模式且有router，使用统一的导航工具
  if (activeMode === 'ai-role-generation' && router) {
    try {
      await navigateToAgentChat(example.id, router)
    } catch (error) {
      console.error('导航到聊天页面失败:', error)
    }
    return
  }
  
  // 其他模式继续使用原有逻辑
  emit('card-select', example)
}

export const filterExamplesBySubject = (examples, subject) => {
  if (!subject) return examples
  return examples.filter(example => 
    example.subject.toLowerCase().includes(subject.toLowerCase())
  )
}

export const sortExamplesByDate = (examples, ascending = false) => {
  return [...examples].sort((a, b) => {
    const dateA = new Date(a.date)
    const dateB = new Date(b.date)
    return ascending ? dateA - dateB : dateB - dateA
  })
}