# 智能体应用后端 API 接口文档

## 用户相关接口

### 用户注册

**接口地址**: `/api/users/register`

**请求方式**: `POST`

**请求参数**:

| **参数名** | **类型** | **必填** | **说明** |
| --- | --- | --- | --- |
| username | string | 是 | 用户名 |
| nikename | string | 是 | 用户昵称 |
| password | string | 是 | 密码 |

**返回示例**:

```plaintext
{
  "message": "Register successful",
  "username": "用户名",
  "nikename": "用户昵称",
  "created_at": "2025-07-30T10:00:00"
}
```

### 用户登录

**接口地址**: `/api/users/login`

**请求方式**: `POST`

**请求参数**:

| **参数名** | **类型** | **必填** | **说明** |
| --- | --- | --- | --- |
| username | string | 是 | 用户名 |
| password | string | 是 | 密码 |

**返回示例**:

```plaintext
{
  "message": "Login successful",
  "username": "用户名",
  "nikename": "用户昵称"
}
```

**说明**: 

*   登录成功后，访问令牌会以 HTTP-only Cookie 的形式设置，不会在响应体中返回
    
*   Cookie 名称为 `access_token`，有效期为 24 小时
    
*   后续所有需要身份验证的请求会自动携带此 Cookie
    

### 用户登出

**接口地址**: `/api/users/logout`

**请求方式**: `POST`

**请求头**: 需要携带登录时设置的 Cookie

**返回示例**:

```plaintext
{
  "message": "Logout successful",
  "username": "用户名"
}
```

**说明**: 

*   登出操作会清除客户端的 `access_token` Cookie
    

## 智能体相关接口

### 创建智能体

**接口地址**: `/api/agent/create`

**请求方式**: `POST`

**请求头**: 需要身份验证（自动携带 Cookie）

**请求参数**:

| **参数名** | **类型** | **必填** | **说明** |
| --- | --- | --- | --- |
| agent\_type | string | 是 | 智能体类型，如"roleplay" |
| prompt | string | 是 | 创建智能体的提示词 |

**返回示例**:

```plaintext
{
  "status": "success",
  "config": {
    "name": "智能体名称",
    "avatar": "用来生成头像的prompt",
    "design": "角色设定",
    "introduction": "角色介绍",
    "prologue": "开场白",
    "predefined_questions": [
      "预设问题1",
      "预设问题2",
      "预设问题3"
    ],
    "id": "生成的UUID"
  }
}
```

### 获取用户所有智能体

**接口地址**: `/api/agent/me`

**请求方式**: `GET`

**请求头**: 需要身份验证（自动携带 Cookie）

**返回示例**:

```plaintext
[
  {
    "id": "智能体ID",
    "agent_type": "roleplay",
    "name": "李白",
    "avatar": "头像URL",
    "introduction": "简介文本",
    "created_by": "创建者昵称",
    "created_at": "2025-07-30T10:00:00"
  }
]
```

### 获取智能体详细配置

**接口地址**: `/api/agent/config`

**请求方式**: `GET`

**请求头**: 需要身份验证（自动携带 Cookie）

**请求参数**:

| **参数名** | **类型** | **必填** | **说明** |
| --- | --- | --- | --- |
| agent\_id | string | 是 | 智能体ID |

**返回示例**:

```plaintext
{
  "id": "智能体ID",
  "agent_type": "roleplay",
  "name": "智能体名称",
  "avatar": "头像URL",
  "introduction": "简介文本",
  "config": {
    "name": "智能体名称",
    "design": "角色设定",
    "introduction": "角色介绍",
    "prologue": "开场白",
    "predefined_questions": [
      "预设问题1",
      "预设问题2",
      "预设问题3"
    ]
  },
  "is_owner": true/false,
  "created_at": "2025-07-30T10:00:00"
}
```

### 更新智能体信息

**接口地址**: `/api/agent/update`

**请求方式**: `PUT`

**请求头**: 需要身份验证（自动携带 Cookie）

**请求参数**:

