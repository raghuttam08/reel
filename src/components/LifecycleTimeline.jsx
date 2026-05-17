const STAGES = ['release', 'settled', 'rediscovery', 'legacy']

const STAGE_LABELS = {
  release:     'Release',
  settled:     'Settled',
  rediscovery: 'Rediscovery',
  legacy:      'Legacy',
}

const STAGE_COLORS = {
  release:     { dot: 'linear-gradient(135deg, #f5e6b8, #d4a853)', glow: 'rgba(212,168,83,0.55)',  text: 'linear-gradient(135deg, #f5e6b8, #d4a853)' },
  settled:     { dot: 'linear-gradient(135deg, #5dcaa5, #28b5a0)', glow: 'rgba(40,181,160,0.55)',  text: 'linear-gradient(135deg, #5dcaa5, #28b5a0)' },
  rediscovery: { dot: 'linear-gradient(135deg, #c9c0f8, #9580f0)', glow: 'rgba(149,128,240,0.55)', text: 'linear-gradient(135deg, #c9c0f8, #9580f0)' },
  legacy:      { dot: 'linear-gradient(135deg, #f5e6b8, #d4a853)', glow: 'rgba(212,168,83,0.55)',  text: 'linear-gradient(135deg, #f5e6b8, #d4a853)' },
}

export default function LifecycleTimeline({ lifecycle }) {
  const activeStages  = STAGES.filter(s => lifecycle?.[s])
  const firstActiveIdx = STAGES.indexOf(activeStages[0])
  const lastActiveIdx  = STAGES.indexOf(activeStages[activeStages.length - 1])

  if (!lifecycle) return null

  return (
    <div style={{
      background: 'rgba(0,0,0,0.22)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 14,
      padding: '22px 28px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Inner glow */}
      <div style={{
        position: 'absolute', top: -40, left: '50%', transform: 'translateX(-50%)',
        width: 300, height: 120,
        background: 'radial-gradient(ellipse, rgba(212,168,83,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start' }}>

        {/* Base track */}
        <div style={{
          position: 'absolute',
          top: 10, left: 10, right: 10, height: 1,
          background: 'rgba(255,255,255,0.08)',
          zIndex: 0,
        }} />

        {/* Active gradient track */}
        {activeStages.length > 1 && (
          <div style={{
            position: 'absolute',
            top: 10,
            left: `calc(${(firstActiveIdx / (STAGES.length - 1)) * 100}% + 4px)`,
            width: `calc(${((lastActiveIdx - firstActiveIdx) / (STAGES.length - 1)) * 100}% - 8px)`,
            height: 1,
            background: 'linear-gradient(90deg, #d4a853, #28b5a0, #9580f0, #d4a853)',
            zIndex: 0,
            opacity: 0.7,
          }} />
        )}

        {STAGES.map((stage) => {
          const data     = lifecycle[stage]
          const isActive = !!data
          const colors   = STAGE_COLORS[stage]

          return (
            <div key={stage} style={{
              flex: 1,
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              position: 'relative', zIndex: 1,
            }}>
              {/* Dot */}
              <div style={{
                width: 20, height: 20, borderRadius: '50%',
                background: isActive ? colors.dot : 'rgba(255,255,255,0.05)',
                border: isActive ? 'none' : '1px solid rgba(255,255,255,0.1)',
                marginBottom: 14,
                boxShadow: isActive ? `0 0 14px ${colors.glow}` : 'none',
                transition: 'all 0.2s',
              }} />

              {/* Stage label */}
              <p style={{
                fontSize: 9, fontWeight: 600,
                textTransform: 'uppercase', letterSpacing: '0.1em',
                color: isActive ? 'rgba(212,168,83,0.5)' : 'rgba(255,255,255,0.15)',
                marginBottom: 6, textAlign: 'center',
              }}>
                {STAGE_LABELS[stage]}
              </p>

              {/* Dominant word */}
              {isActive ? (
                <p style={{
                  fontFamily: 'var(--font-display)',
                  fontStyle: 'italic',
                  fontSize: 14,
                  background: colors.text,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  textAlign: 'center',
                  lineHeight: 1.3,
                }}>
                  {data.dominant_word}
                </p>
              ) : (
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.15)', textAlign: 'center' }}>—</p>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}