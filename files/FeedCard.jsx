import { useState } from 'react'
import { Link } from 'react-router-dom'

const FORMATS = {
  moment:    { label: 'moment',    color: '#4ecca3', bg: 'rgba(78,204,163,0.08)',    border: 'rgba(78,204,163,0.2)'  },
  verdict:   { label: 'verdict',   color: '#e8a24a', bg: 'rgba(232,162,74,0.08)',    border: 'rgba(232,162,74,0.2)'  },
  discovery: { label: 'discovery', color: '#9b7fe8', bg: 'rgba(155,127,232,0.08)',   border: 'rgba(155,127,232,0.2)' },
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return 'today'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days/7)}w ago`
  if (days < 365) return `${Math.floor(days/30)}mo ago`
  return `${Math.floor(days/365)}y ago`
}

export default function FeedCard({ post, spoilerBlur = false, compact = false }) {
  const [revealed, setRevealed] = useState(false)
  const fmt = FORMATS[post.format] || FORMATS.moment

  return (
    <article style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: compact ? '14px 16px' : '18px 20px',
      transition: 'border-color 0.15s',
      cursor: 'default',
    }}
    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hover)'}
    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
    >

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: `${fmt.bg}`,
            border: `1px solid ${fmt.border}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 500, color: fmt.color,
            flexShrink: 0,
          }}>
            {post.username[0].toUpperCase()}
          </div>
          <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 400 }}>
            @{post.username}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>·</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {timeAgo(post.published)}
          </span>
        </div>

        <span style={{
          fontSize: 11, fontWeight: 500,
          color: fmt.color,
          background: fmt.bg,
          border: `1px solid ${fmt.border}`,
          padding: '2px 8px',
          borderRadius: 20,
          letterSpacing: '0.02em',
        }}>
          {fmt.label}
        </span>
      </div>

      {/* Show name */}
      <Link
        to={`/show/${encodeURIComponent(post.show_name)}`}
        style={{
          display: 'block',
          fontSize: 12,
          fontWeight: 500,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          marginBottom: 8,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.target.style.color = 'var(--text-primary)'}
        onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
      >
        {post.show_name}
      </Link>

      {/* Text */}
      <div style={{ position: 'relative' }}>
        <p style={{
          fontSize: 15,
          color: 'var(--text-primary)',
          lineHeight: 1.65,
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          filter: spoilerBlur && !revealed ? 'blur(6px)' : 'none',
          userSelect: spoilerBlur && !revealed ? 'none' : 'auto',
          transition: 'filter 0.2s',
        }}>
          {post.text}
        </p>
        {spoilerBlur && !revealed && (
          <button
            onClick={() => setRevealed(true)}
            style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent',
              border: 'none', cursor: 'pointer',
              fontSize: 12, color: 'var(--text-secondary)',
              fontFamily: 'var(--font-body)',
            }}
          >
            Click to reveal spoiler
          </button>
        )}
      </div>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
        <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          ↑ {post.score?.toLocaleString()}
        </span>
      </div>

    </article>
  )
}
