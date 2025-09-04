import api, { API_BASE_URL } from './api.js'
import { MOCK_MODE, mockAvatarService } from '../mock/index.js'

export const avatarService = {
  create: (avatarData) => {
    if (MOCK_MODE) {
      return mockAvatarService.create(avatarData)
    }
    return api.post('/avatar/create', avatarData)
  },

  upload: (agentId, file) => {
    if (MOCK_MODE) {
      return mockAvatarService.upload(agentId, file)
    }
    const formData = new FormData()
    formData.append('agent_id', agentId)
    formData.append('file', file)
    
    return fetch(`${API_BASE_URL}/avatar/upload`, {
      method: 'POST',
      credentials: 'include',
      body: formData
    }).then(response => response.json())
  }
}

export default avatarService