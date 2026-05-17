import { useState } from 'react'
import { SHOWS_LIST } from '../data/shows'
import api from '../lib/api'
import { useAuth } from '../lib/AuthContext'

// ── ToneTags ──────────────────────────────────────────────────────────────────
export function ToneTags({ tags, dark = false }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
      {(tags || []).map((tag, i) => (
        <span key={tag} style={{
          fontSize: 11,
          fontWeight: i === 0 ? 600 : 400,
          color: dark
            ? (i === 0 ? '#f5e6b8' : 'rgba(245,240,232,0.45)')
            : (i === 0 ? 'var(--gold-deep)' : 'var(--ink-muted)'),
          background: dark
            ? (i === 0 ? 'rgba(212,168,83,0.14)' : 'transparent')
            : (i === 0 ? 'rgba(212,168,83,0.1)' : 'transparent'),
          border: dark
            ? (i === 0 ? '1px solid rgba(212,168,83,0.28)' : '1px solid rgba(255,255,255,0.08)')
            : '1px solid var(--border-warm)',
          padding: '4px 12px', borderRadius: 20,
        }}>
          {tag}
        </span>
      ))}
    </div>
  )
}

// ── HonestStats ───────────────────────────────────────────────────────────────
export function HonestStats({ stats }) {
  const items = [
    { value: `${stats.finished_pct}%`, label: 'finished it',  sub: 'of viewers' },
    { value: `${stats.rewatch_pct}%`,  label: 'rewatched it', sub: 'went back' },
    { value: stats.top_word,           label: 'top word',     sub: 'from discussions' },
  ]
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
      {items.map(({ value, label, sub }) => (
        <div key={label} style={{ background: '#fff', border: '1px solid var(--border-warm)', borderRadius: 12, padding: '18px 16px', textAlign: 'center', boxShadow: '0 1px 4px rgba(139,98,32,0.04)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontSize: 28, background: 'linear-gradient(135deg,#c4933a,#8b6220)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1, marginBottom: 8 }}>
            {value}
          </p>
          <p style={{ fontSize: 9, fontWeight: 600, color: 'var(--ink-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
          <p style={{ fontSize: 10, color: 'var(--ink-faint)', marginTop: 2 }}>{sub}</p>
        </div>
      ))}
    </div>
  )
}

// ── PostForm ──────────────────────────────────────────────────────────────────
const FORMATS = [
  {
    id: 'verdict', label: 'Verdict', desc: 'One honest sentence after finishing',
    color: '#d4a853', activeBg: 'rgba(212,168,83,0.12)', activeBorder: 'rgba(212,168,83,0.32)',
    inputBorder: 'rgba(212,168,83,0.25)',
    btnBg: 'linear-gradient(135deg,#f5e6b8,#d4a853,#c4933a)', btnColor: '#16100a',
    btnShadow: '0 4px 18px rgba(212,168,83,0.35)', placeholder: 'In one sentence...',
  },
  {
    id: 'moment', label: 'Moment', desc: 'A specific scene or feeling hit you',
    color: '#28b5a0', activeBg: 'rgba(40,181,160,0.1)', activeBorder: 'rgba(40,181,160,0.3)',
    inputBorder: 'rgba(40,181,160,0.25)',
    btnBg: 'linear-gradient(135deg,#5dcaa5,#28b5a0)', btnColor: '#fff',
    btnShadow: '0 4px 18px rgba(40,181,160,0.3)', placeholder: 'What hit you...',
  },
  {
    id: 'discovery', label: 'Discovery', desc: 'How you found it and why it stayed',
    color: '#9580f0', activeBg: 'rgba(149,128,240,0.1)', activeBorder: 'rgba(149,128,240,0.3)',
    inputBorder: 'rgba(149,128,240,0.25)',
    btnBg: 'linear-gradient(135deg,#c9c0f8,#9580f0)', btnColor: '#fff',
    btnShadow: '0 4px 18px rgba(149,128,240,0.3)', placeholder: 'I found this when...',
  },
]

export function PostForm({ onPost, defaultShow }) {
  const { user } = useAuth()
  const [format, setFormat]       = useState(null)
  const [show, setShow]           = useState(defaultShow || '')
  const [text, setText]           = useState('')
  const [isSpoiler, setIsSpoiler] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  const fmt       = FORMATS.find(f => f.id === format)
  const canSubmit = format && show && text.trim().length > 10 && !saving

  const handleSubmit = async () => {
    if (!canSubmit) return
    setError('')
    setSaving(true)
    try {
      if (user) {
        // Authenticated — save to backend
        const saved = await api.createPost({ show_name: show, format, text, is_spoiler: isSpoiler })
        onPost?.(saved)
      } else {
        // Not logged in — optimistic local post
        onPost?.({ format, show_name: show, text, is_spoiler: isSpoiler, username: 'guest', published: new Date().toISOString(), score: 1 })
      }
      setSubmitted(true)
    } catch (err) {
      setError(err.message || 'Failed to post. Please sign in.')
    } finally {
      setSaving(false)
    }
  }

  if (submitted) return (
    <div style={{ textAlign: 'center', padding: '28px 0' }}>
      <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 20, color: '#f5f0e8', marginBottom: 8 }}>Posted.</p>
      <p style={{ fontSize: 13, color: 'rgba(245,240,232,0.45)', marginBottom: 16 }}>Your {format} is now part of the conversation.</p>
      <button onClick={() => { setSubmitted(false); setText(''); setFormat(null) }}
        style={{ fontSize: 12, color: 'rgba(245,240,232,0.4)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
        Post another
      </button>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {!user && (
        <div style={{ background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.2)', borderRadius: 8, padding: '10px 14px', fontSize: 12, color: 'rgba(212,168,83,0.7)' }}>
          <a href="/login" style={{ color: '#d4a853', fontWeight: 600 }}>Sign in</a> to save your reaction permanently.
        </div>
      )}

      {/* Format picker */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
        {FORMATS.map(f => (
          <button key={f.id} onClick={() => setFormat(f.id)} style={{
            background: format === f.id ? f.activeBg : 'rgba(255,255,255,0.03)',
            border: `1px solid ${format === f.id ? f.activeBorder : 'rgba(255,255,255,0.08)'}`,
            borderRadius: 10, padding: '13px 12px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s',
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: format === f.id ? f.color : 'rgba(245,240,232,0.4)', marginBottom: 3 }}>{f.label}</p>
            <p style={{ fontSize: 11, color: 'rgba(245,240,232,0.25)', lineHeight: 1.4 }}>{f.desc}</p>
          </button>
        ))}
      </div>

      {format && (
        <>
          {!defaultShow && (
            <select value={show} onChange={e => setShow(e.target.value)}
              style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: show ? '#f5f0e8' : 'rgba(245,240,232,0.35)', outline: 'none', width: '100%' }}>
              <option value="" style={{ background: '#1a1008' }}>Select a show or film...</option>
              {SHOWS_LIST.map(s => <option key={s.show_name} value={s.show_name} style={{ background: '#1a1008' }}>{s.show_name}</option>)}
            </select>
          )}

          <div>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder={fmt.placeholder}
              maxLength={500} rows={3}
              style={{ width: '100%', background: 'rgba(0,0,0,0.28)', border: `1px solid ${fmt.inputBorder}`, borderRadius: 10, padding: '12px 14px', fontSize: 16, fontFamily: 'var(--font-display)', fontStyle: 'italic', color: '#f5f0e8', resize: 'none', outline: 'none', lineHeight: 1.6 }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'rgba(245,240,232,0.35)', cursor: 'pointer' }}>
                <input type="checkbox" checked={isSpoiler} onChange={e => setIsSpoiler(e.target.checked)} />
                Contains spoilers
              </label>
              <span style={{ fontSize: 12, color: text.length > 450 ? '#e06060' : 'rgba(245,240,232,0.2)' }}>{text.length}/500</span>
            </div>
          </div>

          {error && (
            <p style={{ fontSize: 12, color: '#e06060', background: 'rgba(220,60,60,0.08)', border: '1px solid rgba(220,60,60,0.2)', borderRadius: 8, padding: '8px 12px' }}>{error}</p>
          )}

          <button onClick={handleSubmit} disabled={!canSubmit}
            style={{ background: canSubmit ? fmt.btnBg : 'rgba(255,255,255,0.05)', color: canSubmit ? fmt.btnColor : 'rgba(245,240,232,0.2)', border: 'none', borderRadius: 10, padding: '12px 20px', fontSize: 13, fontWeight: 700, letterSpacing: '0.04em', cursor: canSubmit ? 'pointer' : 'not-allowed', boxShadow: canSubmit ? fmt.btnShadow : 'none', transition: 'all 0.15s' }}
            onMouseEnter={e => { if (canSubmit) e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}>
            {saving ? 'Posting…' : `Post ${fmt?.label}`}
          </button>
        </>
      )}
    </div>
  )
}