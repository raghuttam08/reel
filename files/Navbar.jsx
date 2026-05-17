import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useState } from 'react'

export default function Navbar() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`)
      setQuery('')
    }
  }

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(8,8,8,0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '0 24px',
        height: 56,
        display: 'flex', alignItems: 'center', gap: 24,
      }}>

        <Link to="/" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          color: 'var(--text-primary)',
          letterSpacing: '-0.5px',
          flexShrink: 0,
        }}>
          reel
        </Link>

        <form onSubmit={handleSearch} style={{ flex: 1, maxWidth: 360 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search shows & films..."
            style={{
              width: '100%',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '7px 14px',
              fontSize: 13,
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'border-color 0.15s',
            }}
            onFocus={e => e.target.style.borderColor = 'var(--border-hover)'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </form>

        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
          {[['/', 'Home'], ['/search', 'Discover'], ['/post', 'Post']].map(([path, label]) => {
            const active = location.pathname === path
            return (
              <Link
                key={path}
                to={path}
                style={{
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  background: active ? 'var(--bg-hover)' : 'transparent',
                  transition: 'all 0.15s',
                  fontWeight: active ? 500 : 400,
                }}
              >
                {label}
              </Link>
            )
          })}
        </div>

      </div>
    </nav>
  )
}
