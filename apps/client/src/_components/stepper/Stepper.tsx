import React, { useState } from 'react'
import { StepperTab } from './StepperTab'
import { Button } from '@/_components/ui/button'
import { cn } from '@/_lib/utils'

export interface StepConfig {
  id: string
  label: string
  content: React.ReactNode
}

interface StepperProps {
  steps: StepConfig[]
  onComplete?: () => void
  className?: string
}

export const Stepper: React.FC<StepperProps> = ({ steps, onComplete, className }) => {
  const [activeStep, setActiveStep] = useState(0)

  const isFirst = activeStep === 0
  const isLast = activeStep === steps.length - 1

  return (
    <div className={cn('w-full max-w-3xl mx-auto', className)}>

      {/* Tab bar */}
      <div className="flex border-b border-slate-200 overflow-x-auto bg-white rounded-t-xl shadow-sm">
        {steps.map((step, index) => {
          const status =
            index === activeStep ? 'active'
            : index < activeStep ? 'completed'
            : 'upcoming'

          return (
            <StepperTab
              key={step.id}
              index={index}
              label={step.label}
              status={status}
              onClick={() => setActiveStep(index)}
            />
          )
        })}
      </div>

      {/* Content panel */}
      <div
        key={steps[activeStep].id}
        className="bg-white border border-t-0 border-slate-200 rounded-b-xl p-6 min-h-64 shadow-sm animate-in fade-in duration-200"
      >
        {steps[activeStep].content}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-4">
        <Button
          variant="outline"
          onClick={() => setActiveStep(p => p - 1)}
          disabled={isFirst}
        >
          ← Back
        </Button>

        {/* Progress dots */}
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={cn(
                'w-2 h-2 rounded-full transition-all duration-200',
                i === activeStep ? 'bg-slate-900 w-4' : 'bg-slate-300 hover:bg-slate-400'
              )}
            />
          ))}
        </div>

        <Button
          onClick={isLast ? onComplete : () => setActiveStep(p => p + 1)}
        >
          {isLast ? 'Submit →' : 'Next →'}
        </Button>
      </div>
    </div>
  )
}