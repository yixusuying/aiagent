export const validateForm = (formData) => {
  const errors = {}
  
  if (!formData.username) {
    errors.username = '请输入用户名'
  } else if (formData.username.length < 3 || formData.username.length > 20) {
    errors.username = '用户名长度应在3-20个字符之间'
  }
  
  if (!formData.password) {
    errors.password = '请输入密码'
  } else if (formData.password.length < 6) {
    errors.password = '密码长度不能少于6位'
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const handleLoginSuccess = (response, router) => {
  // 登录成功后的处理逻辑
  console.log('Login successful:', response)
  
  // 可以在这里存储用户信息到 store
  // const userStore = useUserStore()
  // userStore.setUserInfo(response)
  
  // 跳转到首页或用户之前想访问的页面
  const redirectPath = router.currentRoute.value.query.redirect || '/'
  router.push(redirectPath)
}

export const formatLoginData = (formData) => {
  return {
    username: formData.username.trim(),
    password: formData.password
  }
}