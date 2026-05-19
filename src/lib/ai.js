import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

export const aiService = {
  // Generate show information using Groq
  generateShowInfo: async (showName, year, overview) => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/ai/generate-show-info`,
        { showName, year, overview }
      )
      return response.data.data
    } catch (error) {
      console.error('Error generating show info:', error)
      throw error
    }
  }
}
