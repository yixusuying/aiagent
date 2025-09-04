const routes = [
  { 
    path: '/', 
    component: () => import('@/views/Home/index.js'),
    meta: { layout: 'main' }
  },
  {
    path: '/login',
    component: () => import('@/views/Login/index.js'),
    meta: { layout: 'simple', hideHeader: true }
  },
  { 
    path: '/agents', 
    component: () => import('@/views/AllAgents/index.js'),
    meta: { layout: 'main', requiresAuth: true }
  },
  {
    path: '/create-agent',
    component: () => import('@/views/CreateAgent/index.js'),
    meta: { layout: 'simple', hideHeader: true, requiresAuth: true }
  },
  {
    path: '/setup-agent',
    component: () => import('@/views/SetupAgent/index.js'),
    meta: { layout: 'simple', hideHeader: true, requiresAuth: true }
  },
  {
    path: '/chat/:agentId?',
    component: () => import('@/views/ChatList/index.js'),
    meta: { layout: 'simple', hideHeader: true, requiresAuth: true }
  }
]

export default routes