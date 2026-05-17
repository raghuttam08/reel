import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FEED_POSTS, SHOWS_LIST } from '../data/shows'
import FeedCard from '../components/FeedCard'

export default function Home() {
  const [tab, setTab] = useState('trending')

  const sorted = [...FEED_POSTS].sort((a, b) =>
    tab === 'trending'
      ? b.score - a.score
      : new Date(b.published) - new Date(a.published)
  )

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 24px', display: 'flex', gap: 48, alignItems: 'flex-start' }}>

      {/* Feed */}
      <div style={{ flex: 1, minWidth: 0 }}>

        {/* Hero line */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            fontWeight: 400,
            fontStyle: 'italic',
            color: 'var(--text-primary)',
            lineHeight: 1.2,
            marginBottom: 8,
          }}>
            What people actually felt.
          </h1>
          <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
            Real audience reactions — no critic scores, no algorithms.
          </p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 24, borderBottom: '1px solid var(--border)', paddingBottom: 0 }}>
          {[['trending', 'Trending'], ['recent', 'Recent']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 500,
                color: tab === id ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${tab === id ? 'var(--text-primary)' : 'transparent'}`,
                marginBottom: -1,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'var(--font-body)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {sorted.map(post => (
            <FeedCard key={post.id} post={post} />
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <aside style={{ width: 220, flexShrink: 0, display: 'none' }} className="lg-sidebar">
        <div style={{ position: 'sticky', top: 80 }}>
          <p style={{
            fontSize: 10, fontWeight: 500,
            textTransform: 'uppercase', letterSpacing: '0.12em',
            color: 'var(--text-muted)',
            marginBottom: 12,
          }}>
            Shows
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {SHOWS_LIST.map(show => (
              <Link
                key={show.show_name}
                to={`/show/${encodeURIComponent(show.show_name)}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 10px',
                  borderRadius: 7,
                  transition: 'background 0.1s',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-hover)'; e.currentTarget.style.color = 'var(--text-primary)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)' }}
              >
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {show.show_name}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8, flexShrink: 0 }}>
                  {show.release_year}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </aside>

    </div>
  )
}
