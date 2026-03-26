import React from 'react'
import { Plus, X } from 'lucide-react'
import type { Question, QuestionType } from './useFormBuilder'

const TYPES: { value: QuestionType; label: string }[] = [
  { value: 'TEXT',            label: 'Text' },
  { value: 'MULTIPLE_CHOICE', label: 'Multiple choice' },
  { value: 'CHECKBOX',        label: 'Checkbox' },
  { value: 'DATE',            label: 'Date' },
]

const HAS_OPTIONS: QuestionType[] = ['MULTIPLE_CHOICE', 'CHECKBOX']

interface Props {
  question: Question
  onUpdate: (patch: Partial<Question>) => void
  onAddOption: () => void
  onUpdateOption: (idx: number, value: string) => void
  onRemoveOption: (idx: number) => void
}

export const QuestionEditor: React.FC<Props> = ({
  question, onUpdate, onAddOption, onUpdateOption, onRemoveOption,
}) => (
  <div style={{
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 22,
    padding: 22,
    position: 'sticky',
    top: 80,
  }}>
    <p style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 18 }}>
      Edit question
    </p>

    {/* Title */}
    <Label>Question text</Label>
    <input
      className="glass-input"
      style={{ marginBottom: 16 }}
      placeholder="Enter your question..."
      value={question.title}
      onChange={e => onUpdate({ title: e.target.value })}
    />

    {/* Type */}
    <Label>Type</Label>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 18 }}>
      {TYPES.map(t => (
        <button
          key={t.value}
          onClick={() => onUpdate({ type: t.value, options: [] })}
          style={{
            padding: '10px 8px', borderRadius: 12, fontSize: 12, fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s ease',
            border: question.type === t.value
              ? '1px solid rgba(99,102,241,0.5)'
              : '1px solid rgba(255,255,255,0.08)',
            background: question.type === t.value
              ? 'rgba(99,102,241,0.15)'
              : 'rgba(255,255,255,0.03)',
            color: question.type === t.value ? '#818cf8' : 'var(--text-secondary)',
          }}
        >
          {t.label}
        </button>
      ))}
    </div>

    {/* Options */}
    {HAS_OPTIONS.includes(question.type) && (
      <>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', margin: '0 0 16px' }} />
        <Label>Options</Label>
        {question.options.map((opt, idx) => (
          <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{
              width: question.type === 'CHECKBOX' ? 11 : 11,
              height: 11, flexShrink: 0,
              borderRadius: question.type === 'CHECKBOX' ? 3 : '50%',
              border: '1.5px solid rgba(255,255,255,0.2)',
            }} />
            <input
              className="glass-input"
              style={{ flex: 1, padding: '7px 12px', fontSize: 13 }}
              placeholder={`Option ${idx + 1}`}
              value={opt}
              onChange={e => onUpdateOption(idx, e.target.value)}
            />
            <button
              onClick={() => onRemoveOption(idx)}
              style={{
                width: 26, height: 26, flexShrink: 0, borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.08)',
                background: 'transparent', color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
              }}
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          onClick={onAddOption}
          style={{
            width: '100%', padding: '9px', marginTop: 4,
            borderRadius: 12, border: '1px dashed rgba(99,102,241,0.3)',
            background: 'rgba(99,102,241,0.05)', color: '#818cf8',
            fontSize: 12, fontWeight: 500, cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <Plus size={13} /> Add option
        </button>
      </>
    )}
  </div>
)

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
    {children}
  </p>
)