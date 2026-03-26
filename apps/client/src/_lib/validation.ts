import type { QuestionType } from '../api/generated'

export type FieldError = string

export interface FormBuilderErrors {
  title?: FieldError
  questions?: FieldError
  questionTitles: Record<string, FieldError>
  questionOptions: Record<string, FieldError>
}

export interface FormFillerErrors {
  answers: Record<string, FieldError>
}

export interface FormDraftQuestion {
  id: string
  title: string
  type: QuestionType
  options: string[]
}

export interface FormDraft {
  title: string
  description: string
  questions: FormDraftQuestion[]
}

export type AnswerValue = string | string[]

export interface FillerQuestion {
  id: string
  type: QuestionType
}

export function validateFormBuilder(form: FormDraft): FormBuilderErrors {
  const errors: FormBuilderErrors = {
    questionTitles: {},
    questionOptions: {},
  }

  if (!form.title.trim()) {
    errors.title = 'Form title is required'
  }

  if (form.questions.length === 0) {
    errors.questions = 'Add at least one question'
  }

  form.questions.forEach(q => {
    if (!q.title.trim()) {
      errors.questionTitles[q.id] = 'Question title is required'
    }

    if (q.type === 'MULTIPLE_CHOICE' || q.type === 'CHECKBOX') {
      const nonEmpty = q.options.filter(o => o.trim())

      if (nonEmpty.length < 2) {
        errors.questionOptions[q.id] = 'Add at least 2 options'
      } else {
        const unique = new Set(nonEmpty.map(o => o.trim().toLowerCase()))
        if (unique.size !== nonEmpty.length) {
          errors.questionOptions[q.id] = 'Options must be unique'
        }
      }
    }
  })

  return errors
}

export function isBuilderValid(errors: FormBuilderErrors): boolean {
  return (
    !errors.title &&
    !errors.questions &&
    Object.keys(errors.questionTitles).length === 0 &&
    Object.keys(errors.questionOptions).length === 0
  )
}

export function validateFormFiller(
  questions: FillerQuestion[],
  answers: Record<string, AnswerValue>
): FormFillerErrors {
  const errors: FormFillerErrors = { answers: {} }

  questions.forEach(q => {
    const value = answers[q.id]

    if (q.type === 'CHECKBOX') {
      const checked = (value as string[]) ?? []
      if (checked.length === 0) {
        errors.answers[q.id] = 'Select at least one option'
      }
      return
    }

    if (q.type === 'DATE') {
      if (!value || !(value as string).trim()) {
        errors.answers[q.id] = 'Please select a date'
        return
      }
      const date = new Date(value as string)
      if (isNaN(date.getTime())) {
        errors.answers[q.id] = 'Invalid date format'
        return
      }
      const year = date.getFullYear()
      if (year < 1900 || year > 2100) {
        errors.answers[q.id] = 'Please enter a date between 1900 and 2100'
      }
      return
    }

    if (!value || !(value as string).trim()) {
      errors.answers[q.id] = 'This field is required'
    }
  })

  return errors
}

export function isFillerValid(errors: FormFillerErrors): boolean {
  return Object.keys(errors.answers).length === 0
}