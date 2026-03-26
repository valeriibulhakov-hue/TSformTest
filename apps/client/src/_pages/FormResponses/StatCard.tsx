import React from 'react'

interface Props {
  value: string | number
  label: string
  accent?: string
}

export const StatCard: React.FC<Props> = ({ value, label, accent }) => (
  <div className="glass-card" style={{ padding: '18px 22px' }}>
    <div style={{
      fontSize: 28, fontWeight: 600, fontFamily: 'Sora, sans-serif',
      color: accent ?? 'var(--text-primary)', marginBottom: 6,
    }}>
      {value}
    </div>
    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
      {label}
    </div>
  </div>
)