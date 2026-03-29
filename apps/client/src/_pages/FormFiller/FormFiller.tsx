import { useParams } from 'react-router-dom'
import { Send, AlertCircle } from 'lucide-react'
import { useGetFormQuery, useSubmitResponseMutation, QuestionType } from '../../api/generated'
import { useFormFiller } from './useFormFiller'
import { QuestionInput } from './QuestionInput'
import { SuccessScreen } from './SuccessScreen'

export const FormFillerPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data, isLoading, isError } = useGetFormQuery({ id: id! })
  const [submitResponse, { isLoading: isSubmitting }] = useSubmitResponseMutation()

  const form = data?.form
  const questions = form?.questions.map(q => ({
    id: q.id,
    type: q.type as QuestionType,
  })) ?? []

  const {
    answers, submitted, error, errors,
    setAnswer, toggleCheckbox,
    answeredCount, progress,
    getSerializedAnswers,
    setSubmitted, setError,
    validateAndSubmit,
  } = useFormFiller(questions)

  if (isLoading) return <LoadingForm />
  if (isError || !form) return <ErrorForm />
  if (submitted) return <SuccessScreen />

  const handleSubmit = async () => {
    if (!validateAndSubmit()) return
    try {
      await submitResponse({
        formId: id!,
        answers: getSerializedAnswers(),
      }).unwrap()
      setSubmitted(true)
    } catch {
      setError('Failed to submit. Please try again.')
    }
  }

  return (
    <div className="animate-fade-up" style={{ maxWidth: 620, margin: '0 auto' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {answeredCount} of {form.questions.length} answered
          </span>
          <span style={{ fontSize: 12, color: 'var(--accent)' }}>{progress}%</span>
        </div>
        <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{
            height: '100%', borderRadius: 99,
            background: 'linear-gradient(90deg, #818cf8, #a78bfa)',
            width: `${progress}%`,
            transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
          }} />
        </div>
      </div>

      <div className="glass-card" style={{ padding: 28, marginBottom: 16 }}>
        <h1 style={{
          fontFamily: 'Sora, sans-serif', fontSize: 24, fontWeight: 600,
          color: 'var(--text-primary)', marginBottom: 10,
        }}>
          {form.title}
        </h1>
        {form.description && (
          <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {form.description}
          </p>
        )}
      </div>

      {form.questions.map((q, i) => (
        <div
          key={q.id}
          className="glass-card animate-fade-up"
          style={{ padding: 22, marginBottom: 12, animationDelay: `${i * 0.06}s` }}
        >
          <p style={{ fontSize: 14, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 16 }}>
            <span style={{ color: 'var(--accent)', marginRight: 8 }}>{i + 1}.</span>
            {q.title}
          </p>
          <QuestionInput
            questionId={q.id}
            type={q.type as QuestionType}
            options={q.options ?? []}
            value={answers[q.id] ?? (q.type === QuestionType.Checkbox ? [] : '')}
            onChange={val => setAnswer(q.id, val)}
            onToggle={opt => toggleCheckbox(q.id, opt)}
          />
          {errors.answers[q.id] && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              fontSize: 12, color: '#fb7185', marginTop: 10,
              padding: '6px 12px', borderRadius: 8,
              background: 'rgba(244,63,94,0.08)',
              border: '1px solid rgba(244,63,94,0.15)',
            }}>
              <AlertCircle size={12} color="#fb7185" />
              {errors.answers[q.id]}
            </div>
          )}
        </div>
      ))}

      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '12px 16px', borderRadius: 12, marginBottom: 12,
          background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.2)',
          color: '#fb7185', fontSize: 13,
        }}>
          <AlertCircle size={15} /> {error}
        </div>
      )}

      <button
        className="glass-btn-primary"
        onClick={handleSubmit}
        disabled={isSubmitting}
        style={{
          width: '100%', padding: '14px', fontSize: 14,
          borderRadius: 18, marginTop: 4,
          opacity: isSubmitting ? 0.6 : 1,
        }}
      >
        <Send size={15} />
        {isSubmitting ? 'Submitting...' : 'Submit response'}
      </button>
    </div>
  )
}

const LoadingForm: React.FC = () => (
  <div style={{ maxWidth: 620, margin: '0 auto', paddingTop: 40 }}>
    {[1, 2, 3].map(i => (
      <div key={i} className="glass-card" style={{ padding: 22, marginBottom: 12, height: 120 }}>
        <div style={{
          height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.05)',
          width: '60%', marginBottom: 16, animation: 'pulse 1.5s ease infinite',
        }} />
        <div style={{ height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.04)' }} />
      </div>
    ))}
  </div>
)

const ErrorForm: React.FC = () => (
  <div style={{ textAlign: 'center', paddingTop: 80 }}>
    <div className="glass-card" style={{ display: 'inline-block', padding: '32px 48px' }}>
      <p style={{ color: '#fb7185', fontSize: 14 }}>Form not found</p>
    </div>
  </div>
)