| **参数名** | **类型** | **必填** | **说明** |
| --- | --- | --- | --- |
| agent\_id | string | 是 | 智能体ID |
| name | string | 否 | 智能体名称 |
| avatar | string | 否 | 头像URL |
| introduction | string | 否 | 简介 |
| config | object | 否 | 配置信息 |
| is\_public | boolean | 否 | 是否公开 |

**返回示例**:

```plaintext
{
  "status": "success",
  "message": "Agent updated"
}
```

### 删除智能体

**接口地址**: `/api/agent/delete`

**请求方式**: `DELETE`

**请求头**: 需要身份验证（自动携带 Cookie）

**请求参数**:

| **参数名** | **类型** | **必填** | **说明** |
| --- | --- | --- | --- |
| agent\_id | string | 是 | 智能体ID（URL查询参数） |

**返回示例**:

```plaintext
{
  "status": "success",
  "message": "Agent deleted",
  "agent_id": "智能体ID"
}
```

### 获取管理员智能体

**接口地址**: `/api/agent/admin`

**请求方式**: `GET`

**请求头**: 无需身份验证

**返回示例**:

```plaintext
[  {    "id": "智能体ID",    "agent_type": "roleplay",    "name": "李白",    "avatar": "头像URL",    "introduction": "简介文本",    "created_by": "管理员昵称",    "created_at": "2025-07-30T10:00:00"  }]
```

**说明**: 

*   返回所有管理员创建的智能体
    
*   任何已登录用户都可以查看管理员的智能体
    
*   不包括已删除的智能体
    

### 获取公开智能体列表

**接口地址**: `/api/agent/public/{agent_type}`

**请求方式**: `GET`

**请求头**: 无需身份验证

**路径参数**:

| **参数名** | **类型** | **必填** | **说明** |
| --- | --- | --- | --- |
| agent\_type | string | 是 | 智能体类型，如"roleplay" |

**返回示例**:

```plaintext
[  {    "id": "智能体ID",    "agent_type": "roleplay",    "name": "李白",    "avatar": "头像URL",    "introduction": "简介文本",    "created_at": "2025-07-30T10:00:00",    "created_by": "创建者昵称"  }]
```

### 复制智能体

**接口地址**: `/api/agent/copy`

**请求方式**: `POST`

**请求头**: 需要身份验证（自动携带 Cookie）

**请求参数**:

| **参数名** | **类型** | **必填** | **说明** |
| --- | --- | --- | --- |
| agent\_id | string | 是 | 要复制的智能体ID |

**返回示例**:

```plaintext
{  "status": "success",  "message": "Agent copied successfully",  "new_agent_id": "新智能体ID"}
```

**说明**: 

*   复制智能体会创建一个完全独立的新智能体
    
*   新智能体继承原智能体的所有配置信息
    
*   复制后的智能体归当前用户所有
    
*   可以复制自己的智能体或公开的智能体
    
*   如果源智能体有头像，也会复制头像URL
    

## 会话相关接口

### 创建新会话

**接口地址**: `/api/session/create`

**请求方式**: `POST`

**请求头**: 需要身份验证（自动携带 Cookie）

**请求参数**:

| **参数名** | **类型** | **必填** | **说明** |
| --- | --- | --- | --- |
| agent\_id | string | 是 | 智能体ID |
| debug | boolean | 否 | 是否为调试会话，默认为false |
| messages | array | 是 | 消息数组 |
| messages\[\].role | string | 是 | 角色，一般为"user" 和 "assistant" |
| messages\[\].content | string | 是 | 消息文本 |

**返回示例**:

```plaintext
{  "status": "success",  "session_id": "会话ID",  "name": "会话名称",  "created_at": "2025-07-30T10:00:00"}
```

### 删除会话

**接口地址**: `/api/session/delete`

**请求方式**: `DELETE`

**请求头**: 需要身份验证（自动携带 Cookie）

**请求参数**:

| **参数名** | **类型** | **必填** | **说明** |
| --- | --- | --- | --- |
| session\_id | string | 是 | 会话ID（URL查询参数） |

**返回示例**:

```plaintext
{  "status": "success",  "message": "Session deleted"}
```

### 获取用户所有会话

**接口地址**: `/api/session/me`

**请求方式**: `GET`

**请求头**: 需要身份验证（自动携带 Cookie）

