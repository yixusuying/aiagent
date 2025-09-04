export const UI_TEXT = {
  BREADCRUMB: {
    HOME: '首页',
    AGENTS: '智能体广场',
    CREATE_AGENT: '创建智能体'
  },
  FORM: {
    AVATAR: {
      TITLE: '智能体头像',
      UPLOAD_TEXT: '点击上传'
    },
    NAME: {
      TITLE: '智能体名称',
      PLACEHOLDER: '请输入智能体名称'
    },
    TARGET_AUDIENCE: {
      TITLE: '目标受众设置',
      SUBTITLE: '选择智能体主要服务的用户群体',
      OPTIONS: {
        ELEMENTARY: '小学生(6-12岁)',
        MIDDLE: '中学生(13-18岁)',
        ADULT: '成人(18岁以上)',
        RESEARCHER: '学者研究者'
      }
    },
    CONTENT_COMPLEXITY: {
      TITLE: '内容复杂度',
      SUBTITLE: '根据受众选择合适的内容深度',
      OPTIONS: {
        SIMPLE: '简单',
        MEDIUM: '中等',
        COMPLEX: '复杂'
      }
    },
    INTERACTION_STYLE: {
      TITLE: '交流风格',
      MAIN_STYLE: {
        TITLE: '主要风格',
        SUBTITLE: '单选',
        OPTIONS: {
          WARM_FRIENDLY: '温和亲切',
          HUMOROUS: '幽默风格',
          SCHOLARLY: '学术严谨'
        }
      },
      ADDITIONAL_TRAITS: {
        TITLE: '辅助特色',
        SUBTITLE: '为智能体添加额外的个性特征',
        OPTIONS: {
          STORYTELLING: '善于讲故事',
          PRACTICAL: '喜用比喻',
          FOCUSED: '注重实用',
          ENCOURAGING: '善于鼓励',
          LOGICAL: '引导思考',
          MODERN: '结合现代'
        }
      }
    },
    SUBMIT_BUTTON: '生成AI角色'
  }
}

export const ROUTES = {
  HOME: '/',
  AGENTS: '/agents'
}

export const TARGET_AUDIENCE_OPTIONS = [
  { key: 'elementary', label: UI_TEXT.FORM.TARGET_AUDIENCE.OPTIONS.ELEMENTARY },
  { key: 'middle', label: UI_TEXT.FORM.TARGET_AUDIENCE.OPTIONS.MIDDLE },
  { key: 'adult', label: UI_TEXT.FORM.TARGET_AUDIENCE.OPTIONS.ADULT },
  { key: 'researcher', label: UI_TEXT.FORM.TARGET_AUDIENCE.OPTIONS.RESEARCHER }
]

export const COMPLEXITY_OPTIONS = [
  { key: 'simple', label: UI_TEXT.FORM.CONTENT_COMPLEXITY.OPTIONS.SIMPLE },
  { key: 'medium', label: UI_TEXT.FORM.CONTENT_COMPLEXITY.OPTIONS.MEDIUM },
  { key: 'complex', label: UI_TEXT.FORM.CONTENT_COMPLEXITY.OPTIONS.COMPLEX }
]

export const MAIN_STYLE_OPTIONS = [
  { key: 'warm', label: UI_TEXT.FORM.INTERACTION_STYLE.MAIN_STYLE.OPTIONS.WARM_FRIENDLY },
  { key: 'humorous', label: UI_TEXT.FORM.INTERACTION_STYLE.MAIN_STYLE.OPTIONS.HUMOROUS },
  { key: 'scholarly', label: UI_TEXT.FORM.INTERACTION_STYLE.MAIN_STYLE.OPTIONS.SCHOLARLY }
]

export const ADDITIONAL_TRAITS_OPTIONS = [
  { key: 'storytelling', label: UI_TEXT.FORM.INTERACTION_STYLE.ADDITIONAL_TRAITS.OPTIONS.STORYTELLING },
  { key: 'practical', label: UI_TEXT.FORM.INTERACTION_STYLE.ADDITIONAL_TRAITS.OPTIONS.PRACTICAL },
  { key: 'focused', label: UI_TEXT.FORM.INTERACTION_STYLE.ADDITIONAL_TRAITS.OPTIONS.FOCUSED },
  { key: 'encouraging', label: UI_TEXT.FORM.INTERACTION_STYLE.ADDITIONAL_TRAITS.OPTIONS.ENCOURAGING },
  { key: 'logical', label: UI_TEXT.FORM.INTERACTION_STYLE.ADDITIONAL_TRAITS.OPTIONS.LOGICAL },
  { key: 'modern', label: UI_TEXT.FORM.INTERACTION_STYLE.ADDITIONAL_TRAITS.OPTIONS.MODERN }
]