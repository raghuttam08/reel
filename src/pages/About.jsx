export default function About() {
  return (
    <div style={{ minHeight: '100vh', padding: '60px 20px', maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 60, textAlign: 'center' }}>
        <h1 style={{
          fontSize: 48,
          fontWeight: 700,
          color: '#1a1a1a',
          marginBottom: 16,
          fontStyle: 'italic'
        }}>
          reel
        </h1>
        <p style={{ fontSize: 20, color: '#666', fontWeight: 300 }}>
          Real audience reactions. No critic scores. No algorithms.
        </p>
      </div>

      {/* Mission */}
      <section style={{ marginBottom: 50 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
          Our Mission
        </h2>
        <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8, marginBottom: 12 }}>
          reel is built on a simple belief: <strong>real people's genuine reactions matter more than algorithms</strong>.
        </p>
        <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8 }}>
          We're tired of critic scores that don't reflect how audiences actually feel. Tired of algorithms that optimize for engagement rather than authenticity. We created reel to be different — a platform where your honest reaction is the only metric that counts.
        </p>
      </section>

      {/* What We Do */}
      <section style={{ marginBottom: 50 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
          What We Do
        </h2>
        <ul style={{
          fontSize: 16,
          color: '#444',
          lineHeight: 1.8,
          paddingLeft: 24,
          listStyleType: 'disc'
        }}>
          <li style={{ marginBottom: 12 }}>
            <strong>Collect honest reactions</strong> - We aggregate real audience reactions from platforms like Reddit
          </li>
          <li style={{ marginBottom: 12 }}>
            <strong>Analyze audience lifecycle</strong> - See how shows evolve through Release, Settled, Rediscovery, and Legacy phases
          </li>
          <li style={{ marginBottom: 12 }}>
            <strong>Show honest stats</strong> - What percentage finished? What percentage rewatched? What are people actually talking about?
          </li>
          <li style={{ marginBottom: 12 }}>
            <strong>Enable conversation</strong> - Share your own reactions and join the real discussion about shows and films
          </li>
        </ul>
      </section>

      {/* Why It Matters */}
      <section style={{ marginBottom: 50 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
          Why It Matters
        </h2>
        <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8, marginBottom: 12 }}>
          Choosing what to watch should be easier. Critics have their opinion. Your friends have theirs. But what do <em>thousands</em> of people like you actually think?
        </p>
        <p style={{ fontSize: 16, color: '#444', lineHeight: 1.8 }}>
          reel cuts through the noise and shows you what real audiences felt. Whether they were devastated, blown away, or underwhelmed. That's the insight that matters.
        </p>
      </section>

      {/* Data */}
      <section style={{ marginBottom: 50, padding: 24, background: '#f5f0e8', borderRadius: 12 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
          Our Data
        </h2>
        <p style={{ fontSize: 16, color: '#666', lineHeight: 1.8, marginBottom: 12 }}>
          We analyze reactions from Reddit communities and your posts on reel. Data is anonymized, aggregated, and never sold.
        </p>
        <p style={{ fontSize: 14, color: '#999' }}>
          Data sources include Reddit, TMDB database, and user-generated reactions on this platform.
        </p>
      </section>

      {/* Contact */}
      <section style={{ textAlign: 'center', paddingTop: 40, borderTop: '1px solid #e8e1d9' }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, color: '#1a1a1a', marginBottom: 16 }}>
          Questions?
        </h2>
        <p style={{ fontSize: 16, color: '#666', marginBottom: 16 }}>
          We'd love to hear from you.
        </p>
        <a href="/contact" style={{
          display: 'inline-block',
          padding: '12px 24px',
          background: '#d4a853',
          color: '#fff',
          borderRadius: 6,
          textDecoration: 'none',
          fontWeight: 600,
          transition: 'all 0.2s',
          fontSize: 14
        }}
          onMouseEnter={e => e.target.style.opacity = 0.9}
          onMouseLeave={e => e.target.style.opacity = 1}
        >
          Contact Us →
        </a>
      </section>

      {/* Footer Note */}
      <p style={{ fontSize: 12, color: '#999', textAlign: 'center', marginTop: 60 }}>
        © 2026 reel. Built with real human data.
      </p>
    </div>
  )
}
