const STAGES = ['release', 'settled', 'rediscovery', 'legacy']

const STAGE_META = {
  release:     { label: 'Release',     desc: 'First reactions' },
  settled:     { label: 'Settled',     desc: 'Consensus forms' },
  rediscovery: { label: 'Rediscovery', desc: 'New audiences find it' },
  legacy:      { label: 'Legacy',      desc: 'Cultural permanence' },
}

const SENTIMENT_COLOR = {
  positive: '#4ecca3',
  negative: '#e85a4a',
  neutral:  '#7a7673',
}

export default function LifecycleTimeline({ lifecycle }) {
  const activeStages = STAGES.filter(s => lifecycle[s])

  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '24px 28px',
    }}>
      {/* Timeline track */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 0 }}>

        {/* Background line */}
        <div style={{
          position: 'absolute',
          top: 10, left: 10, right: 10,
          height: 1,
          background: 'var(--border)',
          zIndex: 0,
        }} />

        {/* Active line */}
        {activeStages.length > 1 && (
          <div style={{
            position: 'absolute',
            top: 10,
            left: `${(STAGES.indexOf(activeStages[0]) / (STAGES.length - 1)) * 100}%`,
            width: `${((STAGES.indexOf(activeStages[activeStages.length - 1]) - STAGES.indexOf(activeStages[0])) / (STAGES.length - 1)) * 100}%`,
            height: 1,
            background: 'linear-gradient(90deg, #4ecca3, #9b7fe8)',
            zIndex: 0,
          }} />
        )}

        {STAGES.map((stage, i) => {
          const data = lifecycle[stage]
          const isActive = !!data
          const sentColor = data ? SENTIMENT_COLOR[data.sentiment] || '#4ecca3' : 'var(--text-muted)'

          return (
            <div key={stage} style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              position: 'relative',
              zIndex: 1,
            }}>
              {/* Dot */}
              <div style={{
                width: 20, height: 20,
                borderRadius: '50%',
                background: isActive ? sentColor : 'var(--bg)',
                border: `2px solid ${isActive ? sentColor : 'var(--border)'}`,
                marginBottom: 14,
                transition: 'all 0.2s',
                boxShadow: isActive ? `0 0 12px ${sentColor}40` : 'none',
              }} />

              {/* Stage name */}
              <p style={{
                fontSize: 10,
                fontWeight: 500,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: isActive ? 'var(--text-secondary)' : 'var(--text-muted)',
                marginBottom: 6,
                textAlign: 'center',
              }}>
                {STAGE_META[stage].label}
              </p>

              {/* Dominant word */}
              {isActive ? (
                <p style={{
                  fontSize: 14,
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  color: sentColor,
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}>
                  {data.dominant_word}
                </p>
              ) : (
                <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>—</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
