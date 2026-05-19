import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { watchlistService } from '../lib/watchlist'
import { useAuth } from '../lib/AuthContext'

export default function Watchlist() {
  const { user, token } = useAuth()
  const [watchlist, setWatchlist] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!token) return

    const loadWatchlist = async () => {
      try {
        const items = await watchlistService.getWatchlist()
        setWatchlist(items)
      } catch (err) {
        setError('Failed to load watchlist')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadWatchlist()
  }, [token])

  const removeFromWatchlist = async (showName) => {
    try {
      await watchlistService.removeFromWatchlist(showName)
      setWatchlist(watchlist.filter(show => show !== showName))
    } catch (err) {
      setError('Failed to remove from watchlist')
    }
  }

  if (!token) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 18, marginBottom: 16 }}>Please sign in to view your watchlist</p>
          <Link to="/login" style={{
            color: '#d4a853',
            textDecoration: 'none',
            fontSize: 16,
            fontWeight: 600
          }}>
            Sign in →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', padding: '40px 20px', maxWidth: 1200, margin: '0 auto' }}>
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 32, color: '#1a1a1a' }}>
        My Watchlist
      </h1>

      {error && (
        <div style={{
          padding: 16,
          backgroundColor: '#fee',
          border: '1px solid #fcc',
          borderRadius: 8,
          color: '#c00',
          marginBottom: 24
        }}>
          {error}
        </div>
      )}

      {loading ? (
        <p style={{ fontSize: 16, color: '#666' }}>Loading...</p>
      ) : watchlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 40 }}>
          <p style={{ fontSize: 18, color: '#999', marginBottom: 16 }}>
            Your watchlist is empty
          </p>
          <Link to="/" style={{
            color: '#d4a853',
            textDecoration: 'none',
            fontSize: 16,
            fontWeight: 600
          }}>
            Explore shows →
          </Link>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 24
        }}>
          {watchlist.map(showName => (
            <div key={showName} style={{
              background: '#f9f7f4',
              borderRadius: 12,
              padding: 16,
              border: '1px solid #e8e1d9'
            }}>
              <Link
                to={`/show/${encodeURIComponent(showName)}`}
                style={{
                  textDecoration: 'none',
                  color: '#1a1a1a',
                  display: 'block',
                  marginBottom: 12
                }}
              >
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 12 }}>
                  {showName}
                </h3>
              </Link>
              <button
                onClick={() => removeFromWatchlist(showName)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  background: '#fff',
                  border: '1px solid #d4a853',
                  borderRadius: 6,
                  color: '#d4a853',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  fontSize: 12
                }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = '#d4a853'
                  e.target.style.color = '#fff'
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = '#fff'
                  e.target.style.color = '#d4a853'
                }}
              >
                Remove from Watchlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
