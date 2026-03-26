import React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/_lib/utils'

interface StepperTabProps {
  index: number
  label: string
  status: 'active' | 'completed' | 'upcoming'
  onClick: () => void
}

export const StepperTab: React.FC<StepperTabProps> = ({ index, label, status, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-200 border-b-2 whitespace-nowrap',
        status === 'active' && 'border-slate-900 text-slate-900',
        status === 'completed' && 'border-transparent text-emerald-600 hover:text-emerald-700',
        status === 'upcoming' && 'border-transparent text-slate-400 hover:text-slate-600 cursor-pointer'
      )}
    >
      <span className={cn(
        'flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold transition-all',
        status === 'active' && 'bg-slate-900 text-white',
        status === 'completed' && 'bg-emerald-100 text-emerald-600',
        status === 'upcoming' && 'bg-slate-100 text-slate-400'
      )}>
        {status === 'completed' ? <Check size={12} /> : index + 1}
      </span>
      {label}
    </button>
  )
}