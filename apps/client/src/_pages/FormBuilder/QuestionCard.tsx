import React from 'react'
import { Trash2 } from 'lucide-react'
import type { Question } from './useFormBuilder'
import { QuestionType } from '../../api/generated'

const TYPE_LABELS: Record<QuestionType, string> = {
  [QuestionType.Text]:           'Text',
  [QuestionType.MultipleChoice]: 'Multiple choice',
  [QuestionType.Checkbox]:       'Checkbox',
  [QuestionType.Date]:           'Date',
}

const TYPE_COLORS: Record<QuestionType, { bg: string; color: string; border: string }> = {
  [QuestionType.Text]:           { bg: 'rgba(56,189,248,0.1)',  color: '#38bdf8', border: 'rgba(56,189,248,0.2)' },
  [QuestionType.MultipleChoice]: { bg: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: 'rgba(167,139,250,0.2)' },
  [QuestionType.Checkbox]:       { bg: 'rgba(251,191,36,0.1)',  color: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
  [QuestionType.Date]:           { bg: 'rgba(52,211,153,0.1)',  color: '#34d399', border: 'rgba(52,211,153,0.2)' },
}

interface Props {
  question: Question
  index: number
  isActive: boolean
  onClick: () => void
  onRemove: () => void
}

export const QuestionCard: React.FC<Props> = ({ question, index, isActive, onClick, onRemove }) => {
  const c = TYPE_COLORS[question.type]

  return (
    <div
      onClick={onClick}
      style={{
        background: isActive ? 'rgba(99,102,241,0.07)' : 'rgba(255,255,255,0.03)',
        border: `1px solid ${isActive ? 'rgba(99,102,241,0.4)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 14,
        padding: '14px 16px',
        marginBottom: 10,
        cursor: 'pointer',
        transition: 'all 0.18s ease',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7, flexShrink: 0,
            background: 'rgba(99,102,241,0.15)',
            color: '#818cf8', fontSize: 11, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {index + 1}
          </div>
          <span style={{
            fontSize: 13, fontWeight: 500,
            color: question.title ? 'var(--text-primary)' : 'var(--text-muted)',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {question.title || 'Untitled question'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 10 }}>
          <span style={{
            fontSize: 10, fontWeight: 500, padding: '3px 9px', borderRadius: 20,
            background: c.bg, color: c.color, border: `1px solid ${c.border}`,
          }}>
            {TYPE_LABELS[question.type]}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onRemove() }}
            style={{
              width: 26, height: 26, borderRadius: 8, border: '1px solid rgba(244,63,94,0.2)',
              background: 'rgba(244,63,94,0.08)', color: '#fb7185',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
            }}
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  )
}