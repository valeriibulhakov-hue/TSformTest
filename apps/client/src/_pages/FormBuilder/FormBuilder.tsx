import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Save, X, AlertCircle } from 'lucide-react'
import { useFormBuilder } from './useFormBuilder'
import { QuestionCard } from './QuestionCard'
import { QuestionEditor } from './QuestionEditor'
import { useCreateFormMutation } from '../../api/generated'
import type { QuestionInput, QuestionType } from '../../api/generated'

export const FormBuilderPage: React.FC = () => {
  const navigate = useNavigate()
  const {
    form, activeId, activeQuestion, errors,
    setTitle, setDescription,
    addQuestion, removeQuestion, updateQuestion,
    addOption, updateOption, removeOption,
    setActiveId, validateAndSubmit,
  } = useFormBuilder()

  const [createForm, { isLoading }] = useCreateFormMutation()

  const handleSave = async () => {
    if (!validateAndSubmit(form)) return
    try {
      await createForm({
        title: form.title,
        description: form.description || undefined,
        questions: form.questions.map(q => ({
          title: q.title,
          type: q.type as QuestionType,
          options: q.options.length > 0 ? q.options : undefined,
        } satisfies QuestionInput)),
      }).unwrap()
      navigate('/')
    } catch (e) {
      console.error('Failed to save:', e)
    }
  }

  return (
    <div className="animate-fade-up" style={{ maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{
            fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 600,
            color: 'var(--text-primary)', marginBottom: 4,
          }}>
            Create form
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {form.questions.length} question{form.questions.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="glass-btn" onClick={() => navigate('/')}>
            <X size={14} /> Cancel
          </button>
          <button
            className="glass-btn-primary"
            onClick={handleSave}
            disabled={isLoading}
            style={{ opacity: isLoading ? 0.6 : 1 }}
          >
            <Save size={14} /> {isLoading ? 'Saving...' : 'Save form'}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16, alignItems: 'start' }}>
        <div>
          <div className="glass-card" style={{ padding: 22, marginBottom: 16 }}>
            <SectionLabel>Form details</SectionLabel>
            <input
              className="glass-input"
              style={{ marginBottom: errors.title ? 6 : 12 }}
              placeholder="Form title *"
              value={form.title}
              onChange={e => setTitle(e.target.value)}
            />
            {errors.title && <ErrorMessage message={errors.title} />}
            <input
              className="glass-input"
              style={{ marginTop: errors.title ? 10 : 0 }}
              placeholder="Description (optional)"
              value={form.description}
              onChange={e => setDescription(e.target.value)}
            />
          </div>

          <div className="glass-card" style={{ padding: 22 }}>
            <SectionLabel>Questions</SectionLabel>

            {form.questions.length === 0 && (
              <p style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', padding: '24px 0' }}>
                No questions yet. Add your first one below.
              </p>
            )}

            {errors.questions && (
              <ErrorMessage message={errors.questions} />
            )}

            {form.questions.map((q, i) => (
              <div key={q.id}>
                <QuestionCard
                  question={q}
                  index={i}
                  isActive={q.id === activeId}
                  onClick={() => setActiveId(q.id)}
                  onRemove={() => removeQuestion(q.id)}
                />
                {errors.questionTitles[q.id] && (
                  <ErrorMessage message={errors.questionTitles[q.id]} />
                )}
                {errors.questionOptions[q.id] && (
                  <ErrorMessage message={errors.questionOptions[q.id]} />
                )}
              </div>
            ))}

            <button
              onClick={addQuestion}
              style={{
                width: '100%', padding: '11px',
                borderRadius: 14, border: '1px dashed rgba(99,102,241,0.3)',
                background: 'rgba(99,102,241,0.05)', color: '#818cf8',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: form.questions.length ? 4 : 0,
              }}
            >
              <Plus size={15} /> Add question
            </button>
          </div>
        </div>

        {activeQuestion ? (
          <QuestionEditor
            question={activeQuestion}
            onUpdate={patch => updateQuestion(activeQuestion.id, patch)}
            onAddOption={() => addOption(activeQuestion.id)}
            onUpdateOption={(idx, val) => updateOption(activeQuestion.id, idx, val)}
            onRemoveOption={idx => removeOption(activeQuestion.id, idx)}
          />
        ) : (
          <div className="glass-card" style={{ padding: 32, textAlign: 'center', position: 'sticky', top: 80 }}>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Click a question<br />to edit it here
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{
    fontSize: 10, fontWeight: 500, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14,
  }}>
    {children}
  </p>
)

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 6,
    fontSize: 12, color: '#fb7185',
    marginTop: 6, marginBottom: 6,
    padding: '6px 12px', borderRadius: 8,
    background: 'rgba(244,63,94,0.08)',
    border: '1px solid rgba(244,63,94,0.15)',
  }}>
    <AlertCircle size={12} color="#fb7185" />
    {message}
  </div>
)