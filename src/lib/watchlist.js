import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function getHeaders() {
  const token = localStorage.getItem('reel_token')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
}

export const watchlistService = {
  // Get user's watchlist
  getWatchlist: async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/watchlist`, { headers: getHeaders() })
      return response.data.watchlist || []
    } catch (error) {
      console.error('Error fetching watchlist:', error)
      throw error
    }
  },

  // Add show to watchlist
  addToWatchlist: async (showName) => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/watchlist/add`,
        { showName },
        { headers: getHeaders() }
      )
      return response.data
    } catch (error) {
      console.error('Error adding to watchlist:', error)
      throw error
    }
  },

  // Remove show from watchlist
  removeFromWatchlist: async (showName) => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/watchlist/remove`,
        { showName },
        { headers: getHeaders() }
      )
      return response.data
    } catch (error) {
      console.error('Error removing from watchlist:', error)
      throw error
    }
  },

  // Check if show is in watchlist
  isInWatchlist: async (showName) => {
    try {
      const response = await axios.post(
        `${API_BASE}/api/watchlist/check`,
        { showName },
        { headers: getHeaders() }
      )
      return response.data.isInWatchlist
    } catch (error) {
      console.error('Error checking watchlist:', error)
      throw error
    }
  },

  // Toggle watchlist status
  toggleWatchlist: async (showName, isInWatchlist) => {
    if (isInWatchlist) {
      return watchlistService.removeFromWatchlist(showName)
    } else {
      return watchlistService.addToWatchlist(showName)
    }
  }
}
