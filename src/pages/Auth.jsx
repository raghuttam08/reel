import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../lib/AuthContext'

function AuthForm({ mode }) {
  const [username, setUsername] = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const { login, register } = useAuth()
  const navigate = useNavigate()

  const isLogin = mode === 'login'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isLogin) {
        await login(username, password)
      } else {
        await register(username, email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(139,110,66,0.06)',
    border: '1px solid var(--border-warm)',
    borderRadius: 10,
    padding: '11px 14px',
    fontSize: 14,
    color: 'var(--ink)',
    outline: 'none',
    transition: 'all 0.15s',
    display: 'block',
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>

      {/* Background glow */}
      <div style={{
        position: 'fixed', top: '20%', left: '50%', transform: 'translateX(-50%)',
        width: 600, height: 400,
        background: 'radial-gradient(ellipse, rgba(212,168,83,0.06) 0%, transparent 65%)',
        pointerEvents: 'none', zIndex: 0,
      }} />

      <div style={{
        width: '100%', maxWidth: 420,
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <Link to="/" style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 36,
            color: 'var(--ink)',
            display: 'inline-block',
          }}>
            reel
          </Link>
          <p style={{ fontSize: 13, color: 'var(--ink-muted)', marginTop: 6 }}>
            {isLogin ? 'Sign in to share your reactions' : 'Join the conversation'}
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#fff',
          border: '1px solid var(--border-warm)',
          borderRadius: 16,
          padding: '32px 28px',
          boxShadow: '0 4px 24px rgba(139,98,32,0.07)',
        }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="your_username"
                  required
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(139,110,66,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-warm)'}
                />
              </div>

              {!isLogin && (
                <div>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = 'rgba(139,110,66,0.4)'}
                    onBlur={e => e.target.style.borderColor = 'var(--border-warm)'}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: 'var(--ink-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  style={inputStyle}
                  onFocus={e => e.target.style.borderColor = 'rgba(139,110,66,0.4)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-warm)'}
                />
              </div>

              {error && (
                <div style={{
                  background: 'rgba(220,60,60,0.07)',
                  border: '1px solid rgba(220,60,60,0.2)',
                  borderRadius: 8,
                  padding: '10px 14px',
                  fontSize: 13,
                  color: '#c03030',
                }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-gold"
                style={{
                  width: '100%',
                  padding: '12px',
                  fontSize: 13,
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  marginTop: 4,
                }}
              >
                {loading ? '…' : isLogin ? 'Sign in' : 'Create account'}
              </button>
            </div>
          </form>

          {/* Toggle */}
          <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--ink-muted)', marginTop: 20 }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <Link
              to={isLogin ? '/register' : '/login'}
              style={{ color: 'var(--gold-deep)', fontWeight: 600, textDecoration: 'underline' }}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export function LoginPage()    { return <AuthForm mode="login" /> }
export function RegisterPage() { return <AuthForm mode="register" /> }