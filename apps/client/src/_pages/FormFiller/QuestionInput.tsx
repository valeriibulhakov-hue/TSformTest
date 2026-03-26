import React from 'react'
import type { AnswerValue } from './useFormFiller'

interface Props {
  questionId: string
  type: 'TEXT' | 'MULTIPLE_CHOICE' | 'CHECKBOX' | 'DATE'
  options?: string[]
  value: AnswerValue
  onChange: (value: AnswerValue) => void
  onToggle: (option: string) => void
}

export const QuestionInput: React.FC<Props> = ({
  type, options = [], value, onChange, onToggle,
}) => {
  if (type === 'TEXT') {
    return (
      <textarea
        className="glass-input"
        rows={3}
        placeholder="Type your answer..."
        value={(value as string) ?? ''}
        onChange={e => onChange(e.target.value)}
        style={{ resize: 'none', lineHeight: 1.6 }}
      />
    )
  }

  if (type === 'DATE') {
    return (
      <input
        type="date"
        className="glass-input"
        value={(value as string) ?? ''}
        onChange={e => onChange(e.target.value)}
        style={{ colorScheme: 'dark' }}
      />
    )
  }

  if (type === 'MULTIPLE_CHOICE') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {options.map(opt => {
          const selected = value === opt
          return (
            <button
              key={opt}
              onClick={() => onChange(opt)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '11px 16px', borderRadius: 12, cursor: 'pointer',
                border: selected ? '1px solid rgba(99,102,241,0.45)' : '1px solid rgba(255,255,255,0.07)',
                background: selected ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
                transition: 'all 0.15s ease', textAlign: 'left',
              }}
            >
              <div style={{
                width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                border: selected ? '1.5px solid #818cf8' : '1.5px solid rgba(255,255,255,0.2)',
                background: selected ? 'rgba(99,102,241,0.2)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {selected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#818cf8' }} />}
              </div>
              <span style={{ fontSize: 13, color: selected ? '#c4b5fd' : 'var(--text-secondary)' }}>
                {opt}
              </span>
            </button>
          )
        })}
      </div>
    )
  }

  // CHECKBOX
  const checked = (value as string[]) ?? []
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {options.map(opt => {
        const selected = checked.includes(opt)
        return (
          <button
            key={opt}
            onClick={() => onToggle(opt)}
            style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '11px 16px', borderRadius: 12, cursor: 'pointer',
              border: selected ? '1px solid rgba(99,102,241,0.45)' : '1px solid rgba(255,255,255,0.07)',
              background: selected ? 'rgba(99,102,241,0.08)' : 'rgba(255,255,255,0.03)',
              transition: 'all 0.15s ease', textAlign: 'left',
            }}
          >
            <div style={{
              width: 16, height: 16, borderRadius: 4, flexShrink: 0,
              border: selected ? '1.5px solid #818cf8' : '1.5px solid rgba(255,255,255,0.2)',
              background: selected ? 'rgba(99,102,241,0.25)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {selected && (
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M2 5l2.5 2.5L8 3" stroke="#818cf8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span style={{ fontSize: 13, color: selected ? '#c4b5fd' : 'var(--text-secondary)' }}>
              {opt}
            </span>
          </button>
        )
      })}
    </div>
  )
}