export const MODES = [
  // {
  //   key: 'ai-resource-search',
  //   label: 'AI资源检索',
  //   icon: '📚'
  // },
  {
    key: 'ai-design-generation',
    label: 'AI教学设计生成',
    icon: '🎯',
    iconPath: '/images/avatars/classDesignIcon.png',
    defaultIconPath: '/images/avatars/classDesignIcon_default.png'
  },
  {
    key: 'ai-role-generation',
    label: 'AI角色智能生成',
    icon: '📊',
    iconPath: '/images/avatars/createAIRole.png',
    defaultIconPath: '/images/avatars/createAIRole_default.png'
  }
]

export const DEFAULT_MODE = 'ai-role-generation'

export const UI_CONFIG = {
  GAP: '16px',
  MARGIN_BOTTOM: '32px',
  BUTTON_PADDING: '8px 20px',
  BUTTON_BORDER_RADIUS: '20px',
  FONT_SIZE: '14px',
  ICON_SIZE: '16px'
}