import { useState, useCallback } from 'react'
import { v4 as uuid } from 'uuid'
import type { QuestionType } from '../../api/generated'
import {
  validateFormBuilder,
  isBuilderValid,
  type FormBuilderErrors,
} from '../../_lib/validation'

export interface Question {
  id: string
  title: string
  type: QuestionType
  options: string[]
}

export interface FormDraft {
  title: string
  description: string
  questions: Question[]
}

const makeQuestion = (): Question => ({
  id: uuid(),
  title: '',
  type: 'TEXT',
  options: [],
})

export function useFormBuilder() {
  const [form, setForm] = useState<FormDraft>({ title: '', description: '', questions: [] })
  const [activeId, setActiveId] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormBuilderErrors>({ questionTitles: {}, questionOptions: {} })
  const [touched, setTouched] = useState(false)

  const activeQuestion = form.questions.find(q => q.id === activeId) ?? null

  const validate = useCallback((draft: FormDraft) => {
    const errs = validateFormBuilder(draft)
    setErrors(errs)
    return isBuilderValid(errs)
  }, [])

  const setTitle = useCallback((title: string) => {
    setForm(f => {
      const next = { ...f, title }
      if (touched) validate(next)
      return next
    })
  }, [touched, validate])

  const setDescription = useCallback((description: string) =>
    setForm(f => ({ ...f, description })), [])

  const addQuestion = useCallback(() => {
    const q = makeQuestion()
    setForm(f => {
      const next = { ...f, questions: [...f.questions, q] }
      if (touched) validate(next)
      return next
    })
    setActiveId(q.id)
  }, [touched, validate])

  const removeQuestion = useCallback((id: string) => {
    setForm(f => {
      const next = { ...f, questions: f.questions.filter(q => q.id !== id) }
      if (touched) validate(next)
      return next
    })
    setActiveId(prev => (prev === id ? null : prev))
  }, [touched, validate])

  const updateQuestion = useCallback((id: string, patch: Partial<Question>) => {
    setForm(f => {
      const next = {
        ...f,
        questions: f.questions.map(q => q.id === id ? { ...q, ...patch } : q),
      }
      if (touched) validate(next)
      return next
    })
  }, [touched, validate])

  const addOption = useCallback((id: string) => {
    setForm(f => {
      const next = {
        ...f,
        questions: f.questions.map(q =>
          q.id === id ? { ...q, options: [...q.options, ''] } : q
        ),
      }
      if (touched) validate(next)
      return next
    })
  }, [touched, validate])

  const updateOption = useCallback((id: string, idx: number, value: string) => {
    setForm(f => {
      const next = {
        ...f,
        questions: f.questions.map(q => {
          if (q.id !== id) return q
          const options = [...q.options]
          options[idx] = value
          return { ...q, options }
        }),
      }
      if (touched) validate(next)
      return next
    })
  }, [touched, validate])

  const removeOption = useCallback((id: string, idx: number) => {
    setForm(f => {
      const next = {
        ...f,
        questions: f.questions.map(q =>
          q.id === id ? { ...q, options: q.options.filter((_, i) => i !== idx) } : q
        ),
      }
      if (touched) validate(next)
      return next
    })
  }, [touched, validate])

  const validateAndSubmit = useCallback((draft: FormDraft) => {
    setTouched(true)
    return validate(draft)
  }, [validate])

  return {
    form, activeId, activeQuestion, errors,
    setTitle, setDescription,
    addQuestion, removeQuestion, updateQuestion,
    addOption, updateOption, removeOption,
    setActiveId, validateAndSubmit,
  }
}