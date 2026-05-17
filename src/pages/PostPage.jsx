import { useState, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../lib/AuthContext'

export default function PostPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [show, setShow] = useState('')
  const [rating, setRating] = useState(5)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { user, isAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!isAuthenticated) {
      setError('Please log in to create a post')
      return
    }

    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          title,
          content,
          show,
          rating,
        }),
      })

      if (!response.ok) throw new Error('Failed to create post')

      const post = await response.json()
      navigate(`/post/${post.id}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 24px 80px' }}>
      <h1 style={{
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontSize: 36,
        marginBottom: 8,
      }}>
        Share your thoughts
      </h1>
      <p style={{
        fontSize: 13,
        color: 'var(--text-secondary)',
        marginBottom: 32,
      }}>
        Post about your favorite shows & films
      </p>

      {error && (
        <div style={{
          background: 'rgba(220, 38, 38, 0.1)',
          border: '1px solid rgba(220, 38, 38, 0.3)',
          borderRadius: 8,
          padding: 12,
          marginBottom: 20,
          fontSize: 12,
          color: '#991b1b',
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
            Show / Film
          </label>
          <input
            type="text"
            placeholder="e.g., Breaking Bad, The Office"
            value={show}
            onChange={e => setShow(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '1px solid rgba(139,110,66,0.15)',
              borderRadius: 8,
              fontSize: 13,
              background: 'rgba(255,255,255,0.6)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
            Title
          </label>
          <input
            type="text"
            placeholder="What's on your mind?"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '1px solid rgba(139,110,66,0.15)',
              borderRadius: 8,
              fontSize: 13,
              background: 'rgba(255,255,255,0.6)',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>
            Your thoughts
          </label>
          <textarea
            placeholder="Share your detailed thoughts about this show or film..."
            value={content}
            onChange={e => setContent(e.target.value)}
            required
            rows={8}
            style={{
              width: '100%',
              padding: '12px 14px',
              border: '1px solid rgba(139,110,66,0.15)',
              borderRadius: 8,
              fontSize: 13,
              background: 'rgba(255,255,255,0.6)',
              outline: 'none',
              fontFamily: 'inherit',
              resize: 'vertical',
              minHeight: 200,
              boxSizing: 'border-box',
            }}
          />
        </div>

        <div>
          <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: 12 }}>
            Rating: {rating}/10
          </label>
          <input
            type="range"
            min="0"
            max="10"
            value={rating}
            onChange={e => setRating(Number(e.target.value))}
            style={{ width: '100%' }}
          />
        </div>

        <button
          type="submit"
          disabled={loading || !isAuthenticated}
          style={{
            padding: '12px 16px',
            background: !isAuthenticated ? 'rgba(139,110,66,0.3)' : 'rgba(212,168,83,0.9)',
            border: 'none',
            borderRadius: 8,
            fontSize: 13,
            fontWeight: 600,
            color: 'var(--text-ink)',
            cursor: (!isAuthenticated || loading) ? 'not-allowed' : 'pointer',
            opacity: (!isAuthenticated || loading) ? 0.6 : 1,
            transition: 'all 0.15s',
          }}
          onMouseEnter={e => {
            if (isAuthenticated && !loading) {
              e.currentTarget.style.background = 'rgba(212,168,83,1)'
            }
          }}
          onMouseLeave={e => {
            if (isAuthenticated && !loading) {
              e.currentTarget.style.background = 'rgba(212,168,83,0.9)'
            }
          }}
        >
          {loading ? 'Publishing...' : isAuthenticated ? 'Publish post' : 'Please log in'}
        </button>
      </form>
    </div>
  )
}
