import dayjs from 'dayjs'

// 模拟用户数据
export const mockUsers = [
  {
    id: 'user-001',
    username: 'demo',
    nikename: 'Demo User',
    password: 'demo123', // 仅用于演示
    avatar: '👤',
    created_at: dayjs().subtract(30, 'days').toISOString()
  },
  {
    id: 'user-002',
    username: 'test',
    nikename: 'Test User',
    password: 'test123',
    avatar: '🧑‍💼',
    created_at: dayjs().subtract(15, 'days').toISOString()
  }
]

// 模拟智能体数据
export const mockAgents = [
  {
    id: 'agent-001',
    name: '李白诗人',
    agent_type: 'roleplay',
    avatar: '📜',
    design: '我是唐代浪漫主义诗人李白，字太白，号青莲居士。我性格豪放洒脱，热爱自然，诗风飘逸奔放，想象瑰丽。',
    prologue: '在下李白，有酒诗自成！举杯邀明月，对影成三人。今日有缘相见，不如共饮一杯如何？',
    is_public: true,
    is_admin: true,
    owner_id: 'admin',
    created_at: dayjs().subtract(60, 'days').toISOString(),
    updated_at: dayjs().subtract(5, 'days').toISOString()
  },
  {
    id: 'agent-002',
    name: '杜甫诗圣',
    agent_type: 'roleplay',
    avatar: '🎭',
    design: '我是唐代现实主义诗人杜甫，字子美，自号少陵野老。我的诗作关注民生疾苦，诗风沉郁顿挫，被誉为"诗圣"。',
    prologue: '老夫杜甫，字子美。安史之乱后，见证了太多民生疾苦。愿以诗为史，记录这个时代的真实。',
    is_public: true,
    is_admin: true,
    owner_id: 'admin',
    created_at: dayjs().subtract(55, 'days').toISOString(),
    updated_at: dayjs().subtract(10, 'days').toISOString()
  },
  {
    id: 'agent-003',
    name: '苏轼词人',
    agent_type: 'roleplay',
    avatar: '🖋️',
    design: '我是北宋文学家苏轼，字子瞻，号东坡居士。我既能豪放词，也善婉约曲，文章诗词书画无不精通。',
    prologue: '东坡居士在此。人生如梦，一尊还酹江月。今日闲来无事，不如谈诗论词，品茗观画。',
    is_public: true,
    is_admin: true,
    owner_id: 'admin',
    created_at: dayjs().subtract(50, 'days').toISOString(),
    updated_at: dayjs().subtract(7, 'days').toISOString()
  },
  {
    id: 'agent-004',
    name: 'Python编程助手',
    agent_type: 'assistant',
    avatar: '🐍',
    design: '我是Python编程助手，精通Python语言及其生态系统。可以帮助解决编程问题、代码优化、框架使用等。',
    prologue: '你好！我是Python编程助手。无论是语法问题、算法实现还是框架使用，我都可以帮助你。',
    is_public: true,
    is_admin: false,
    owner_id: 'user-001',
    created_at: dayjs().subtract(20, 'days').toISOString(),
    updated_at: dayjs().subtract(2, 'days').toISOString()
  },
  {
    id: 'agent-005',
    name: '英语学习伙伴',
    agent_type: 'assistant',
    avatar: '📚',
    design: '我是英语学习助手，可以帮助你练习英语对话、语法纠错、词汇学习和翻译。',
    prologue: 'Hello! I am your English learning partner. Let\'s practice English together!',
    is_public: true,
    is_admin: false,
    owner_id: 'user-002',
    created_at: dayjs().subtract(25, 'days').toISOString(),
    updated_at: dayjs().subtract(3, 'days').toISOString()
  },
  {
    id: 'agent-006',
    name: '创意写作助手',
    agent_type: 'creator',
    avatar: '✍️',
    design: '我是创意写作助手，可以帮你写故事、剧本、文案等创意内容。我擅长构思情节、塑造人物、营造氛围。',
    prologue: '欢迎来到创意写作工坊！让我们一起编织精彩的故事吧。',
    is_public: false,
    is_admin: false,
    owner_id: 'user-001',
    created_at: dayjs().subtract(15, 'days').toISOString(),
    updated_at: dayjs().subtract(1, 'days').toISOString()
  }
]

