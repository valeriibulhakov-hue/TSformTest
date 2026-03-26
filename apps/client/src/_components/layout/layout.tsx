import React from 'react'
import { Link } from 'react-router-dom'
import { FileText, Plus } from 'lucide-react'

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative min-h-screen">

    {/* Ambient blobs */}
    <div className="blob" style={{ width: 500, height: 500, background: '#4f46e5', opacity: 0.10, top: -120, left: -100 }} />
    <div className="blob" style={{ width: 400, height: 400, background: '#7c3aed', opacity: 0.08, bottom: -80, right: -80, animationDelay: '4s' }} />
    <div className="blob" style={{ width: 300, height: 300, background: '#0ea5e9', opacity: 0.07, top: '45%', left: '60%', animationDelay: '8s' }} />

    {/* Navbar */}
    <nav className="glass sticky top-0 z-50 flex items-center justify-between px-6 py-3"
         style={{ borderLeft: 'none', borderRight: 'none', borderTop: 'none', borderRadius: 0 }}>
      <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="glass-btn-primary"
             style={{ width: 34, height: 34, padding: 0, borderRadius: 10 }}>
          <FileText size={16} color="white" />
        </div>
        <span style={{ fontFamily: 'Sora, sans-serif', fontWeight: 600, fontSize: 16, color: 'var(--text-primary)' }}>
          FormCraft
        </span>
      </Link>

      <Link to="/forms/new" style={{ textDecoration: 'none' }}>
        <button className="glass-btn-primary">
          <Plus size={14} />
          New Form
        </button>
      </Link>
    </nav>

    {/* Content */}
    <main className="relative z-10 mx-auto max-w-5xl px-6 py-10 animate-fade-up">
      {children}
    </main>
  </div>
)