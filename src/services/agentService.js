import api from './api.js'
import { MOCK_MODE, mockAgentService } from '../mock/index.js'

export const agentService = {
  create: (agentData) => {
    if (MOCK_MODE) {
      return mockAgentService.create(agentData)
    }
    return api.post('/agent/create', agentData)
  },

  getMyAgents: () => {
    if (MOCK_MODE) {
      return mockAgentService.getMyAgents()
    }
    return api.get('/agent/me')
  },

  getAgentConfig: (agentId) => {
    if (MOCK_MODE) {
      return mockAgentService.getAgentConfig(agentId)
    }
    return api.get('/agent/config', {
      params: { agent_id: agentId }
    })
  },

  updateAgent: (agentData) => {
    if (MOCK_MODE) {
      return mockAgentService.updateAgent(agentData)
    }
    return api.put('/agent/update', agentData)
  },

  deleteAgent: (agentId) => {
    if (MOCK_MODE) {
      return mockAgentService.deleteAgent(agentId)
    }
    return api.delete('/agent/delete', {
      params: { agent_id: agentId }
    })
  },

  getPublicAgents: (agentType) => {
    if (MOCK_MODE) {
      return mockAgentService.getPublicAgents(agentType)
    }
    return api.get(`/agent/public/${agentType}`)
  },

  getAdminAgents: () => {
    if (MOCK_MODE) {
      return mockAgentService.getAdminAgents()
    }
    return api.get('/agent/admin')
  },

  copyAgent: (agentId) => {
    if (MOCK_MODE) {
      return mockAgentService.copyAgent(agentId)
    }
    return api.post('/agent/copy', { agent_id: agentId })
  }
}

export default agentService