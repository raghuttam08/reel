import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../lib/AuthContext'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuth()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  const active = (path) => location.pathname === path

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(248,244,238,0.93)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(139,110,66,0.13)',
      boxShadow: '0 1px 0 rgba(255,255,255,0.7) inset',
    }}>
      <div style={{
        maxWidth: 1140, margin: '0 auto',
        padding: '0 28px',
        height: 58,
        display: 'flex', alignItems: 'center', gap: 20,
      }}>

        {/* Logo */}
        <Link to="/" style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 26,
          color: 'var(--ink)',
          letterSpacing: '-0.5px',
          flexShrink: 0,
          lineHeight: 1,
        }}>
          reel
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 320 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search shows & films..."
            style={{
              width: '100%',
              background: 'rgba(139,110,66,0.07)',
              border: '1px solid rgba(139,110,66,0.15)',
              borderRadius: 8,
              padding: '7px 14px',
              fontSize: 12,
              color: 'var(--ink)',
              outline: 'none',
              transition: 'all 0.15s',
            }}
            onFocus={e => {
              e.target.style.borderColor = 'rgba(139,110,66,0.35)'
              e.target.style.background = 'rgba(139,110,66,0.1)'
            }}
            onBlur={e => {
              e.target.style.borderColor = 'rgba(139,110,66,0.15)'
              e.target.style.background = 'rgba(139,110,66,0.07)'
            }}
          />
        </form>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
          {[['/', 'Shows'], ['/feed', 'Feed']].map(([path, label]) => (
            <Link key={path} to={path} style={{
              fontSize: 12,
              fontWeight: active(path) ? 600 : 400,
              padding: '6px 12px',
              borderRadius: 8,
              color: active(path) ? 'var(--ink)' : 'var(--ink-muted)',
              background: active(path) ? 'rgba(139,110,66,0.1)' : 'transparent',
              border: active(path) ? '1px solid rgba(139,110,66,0.18)' : '1px solid transparent',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!active(path)) { e.currentTarget.style.color = 'var(--ink-body)'; e.currentTarget.style.background = 'rgba(139,110,66,0.05)' }}}
              onMouseLeave={e => { if (!active(path)) { e.currentTarget.style.color = 'var(--ink-muted)'; e.currentTarget.style.background = 'transparent' }}}
            >
              {label}
            </Link>
          ))}

          {user ? (
            <>
              <Link to="/post" className="btn-gold" style={{ marginLeft: 4 }}>+ Post</Link>
              <button
                onClick={logout}
                className="btn-warm"
                style={{ marginLeft: 4 }}
              >
                @{user.username}
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-gold" style={{ marginLeft: 4 }}>
              Sign in
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}