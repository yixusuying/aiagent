# 代码风格
- 使用ES模块（import/export）语法，而不是CommonJS （require）
- 在可能的情况下解构导入(例如：import { foo } from 'bar')
- 创建一个页面时，应该在src/views下创建一个页面的文件夹， 里面包含页面文件本身，常量文件（constants.js）和业务逻辑工具文件（utils.js），并由index.js导出页面文件
- 创建一个可复用的组件时，应该在src/components下创建一个页面的文件夹， 里面包含组件文件本身，常量文件（constants.js）和业务逻辑工具文件（utils.js），并由index.js导出组件文件， 并确保这个组件能够脱离业务单独工作
- 在构建一个功能时，需思考这个功能是否能够进行DSL的配置，而不是硬编码
- 在进行样式的创建以及修改时， 请避免使用!important这样的选择器
- 使用图标时，优先使用antd的图标

# 工作流
- 当你完成一系列的代码修改时，一定要进行类型检查
- 为了性能，应该优先测试涉及到修改的功能，而不是整个测试项目， 测试完成之后请将对应测试端口关闭

# API接口规范

## 后端代理配置
- 后端服务地址：yourapi.com/api
- 前端代理配置：所有 `/api/*` 请求会被代理到后端服务，保留 `/api` 前缀
- 身份验证：使用HTTP-only Cookie机制，Cookie名称为 `access_token`，有效期24小时
- 注意：后端API期望完整路径包含 `/api` 前缀（如：`/api/users/login`）

## 接口服务文件结构
```
src/services/
├── api.js              # 基础API配置（axios实例）
├── userService.js      # 用户相关接口
├── agentService.js     # 智能体相关接口  
├── sessionService.js   # 会话相关接口
├── avatarService.js    # 头像相关接口
└── index.js           # 统一导出文件
```

## 接口使用规范

**重要说明**: axios响应拦截器已经自动解包响应数据，所有接口方法直接返回业务数据，无需访问`.data`属性

### 1. 用户相关接口 (userService)
- `register(userData)` - 用户注册（需要username、nikename、password参数）
- `login(credentials)` - 用户登录（会自动设置Cookie）
- `logout()` - 用户登出（会清除Cookie）

### 2. 智能体相关接口 (agentService) 
- `create(agentData)` - 创建智能体，返回智能体配置对象
- `getMyAgents()` - 获取我的智能体列表，返回智能体数组
- `getAgentConfig(agentId)` - 获取智能体详细配置，返回配置对象
- `updateAgent(agentData)` - 更新智能体信息
- `deleteAgent(agentId)` - 删除智能体
- `getPublicAgents(agentType)` - 获取公开智能体列表，返回智能体数组
- `getAdminAgents()` - 获取管理员智能体列表，返回智能体数组
- `copyAgent(agentId)` - 复制智能体

### 3. 会话相关接口 (sessionService)
- `create(sessionData)` - 创建新会话，需要`agent_id`, `debug`, `messages`参数，返回包含session_id的对象
- `deleteSession(sessionId)` - 删除会话  
- `getMySessions()` - 获取我的会话列表，返回会话数组（包含session_name、agent_name、agent_avatar、updated_at字段）
- `getSessionMessages(sessionId)` - 获取会话历史消息（返回流式响应）
- `chatStream(chatData)` - 智能体对话，需要`session_id`, `messages`参数（返回流式响应）
- `chatStreamDebug(debugData)` - 调试模式智能体对话，需要`session_id`, `messages`, `agent_config`参数（返回流式响应）

**注意**: 
- 流式接口使用fetch而非axios，需要手动处理EventSource流
- 流式响应格式：`event: message_chunk\ndata: {"content": "..."}`

### 4. 头像相关接口 (avatarService)
- `create(avatarData)` - 创建智能体头像
- `upload(agentId, file)` - 上传智能体头像（支持PNG、JPG、JPEG、GIF、WEBP格式，最大10MB）

## 使用示例
```js
// 导入服务
import { userService, agentService, sessionService, avatarService } from '@/services'

// 用户注册
await userService.register({ 
  username: 'user', 
  nikename: 'nickname', 
  password: 'pass' 
})

// 用户登录
await userService.login({ username: 'user', password: 'pass' })

// 用户登出
await userService.logout()

// 创建智能体
const agentConfig = await agentService.create({
  agent_type: 'roleplay',
  prompt: '创建一个李白的角色'
})

// 获取管理员智能体
const adminAgents = await agentService.getAdminAgents()

// 复制智能体
const copyResult = await agentService.copyAgent('agent-id')

// 创建新会话
const sessionData = await sessionService.create({
  agent_id: 'agent-id',
  debug: false
})
console.log('会话ID:', sessionData.session_id)

// 获取用户会话列表
const sessions = await sessionService.getMySessions()

// 流式对话
const response = await sessionService.chatStream({
  agent_type: 'roleplay', 
  session_id: 'session-id',
  messages: [
    { role: 'assistant', content: '举杯邀明月，对影成三人。' },
    { role: 'user', content: '你好，请介绍一下自己' }
  ]
})

// 调试模式对话
const debugResponse = await sessionService.chatStreamDebug({
  session_id: 'session-id',
  messages: [{ role: 'user', content: '你是谁？' }],
  agent_config: {
    name: '测试助手',
    design: '一个用于测试的AI助手',
    prologue: '你好，我是测试用的AI助手'
  }
})

// 上传头像
const fileInput = document.getElementById('fileInput')
const file = fileInput.files[0]
const uploadResult = await avatarService.upload('agent-id', file)
```

## 错误处理
- 401: 未授权，需要重新登录
- 403: 权限不足
- 404: 资源不存在  
- 422: 请求格式正确但含有语义错误
- 500: 服务器内部错误

