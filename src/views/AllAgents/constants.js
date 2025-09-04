export const TABS = {
  OFFICIAL: 'official',
  PERSONAL: 'personal'
}

export const TAB_CONFIG = {
  [TABS.OFFICIAL]: {
    label: '官方推荐',
    key: TABS.OFFICIAL
  },
  [TABS.PERSONAL]: {
    label: '我的创建',
    key: TABS.PERSONAL
  }
}

export const PAGE_CONFIG = {
  SIZE: 12,
  DEFAULT_TAB: TABS.OFFICIAL
}

export const UI_TEXT = {
  BREADCRUMB: {
    HOME: '首页',
    AGENTS_PLAZA: '智能体广场'
  },
  SEARCH: {
    PLACEHOLDER: '搜索智能角色'
  },
  BUTTONS: {
    CREATE_AGENT: '创建AI角色'
  },
  EMPTY_STATE: {
    TEXT: '您还没有创建过AI角色，点击按钮快速创建',
    BUTTON: '创建AI角色',
    IMAGE_ALT: '空状态图片'
  }
}

export const UI_CONFIG = {
  CONTAINER: {
    MAX_WIDTH: '1200px',
    PADDING: '24px'
  },
  BREADCRUMB: {
    MARGIN_BOTTOM: '24px'
  },
  HEADER: {
    MARGIN_BOTTOM: '32px'
  },
  SEARCH: {
    WIDTH: '300px',
    MARGIN_RIGHT: '16px'
  },
  GRID: {
    MIN_COLUMN_WIDTH: '260px',
    GAP: '24px',
    MARGIN_BOTTOM: '48px'
  },
  CARD: {
    HEIGHT: '120px',
    PADDING: '16px',
    BORDER_RADIUS: '8px',
    ICON_GAP: '16px'
  },
  EMPTY_STATE: {
    PADDING: '80px 24px',
    IMAGE_MARGIN_BOTTOM: '24px',
    TEXT_MARGIN_BOTTOM: '32px',
    TEXT_MAX_WIDTH: '400px',
    BUTTON_MIN_WIDTH: '120px'
  },
  TABS: {
    BACKGROUND: 'rgba(255, 255, 255, 0.48)',
    BORDER_RADIUS: '8px',
    PADDING: '4px',
    ITEM_PADDING: '8px 20px',
    ITEM_BORDER_RADIUS: '8px'
  }
}

export const COLORS = {
  PRIMARY: '#355EFF',
  TEXT_PRIMARY: '#181B49',
  TEXT_SECONDARY: '#646479',
  BACKGROUND_OVERLAY: 'rgba(255, 255, 255, 0.9)',
  BORDER: 'rgba(255, 255, 255, 0.3)',
  GRADIENT_ICON: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)'
}

export const ROUTES = {
  HOME: '/',
  AGENTS: '/agents'
}

export const MOCK_OFFICIAL_AGENTS = [
  {
    id: 1,
    title: '智能课堂助手',
    description: '专业的课堂管理助手，能够协助教师进行课堂互动、学生管理和教学辅导，提供个性化的学习建议。',
    image: '🤖',
    category: 'education',
    tags: ['教学辅导', '课堂管理']
  },
  {
    id: 2,
    title: '学科专家导师',
    description: '各学科领域的专业导师角色，具备深厚的学科知识和丰富的教学经验，为学生提供专业指导。',
    image: '👨‍🏫',
    category: 'education',
    tags: ['学科指导', '专业知识']
  },
  {
    id: 3,
    title: '互动学习伙伴',
    description: '友好的学习伙伴角色，能够与学生进行自然对话，激发学习兴趣，提供学习陪伴和鼓励。',
    image: '👥',
    category: 'companion',
    tags: ['学习陪伴', '互动对话']
  },
  {
    id: 4,
    title: '创意思维启发师',
    description: '专注于启发学生创造性思维的角色，通过引导式提问和创意活动，培养学生的创新能力。',
    image: '💡',
    category: 'creativity',
    tags: ['创意思维', '创新培养']
  },
  {
    id: 5,
    title: '心理健康顾问',
    description: '关注学生心理健康的专业角色，提供情感支持、压力管理和心理疏导，营造积极的学习环境。',
    image: '💚',
    category: 'health',
    tags: ['心理健康', '情感支持']
  },
  {
    id: 6,
    title: '职业规划导师',
    description: '专业的职业规划指导角色，帮助学生了解不同职业路径，制定学习目标和未来发展计划。',
    image: '🎯',
    category: 'career',
    tags: ['职业规划', '发展指导']
  },
  {
    id: 7,
    title: '编程学习助手',
    description: '专业的编程教学助手，提供代码示例、算法讲解和编程实践指导，适合不同水平的学习者。',
    image: '💻',
    category: 'programming',
    tags: ['编程教学', '代码指导']
  },
  {
    id: 8,
    title: '语言学习伙伴',
    description: '多语言学习助手，提供发音练习、语法讲解和文化交流，帮助学生提高外语水平。',
    image: '🗣️',
    category: 'language',
    tags: ['语言学习', '文化交流']
  },
  {
    id: 9,
    title: '数学思维训练师',
    description: '专注于数学思维培养的助手，通过趣味问题和逻辑训练，提升学生的数学能力和思维水平。',
    image: '🔢',
    category: 'math',
    tags: ['数学思维', '逻辑训练']
  },
  {
    id: 10,
    title: '科学实验指导员',
    description: '科学实验教学助手，提供实验设计、操作指导和结果分析，培养学生的科学探究能力。',
    image: '🔬',
    category: 'science',
    tags: ['科学实验', '探究学习']
  },
  {
    id: 11,
    title: '艺术创作导师',
    description: '艺术教育专家，指导绘画、音乐、设计等艺术创作，激发学生的艺术潜能和审美能力。',
    image: '🎨',
    category: 'art',
    tags: ['艺术创作', '审美培养']
  },
  {
    id: 12,
    title: '阅读理解导师',
    description: '阅读教学专家，提供文本分析、阅读策略和理解技巧，提升学生的阅读能力和文学素养。',
    image: '📚',
    category: 'reading',
    tags: ['阅读理解', '文学素养']
  }
]

export const MOCK_PERSONAL_AGENTS = [
  // 空数组，用于展示空状态
]