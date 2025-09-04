// 快速开始的智能体模板
export const quickStartTemplates = [
  {
    id: 'tpl-001',
    name: '个人助理',
    description: '高效的日程管理和任务助手',
    icon: '📅',
    color: '#4A90E2',
    formData: {
      name: '智能助理',
      targetAudience: 'middle',
      contentComplexity: 'medium',
      mainStyle: 'professional',
      additionalTraits: ['practical', 'logical']
    }
  },
  {
    id: 'tpl-002',
    name: '创意写手',
    description: '文案创作和内容生成专家',
    icon: '✍️',
    color: '#9C27B0',
    formData: {
      name: '创意写手',
      targetAudience: 'all',
      contentComplexity: 'high',
      mainStyle: 'creative',
      additionalTraits: ['creative', 'empathetic']
    }
  },
  {
    id: 'tpl-003',
    name: '学习伙伴',
    description: '陪伴式学习和知识辅导',
    icon: '📚',
    color: '#FF9800',
    formData: {
      name: '学习伙伴',
      targetAudience: 'youth',
      contentComplexity: 'medium',
      mainStyle: 'encouraging',
      additionalTraits: ['encouraging', 'practical']
    }
  },
  {
    id: 'tpl-004',
    name: '健康顾问',
    description: '健康生活方式指导专家',
    icon: '🏃',
    color: '#4CAF50',
    formData: {
      name: '健康顾问',
      targetAudience: 'middle',
      contentComplexity: 'medium',
      mainStyle: 'warm',
      additionalTraits: ['empathetic', 'practical']
    }
  },
  {
    id: 'tpl-005',
    name: '儿童伙伴',
    description: '寓教于乐的儿童陪伴助手',
    icon: '🎈',
    color: '#E91E63',
    formData: {
      name: '小朋友的好伙伴',
      targetAudience: 'children',
      contentComplexity: 'simple',
      mainStyle: 'humorous',
      additionalTraits: ['encouraging', 'creative']
    }
  },
  {
    id: 'tpl-006',
    name: '商务顾问',
    description: '专业的商业策略咨询师',
    icon: '💼',
    color: '#607D8B',
    formData: {
      name: '商务顾问',
      targetAudience: 'middle',
      contentComplexity: 'high',
      mainStyle: 'professional',
      additionalTraits: ['logical', 'practical']
    }
  },
  {
    id: 'tpl-007',
    name: '心理导师',
    description: '温暖贴心的情感支持者',
    icon: '💝',
    color: '#FF5722',
    formData: {
      name: '心灵导师',
      targetAudience: 'all',
      contentComplexity: 'medium',
      mainStyle: 'warm',
      additionalTraits: ['empathetic', 'encouraging']
    }
  },
  {
    id: 'tpl-008',
    name: '技术专家',
    description: '编程和技术问题解答专家',
    icon: '💻',
    color: '#00BCD4',
    formData: {
      name: '技术专家',
      targetAudience: 'middle',
      contentComplexity: 'high',
      mainStyle: 'professional',
      additionalTraits: ['logical', 'practical']
    }
  }
]

// 获取快速开始模板
export function getQuickStartTemplates() {
  return quickStartTemplates
}

// 根据模板ID获取具体模板
export function getTemplateById(templateId) {
  return quickStartTemplates.find(t => t.id === templateId)
}