**返回示例**:

```json
[{
  "session_id": "会话ID",
  "agent_id": "智能体ID",
  "session_name": "会话名称",
  "agent_name": "智能体名称",
  "agent_avatar": "智能体头像",
  "created_at": "2025-07-30T10:00:00",
  "updated_at": "2025-07-30T10:00:00"
}]
```

### 获取会话历史消息

**接口地址**: `/api/session/messages`

**请求方式**: `GET`

**请求头**: 需要身份验证（自动携带 Cookie）

**请求参数**:

| **参数名** | **类型** | **必填** | **说明** |
| --- | --- | --- | --- |
| session\_id | string | 是 | 会话ID（URL查询参数） |

**返回类型**: `text/event-stream`

**返回示例**:

```plaintext
event: message_chunkdata: {"role": "user", "content": "你好", "created_at": "2025-07-30T10:00:00"}event: message_chunkdata: {"role": "assistant", "content": "你好，我是李白，很高兴认识你。", "created_at": "2025-07-30T10:00:01"}event: message_chunkdata: {"role": "assistant", "finish_reason": "__END__"}
```

### 智能体对话（流式）

**接口地址**: `/api/session/chat/stream`

**请求方式**: `POST`

**请求头**: 需要身份验证（自动携带 Cookie）

**请求参数**:

| **参数名** | **类型** | **必填** | **说明** |
| --- | --- | --- | --- |
| session\_id | string | 是 | 会话ID |
| messages | array | 是 | 消息数组 |
| messages\[\].role | string | 是 | 角色，一般为"user" 和 "assistant" |
| messages\[\].content | string | 是 | 消息文本 |

**说明**: 

*   首次对话时，如果智能体（assistant）有开场白，需要将开场白和用户（user）的 query 按时间顺序放到 messages 中
    
*   后续对话时，只需要将用户（user）最新的 query 放到 messages 中
    

**返回类型**: `text/event-stream`

**请求示例**:

```plaintext
{  "agent_type": "roleplay",  "session_id": "b4279a49-f415-45eb-9b1b-b33503c521fe",  "messages": [{    "role": "assistant",    "content": "举杯邀明月，对影成三人。"  }, {    "role": "user",    "content": "你好，请介绍一下自己"  }]}
```

**返回示例**:

```plaintext
event: message_chunkdata: {"thread_id": "会话ID", "id": "消息ID", "role": "assistant", "content": "这"}event: message_chunkdata: {"thread_id": "会话ID", "id": "消息ID", "role": "assistant", "content": "是"}event: message_chunkdata: {"thread_id": "会话ID", "id": "消息ID", "role": "assistant", "content": "回复"}event: message_chunkdata: {"thread_id": "会话ID", "role": "assistant", "finish_reason": "__END__"}
```

### 调试模式智能体对话（流式）

**接口地址**: `/api/session/chat/stream/debug`

**请求方式**: `POST`

**请求头**: 需要身份验证（自动携带 Cookie）

**请求参数**:

| **参数名** | **类型** | **必填** | **说明** |
| --- | --- | --- | --- |
| agent\_id | string | 是 | 智能体ID |
| messages | array | 是 | 消息数组 |
| messages\[\].role | string | 是 | 角色，一般为"user" 和 "assistant" |
| messages\[\].content | string | 是 | 消息文本 |
| agent\_config | ConfigObject | 是 | 自定义智能体配置 |

**ConfigObject 结构**

| **字段** | **类型** | **必填** | **描述** |
| --- | --- | --- | --- |
| name | string | 是 | 角色名称 |
| design | string | 是 | 角色设定 |
| introduction | string | 是 | 角色简介 |
| user\_age | string | 否 | 受众的年龄段 |
| content\_complexity | string | 否 | 内容复杂度 |
| main\_style | string | 否 | 主要风格 |
| auxiliary\_feature | string | 否 | 辅助特色 |

**返回类型**: `text/event-stream`

**请求示例**:

```plaintext
{  "session_id": "会话ID",  "messages": [{    "role": "user",    "content": "你是谁？请简单介绍一下自己"  }],  "agent_config": {    "name": "测试助手",    "design": "一个用于测试的AI助手",    "prologue": "你好，我是测试用的AI助手"  }}
```