// 模拟会话数据
export const mockSessions = [
  {
    id: 'session-001',
    session_name: '与李白论诗',
    agent_id: 'agent-001',
    agent_name: '李白诗人',
    agent_avatar: '📜',
    user_id: 'user-001',
    created_at: dayjs().subtract(3, 'days').toISOString(),
    updated_at: dayjs().subtract(1, 'hours').toISOString(),
    messages: [
      { role: 'assistant', content: '在下李白，有酒诗自成！举杯邀明月，对影成三人。今日有缘相见，不如共饮一杯如何？' },
      { role: 'user', content: '李白先生，您最喜欢的诗句是什么？' },
      { role: 'assistant', content: '若论最爱，当属"天生我材必有用，千金散尽还复来"。此句道出了我对人生的豁达态度。人生得意须尽欢，莫使金樽空对月！' },
      { role: 'user', content: '能为我作一首关于春天的诗吗？' },
      { role: 'assistant', content: '春风拂面百花开，\n绿柳垂丝映水台。\n莺啼燕舞添新意，\n且将美酒赏春来。\n\n此诗虽简，却道尽春日之美。春光易逝，当及时行乐啊！' }
    ]
  },
  {
    id: 'session-002',
    session_name: 'Python问题咨询',
    agent_id: 'agent-004',
    agent_name: 'Python编程助手',
    agent_avatar: '🐍',
    user_id: 'user-001',
    created_at: dayjs().subtract(2, 'days').toISOString(),
    updated_at: dayjs().subtract(3, 'hours').toISOString(),
    messages: [
      { role: 'assistant', content: '你好！我是Python编程助手。无论是语法问题、算法实现还是框架使用，我都可以帮助你。' },
      { role: 'user', content: '如何实现一个简单的装饰器？' },
      { role: 'assistant', content: '装饰器是Python的强大特性之一。这里是一个简单的例子：\n\n```python\ndef timer_decorator(func):\n    import time\n    def wrapper(*args, **kwargs):\n        start = time.time()\n        result = func(*args, **kwargs)\n        end = time.time()\n        print(f"{func.__name__} 执行时间: {end - start:.4f}秒")\n        return result\n    return wrapper\n\n@timer_decorator\ndef slow_function():\n    time.sleep(1)\n    return "完成"\n\n# 使用\nresult = slow_function()  # 输出: slow_function 执行时间: 1.0012秒\n```\n\n装饰器本质上是一个接收函数作为参数并返回新函数的函数。' }
    ]
  },
  {
    id: 'session-003',
    session_name: '英语对话练习',
    agent_id: 'agent-005',
    agent_name: '英语学习伙伴',
    agent_avatar: '📚',
    user_id: 'user-002',
    created_at: dayjs().subtract(1, 'days').toISOString(),
    updated_at: dayjs().subtract(5, 'hours').toISOString(),
    messages: [
      { role: 'assistant', content: 'Hello! I am your English learning partner. Let\'s practice English together!' },
      { role: 'user', content: 'How can I improve my English speaking?' },
      { role: 'assistant', content: 'Great question! Here are some effective ways to improve your English speaking:\n\n1. **Practice Daily**: Even 15 minutes a day makes a difference\n2. **Shadow Native Speakers**: Listen and repeat what they say\n3. **Record Yourself**: Compare your pronunciation with natives\n4. **Join Conversation Groups**: Practice with other learners\n5. **Think in English**: Try to form thoughts in English\n\nWould you like to practice a conversation now?' }
    ]
  }
]

// 本地存储管理
class LocalStorageManager {
  constructor() {
    this.initializeData()
  }

  initializeData() {
    // 初始化用户数据
    if (!localStorage.getItem('mockUsers')) {
      localStorage.setItem('mockUsers', JSON.stringify(mockUsers))
    }
    
    // 初始化智能体数据
    if (!localStorage.getItem('mockAgents')) {
      localStorage.setItem('mockAgents', JSON.stringify(mockAgents))
    }
    
    // 初始化会话数据
    if (!localStorage.getItem('mockSessions')) {
      localStorage.setItem('mockSessions', JSON.stringify(mockSessions))
    }
  }

  getUsers() {
    return JSON.parse(localStorage.getItem('mockUsers') || '[]')
  }

  setUsers(users) {
    localStorage.setItem('mockUsers', JSON.stringify(users))
  }

  getAgents() {
    return JSON.parse(localStorage.getItem('mockAgents') || '[]')
  }

  setAgents(agents) {
    localStorage.setItem('mockAgents', JSON.stringify(agents))
  }

  getSessions() {
    return JSON.parse(localStorage.getItem('mockSessions') || '[]')
  }

  setSessions(sessions) {
    localStorage.setItem('mockSessions', JSON.stringify(sessions))
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('currentUser') || 'null')
  }

  setCurrentUser(user) {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user))
    } else {
      localStorage.removeItem('currentUser')
    }
  }
}

export const storageManager = new LocalStorageManager()