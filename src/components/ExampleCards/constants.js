export const EXAMPLE_DATA = {
  'ai-resource-search': [
    {
      id: 1,
      title: '秋天的神秘科学探索',
      subject: '自然科学',
      date: '2023-10-15',
      contentLines: 8
    },
    {
      id: 2,
      title: 'Unit 2: Animals at the Zoo',
      subject: '英语教学',
      date: '2023-10-12',
      contentLines: 6
    },
    {
      id: 3,
      title: '体验编程1 PBL教学设计',
      subject: '信息技术',
      date: '2023-10-08',
      contentLines: 7
    }
  ],
  'ai-design-generation': [
    {
      id: 4,
      title: '数学思维训练教学设计',
      subject: '数学',
      date: '2023-10-16',
      contentLines: 9
    },
    {
      id: 5,
      title: '古诗词鉴赏课程设计',
      subject: '语文',
      date: '2023-10-14',
      contentLines: 8
    },
    {
      id: 6,
      title: '化学实验安全教学',
      subject: '化学',
      date: '2023-10-11',
      contentLines: 6
    }
  ],
  'ai-role-generation': [
    {
      id: 7,
      title: '智能课堂助手',
      description: '专业的课堂管理助手，能够协助教师进行课堂互动、学生管理和教学辅导，提供个性化的学习建议。',
      image: '🤖'
    },
    {
      id: 8,
      title: '学科专家导师',
      description: '各学科领域的专业导师角色，具备深厚的学科知识和丰富的教学经验，为学生提供专业指导。',
      image: '👨‍🏫'
    },
    {
      id: 9,
      title: '互动学习伙伴',
      description: '友好的学习伙伴角色，能够与学生进行自然对话，激发学习兴趣，提供学习陪伴和鼓励。',
      image: '👥'
    },
    {
      id: 10,
      title: '创意思维启发师',
      description: '专注于启发学生创造性思维的角色，通过引导式提问和创意活动，培养学生的创新能力。',
      image: '💡'
    },
    {
      id: 11,
      title: '心理健康顾问',
      description: '关注学生心理健康的专业角色，提供情感支持、压力管理和心理疏导，营造积极的学习环境。',
      image: '💚'
    },
    {
      id: 12,
      title: '职业规划导师',
      description: '专业的职业规划指导角色，帮助学生了解不同职业路径，制定学习目标和未来发展计划。',
      image: '🎯'
    }
  ]
}

export const UI_CONFIG = {
  MAX_WIDTH: '1000px',
  GRID_MIN_WIDTH: '280px',
  GRID_GAP: '24px',
  CARD_HEIGHT: '160px',
  CARD_PADDING: '16px',
  CARD_BORDER_RADIUS: '12px',
  CARD_MARGIN_BOTTOM: '32px',
  ROLE_CARD: {
    WIDTH: '260px',
    HEIGHT: '100px',
    PADDING: '12px',
    BORDER_RADIUS: '8px',
    IMAGE_SIZE: '40px',
    GRID_COLUMNS: 3,
    GRID_ROWS: 2
  },
  DESIGN_LAYOUT: {
    MAX_WIDTH: '800px',
    GRID_MIN_WIDTH: '240px',
    GRID_GAP: '16px',
    CARD_HEIGHT: '216px', // Calculated to match role layout total height
    TOTAL_HEIGHT: '248px' // 2 * 100px + 16px gap + 32px margin
  }
}

export const UI_TEXT = {
  VIEW_MORE_BY_MODE: {
    'ai-resource-search': '查看更多资源 >',
    'ai-design-generation': '查看更多设计 >',
    'ai-role-generation': '查看全部智能角色 >'
  },
  DEFAULT_VIEW_MORE: '查看更多 >'
}

export const CONTENT_LINE_WIDTHS = {
  1: '90%',
  2: '85%',
  3: '92%',
  4: '78%',
  5: '88%',
  6: '82%',
  7: '95%',
  8: '87%',
  9: '90%'
}