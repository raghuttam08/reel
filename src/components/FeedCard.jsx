import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../lib/api'

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

export default function FeedCard({ post, spoilerBlur = false, onPostUpdate, onPostDelete }) {
  const [revealed, setRevealed] = useState(false)
  const [hovered, setHovered]   = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(post.text)
  const [editFormat, setEditFormat] = useState(post.format)
  const [isSpoiler, setIsSpoiler] = useState(post.is_spoiler || false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showMenu, setShowMenu] = useState(false)
  const fmt = FORMATS[post.format] || FORMATS.verdict

  // Get current user on mount
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const response = await api.me()
        // Extract the nested user object from the response: response.user.user or response.user
        const user = response.user?.user || response.user || response
        setCurrentUser(user)
      } catch (err) {
        // Not logged in or error
        console.log('Failed to get user info:', err.message)
      }
    }
    getUserInfo()
  }, [])

  const isOwnPost = currentUser && currentUser.username === post.username

  const handleSaveEdit = async () => {
    if (!editText.trim()) return
    try {
      const updated = await api.updatePost(post._id, {
        text: editText,
        format: editFormat,
        is_spoiler: isSpoiler,
      })
      if (onPostUpdate) onPostUpdate(post._id, updated)
      setIsEditing(false)
      setShowMenu(false)
    } catch (err) {
      alert(`Failed to update: ${err.message}`)
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return
    setIsDeleting(true)
    try {
      await api.deletePost(post._id)
      if (onPostDelete) onPostDelete(post._id)
    } catch (err) {
      alert(`Failed to delete: ${err.message}`)
      setIsDeleting(false)
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setEditText(post.text)
    setEditFormat(post.format)
    setIsSpoiler(post.is_spoiler || false)
    setShowMenu(false)
  }

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

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
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
          
          {/* Menu button for own posts */}
          {isOwnPost && !isEditing && (
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 16,
                  padding: '4px 8px',
                  color: 'var(--ink-faint)',
                  opacity: hovered ? 1 : 0.6,
                  transition: 'opacity 0.15s',
                }}
                title="Edit or delete"
              >
                ⋯
              </button>
              
              {showMenu && (
                <div style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-warm)',
                  borderRadius: 8,
                  boxShadow: '0 4px 12px rgba(139, 98, 32, 0.12)',
                  zIndex: 10,
                  minWidth: 120,
                  overflow: 'hidden',
                }}>
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 12,
                      color: 'var(--ink)',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.target.style.background = 'var(--bg-raised)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                  >
                    ✏️ Edit
                  </button>
                  <div style={{ height: '1px', background: 'var(--border-warm)' }} />
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      background: 'transparent',
                      border: 'none',
                      cursor: isDeleting ? 'not-allowed' : 'pointer',
                      fontSize: 12,
                      color: '#e07060',
                      textAlign: 'left',
                      opacity: isDeleting ? 0.6 : 1,
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => e.target.style.background = 'rgba(224, 112, 96, 0.08)'}
                    onMouseLeave={e => e.target.style.background = 'transparent'}
                  >
                    {isDeleting ? '🗑️ Deleting...' : '🗑️ Delete'}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
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

      {/* Quote text or edit form */}
      <div style={{ position: 'relative' }}>
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {/* Edit form */}
            <div style={{ display: 'flex', gap: 8 }}>
              {['moment', 'verdict', 'discovery'].map(fmt_key => (
                <button
                  key={fmt_key}
                  onClick={() => setEditFormat(fmt_key)}
                  style={{
                    padding: '6px 12px',
                    fontSize: 10,
                    fontWeight: 700,
                    border: `2px solid ${editFormat === fmt_key ? FORMATS[fmt_key].color : 'var(--border-warm)'}`,
                    background: editFormat === fmt_key ? FORMATS[fmt_key].bg : 'transparent',
                    color: editFormat === fmt_key ? FORMATS[fmt_key].color : 'var(--ink-faint)',
                    borderRadius: 6,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={e => {
                    if (editFormat !== fmt_key) {
                      e.target.style.borderColor = FORMATS[fmt_key].color
                      e.target.style.color = FORMATS[fmt_key].color
                    }
                  }}
                  onMouseLeave={e => {
                    if (editFormat !== fmt_key) {
                      e.target.style.borderColor = 'var(--border-warm)'
                      e.target.style.color = 'var(--ink-faint)'
                    }
                  }}
                >
                  {FORMATS[fmt_key].label}
                </button>
              ))}
            </div>

            <textarea
              value={editText}
              onChange={e => setEditText(e.target.value)}
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 14,
                padding: 12,
                border: `1px solid var(--border-warm)`,
                borderRadius: 8,
                background: 'var(--bg-raised)',
                color: 'var(--ink)',
                resize: 'vertical',
                minHeight: 80,
              }}
              placeholder="Edit your post..."
            />

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'var(--ink-muted)' }}>
              <input
                type="checkbox"
                checked={isSpoiler}
                onChange={e => setIsSpoiler(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              Contains spoilers
            </label>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button
                onClick={handleCancel}
                style={{
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  border: '1px solid var(--border-warm)',
                  background: 'transparent',
                  color: 'var(--ink-faint)',
                  borderRadius: 6,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.target.style.color = 'var(--ink)'}
                onMouseLeave={e => e.target.style.color = 'var(--ink-faint)'}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editText.trim()}
                style={{
                  padding: '8px 14px',
                  fontSize: 12,
                  fontWeight: 600,
                  border: 'none',
                  background: editText.trim() ? 'var(--accent)' : 'var(--ink-faint)',
                  color: '#fff',
                  borderRadius: 6,
                  cursor: editText.trim() ? 'pointer' : 'not-allowed',
                  opacity: editText.trim() ? 1 : 0.5,
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  if (editText.trim()) e.target.style.opacity = '0.9'
                }}
                onMouseLeave={e => {
                  if (editText.trim()) e.target.style.opacity = '1'
                }}
              >
                Save
              </button>
            </div>
          </div>
        ) : (
          <>
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
          </>
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