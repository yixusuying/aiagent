export const UI_TEXT = {
  TITLE: '角色智能体',
  NAV: {
    CONFIG_AGENT: '配置智能体',
    SHARE: '分享'
  },
  SIDEBAR: {
    CONVERSATIONS: '历史对话',
    EMPTY: '暂无对话历史'
  }
}

// 示例对话历史数据
export const SAMPLE_CONVERSATIONS = [
  {
    id: 1,
    agentName: '苏士比亚',
    agentAvatar: '🎭',
    lastMessage: '戏剧，戏剧的那种，戏剧',
    timestamp: new Date('2024-01-15 14:30:00').getTime(),
    isActive: false
  },
  {
    id: 2,
    agentName: '苏士比亚', 
    agentAvatar: '🎭',
    lastMessage: '戏剧，戏剧的那种，戏剧',
    timestamp: new Date('2024-01-15 13:45:00').getTime(),
    isActive: true
  },
  {
    id: 3,
    agentName: '苏士比亚',
    agentAvatar: '🎭', 
    lastMessage: '戏剧，戏剧的那种，戏剧',
    timestamp: new Date('2024-01-15 12:20:00').getTime(),
    isActive: false
  },
  {
    id: 4,
    agentName: '苏士比亚',
    agentAvatar: '🎭',
    lastMessage: '戏剧，戏剧的那种，戏剧',
    timestamp: new Date('2024-01-15 11:10:00').getTime(),
    isActive: false
  },
  {
    id: 5,
    agentName: '苏士比亚',
    agentAvatar: '🎭',
    lastMessage: '戏剧，戏剧的那种，戏剧',
    timestamp: new Date('2024-01-15 10:30:00').getTime(),
    isActive: false
  },
  {
    id: 6,
    agentName: '苏士比亚',
    agentAvatar: '🎭',
    lastMessage: '戏剧，戏剧的那种，戏剧',
    timestamp: new Date('2024-01-14 16:20:00').getTime(),
    isActive: false
  },
  {
    id: 7,
    agentName: '梦',
    agentAvatar: '🌙',
    lastMessage: '戏剧，戏剧的那种，戏剧',
    timestamp: new Date('2024-01-14 15:15:00').getTime(),
    isActive: false
  },
  {
    id: 8,
    agentName: '苏士比亚',
    agentAvatar: '🎭',
    lastMessage: '戏剧，戏剧的那种，戏剧',
    timestamp: new Date('2024-01-14 14:40:00').getTime(),
    isActive: false
  },
  {
    id: 9,
    agentName: '苏士比亚',
    agentAvatar: '🎭',
    lastMessage: '戏剧，戏剧的那种，戏剧',
    timestamp: new Date('2024-01-14 13:30:00').getTime(),
    isActive: false
  }
]

// 示例智能体信息
export const AGENT_INFO = {
  id: 'default',
  name: '',
  avatar: '👨‍🏫',
  description: '',
  openingRemarks: '',
  presetQuestions: [],
  isOwnedByUser: false, // 是否为用户创建的智能体
  isAddedToUserAgents: false // 是否已添加到用户的智能体中
}

// 智能体数据库（模拟）
export const AGENT_DATABASE = {
  '1': {
    id: '1',
    name: '苏士比亚',
    avatar: '🎭',
    description: '戏剧大师，莎士比亚的化身，擅长创作和解析戏剧作品',
    openingRemarks: '世界是一个舞台，所有的男男女女不过是一些演员罢了。您想要探讨什么戏剧话题呢？',
    presetQuestions: [
      '什么是悲剧？',
      '如何理解哈姆雷特？',
      '戏剧的核心是什么？',
      '如何创作戏剧？'
    ],
    isOwnedByUser: false,
    isAddedToUserAgents: false,
    // 配置信息
    backgroundSetting: '16世纪的英格兰，文艺复兴时期的戏剧家和诗人，创作了众多不朽的戏剧作品',
    personality: '富有想象力、深刻洞察人性、语言天赋极高，善于通过戏剧表达人生哲理',
    voice: 'male-deep',
    audienceAge: 'adult',
    contentComplexity: 'complex',
    mainStyle: 'academic',
    auxiliaryTraits: ['storytelling']
  },
  '2': {
    id: '2', 
    name: '我的智能助手',
    avatar: '🤖',
    description: '由我创建的个人智能助手',
    openingRemarks: '您好！我是您的专属智能助手，有什么可以帮助您的吗？',
    presetQuestions: [
      '你能做什么？',
      '如何更好地使用你？',
      '有什么建议给我？'
    ],
    isOwnedByUser: true,
    isAddedToUserAgents: true,
    backgroundSetting: '一个专为用户定制的智能助手',
    personality: '友好、耐心、专业',
    voice: 'female-gentle',
    audienceAge: 'adult',
    contentComplexity: 'medium',
    mainStyle: 'warm',
    auxiliaryTraits: ['supportive', 'practical']
  }
}