import { message } from 'ant-design-vue'
import { agentService } from '@/services'

export const validateForm = (formData) => {
  const errors = {}

  if (!formData.name?.trim()) {
    errors.name = '请输入智能体名称'
  }

  if (!formData.targetAudience) {
    errors.targetAudience = '请选择目标受众'
  }

  if (!formData.contentComplexity) {
    errors.contentComplexity = '请选择内容复杂度'
  }

  if (!formData.mainStyle) {
    errors.mainStyle = '请选择主要交流风格'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export const handleAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  if (!isImage) {
    message.error('只能上传图片文件')
    return false
  }

  const isLt2M = file.size / 1024 / 1024 < 2
  if (!isLt2M) {
    message.error('图片大小不能超过2MB')
    return false
  }

  return true
}

export const submitForm = async (formData, router) => {
  const validation = validateForm(formData)
  
  if (!validation.isValid) {
    const firstError = Object.values(validation.errors)[0]
    message.error(firstError)
    return false
  }

  try {
    message.loading('正在生成AI角色...', 0)
    
    // 调用模拟API创建智能体
    const result = await agentService.create(formData)
    
    message.destroy()
    message.success('AI角色创建成功！')
    
    // 保存创建的智能体ID到sessionStorage，供后续页面使用
    if (result && result.id) {
      sessionStorage.setItem('lastCreatedAgentId', result.id)
    }
    
    setTimeout(() => {
      router.push('/setup-agent')
    }, 1500)
    
    return true
  } catch (error) {
    message.destroy()
    message.error('创建失败，请重试')
    console.error('创建AI角色失败:', error)
    return false
  }
}

export const handleFormReset = (formRef) => {
  formRef.value?.resetFields()
}