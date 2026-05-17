import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { tmdb } from '../lib/tmdb'

export default function Discover() {
  const [trending, setTrending] = useState([])
  const [loading, setLoading] = useState(true)
  const [type, setType] = useState('tv')

  useEffect(() => {
    fetchTrending()
  }, [type])

  const fetchTrending = async () => {
    setLoading(true)
    try {
      const data = await tmdb.getTrending(type)
      setTrending(data.results || [])
    } catch (error) {
      console.error('Error fetching trending:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 40,
      }}>
        <div>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 40,
            marginBottom: 8,
          }}>
            Discover
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Trending this week
          </p>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {['tv', 'movie'].map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              style={{
                padding: '8px 16px',
                border: `1px solid ${type === t ? 'rgba(212,168,83,0.3)' : 'rgba(139,110,66,0.15)'}`,
                background: type === t ? 'rgba(212,168,83,0.1)' : 'transparent',
                borderRadius: 6,
                fontSize: 12,
                fontWeight: type === t ? 600 : 500,
                color: type === t ? 'var(--text-ink)' : 'var(--text-body)',
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)' }}>
          Loading trending...
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 16,
        }}>
          {trending.map(item => (
            <Link
              key={item.id}
              to={`/show/${encodeURIComponent(item.name || item.title)}`}
              style={{
                display: 'block',
                borderRadius: 10,
                overflow: 'hidden',
                background: 'rgba(0,0,0,0.3)',
                aspectRatio: '2/3',
                position: 'relative',
                textDecoration: 'none',
                group: 'hover',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.05)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              {item.poster_path && (
                <img
                  src={tmdb.getPosterUrl(item.poster_path)}
                  alt={item.name || item.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              )}
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                padding: '16px 12px 12px',
                color: 'white',
              }}>
                <p style={{ fontSize: 12, fontWeight: 600, margin: 0, lineHeight: 1.3 }}>
                  {item.name || item.title}
                </p>
                <p style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', margin: '4px 0 0' }}>
                  ★ {(item.vote_average || 0).toFixed(1)}/10
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
