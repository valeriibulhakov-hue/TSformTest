import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, ArrowRight, BarChart2, Plus, Trash2 } from 'lucide-react'
import { useDispatch } from 'react-redux'
import type { GetFormsQuery } from '../api/generated'
import { useGetFormsQuery, useDeleteFormMutation, api } from '../api/generated'

type FormItem = GetFormsQuery['forms'][number]

export const HomePage: React.FC = () => {
  const { data, isLoading, isError } = useGetFormsQuery()
  const forms = data?.forms ?? []

  if (isLoading) return <LoadingState />
  if (isError)   return <ErrorState />


  return (
    <div>
      {/* Hero */}
      <div className="animate-fade-up" style={{ textAlign: 'center', marginBottom: 56 }}>
        <h1 style={{
          fontFamily: 'Sora, sans-serif', fontWeight: 600,
          fontSize: 'clamp(28px, 5vw, 48px)', lineHeight: 1.15,
          marginBottom: 16, color: 'var(--text-primary)',
        }}>
          Your forms,{' '}
          <span style={{
            background: 'linear-gradient(90deg, #818cf8, #a78bfa, #38bdf8)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>
            beautifully simple
          </span>
        </h1>
        <p style={{
          fontSize: 16, color: 'var(--text-secondary)',
          maxWidth: 420, margin: '0 auto 32px', lineHeight: 1.6,
        }}>
          Create, share and analyse responses — all in one place.
        </p>
        <Link to="/forms/new" style={{ textDecoration: 'none' }}>
          <button className="glass-btn-primary" style={{ fontSize: 15, padding: '12px 28px', borderRadius: 18 }}>
            <Plus size={16} /> Create your first form
          </button>
        </Link>
      </div>

      {/* Grid */}
      {forms.length === 0 ? <EmptyState /> : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-secondary)' }}>
              {forms.length} form{forms.length !== 1 ? 's' : ''}
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {forms.map((form, i) => <FormCard key={form.id} form={form} delay={i} />)}
            <NewFormCard />
          </div>
        </>
      )}
    </div>
  )
}

const ACCENT_COLORS = ['#818cf8', '#2dd4bf', '#fb7185', '#fbbf24', '#34d399']

const FormCard: React.FC<{ form: FormItem; delay: number }> = ({ form, delay }) => {
  const color = ACCENT_COLORS[Math.abs(form.id.charCodeAt(0)) % ACCENT_COLORS.length]
  const dispatch = useDispatch()
  const [deleteForm] = useDeleteFormMutation()

 const handleDelete = async (e: React.MouseEvent) => {
  e.preventDefault()
  await deleteForm({ id: form.id })
}

  return (
    <div
      className={`glass-card animate-fade-up delay-${Math.min(delay + 1, 3)}`}
      style={{ padding: 22 }}
    >
      {/* Card header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: 12,
          background: `${color}18`, border: `1px solid ${color}30`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FileText size={18} color={color} />
        </div>
        <span style={{
          fontSize: 11, fontWeight: 500, padding: '3px 10px', borderRadius: 20,
          background: `${color}15`, border: `1px solid ${color}25`, color,
        }}>
          {form.questions.length} questions
        </span>
      </div>

      {/* Title + description */}
      <h3 style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 6 }}>
        {form.title}
      </h3>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: 18, minHeight: 40 }}>
        {form.description || 'No description'}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>

        {/* Left — delete */}
        <button
          className="glass-btn"
          onClick={handleDelete}
          style={{
            padding: '6px 12px', fontSize: 12, gap: 5,
            color: '#fb7185', borderColor: 'rgba(244,63,94,0.25)',
          }}
        >
          <Trash2 size={13} color="#fb7185" />
        </button>

        {/* Right — responses + fill */}
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/forms/${form.id}/responses`} style={{ textDecoration: 'none' }}>
            <button className="glass-btn" style={{ padding: '6px 12px', fontSize: 12, gap: 5 }}>
              <BarChart2 size={13} /> Responses
            </button>
          </Link>
          <Link to={`/forms/${form.id}/fill`} style={{ textDecoration: 'none' }}>
            <button className="glass-btn-primary" style={{ padding: '6px 14px', fontSize: 12 }}>
              Fill <ArrowRight size={13} />
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

const NewFormCard: React.FC = () => (
  <Link to="/forms/new" style={{ textDecoration: 'none' }}>
    <div className="glass-card" style={{
      padding: 22, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center', gap: 12,
      minHeight: 160, cursor: 'pointer',
      border: '1px dashed rgba(255,255,255,0.1)',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: 'rgba(99,102,241,0.1)',
        border: '1px dashed rgba(99,102,241,0.3)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Plus size={20} color="var(--accent)" />
      </div>
      <span style={{ fontSize: 13, color: 'var(--text-muted)', fontWeight: 500 }}>New form</span>
    </div>
  </Link>
)

const EmptyState: React.FC = () => (
  <div style={{ textAlign: 'center', paddingTop: 60 }}>
    <div className="glass-card" style={{
      display: 'inline-flex', flexDirection: 'column',
      alignItems: 'center', gap: 16, padding: '48px 56px', maxWidth: 360,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 18,
        background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <FileText size={26} color="var(--accent)" />
      </div>
      <div>
        <p style={{ fontSize: 16, fontWeight: 500, color: 'var(--text-primary)', marginBottom: 8 }}>No forms yet</p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>Create your first form to get started</p>
      </div>
      <Link to="/forms/new" style={{ textDecoration: 'none' }}>
        <button className="glass-btn-primary" style={{ padding: '10px 24px' }}>
          <Plus size={14} /> Create form
        </button>
      </Link>
    </div>
  </div>
)

const LoadingState: React.FC = () => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginTop: 56 }}>
    {[1, 2, 3].map(i => (
      <div key={i} className="glass-card" style={{ padding: 22, minHeight: 160 }}>
        <div style={{ height: 40, borderRadius: 10, background: 'rgba(255,255,255,0.05)', marginBottom: 14, animation: 'pulse 1.5s ease infinite' }} />
        <div style={{ height: 14, borderRadius: 6, background: 'rgba(255,255,255,0.04)', marginBottom: 8, width: '70%' }} />
        <div style={{ height: 12, borderRadius: 6, background: 'rgba(255,255,255,0.03)', width: '50%' }} />
      </div>
    ))}
  </div>
)

const ErrorState: React.FC = () => (
  <div className="glass-card" style={{ padding: 32, textAlign: 'center', maxWidth: 360, margin: '56px auto 0' }}>
    <p style={{ fontSize: 14, color: '#fb7185', marginBottom: 8 }}>Failed to load forms</p>
    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>Make sure the server is running on port 4000</p>
  </div>
)