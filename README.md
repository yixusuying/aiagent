# AI Agent 本地示例版本

这是一个完全本地运行的AI Agent示例项目，所有数据都保存在浏览器的localStorage中，无需后端服务器。

## 技术栈

### 前端框架
- **Vue 3** (^3.5.17) - 渐进式JavaScript框架
- **Vue Router** (^4.5.1) - Vue.js官方路由管理器
- **Pinia** (^3.0.3) - Vue.js状态管理库

### UI组件库
- **Ant Design Vue** (^4.2.6) - 企业级UI设计语言和Vue组件库

### 构建工具
- **Vite** (^7.0.4) - 下一代前端构建工具
- **@vitejs/plugin-vue** (^6.0.0) - Vite的Vue插件

### 样式预处理
- **Sass** (^1.89.2) - CSS预处理器

### 工具库
- **Axios** (^1.11.0) - HTTP客户端库
- **Day.js** (^1.11.13) - 轻量级日期处理库
- **Lodash** (^4.17.21) - JavaScript工具函数库

### 开发环境
- **Node.js** - JavaScript运行时环境
- **npm** - 包管理器

### 部署
- **Docker** - 容器化部署
- **Nginx** - Web服务器和反向代理

## 功能特性

- ✅ 用户注册/登录（模拟）
- ✅ 智能体创建和管理
- ✅ 会话管理
- ✅ 流式对话（模拟）
- ✅ 数据持久化（localStorage）

## 测试账号

系统预置了两个测试账号：

1. 用户名：`demo`，密码：`demo123`
2. 用户名：`test`，密码：`test123`

## 如何运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 访问 http://localhost:8080

## 模拟模式说明

项目使用模拟API服务，所有功能都在前端实现：

- **用户服务** (`src/mock/mockApi.js`)：模拟用户注册、登录、登出
- **智能体服务**：模拟智能体的创建、编辑、删除
- **会话服务**：模拟对话流式响应
- **数据存储**：使用localStorage保存所有数据

## 预置智能体

系统预置了几个示例智能体：

- 李白诗人（角色扮演）
- 杜甫诗圣（角色扮演）
- 苏轼词人（角色扮演）
- Python编程助手（助手类型）
- 英语学习伙伴（助手类型）

## 切换到生产模式

如需连接真实后端，修改 `src/mock/index.js` 中的配置：

```javascript
// 将此值改为 false 即可连接真实后端
export const MOCK_MODE = false
```

## 数据重置

如需重置所有数据，在浏览器控制台执行：

```javascript
localStorage.clear()
location.reload()
```

## 注意事项

- 这是一个纯前端演示项目，所有数据存储在浏览器中
- 清除浏览器缓存会导致数据丢失
- 流式对话为模拟效果，实际内容为预设回复
- 上传的头像会转换为base64存储在localStorage中