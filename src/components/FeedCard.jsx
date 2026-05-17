import { useState } from 'react'
import { Link } from 'react-router-dom'

const FORMATS = {
  moment: {
    label: 'MOMENT',
    color: '#28b5a0', deep: '#187a6a',
    bg: 'rgba(40,181,160,0.08)',
    border: 'rgba(40,181,160,0.22)',
    bar: 'linear-gradient(180deg, #5dcaa5, #28b5a0, #187a6a)',
    avatar: 'linear-gradient(135deg, #5dcaa5, #28b5a0)',
    avatarText: '#fff',
  },
  verdict: {
    label: 'VERDICT',
    color: '#d4a853', deep: '#8b6220',
    bg: 'rgba(212,168,83,0.09)',
    border: 'rgba(212,168,83,0.25)',
    bar: 'linear-gradient(180deg, #f5e6b8, #d4a853, #8b6220)',
    avatar: 'linear-gradient(135deg, #f5e6b8, #d4a853)',
    avatarText: '#16100a',
  },
  discovery: {
    label: 'DISCOVERY',
    color: '#9580f0', deep: '#5444b0',
    bg: 'rgba(149,128,240,0.08)',
    border: 'rgba(149,128,240,0.22)',
    bar: 'linear-gradient(180deg, #c9c0f8, #9580f0, #5444b0)',
    avatar: 'linear-gradient(135deg, #c9c0f8, #9580f0)',
    avatarText: '#fff',
  },
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const days = Math.floor(diff / 86400000)
  if (days < 1) return 'today'
  if (days < 7) return `${days}d ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

export default function FeedCard({ post, spoilerBlur = false }) {
  const [revealed, setRevealed] = useState(false)
  const [hovered, setHovered]   = useState(false)
  const fmt = FORMATS[post.format] || FORMATS.verdict

  return (
    <article
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-raised)' : 'var(--bg-card)',
        border: `1px solid ${hovered ? fmt.border : 'var(--border-warm)'}`,
        borderLeft: `3px solid ${fmt.color}`,
        borderRadius: 14,
        padding: '18px 20px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.18s',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: hovered
          ? `0 6px 24px rgba(139,98,32,0.08), 0 0 0 1px ${fmt.border}`
          : '0 1px 4px rgba(139,98,32,0.04)',
      }}
    >
      {/* Ambient glow on hover */}
      {hovered && (
        <div style={{
          position: 'absolute', top: -30, right: -30,
          width: 100, height: 100,
          background: `radial-gradient(circle, ${fmt.bg} 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />
      )}

      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: fmt.avatar,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700,
            color: fmt.avatarText,
            flexShrink: 0,
          }}>
            {(post.username || 'u')[0].toUpperCase()}
          </div>
          <span style={{ fontSize: 12, color: 'var(--ink-muted)', fontWeight: 500 }}>
            @{post.username}
          </span>
          <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>·</span>
          <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
            {timeAgo(post.published || post.created_at)}
          </span>
        </div>

        <span style={{
          fontSize: 10, fontWeight: 700, letterSpacing: '0.07em',
          color: fmt.deep,
          background: fmt.bg,
          border: `1px solid ${fmt.border}`,
          padding: '3px 9px',
          borderRadius: 20,
        }}>
          {fmt.label}
        </span>
      </div>

      {/* Show name */}
      <Link
        to={`/show/${encodeURIComponent(post.show_name)}`}
        style={{
          display: 'block',
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.1em',
          color: 'var(--ink-faint)',
          textTransform: 'uppercase',
          marginBottom: 8,
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => e.target.style.color = fmt.color}
        onMouseLeave={e => e.target.style.color = 'var(--ink-faint)'}
      >
        {post.show_name}
      </Link>

      {/* Quote text */}
      <div style={{ position: 'relative' }}>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 17,
          fontWeight: 400,
          color: 'var(--ink)',
          lineHeight: 1.65,
          filter: spoilerBlur && !revealed ? 'blur(5px)' : 'none',
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
              background: 'transparent', border: 'none',
              cursor: 'pointer',
              fontSize: 11, color: 'var(--ink-muted)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            Click to reveal spoiler
          </button>
        )}
      </div>

      {/* Score */}
      <div style={{ marginTop: 14 }}>
        <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
          ↑ {(post.score || post.likes || 0).toLocaleString()}
        </span>
      </div>
    </article>
  )
}