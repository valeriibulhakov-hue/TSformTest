import { useState, useCallback, useMemo } from 'react'
import {
  validateFormFiller,
  isFillerValid,
  type FormFillerErrors,
  type FillerQuestion,
} from '../../_lib/validation'

export type AnswerValue = string | string[]

export function useFormFiller(questions: FillerQuestion[]) {
  const questionIds = questions.map(q => q.id)

  const [answers, setAnswers] = useState<Record<string, AnswerValue>>({})
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormFillerErrors>({ answers: {} })
  const [touched, setTouched] = useState(false)

  const setAnswer = useCallback((questionId: string, value: AnswerValue) => {
    setAnswers(prev => {
      const next = { ...prev, [questionId]: value }
      if (touched) setErrors(validateFormFiller(questions, next))
      return next
    })
  }, [touched, questions])

  const toggleCheckbox = useCallback((questionId: string, option: string) => {
    setAnswers(prev => {
      const current = (prev[questionId] as string[]) ?? []
      const next = current.includes(option)
        ? current.filter(v => v !== option)
        : [...current, option]
      const nextAnswers = { ...prev, [questionId]: next }
      if (touched) setErrors(validateFormFiller(questions, nextAnswers))
      return nextAnswers
    })
  }, [touched, questions])

  const answeredCount = useMemo(
    () => questionIds.filter(id => {
      const v = answers[id]
      return Array.isArray(v) ? v.length > 0 : Boolean(v)
    }).length,
    [answers, questionIds]
  )

  const progress = questionIds.length > 0
    ? Math.round((answeredCount / questionIds.length) * 100)
    : 0

  const getSerializedAnswers = useCallback(() =>
    Object.entries(answers).map(([questionId, value]) => ({
      questionId,
      value: Array.isArray(value) ? value.join(', ') : value,
    })),
    [answers]
  )

  const validateAndSubmit = useCallback(() => {
    setTouched(true)
    const errs = validateFormFiller(questions, answers)
    setErrors(errs)
    return isFillerValid(errs)
  }, [questions, answers])

  return {
    answers, submitted, error, errors,
    setAnswer, toggleCheckbox,
    answeredCount, progress,
    getSerializedAnswers,
    setSubmitted, setError,
    validateAndSubmit,
  }
}