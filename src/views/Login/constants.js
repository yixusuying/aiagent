export const UI_TEXT = {
  TITLE: '欢迎登录',
  SUBTITLE: '请输入您的账号信息',
  USERNAME_LABEL: '用户名',
  PASSWORD_LABEL: '密码',
  USERNAME_PLACEHOLDER: '请输入用户名',
  PASSWORD_PLACEHOLDER: '请输入密码',
  LOGIN_BTN: '登录',
  LOGIN_BTN_LOADING: '登录中...',
  REGISTER_TEXT: '还没有账号？',
  REGISTER_BTN: '立即注册',
  LOGIN_SUCCESS: '登录成功！',
  LOGIN_FAILED: '登录失败，请检查用户名和密码',
  FORM_VALIDATION_FAILED: '请检查输入信息',
  REGISTER_NOT_AVAILABLE: '注册功能暂未开放'
}

export const VALIDATION_RULES = {
  username: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    },
    {
      min: 3,
      max: 20,
      message: '用户名长度应在3-20个字符之间',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入密码',
      trigger: 'blur'
    },
    {
      min: 6,
      message: '密码长度不能少于6位',
      trigger: 'blur'
    }
  ]
}

export const FORM_CONFIG = {
  LAYOUT: 'vertical',
  SIZE: 'large'
}