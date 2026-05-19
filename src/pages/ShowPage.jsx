import { useParams, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { SHOWS, FEED_POSTS } from '../data/shows'
import { enrichShow, posterUrl, backdropUrl, placeholderPoster } from '../lib/tmdb'
import LifecycleTimeline from '../components/LifecycleTimeline'
import FeedCard from '../components/FeedCard'
import { PostForm, ToneTags, HonestStats } from '../components/components'
import UpgradeModal from '../components/UpgradeModal'
import api from '../lib/api'
import { watchlistService } from '../lib/watchlist'
import { aiService } from '../lib/ai'

function hashName(name) {
  let h = 0
  for (let i = 0; i < name.length; i++) h = Math.imul(31, h) + name.charCodeAt(i) | 0
  return Math.abs(h)
}

const ACCENT_COLORS = ['#d4a853','#28b5a0','#9580f0','#e07060','#5090d0','#c070b0','#70b060','#d08040']

function SectionLabel({ children }) {
  return (
    <p style={{
      fontFamily: 'var(--font-mono)',
      fontSize: 10, fontWeight: 500,
      textTransform: 'uppercase', letterSpacing: '0.18em',
      color: 'var(--ink-faint)', marginBottom: 14,
    }}>
      {children}
    </p>
  )
}

export default function ShowPage() {
  const { name } = useParams()
  const show = SHOWS[decodeURIComponent(name)]

  const [enriched, setEnriched] = useState(null)
  const [tab, setTab]           = useState('safe')
  const [userPosts, setUserPosts] = useState([])
  const [imgErr, setImgErr]     = useState(false)
  const [apiPosts, setApiPosts] = useState([])
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [isInWatchlist, setIsInWatchlist] = useState(false)
  const [watchlistLoading, setWatchlistLoading] = useState(false)
  const [aiInfo, setAiInfo] = useState(null)
  const [aiLoading, setAiLoading] = useState(false)
  useEffect(() => {
    if (!show) return
    enrichShow(show).then(setEnriched)
  }, [show?.show_name])

  useEffect(() => {
  if (!show) return
  api.getShowPosts(show.show_name)
    .then(posts => setApiPosts(Array.isArray(posts) ? posts : []))
    .catch(() => setApiPosts(FEED_POSTS.filter(p => p.show_name === show.show_name)))
}, [show?.show_name])

  // Check if show is in watchlist
  useEffect(() => {
    if (!show) return
    const token = localStorage.getItem('reel_token')
    if (!token) {
      setIsInWatchlist(false)
      return
    }
    watchlistService.isInWatchlist(show.show_name)
      .then(isIn => setIsInWatchlist(isIn))
      .catch(() => setIsInWatchlist(false))
  }, [show?.show_name])

  // Generate AI info if no posts available
  useEffect(() => {
    if (!show || apiPosts.length > 0) return
    
    setAiLoading(true)
    aiService.generateShowInfo(show.show_name, show.release_year, enriched?.overview || show.overview)
      .then(data => setAiInfo(data))
      .catch(err => {
        console.error('Failed to generate AI info:', err)
        setAiInfo(null)
      })
      .finally(() => setAiLoading(false))
  }, [show?.show_name, apiPosts.length, enriched?.overview, show?.overview])

  if (!show) return (
    <div style={{ textAlign: 'center', padding: '80px 24px', color: 'var(--ink-muted)' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 22, marginBottom: 12 }}>
        Show not found
      </p>
      <Link to="/" style={{ fontSize: 13, color: 'var(--ink-faint)' }}>← Back home</Link>
    </div>
  )

  const handleWatchlistToggle = async () => {
    const token = localStorage.getItem('reel_token')
    if (!token) {
      alert('Please log in to use watchlist')
      return
    }
    
    try {
      setWatchlistLoading(true)
      await watchlistService.toggleWatchlist(show.show_name, isInWatchlist)
      setIsInWatchlist(!isInWatchlist)
    } catch (err) {
      console.error('Failed to toggle watchlist:', err)
      alert('Failed to update watchlist')
    } finally {
      setWatchlistLoading(false)
    }
  }

  const data       = enriched || show
  const accent     = ACCENT_COLORS[hashName(show.show_name) % ACCENT_COLORS.length]
  const posterSrc  = (!imgErr && data.poster_path) ? posterUrl(data.poster_path) : placeholderPoster(show.show_name)
  const backdropSrc = data.backdrop_path ? backdropUrl(data.backdrop_path) : null

  const showPosts  = [...userPosts, ...apiPosts]
  const safePosts  = showPosts.filter(p => !p.is_spoiler)
  const spoilerPosts = showPosts.filter(p => p.is_spoiler)

  const handlePost = (newPost) => {
  setUserPosts(prev => [{
    ...newPost,
    id: Date.now(),
    username: newPost.username || 'you',
    published: new Date().toISOString(),
    score: 1,
  }, ...prev])
  setTimeout(() => {
    api.getShowPosts(show.show_name)
      .then(posts => setApiPosts(Array.isArray(posts) ? posts : []))
      .catch(() => {})
  }, 600)
  setTab('safe')
}

  const handlePostUpdate = (postId, updatedPost) => {
    // Update in userPosts
    setUserPosts(prev => prev.map(p => p._id === postId || p.id === postId ? updatedPost : p))
    // Update in apiPosts
    setApiPosts(prev => prev.map(p => p._id === postId ? updatedPost : p))
  }

  const handlePostDelete = (postId) => {
    // Remove from userPosts
    setUserPosts(prev => prev.filter(p => p._id !== postId && p.id !== postId))
    // Remove from apiPosts
    setApiPosts(prev => prev.filter(p => p._id !== postId))
  }

  return (
    <div>
      {/* ── DARK CINEMATIC HEADER ── */}
      <div style={{
        background: `linear-gradient(155deg, #16100a 0%, #2e1f0c 45%, #0e0a14 100%)`,
        position: 'relative',
        overflow: 'hidden',
        paddingBottom: 60,
      }}>
        {/* Backdrop blur bg */}
        {backdropSrc && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${backdropSrc})`,
            backgroundSize: 'cover', backgroundPosition: 'center',
            opacity: 0.08, filter: 'blur(2px)',
          }} />
        )}

        {/* Accent glow */}
        <div style={{
          position: 'absolute', top: -80, right: '10%',
          width: 400, height: 400,
          background: `radial-gradient(circle, ${accent}18 0%, transparent 65%)`,
          pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: 80,
          background: 'linear-gradient(180deg, transparent, var(--bg-page))',
          pointerEvents: 'none',
        }} />

        <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 28px 0', position: 'relative', zIndex: 1 }}>

          {/* Back link */}
          <Link to="/" style={{ fontSize: 12, color: 'rgba(212,168,83,0.45)', display: 'inline-block', marginBottom: 28, transition: 'color 0.15s' }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(212,168,83,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(212,168,83,0.45)'}
          >
            ← All shows
          </Link>

          <div style={{ display: 'flex', gap: 36, alignItems: 'flex-start' }}>

            {/* Poster */}
            <div style={{
              width: 200, flexShrink: 0,
              borderRadius: 12, overflow: 'hidden',
              boxShadow: `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.07)`,
            }}>
              <img
                src={posterSrc}
                alt={show.show_name}
                onError={() => setImgErr(true)}
                style={{ width: '100%', display: 'block' }}
              />
            </div>

            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
                <div>
                  <h1 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(32px, 4vw, 52px)',
                    fontWeight: 400,
                    color: '#f5f0e8',
                    lineHeight: 1.05,
                    marginBottom: 6,
                  }}>
                    {show.show_name}
                  </h1>
                  <p style={{ fontSize: 12, color: 'rgba(212,168,83,0.45)', letterSpacing: '0.05em' }}>
                    {show.release_year}
                    {data.number_of_seasons && ` · ${data.number_of_seasons} season${data.number_of_seasons > 1 ? 's' : ''}`}
                    {data.networks?.[0] && ` · ${data.networks[0]}`}
                  </p>
                </div>

                {/* Positive badge */}
                <div style={{
                  flexShrink: 0,
                  background: `${accent}18`,
                  border: `1px solid ${accent}40`,
                  borderRadius: 12, padding: '12px 18px', textAlign: 'center',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 28,
                    background: 'linear-gradient(135deg, #f5e6b8, #d4a853)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text', lineHeight: 1,
                  }}>
                    {show.honest_stats?.overall_positive_pct}%
                  </p>
                  <p style={{ fontSize: 9, color: 'rgba(212,168,83,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: 4 }}>
                    positive
                  </p>
                </div>
              </div>

              {/* Overview */}
              {data.overview && (
                <p style={{ fontSize: 13, color: 'rgba(245,240,232,0.5)', lineHeight: 1.7, marginBottom: 16, maxWidth: 560 }}>
                  {data.overview.length > 180 ? data.overview.slice(0, 180) + '…' : data.overview}
                </p>
              )}

              {/* Tone tags */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7, marginBottom: 22 }}>
                {show.tone_tags?.map((tag, i) => (
                  <span key={tag} style={{
                    fontSize: 11,
                    fontWeight: i === 0 ? 600 : 400,
                    color: i === 0 ? '#f5e6b8' : 'rgba(245,240,232,0.45)',
                    background: i === 0 ? 'rgba(212,168,83,0.14)' : 'transparent',
                    border: i === 0 ? '1px solid rgba(212,168,83,0.28)' : '1px solid rgba(255,255,255,0.08)',
                    padding: '4px 12px', borderRadius: 20,
                  }}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: 10 }}>
                <button
                  onClick={() => document.getElementById('post-form')?.scrollIntoView({ behavior: 'smooth' })}
                  className="btn-gold"
                  style={{ padding: '11px 22px' }}
                >
                  Share reaction
                </button>
                <button 
                  onClick={handleWatchlistToggle}
                  disabled={watchlistLoading}
                  className="btn-dark" 
                  style={{ 
                    padding: '11px 18px',
                    opacity: watchlistLoading ? 0.6 : 1,
                    cursor: watchlistLoading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {isInWatchlist ? '✓ In Watchlist' : '+ Watchlist'}
                </button>
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  style={{
                    padding: '11px 18px',
                    background: 'linear-gradient(135deg, #d4a853, #c4933a)',
                    border: 'none',
                    borderRadius: 6,
                    color: '#1a1a1a',
                    fontWeight: 600,
                    fontSize: 13,
                    cursor: 'pointer',
                    transition: 'opacity 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                  onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
                >
                  ⭐ Upgrade
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── LIGHT CONTENT ── */}
      <div style={{ maxWidth: 960, margin: '0 auto', padding: '32px 28px 80px' }}>

        {/* Lifecycle */}
        {show.lifecycle && (
          <section style={{ marginBottom: 32 }}>
            <SectionLabel>Audience lifecycle</SectionLabel>
            {/* Lifecycle is dark so wrap it in a dark container */}
            <div style={{ background: 'linear-gradient(155deg, #16100a, #1a1220)', borderRadius: 14, padding: 4 }}>
              <LifecycleTimeline lifecycle={show.lifecycle} />
            </div>
          </section>
        )}

        {/* Stats */}
        {show.honest_stats && (
          <section style={{ marginBottom: 32 }}>
            <SectionLabel>Honest stats</SectionLabel>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { value: `${show.honest_stats.finished_pct}%`, label: 'finished it',  sub: 'of viewers' },
                { value: `${show.honest_stats.rewatch_pct}%`,  label: 'rewatched it', sub: 'went back' },
                { value: show.honest_stats.top_word,           label: 'top word',     sub: 'from discussions' },
              ].map(({ value, label, sub }) => (
                <div key={label} style={{
                  background: '#fff',
                  border: '1px solid var(--border-warm)',
                  borderRadius: 12, padding: '18px 16px', textAlign: 'center',
                  boxShadow: '0 1px 4px rgba(139,98,32,0.04)',
                }}>
                  <p style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 28,
                    background: 'linear-gradient(135deg, #c4933a, #8b6220)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text', lineHeight: 1, marginBottom: 8,
                  }}>
                    {value}
                  </p>
                  <p style={{ fontSize: 9, fontWeight: 600, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    {label}
                  </p>
                  <p style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>{sub}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="divider" />

        {/* Post form */}
        <section id="post-form" style={{ marginBottom: 36 }}>
          <SectionLabel>Share your reaction</SectionLabel>
          <div style={{
            background: 'linear-gradient(135deg, rgba(22,16,10,0.96), rgba(16,12,20,0.96))',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: 14, padding: 24,
          }}>
            <PostForm onPost={handlePost} defaultShow={show.show_name} />
          </div>
        </section>

        {/* Forum */}
        <section>
          <SectionLabel>What people say</SectionLabel>

          <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
            {[['safe', 'Safe'], ['spoilers', '⚠ Spoilers']].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                  padding: '8px 18px', borderRadius: 8,
                  border: 'none', cursor: 'pointer', transition: 'all 0.15s',
                  background: tab === id
                    ? 'linear-gradient(135deg, #c4933a, #8b6220)'
                    : 'rgba(139,110,66,0.07)',
                  color: tab === id ? '#f8f4ee' : 'var(--ink-muted)',
                  boxShadow: tab === id ? '0 2px 10px rgba(139,98,32,0.28)' : 'none',
                  border: tab === id ? 'none' : '1px solid var(--border-warm)',
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tab === 'safe'
              ? safePosts.length
                ? safePosts.map((p, i) => <FeedCard key={p._id ?? p.id ?? i} post={p} onPostUpdate={handlePostUpdate} onPostDelete={handlePostDelete} />)
                : <>
                    <p style={{ fontSize: 13, color: 'var(--ink-faint)', padding: '20px 0' }}>No safe posts yet — be the first.</p>
                    {aiInfo && (
                      <div style={{
                        background: 'linear-gradient(135deg, rgba(212,168,83,0.12), rgba(212,168,83,0.06))',
                        border: '2px solid rgba(212,168,83,0.25)',
                        borderRadius: 14,
                        padding: 24,
                        marginTop: 16
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                          <div style={{ fontSize: 18 }}>✨</div>
                          <p style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'brown', margin: 0 }}>
                            AI Insights
                          </p>
                        </div>
                        
                        {aiInfo.audienceReaction && (
                          <p style={{ fontSize: 13, color: 'brown', marginBottom: 16, lineHeight: 1.7, fontWeight: 500 }}>
                            {aiInfo.audienceReaction}
                          </p>
                        )}
                        
                        {aiInfo.keyThemes && aiInfo.keyThemes.length > 0 && (
                          <div style={{ marginBottom: 16 }}>
                            <p style={{ fontSize: 10, fontWeight: 700, color: 'brown', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Key Themes</p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                              {aiInfo.keyThemes.map((theme, i) => (
                                <span key={i} style={{
                                  fontSize: 13,
                                  fontWeight: 700,
                                  color: '#fff9f0',
                                  background: 'rgba(212,168,83,0.32)',
                                  border: '2px solid rgba(212,168,83,0.45)',
                                  padding: '8px 16px',
                                  borderRadius: 24,
                                  display: 'inline-block',
                                  boxShadow: '0 2px 8px rgba(212,168,83,0.12)'
                                }}>
                                  {theme}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {aiInfo.bestFor && (
                          <div style={{ marginBottom: 16, backgroundColor: 'rgba(212,168,83,0.12)', padding: 14, borderRadius: 10, borderLeft: '4px solid rgba(212,168,83,0.4)' }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(212,168,83,0.9)', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              📺 Best for
                            </p>
                            <p style={{ fontSize: 13, color: 'brown', margin: 0, lineHeight: 1.7, fontWeight: 500 }}>
                              {aiInfo.bestFor}
                            </p>
                          </div>
                        )}
                        
                        {aiInfo.trigger_warnings && aiInfo.trigger_warnings.length > 0 && (
                          <div style={{ padding: 12, background: 'rgba(224,112,96,0.14)', borderLeft: '4px solid rgba(224,112,96,0.5)', marginBottom: 14, borderRadius: '0 6px 6px 0' }}>
                            <p style={{ fontSize: 11, fontWeight: 700, color: 'rgba(224,112,96,0.9)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' }}>⚠️ Content Notes</p>
                            <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: 'rgba(224,112,96,0.8)', lineHeight: 1.5 }}>
                              {aiInfo.trigger_warnings.map((warning, i) => (
                                <li key={i} style={{ marginBottom: 4 }}>{warning}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {aiInfo.fun_fact && (
                          <p style={{ fontSize: 12, color: 'rgba(212,168,83,0.85)', marginTop: 12, lineHeight: 1.6, fontStyle: 'italic', borderTop: '1px solid rgba(212,168,83,0.15)', paddingTop: 12 }}>
                            💡 <strong>Fun Fact:</strong> {aiInfo.fun_fact}
                          </p>
                        )}
                      </div>
                    )}
                    {aiLoading && (
                      <p style={{ fontSize: 13, color: 'var(--ink-faint)', padding: '20px 0', fontStyle: 'italic' }}>Generating insights...</p>
                    )}
                  </>
              : spoilerPosts.length
                ? spoilerPosts.map((p, i) => <FeedCard key={p._id ?? p.id ?? i} post={p} spoilerBlur onPostUpdate={handlePostUpdate} onPostDelete={handlePostDelete} />)
                : <p style={{ fontSize: 13, color: 'var(--ink-faint)', padding: '20px 0' }}>No spoiler posts yet.</p>
            }
          </div>
        </section>
      </div>

      {/* Upgrade Modal */}
      <UpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onSuccess={(plan) => {
          console.log('Upgrade successful:', plan)
          // Handle upgrade success - update user context, show message, etc.
        }}
      />
    </div>
  )
}