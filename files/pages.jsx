// Search.jsx
import { useSearchParams, Link } from 'react-router-dom'
import { SHOWS_LIST } from '../data/shows'
import { useState } from 'react'

export function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''

  const results = q
    ? SHOWS_LIST.filter(s => s.show_name.toLowerCase().includes(q.toLowerCase()))
    : SHOWS_LIST

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>

      <div style={{ marginBottom: 36 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 32,
          fontWeight: 400,
          color: 'var(--text-primary)',
          marginBottom: 6,
        }}>
          {q ? `"${q}"` : 'Discover'}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          {results.length} show{results.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
        {results.map(show => (
          <Link
            key={show.show_name}
            to={`/show/${encodeURIComponent(show.show_name)}`}
            style={{
              display: 'block',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 12,
              padding: '20px',
              transition: 'border-color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <h2 style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 3 }}>
                  {show.show_name}
                </h2>
                <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{show.release_year}</p>
              </div>
              <span style={{
                fontSize: 12,
                color: '#4ecca3',
                background: 'rgba(78,204,163,0.08)',
                border: '1px solid rgba(78,204,163,0.15)',
                padding: '3px 8px',
                borderRadius: 20,
                flexShrink: 0,
              }}>
                {show.honest_stats.overall_positive_pct}%
              </span>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {show.tone_tags.slice(0, 3).map(tag => (
                <span key={tag} style={{
                  fontSize: 11,
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border)',
                  padding: '2px 8px',
                  borderRadius: 20,
                }}>
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// PostPage.jsx
import { PostForm } from '../components/components'
import { useNavigate } from 'react-router-dom'

export function PostPage() {
  const navigate = useNavigate()

  const handlePost = (post) => {
    setTimeout(() => navigate('/'), 1500)
  }

  return (
    <div style={{ maxWidth: 560, margin: '0 auto', padding: '48px 24px' }}>
      <div style={{ marginBottom: 36 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 32,
          fontWeight: 400,
          color: 'var(--text-primary)',
          marginBottom: 8,
        }}>
          Share a reaction
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          A moment, a verdict, or a discovery. One honest thing.
        </p>
      </div>

      <PostForm onPost={handlePost} />
    </div>
  )
}