**返回示例**:

```plaintext
event: message_chunkdata: {"thread_id": "会话ID", "id": "消息ID", "role": "assistant", "content": "你好"}event: message_chunkdata: {"thread_id": "会话ID", "id": "消息ID", "role": "assistant", "content": "，我是"}event: message_chunkdata: {"thread_id": "会话ID", "role": "assistant", "finish_reason": "__END__"}
```

**说明**: 

*   调试模式允许开发者自定义智能体配置进行测试
    
*   如果不提供 agent\_config，将使用默认测试配置
    
*   调试模式主要用于开发和测试环境
    
*   返回格式与普通对话接口一致
    

## 头像相关接口

### 创建智能体头像

**接口地址**: `/api/avatar/create`

**请求方式**: `POST`

**请求头**: 需要身份验证（自动携带 Cookie）

**请求参数**:

| **参数名** | **类型** | **必填** | **说明** |
| --- | --- | --- | --- |
| agent\_id | string | 是 | 智能体ID |
| prompt | string | 是 | 生成头像的提示词 |

**返回示例**:

```plaintext
{  "status": "success",  "avatar_url": "https://cdn.example.com/avatars/filename.png"}
```

### 上传智能体头像

**接口地址**: `/api/avatar/upload`

**请求方式**: `POST`

**请求头**: 需要身份验证（自动携带 Cookie）

**Content-Type**: `multipart/form-data`

**请求参数**:

| **参数名** | **类型** | **必填** | **说明** |
| --- | --- | --- | --- |
| agent\_id | string | 是 | 智能体ID |
| file | file | 是 | 头像图片文件 |

**返回示例**:

```plaintext
{  "status": "success",  "message": "头像上传成功",  "avatar_url": "/static/avatars/agent_id_upload_timestamp_hash.png",  "file_info": {    "filename": "上传后的文件名",    "size_bytes": 1024,    "size_mb": 0.001,    "uploaded_at": "2025-08-01T10:00:00"  }}
```

**说明**: 

*   支持的图片格式：PNG, JPG, JPEG, GIF, WEBP
    
*   文件大小限制：最大 10MB
    
*   上传的图片会自动优化和重命名
    
*   文件名格式：`{agent_id}_upload_{timestamp}_{hash}.{ext}`
    
*   上传成功后会自动更新智能体的头像URL
    

## 身份验证说明

本 API 使用基于 Cookie 的身份验证机制：

1.  **登录流程**：
    
    *   用户通过 `/api/users/login` 接口登录
        
    *   服务器验证用户名密码后，将 JWT 令牌设置为 HTTP-only Cookie
        
    *   Cookie 名称为 `access_token`，有效期为 2 小时
        
2.  **访问受保护接口**：
    
    *   浏览器会自动携带 Cookie
        
    *   服务器从 Cookie 中提取并验证 JWT 令牌
        
    *   无需在请求头中手动设置 Authorization
        
3.  **登出流程**：
    
    *   通过 `/api/users/logout` 接口登出
        
    *   服务器会清除客户端的 `access_token` Cookie
        
4.  **安全特性**：
    
    *   使用 HTTP-only Cookie 防止 XSS 攻击
        
    *   设置 SameSite 属性防止 CSRF 攻击
        
    *   开发环境支持 HTTP，生产环境建议使用 HTTPS
        

## 错误码

| **错误码** | **说明** |
| --- | --- |
| 400 | 请求参数错误 |
| 401 | 未授权，需要登录 |
| 403 | 权限不足 |
| 404 | 资源不存在 |
| 422 | 请求格式正确但含有语义错误 |
| 500 | 服务器内部错误 |

## 常见错误示例

### 未登录访问受保护接口

```plaintext
{  "detail": "Could not validate credentials"}
```

### 用户名已存在

```plaintext
{  "detail": "Username already exists"}
```

### 登录凭据错误

```plaintext
{  "detail": "Invalid username or password"}
```

### 智能体不存在或无权限

```plaintext
{
  "detail": "Agent not found or no permission"
}
```