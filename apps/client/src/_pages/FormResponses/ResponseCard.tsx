import { QuestionType } from '../../api/generated'
import type { Response, Question } from './useFormResponses'

interface Props {
  response: Response
  index: number
  questions: Question[]
  getAnswer: (r: Response, qId: string) => string | null
}

const formatAnswer = (value: string | null, type: string) => {
  if (!value) return null
  if (type === QuestionType.MultipleChoice || type === QuestionType.Checkbox) {
    return value.split(', ').filter(Boolean)
  }
  return [value]
}

export const ResponseCard: React.FC<Props> = ({ response, index, questions, getAnswer }) => (
  <div
    className="glass-card animate-fade-up"
    style={{ padding: 22, animationDelay: `${index * 0.05}s` }}
  >
    {/* Header */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
      <span style={{
        fontSize: 12, fontWeight: 500, padding: '3px 12px', borderRadius: 20,
        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', color: '#818cf8',
      }}>
        #{index + 1}
      </span>
      <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>
        {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </span>
    </div>

    {/* Answers */}
    <div>
      {questions.map((q, i) => {
        const raw = getAnswer(response, q.id)
        const parts = formatAnswer(raw, q.type)
        const isLast = i === questions.length - 1

        return (
          <div
            key={q.id}
            style={{
              display: 'flex', gap: 16, paddingBottom: isLast ? 0 : 12,
              marginBottom: isLast ? 0 : 12,
              borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div style={{ width: 200, flexShrink: 0 }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5 }}>
                {q.title}
              </p>
            </div>

            <div style={{ flex: 1 }}>
              {!parts ? (
                <span style={{ fontSize: 13, color: '#1e293b', fontStyle: 'italic' }}>
                  No answer
                </span>
              ) : parts.length === 1 && q.type !== QuestionType.MultipleChoice && q.type !== QuestionType.Checkbox ? (
                <span style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {parts[0]}
                </span>
              ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {parts.map(p => (
                    <span
                      key={p}
                      style={{
                        fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20,
                        background: 'rgba(167,139,250,0.1)',
                        border: '1px solid rgba(167,139,250,0.2)',
                        color: '#a78bfa',
                      }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  </div>
)