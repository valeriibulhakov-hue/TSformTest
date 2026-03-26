import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, FileText, Inbox } from 'lucide-react'
import { useGetFormQuery, useGetResponsesQuery } from '../../api/generated'
import { useFormResponses } from './useFormResponses'
import { ResponseCard } from './ResponseCard'
import { StatCard } from './StatCard'

export const FormResponsesPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { data: formData, isLoading: formLoading } = useGetFormQuery({ id: id! })
  const { data: respData, isLoading: respLoading } = useGetResponsesQuery({ formId: id! })

  const form = formData?.form
  const responses = respData?.responses ?? []

  const { stats, getAnswerForQuestion } = useFormResponses(
    responses,
    form?.questions ?? []
  )

  if (formLoading || respLoading) return <LoadingResponses />
  if (!form) return (
    <div style={{ textAlign: 'center', paddingTop: 80 }}>
      <div className="glass-card" style={{ display: 'inline-block', padding: '32px 48px' }}>
        <p style={{ color: '#fb7185', fontSize: 14 }}>Form not found</p>
      </div>
    </div>
  )

  return (
    <div className="animate-fade-up" style={{ maxWidth: 800, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <Link to="/" style={{ textDecoration: 'none', display: 'inline-flex', marginBottom: 12 }}>
            <button className="glass-btn" style={{ padding: '6px 14px', fontSize: 12 }}>
              <ArrowLeft size={13} /> Back
            </button>
          </Link>
          <h1 style={{
            fontFamily: 'Sora, sans-serif', fontSize: 22, fontWeight: 600,
            color: 'var(--text-primary)', marginBottom: 4,
          }}>
            {form.title}
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            {stats.total} submission{stats.total !== 1 ? 's' : ''}
          </p>
        </div>
        <Link to={`/forms/${id}/fill`} style={{ textDecoration: 'none', marginTop: 40 }}>
          <button className="glass-btn-primary" style={{ fontSize: 13 }}>
            <FileText size={14} /> Fill form
          </button>
        </Link>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24 }}>
        <StatCard value={stats.total}                      label="Total responses" />
        <StatCard value={stats.questionCount}              label="Questions" />
        <StatCard value={`${stats.completionRate}%`}       label="Completion rate" accent="var(--accent)" />
      </div>

      {/* Empty */}
      {responses.length === 0 ? (
        <div className="glass-card" style={{ padding: '56px 32px', textAlign: 'center' }}>
          <Inbox size={32} color="var(--text-muted)" style={{ margin: '0 auto 16px', display: 'block' }} />
          <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 8 }}>
            No responses yet
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
            Share the form to start collecting answers
          </p>
          <Link to={`/forms/${id}/fill`} style={{ textDecoration: 'none' }}>
            <button className="glass-btn-primary">Fill form →</button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {responses.map((r, i) => (
            <ResponseCard
              key={r.id}
              response={r}
              index={i}
              questions={form.questions}
              getAnswer={getAnswerForQuestion}
            />
          ))}
        </div>
      )}
    </div>
  )
}

const LoadingResponses: React.FC = () => (
  <div style={{ maxWidth: 800, margin: '0 auto', paddingTop: 40 }}>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
      {[1, 2, 3].map(i => (
        <div key={i} className="glass-card" style={{ padding: 22, height: 80, animation: 'pulse 1.5s ease infinite' }} />
      ))}
    </div>
    {[1, 2, 3].map(i => (
      <div key={i} className="glass-card" style={{ padding: 22, marginBottom: 12, height: 140, animation: 'pulse 1.5s ease infinite' }} />
    ))}
  </div>
)