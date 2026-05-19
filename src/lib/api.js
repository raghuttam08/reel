const BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001'

function getToken() {
  return localStorage.getItem('reel_token')
}

async function req(method, path, body) {
  const token = getToken()
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`)
  return data
}

// ─── Shows ────────────────────────────────────────────────────────────────────
export const api = {
  // Get all processed shows
  getShows: () => req('GET', '/api/shows'),

  // Get one show by name
  getShow: (name) => req('GET', `/api/shows/${encodeURIComponent(name)}`),

  // Get lifecycle for a show
  getLifecycle: (name) => req('GET', `/api/shows/${encodeURIComponent(name)}/lifecycle`),

  // ─── Posts ─────────────────────────────────────────────────────────────────
  // Global feed
  getFeed: ({ page = 1, sort = 'recent', format, show } = {}) => {
    const params = new URLSearchParams({ page, sort })
    if (format) params.set('format', format)
    if (show) params.set('show', show)
    return req('GET', `/api/posts?${params}`)
  },

  // Trending (mixed Reddit + user posts)
  getTrending: (limit = 30) =>
    req('GET', `/api/posts/trending?limit=${limit}`),

  // Posts for a specific show
  getShowPosts: (showName, { spoiler, page = 1 } = {}) => {
    const params = new URLSearchParams({ page })
    if (spoiler !== undefined) params.set('spoiler', spoiler)
    return req('GET', `/api/posts/show/${encodeURIComponent(showName)}?${params}`)
  },

  // Create a post (requires auth)
  createPost: (post) => req('POST', '/api/posts', post),

  // Update a post (requires auth)
  updatePost: (id, updates) => req('PUT', `/api/posts/${id}`, updates),

  // Delete a post (requires auth)
  deletePost: (id) => req('DELETE', `/api/posts/${id}`),

  // Like a post (requires auth)
  likePost: (id) => req('POST', `/api/posts/${id}/like`),

  // ─── Auth ──────────────────────────────────────────────────────────────────
  login:    (username, password) => req('POST', '/api/auth/login',    { username, password }),
  register: (username, email, password) => req('POST', '/api/auth/register', { username, email, password }),
  me:       () => req('GET', '/api/auth/me'),

  // ─── Admin ─────────────────────────────────────────────────────────────────
  seed:       () => req('POST', '/api/admin/seed'),
  processAll: () => req('POST', '/api/admin/process-all'),
}

export default api
