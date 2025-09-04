export const UI_TEXT = {
  TITLE: '设置你的智能体',
  
  CONFIG: {
    AGENT_NAME: '智能体名称',
    ROLE_SETTING: '角色设定',
    BACKGROUND_SETTING: '背景设定',
    PERSONALITY: '角色性格',
    VOICE: '声音',
    OPENING_REMARKS: '开场白',
    PRESET_QUESTIONS: '预设提问',
    PRESET_QUESTIONS_DESC: '每行输入一个问题，手动换行表示不同问题',
    ADVANCED_CONFIG: '高级配置',
    KNOWLEDGE_BASE: '知识库',
    
    PLACEHOLDERS: {
      NAME: '',
      BACKGROUND: '',
      PERSONALITY: '',
      OPENING_REMARKS: '',
      PRESET_QUESTIONS: ''
    }
  },
  
  PREVIEW: {
    TITLE: '调试与预览'
  },
  
  BUTTONS: {
    CANCEL: '取消',
    SAVE: '保存设置',
    REGENERATE: '重新生成',
    UPLOAD_FILE: '将文件拖到此处，或点击上传',
    SUPPORTED_FORMATS: '支持txt、pdf、docx等格式'
  },
  
  CHAT: {
    INPUT_PLACEHOLDER: '输入消息与智能体对话...'
  },
  
  INTRO_CARD: {
    YOU_CAN_ASK: '您可以问'
  }
}

export const VOICE_OPTIONS = [
  { value: 'male-cantonese-deep', label: '男性粤语-深沉敦厚' },
  { value: 'male-deep', label: '男性传统-深沉稳重' },
  { value: 'male-young', label: '男性年轻-活力阳光' },
  { value: 'female-gentle', label: '女性温柔-亲切甜美' },
  { value: 'female-professional', label: '女性专业-知性干练' }
]

// 受众年龄选项
export const AUDIENCE_AGE_OPTIONS = [
  { key: 'elementary', label: '小学生（6-12岁）' },
  { key: 'middle', label: '中学生（13-18岁）' },
  { key: 'adult', label: '成人（18岁以上）' },
  { key: 'researcher', label: '学者研究者' }
]

// 内容复杂度选项
export const CONTENT_COMPLEXITY_OPTIONS = [
  { key: 'simple', label: '简单' },
  { key: 'medium', label: '中等' },
  { key: 'complex', label: '复杂' }
]

// 主要风格选项
export const MAIN_STYLE_OPTIONS = [
  { key: 'warm', label: '温和亲切' },
  { key: 'rigorous', label: '幽默风趣' },
  { key: 'academic', label: '学术严谨' }
]

// 辅助特色选项
export const AUXILIARY_TRAIT_OPTIONS = [
  { key: 'storytelling', label: '善于讲故事' },
  { key: 'practical', label: '善用比喻' },
  { key: 'patient', label: '注重实用' },
  { key: 'supportive', label: '善于鼓励' },
  { key: 'guidance', label: '引导思考' },
  { key: 'comprehensive', label: '结合现代' }
]

export const DEFAULT_AGENT_CONFIG = {
  name: '',
  backgroundSetting: '',
  personality: '',
  avatar: '👨‍🏫',
  voice: '',
  openingRemarks: '',
  presetQuestions: [],
  // 高级配置 - 默认为undefined，支持取消选择
  audienceAge: undefined,
  contentComplexity: undefined,
  mainStyle: undefined,
  auxiliaryTraits: []
}

export const SAMPLE_QUESTIONS = [
  '你能做什么？',
  '介绍一下你的特长',
  '如何更好地使用你的服务？',
  '你有什么建议给我？'
]

export const AVATAR_OPTIONS = [
  '🤖', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', 
  '👨‍💻', '👩‍💻', '👨‍🔬', '👩‍🔬', '🧠',
  '💡', '⭐', '🎯', '🚀', '🌟'
]