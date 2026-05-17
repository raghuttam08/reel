import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { SHOWS_LIST } from '../data/shows'
import { enrichShowsWithPosters, posterUrl } from '../lib/tmdb'
import { PostForm } from '../components/components'
import api from '../lib/api'

// ─── Search ───────────────────────────────────────────────────────────────────
export function Search() {
  const [params] = useSearchParams()
  const q = params.get('q') || ''
  const [shows, setShows]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.getShows()
      .then(async (apiShows) => {
        const base = apiShows?.length ? apiShows : SHOWS_LIST
        const enriched = await enrichShowsWithPosters(base)
        setShows(enriched)
      })
      .catch(async () => {
        const enriched = await enrichShowsWithPosters(SHOWS_LIST)
        setShows(enriched)
      })
      .finally(() => setLoading(false))
  }, [])

  const results = q
    ? shows.filter(s => s.show_name.toLowerCase().includes(q.toLowerCase()))
    : shows

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '40px 28px 80px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 36, fontWeight: 400, color: 'var(--ink)', marginBottom: 6 }}>
          {q ? `"${q}"` : 'Discover something.'}
        </h1>
        <p style={{ fontSize: 13, color: 'var(--ink-muted)' }}>
          {results.length} show{results.length !== 1 ? 's' : ''}
        </p>
      </div>

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} style={{ background: '#fff', border: '1px solid var(--border-warm)', borderRadius: 14, padding: 16 }}>
              <div className="skeleton" style={{ height: 15, width: '60%', marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 11, width: '30%', marginBottom: 12 }} />
              <div style={{ display: 'flex', gap: 6 }}>
                <div className="skeleton" style={{ height: 22, width: 80, borderRadius: 20 }} />
                <div className="skeleton" style={{ height: 22, width: 60, borderRadius: 20 }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(260px,1fr))', gap: 12 }}>
          {results.map(show => <SearchCard key={show.show_name} show={show} />)}
        </div>
      )}
    </div>
  )
}

function SearchCard({ show }) {
  const [hovered, setHovered] = useState(false)
  const [imgErr, setImgErr]   = useState(false)
  const src = (!imgErr && show.poster_path) ? posterUrl(show.poster_path, 'w185') : null

  return (
    <Link
      to={`/show/${encodeURIComponent(show.show_name)}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', gap: 14, alignItems: 'flex-start',
        background: hovered ? 'var(--bg-raised)' : 'var(--bg-card)',
        border: `1px solid ${hovered ? 'var(--border-warmer)' : 'var(--border-warm)'}`,
        borderRadius: 14, padding: 16,
        transition: 'all 0.18s',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        boxShadow: hovered ? '0 6px 20px rgba(139,98,32,0.08)' : '0 1px 4px rgba(139,98,32,0.04)',
      }}
    >
      {src && (
        <div style={{ width: 48, flexShrink: 0, borderRadius: 6, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
          <img src={src} alt={show.show_name} onError={() => setImgErr(true)} style={{ width: '100%', display: 'block' }} />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
          <h2 style={{ fontSize: 14, fontWeight: 600, color: 'var(--ink)', lineHeight: 1.3 }}>{show.show_name}</h2>
          {show.honest_stats?.overall_positive_pct && (
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--gold-deep)', background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.2)', padding: '2px 8px', borderRadius: 20, flexShrink: 0, marginLeft: 8 }}>
              {show.honest_stats.overall_positive_pct}%
            </span>
          )}
        </div>
        <p style={{ fontSize: 11, color: 'var(--ink-faint)', marginBottom: 8 }}>{show.release_year}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
          {show.tone_tags?.slice(0, 2).map(tag => (
            <span key={tag} style={{ fontSize: 10, color: 'var(--ink-muted)', border: '1px solid var(--border-warm)', padding: '2px 8px', borderRadius: 20 }}>{tag}</span>
          ))}
        </div>
      </div>
    </Link>
  )
}

// ─── PostPage ─────────────────────────────────────────────────────────────────
export function PostPage() {
  const navigate = useNavigate()

  return (
    <div style={{ maxWidth: 580, margin: '0 auto', padding: '48px 28px 80px' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 36, fontWeight: 400, color: 'var(--ink)', marginBottom: 8 }}>
          Share a reaction.
        </h1>
        <p style={{ fontSize: 14, color: 'var(--ink-muted)', lineHeight: 1.6 }}>
          A moment, a verdict, or a discovery. One honest thing.
        </p>
      </div>
      <div style={{ background: 'linear-gradient(135deg,rgba(22,16,10,0.96),rgba(16,12,20,0.96))', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 28 }}>
        <PostForm onPost={() => setTimeout(() => navigate('/feed'), 1500)} />
      </div>
    </div>
  )
}