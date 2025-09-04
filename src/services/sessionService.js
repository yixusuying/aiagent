import api, { API_BASE_URL } from './api.js'
import { MOCK_MODE, mockSessionService } from '../mock/index.js'

// 模拟流式响应的辅助函数
const createMockStreamResponse = async (generator) => {
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of generator) {
          const message = `event: ${chunk.event}\ndata: ${JSON.stringify(chunk.data)}\n\n`
          controller.enqueue(encoder.encode(message))
        }
      } catch (error) {
        controller.error(error)
      } finally {
        controller.close()
      }
    }
  })
  
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  })
}

export const sessionService = {
  create: (sessionData) => {
    if (MOCK_MODE) {
      return mockSessionService.create(sessionData)
    }
    return api.post('/session/create', sessionData)
  },

  deleteSession: (sessionId) => {
    if (MOCK_MODE) {
      return mockSessionService.deleteSession(sessionId)
    }
    return api.delete('/session/delete', {
      params: { session_id: sessionId }
    })
  },

  getMySessions: () => {
    if (MOCK_MODE) {
      return mockSessionService.getMySessions()
    }
    return api.get('/session/me')
  },

  getSessionMessages: async (sessionId) => {
    if (MOCK_MODE) {
      const messages = await mockSessionService.getSessionMessages(sessionId)
      const encoder = new TextEncoder()
      const messageStr = messages.map(msg => 
        `event: message\ndata: ${JSON.stringify(msg)}\n\n`
      ).join('')
      
      return new Response(encoder.encode(messageStr), {
        headers: { 'Content-Type': 'text/event-stream' }
      })
    }
    return fetch(`${API_BASE_URL}/session/messages?session_id=${sessionId}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Accept': 'text/event-stream'
      }
    })
  },

  chatStream: async (chatData) => {
    if (MOCK_MODE) {
      return createMockStreamResponse(mockSessionService.chatStream(chatData))
    }
    return fetch(`${API_BASE_URL}/session/chat/stream`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(chatData)
    })
  },

  chatStreamDebug: async (debugData) => {
    if (MOCK_MODE) {
      return createMockStreamResponse(mockSessionService.chatStreamDebug(debugData))
    }
    return fetch(`${API_BASE_URL}/session/chat/stream/debug`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify(debugData)
    })
  }
}

export default sessionService