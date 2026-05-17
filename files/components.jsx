// ToneTags.jsx
export function ToneTags({ tags }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
      {tags.map((tag, i) => (
        <span key={tag} style={{
          fontSize: 12,
          color: i === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
          background: i === 0 ? 'rgba(255,255,255,0.07)' : 'transparent',
          border: '1px solid var(--border)',
          padding: '4px 12px',
          borderRadius: 20,
          fontWeight: i === 0 ? 500 : 400,
          transition: 'border-color 0.15s',
        }}>
          {tag}
        </span>
      ))}
    </div>
  )
}

// HonestStats.jsx
export function HonestStats({ stats }) {
  const items = [
    { value: `${stats.finished_pct}%`, label: 'finished it',   sub: 'of viewers' },
    { value: `${stats.rewatch_pct}%`,  label: 'rewatched it',  sub: 'went back' },
    { value: stats.top_word,           label: 'top word',      sub: 'from discussions' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
      {items.map(({ value, label, sub }) => (
        <div key={label} style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 10,
          padding: '18px 16px',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 28,
            color: 'var(--text-primary)',
            lineHeight: 1,
            marginBottom: 8,
          }}>
            {value}
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 500 }}>
            {label}
          </p>
          <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
            {sub}
          </p>
        </div>
      ))}
    </div>
  )
}

// PostForm.jsx — for creating moment/verdict/discovery posts
const FORMATS = [
  {
    id: 'moment',
    label: 'Moment',
    desc: 'A specific scene or feeling hit you',
    color: '#4ecca3',
    bg: 'rgba(78,204,163,0.06)',
    border: 'rgba(78,204,163,0.2)',
    placeholder: 'What hit you...',
  },
  {
    id: 'verdict',
    label: 'Verdict',
    desc: 'One honest sentence after finishing',
    color: '#e8a24a',
    bg: 'rgba(232,162,74,0.06)',
    border: 'rgba(232,162,74,0.2)',
    placeholder: 'In one sentence...',
  },
  {
    id: 'discovery',
    label: 'Discovery',
    desc: 'How you found it and why it stayed',
    color: '#9b7fe8',
    bg: 'rgba(155,127,232,0.06)',
    border: 'rgba(155,127,232,0.2)',
    placeholder: 'I found this when...',
  },
]

import { useState } from 'react'
import { SHOWS_LIST } from '../data/shows'

export function PostForm({ onPost, defaultShow }) {
  const [format, setFormat] = useState(null)
  const [show, setShow] = useState(defaultShow || '')
  const [text, setText] = useState('')
  const [isSpoiler, setIsSpoiler] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const fmt = FORMATS.find(f => f.id === format)
  const canSubmit = format && show && text.trim().length > 10

  const handleSubmit = () => {
    if (!canSubmit) return
    onPost?.({ format, show_name: show, text, is_spoiler: isSpoiler })
    setSubmitted(true)
  }

  if (submitted) return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '32px 24px', textAlign: 'center',
    }}>
      <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 18, color: 'var(--text-primary)', marginBottom: 8 }}>
        Posted.
      </p>
      <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Your {format} is now part of the conversation.</p>
      <button
        onClick={() => { setSubmitted(false); setText(''); setFormat(null) }}
        style={{ marginTop: 16, fontSize: 13, color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
      >
        Post another
      </button>
    </div>
  )

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

      {/* Format picker */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
        {FORMATS.map(f => (
          <button
            key={f.id}
            onClick={() => setFormat(f.id)}
            style={{
              background: format === f.id ? f.bg : 'var(--bg-card)',
              border: `1px solid ${format === f.id ? f.border : 'var(--border)'}`,
              borderRadius: 10,
              padding: '14px 12px',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.15s',
            }}
          >
            <p style={{ fontSize: 13, fontWeight: 500, color: format === f.id ? f.color : 'var(--text-primary)', marginBottom: 4 }}>
              {f.label}
            </p>
            <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.4 }}>
              {f.desc}
            </p>
          </button>
        ))}
      </div>

      {format && (
        <>
          {/* Show selector */}
          {!defaultShow && (
            <select
              value={show}
              onChange={e => setShow(e.target.value)}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 8,
                padding: '10px 14px',
                fontSize: 13,
                color: show ? 'var(--text-primary)' : 'var(--text-secondary)',
                outline: 'none',
                width: '100%',
              }}
            >
              <option value="">Select a show or film...</option>
              {SHOWS_LIST.map(s => (
                <option key={s.show_name} value={s.show_name}>{s.show_name}</option>
              ))}
            </select>
          )}

          {/* Text input */}
          <div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder={fmt.placeholder}
              maxLength={500}
              rows={3}
              style={{
                width: '100%',
                background: 'var(--bg-card)',
                border: `1px solid ${fmt.border}`,
                borderRadius: 8,
                padding: '12px 14px',
                fontSize: 15,
                fontFamily: 'var(--font-display)',
                fontStyle: 'italic',
                color: 'var(--text-primary)',
                resize: 'none',
                outline: 'none',
                lineHeight: 1.6,
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" checked={isSpoiler} onChange={e => setIsSpoiler(e.target.checked)} />
                Contains spoilers
              </label>
              <span style={{ fontSize: 12, color: text.length > 450 ? '#e85a4a' : 'var(--text-muted)' }}>
                {text.length}/500
              </span>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              background: canSubmit ? fmt.color : 'var(--bg-hover)',
              color: canSubmit ? '#080808' : 'var(--text-muted)',
              border: 'none',
              borderRadius: 8,
              padding: '11px 20px',
              fontSize: 13,
              fontWeight: 500,
              cursor: canSubmit ? 'pointer' : 'not-allowed',
              transition: 'all 0.15s',
              fontFamily: 'var(--font-body)',
            }}
          >
            Post {fmt.label}
          </button>
        </>
      )}
    </div>
  )
}
