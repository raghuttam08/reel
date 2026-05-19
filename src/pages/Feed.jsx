import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FEED_POSTS } from '../data/shows'
import FeedCard from '../components/FeedCard'
import api from '../lib/api'

const PER_PAGE = 10

export default function Feed() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [tab, setTab] = useState('trending')
  const [posts, setPosts] = useState([...FEED_POSTS])

  const page = parseInt(searchParams.get('page') || '1')

  const sorted = [...posts].sort((a, b) =>
    tab === 'trending'
      ? b.score - a.score
      : new Date(b.published) - new Date(a.published)
  )

  const totalPages = Math.ceil(sorted.length / PER_PAGE)
  const paginated  = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const goPage = (p) => {
    setSearchParams({ page: p })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const switchTab = (t) => {
    setTab(t)
    goPage(1)
  }

  const handlePostDelete = (postId) => {
    setPosts(prev => prev.filter(p => p._id !== postId && p.id !== postId))
  }

  const handlePostUpdate = (postId, updatedPost) => {
    setPosts(prev => prev.map(p => p._id === postId || p.id === postId ? updatedPost : p))
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 28px 80px' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 36,
          fontWeight: 400,
          color: 'var(--ink)',
          marginBottom: 6,
        }}>
          The feed.
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
          Real reactions from real people — moments, verdicts, discoveries.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24 }}>
        {[['trending', 'Trending'], ['recent', 'Recent']].map(([id, label]) => (
          <button
            key={id}
            onClick={() => switchTab(id)}
            style={{
              fontSize: 11, fontWeight: 700,
              letterSpacing: '0.06em',
              padding: '8px 18px',
              borderRadius: 8,
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.15s',
              background: tab === id
                ? 'linear-gradient(135deg, #c4933a, #8b6220)'
                : 'rgba(139,110,66,0.07)',
              color: tab === id ? '#f8f4ee' : 'var(--ink-muted)',
              boxShadow: tab === id ? '0 2px 10px rgba(139,98,32,0.28)' : 'none',
              border: tab === id ? 'none' : '1px solid var(--border-warm)',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Posts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        {paginated.map(post => (
          <FeedCard key={post._id ?? post.id} post={post} onPostUpdate={handlePostUpdate} onPostDelete={handlePostDelete} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <button
            onClick={() => goPage(page - 1)}
            disabled={page === 1}
            style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              border: '1px solid var(--border-warm)',
              background: page === 1 ? 'transparent' : 'var(--bg-card)',
              color: page === 1 ? 'var(--ink-faint)' : 'var(--ink-muted)',
              cursor: page === 1 ? 'not-allowed' : 'pointer',
            }}
          >
            ← Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => {
            const p = i + 1
            const show = Math.abs(p - page) <= 2 || p === 1 || p === totalPages
            if (!show) return (p === page - 3 || p === page + 3)
              ? <span key={p} style={{ color: 'var(--ink-faint)' }}>…</span>
              : null
            return (
              <button
                key={p}
                onClick={() => goPage(p)}
                style={{
                  width: 34, height: 34, borderRadius: 8,
                  fontSize: 12, fontWeight: p === page ? 700 : 500,
                  border: p === page ? 'none' : '1px solid var(--border-warm)',
                  background: p === page
                    ? 'linear-gradient(135deg, #f5e6b8, #d4a853, #c4933a)'
                    : 'var(--bg-card)',
                  color: p === page ? '#16100a' : 'var(--ink-muted)',
                  cursor: 'pointer',
                  boxShadow: p === page ? '0 2px 10px rgba(212,168,83,0.28)' : 'none',
                }}
              >
                {p}
              </button>
            )
          })}

          <button
            onClick={() => goPage(page + 1)}
            disabled={page === totalPages}
            style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600,
              border: '1px solid var(--border-warm)',
              background: page === totalPages ? 'transparent' : 'var(--bg-card)',
              color: page === totalPages ? 'var(--ink-faint)' : 'var(--ink-muted)',
              cursor: page === totalPages ? 'not-allowed' : 'pointer',
            }}
          >
            Next →
          </button>
        </div>
      )}
    </div>
  )
}