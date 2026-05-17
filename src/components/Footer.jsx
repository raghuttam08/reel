import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border-warm)',
      background: 'var(--bg-alt)',
      padding: '40px 28px',
      marginTop: 'auto',
    }}>
      <div style={{
        maxWidth: 1140, margin: '0 auto',
        display: 'flex', alignItems: 'flex-start',
        justifyContent: 'space-between', gap: 40,
      }}>

        {/* Brand */}
        <div>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontStyle: 'italic',
            fontSize: 24, color: 'var(--ink)',
            marginBottom: 6,
          }}>
            reel
          </p>
          <p style={{ fontSize: 12, color: 'var(--ink-faint)', maxWidth: 240, lineHeight: 1.6 }}>
            Real audience reactions to films and TV shows — no critic scores, no algorithms.
          </p>
        </div>

        {/* Links */}
        <div style={{ display: 'flex', gap: 60 }}>
          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-faint)', marginBottom: 12 }}>
              Explore
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['/', 'Shows'], ['/feed', 'Feed'], ['/search', 'Discover']].map(([path, label]) => (
                <Link key={path} to={path} style={{
                  fontSize: 13, color: 'var(--ink-muted)',
                  transition: 'color 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted)'}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <p style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--ink-faint)', marginBottom: 12 }}>
              Account
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[['/login', 'Sign in'], ['/register', 'Register'], ['/post', 'Post a reaction']].map(([path, label]) => (
                <Link key={path} to={path} style={{
                  fontSize: 13, color: 'var(--ink-muted)',
                  transition: 'color 0.15s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = 'var(--ink)'}
                  onMouseLeave={e => e.currentTarget.style.color = 'var(--ink-muted)'}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        maxWidth: 1140, margin: '28px auto 0',
        paddingTop: 20,
        borderTop: '1px solid var(--border-warm)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <p style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
          © 2026 reel. Built with real human data.
        </p>
        <p style={{ fontSize: 11, color: 'var(--ink-faint)' }}>
          Data from Reddit · TMDB
        </p>
      </div>
    </footer>
  )
}
