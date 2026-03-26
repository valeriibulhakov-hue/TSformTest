import React from 'react'
import { Link } from 'react-router-dom'
import { CheckCircle } from 'lucide-react'

export const SuccessScreen: React.FC = () => (
  <div style={{ textAlign: 'center', paddingTop: 80 }}>
    <div className="glass-card" style={{
      display: 'inline-flex', flexDirection: 'column',
      alignItems: 'center', gap: 20, padding: '52px 64px', maxWidth: 380,
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 20,
        background: 'rgba(52,211,153,0.1)',
        border: '1px solid rgba(52,211,153,0.25)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <CheckCircle size={30} color="#34d399" />
      </div>
      <div>
        <p style={{ fontSize: 18, fontWeight: 600, fontFamily: 'Sora, sans-serif', color: 'var(--text-primary)', marginBottom: 8 }}>
          Response submitted!
        </p>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
          Thank you for filling out the form. Your answers have been recorded.
        </p>
      </div>
      <Link to="/" style={{ textDecoration: 'none', width: '100%' }}>
        <button className="glass-btn" style={{ width: '100%', justifyContent: 'center' }}>
          Back to forms
        </button>
      </Link>
    </div>
  </div>
)