import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SHOWS_LIST } from '../data/shows'
import { posterUrl, placeholderPoster, enrichShowsWithPosters } from '../lib/tmdb'
import api from '../lib/api'

const PER_PAGE = 12

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [shows, setShows]     = useState([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery]     = useState(searchParams.get('q') || '')
  const page = parseInt(searchParams.get('page') || '1')

  useEffect(() => {
    api.getShows()
      .then(async (apiShows) => {
        if (apiShows?.length) {
          const enriched = await enrichShowsWithPosters(apiShows)
          setShows(enriched)
        } else throw new Error('empty')
      })
      .catch(async () => {
        const enriched = await enrichShowsWithPosters(SHOWS_LIST)
        setShows(enriched)
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered   = query ? shows.filter(s => s.show_name.toLowerCase().includes(query.toLowerCase())) : shows
  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const goPage = (p) => {
    setSearchParams(prev => { const n = new URLSearchParams(prev); n.set('page', p); return n })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div>
      {/* Hero */}
      <div style={{ background: 'var(--grad-hero)', padding: '56px 28px 72px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: '15%', width: 450, height: 350, background: 'radial-gradient(ellipse, rgba(212,168,83,0.1) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 80, background: 'linear-gradient(180deg, transparent, var(--bg-page))', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 1140, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: 10, fontWeight: 500, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(212,168,83,0.5)', marginBottom: 16 }}>Real audience reactions</p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(40px,5.5vw,64px)', fontWeight: 400, lineHeight: 1.05, color: '#f5f0e8', marginBottom: 10 }}>
            What people<br />
            <span style={{ fontStyle: 'italic', background: 'linear-gradient(135deg,#f5e6b8,#d4a853,#c4933a)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>actually felt.</span>
          </h1>
          <p style={{ fontSize: 14, color: 'rgba(212,168,83,0.45)' }}>No critic scores. No algorithms. Just the real thing.</p>
        </div>
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1140, margin: '0 auto', padding: '32px 28px 72px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, gap: 16 }}>
          <input
            value={query}
            onChange={e => { setQuery(e.target.value); goPage(1) }}
            placeholder="Filter shows..."
            style={{ flex: 1, maxWidth: 360, background: '#fff', border: '1px solid var(--border-warm)', borderRadius: 10, padding: '9px 14px', fontSize: 13, color: 'var(--ink)', outline: 'none', boxShadow: '0 1px 4px rgba(139,98,32,0.06)', transition: 'border-color 0.15s' }}
            onFocus={e => e.target.style.borderColor = 'rgba(139,110,66,0.35)'}
            onBlur={e => e.target.style.borderColor = 'var(--border-warm)'}
          />
          <span style={{ fontSize: 12, color: 'var(--ink-faint)', flexShrink: 0 }}>{filtered.length} shows</span>
        </div>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 20 }}>
            {Array.from({ length: PER_PAGE }).map((_, i) => (
              <div key={i}>
                <div className="skeleton" style={{ aspectRatio: '2/3', borderRadius: 12, marginBottom: 10 }} />
                <div className="skeleton" style={{ height: 14, width: '70%', marginBottom: 6 }} />
                <div className="skeleton" style={{ height: 11, width: '40%' }} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 20 }}>
            {paginated.map(show => <PosterCard key={show.show_name} show={show} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 40 }}>
            <button onClick={() => goPage(page - 1)} disabled={page === 1}
              style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: '1px solid var(--border-warm)', background: page === 1 ? 'transparent' : '#fff', color: page === 1 ? 'var(--ink-faint)' : 'var(--ink-muted)', cursor: page === 1 ? 'not-allowed' : 'pointer' }}>
              ← Prev
            </button>
            {Array.from({ length: totalPages }).map((_, i) => {
              const p = i + 1
              const near = Math.abs(p - page) <= 2 || p === 1 || p === totalPages
              if (!near) return (p === page - 3 || p === page + 3) ? <span key={p} style={{ color: 'var(--ink-faint)' }}>…</span> : null
              return (
                <button key={p} onClick={() => goPage(p)} style={{ width: 34, height: 34, borderRadius: 8, fontSize: 12, fontWeight: p === page ? 700 : 500, border: p === page ? 'none' : '1px solid var(--border-warm)', background: p === page ? 'linear-gradient(135deg,#f5e6b8,#d4a853,#c4933a)' : '#fff', color: p === page ? '#16100a' : 'var(--ink-muted)', cursor: 'pointer', boxShadow: p === page ? '0 2px 10px rgba(212,168,83,0.3)' : 'none' }}>
                  {p}
                </button>
              )
            })}
            <button onClick={() => goPage(page + 1)} disabled={page === totalPages}
              style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 600, border: '1px solid var(--border-warm)', background: page === totalPages ? 'transparent' : '#fff', color: page === totalPages ? 'var(--ink-faint)' : 'var(--ink-muted)', cursor: page === totalPages ? 'not-allowed' : 'pointer' }}>
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function PosterCard({ show }) {
  const [imgErr, setImgErr] = useState(false)
  const src = (!imgErr && show.poster_path) ? posterUrl(show.poster_path) : placeholderPoster(show.show_name)

  return (
    <Link to={`/show/${encodeURIComponent(show.show_name)}`} className="poster-card" style={{ display: 'block' }}>
      <div style={{ aspectRatio: '2/3', borderRadius: 12, overflow: 'hidden', background: '#1c1408', marginBottom: 10, boxShadow: '0 2px 12px rgba(22,16,10,0.12)', position: 'relative' }}>
        <img src={src} alt={show.show_name} onError={() => setImgErr(true)} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg,transparent 50%,rgba(22,16,10,0.85) 100%)', display: 'flex', alignItems: 'flex-end', padding: 12, opacity: 0, transition: 'opacity 0.2s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = 1}
          onMouseLeave={e => e.currentTarget.style.opacity = 0}>
          <span style={{ fontSize: 10, fontWeight: 600, color: '#f5e6b8', background: 'rgba(212,168,83,0.2)', border: '1px solid rgba(212,168,83,0.3)', padding: '3px 8px', borderRadius: 20 }}>View show →</span>
        </div>
      </div>
      <p style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 500, color: 'var(--ink)', lineHeight: 1.3, marginBottom: 3 }}>{show.show_name}</p>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 11, color: 'var(--ink-faint)' }}>{show.release_year}</span>
        {show.honest_stats?.overall_positive_pct && (
          <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--gold-deep)', background: 'rgba(212,168,83,0.1)', border: '1px solid rgba(212,168,83,0.2)', padding: '2px 7px', borderRadius: 20 }}>
            {show.honest_stats.overall_positive_pct}%
          </span>
        )}
      </div>
    </Link>
  )
}