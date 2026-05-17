import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { SHOWS, FEED_POSTS } from '../data/shows'
import LifecycleTimeline from '../components/LifecycleTimeline'
import { ToneTags, HonestStats, PostForm } from '../components/components'
import FeedCard from '../components/FeedCard'

export default function ShowPage() {
  const { name } = useParams()
  const show = SHOWS[decodeURIComponent(name)]
  const [tab, setTab] = useState('safe')
  const [userPosts, setUserPosts] = useState([])

  if (!show) return (
    <div style={{ maxWidth: 700, margin: '80px auto', padding: '0 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20 }}>Show not found</p>
      <Link to="/" style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 12, display: 'block' }}>← Back home</Link>
    </div>
  )

  const showPosts = [...userPosts, ...FEED_POSTS.filter(p => p.show_name === show.show_name)]
  const safePosts = showPosts.filter(p => !p.is_spoiler)
  const spoilerPosts = showPosts.filter(p => p.is_spoiler)

  const handlePost = (newPost) => {
    setUserPosts(prev => [{
      ...newPost,
      id: Date.now(),
      username: 'you',
      published: new Date().toISOString(),
      score: 1,
    }, ...prev])
    setTab('safe')
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px 80px' }}>

      {/* Back */}
      <Link to="/" style={{ fontSize: 12, color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 32, transition: 'color 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.color = 'var(--text-secondary)'}
        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-muted)'}
      >
        ← All shows
      </Link>

      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
          <div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 42,
              fontWeight: 400,
              color: 'var(--text-primary)',
              lineHeight: 1.1,
              marginBottom: 6,
            }}>
              {show.show_name}
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{show.release_year}</p>
          </div>

          <div style={{
            flexShrink: 0,
            background: 'rgba(78,204,163,0.08)',
            border: '1px solid rgba(78,204,163,0.2)',
            borderRadius: 8,
            padding: '8px 14px',
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 20, fontFamily: 'var(--font-display)', color: '#4ecca3', lineHeight: 1 }}>
              {show.honest_stats.overall_positive_pct}%
            </p>
            <p style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: 3 }}>
              positive
            </p>
          </div>
        </div>

        <ToneTags tags={show.tone_tags} />
      </div>

      {/* Section: Lifecycle */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>Audience lifecycle</SectionLabel>
        <LifecycleTimeline lifecycle={show.lifecycle} />
      </section>

      {/* Section: Stats */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>Honest stats</SectionLabel>
        <HonestStats stats={show.honest_stats} />
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: 'var(--border)', margin: '40px 0' }} />

      {/* Section: Post */}
      <section style={{ marginBottom: 40 }}>
        <SectionLabel>Share your reaction</SectionLabel>
        <PostForm onPost={handlePost} defaultShow={show.show_name} />
      </section>

      {/* Section: Forum */}
      <section>
        <SectionLabel>What people say</SectionLabel>

        {/* Forum tabs */}
        <div style={{ display: 'flex', gap: 2, marginBottom: 20, borderBottom: '1px solid var(--border)' }}>
          {[['safe', 'Safe'], ['spoilers', '⚠ Spoilers']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                padding: '8px 16px',
                fontSize: 13,
                fontWeight: 500,
                color: tab === id ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: 'none',
                border: 'none',
                borderBottom: `2px solid ${tab === id ? 'var(--text-primary)' : 'transparent'}`,
                marginBottom: -1,
                cursor: 'pointer',
                transition: 'all 0.15s',
                fontFamily: 'var(--font-body)',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tab === 'safe'
            ? safePosts.length
              ? safePosts.map((p, i) => <FeedCard key={p.id ?? i} post={p} />)
              : <Empty>No safe posts yet — be the first.</Empty>
            : spoilerPosts.length
              ? spoilerPosts.map((p, i) => <FeedCard key={p.id ?? i} post={p} spoilerBlur />)
              : <Empty>No spoiler posts yet.</Empty>
          }
        </div>
      </section>

    </div>
  )
}

function SectionLabel({ children }) {
  return (
    <p style={{
      fontSize: 10,
      fontWeight: 500,
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      color: 'var(--text-muted)',
      marginBottom: 14,
    }}>
      {children}
    </p>
  )
}

function Empty({ children }) {
  return (
    <p style={{ fontSize: 13, color: 'var(--text-muted)', padding: '24px 0' }}>
      {children}
    </p>
  )
}
