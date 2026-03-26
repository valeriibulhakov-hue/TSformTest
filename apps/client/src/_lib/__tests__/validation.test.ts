import {
  validateFormBuilder,
  isBuilderValid,
  validateFormFiller,
  isFillerValid,
} from '../validation'
import { QuestionType } from '../../api/generated'

const makeQuestion = (overrides = {}) => ({
  id: 'q1',
  title: 'Test question',
  type: QuestionType.Text,
  options: [],
  ...overrides,
})

const makeForm = (overrides = {}) => ({
  title: 'Test Form',
  description: '',
  questions: [makeQuestion()],
  ...overrides,
})

// ── validateFormBuilder ─────────────────────────────────────

describe('validateFormBuilder', () => {

  describe('title', () => {
    it('requires form title', () => {
      const errors = validateFormBuilder(makeForm({ title: '' }))
      expect(errors.title).toBe('Form title is required')
    })

    it('rejects whitespace-only title', () => {
      const errors = validateFormBuilder(makeForm({ title: '   ' }))
      expect(errors.title).toBe('Form title is required')
    })

    it('accepts valid title', () => {
      const errors = validateFormBuilder(makeForm({ title: 'My Form' }))
      expect(errors.title).toBeUndefined()
    })
  })

  describe('questions', () => {
    it('requires at least one question', () => {
      const errors = validateFormBuilder(makeForm({ questions: [] }))
      expect(errors.questions).toBe('Add at least one question')
    })

    it('accepts form with questions', () => {
      const errors = validateFormBuilder(makeForm())
      expect(errors.questions).toBeUndefined()
    })

    it('requires question title', () => {
      const errors = validateFormBuilder(makeForm({
        questions: [makeQuestion({ title: '' })],
      }))
      expect(errors.questionTitles['q1']).toBe('Question title is required')
    })

    it('rejects whitespace-only question title', () => {
      const errors = validateFormBuilder(makeForm({
        questions: [makeQuestion({ title: '   ' })],
      }))
      expect(errors.questionTitles['q1']).toBe('Question title is required')
    })
  })

  describe('options for MULTIPLE_CHOICE and CHECKBOX', () => {
    it('requires at least 2 options for MULTIPLE_CHOICE', () => {
      const errors = validateFormBuilder(makeForm({
        questions: [makeQuestion({ type: QuestionType.MultipleChoice, options: ['Only one'] })],
      }))
      expect(errors.questionOptions['q1']).toBe('Add at least 2 options')
    })

    it('requires at least 2 options for CHECKBOX', () => {
      const errors = validateFormBuilder(makeForm({
        questions: [makeQuestion({ type: QuestionType.Checkbox, options: ['Only one'] })],
      }))
      expect(errors.questionOptions['q1']).toBe('Add at least 2 options')
    })

    it('rejects duplicate options', () => {
      const errors = validateFormBuilder(makeForm({
        questions: [makeQuestion({
          type: QuestionType.Checkbox,
          options: ['Option A', 'Option A', 'Option B'],
        })],
      }))
      expect(errors.questionOptions['q1']).toBe('Options must be unique')
    })

    it('rejects case-insensitive duplicate options', () => {
      const errors = validateFormBuilder(makeForm({
        questions: [makeQuestion({
          type: QuestionType.MultipleChoice,
          options: ['option a', 'Option A'],
        })],
      }))
      expect(errors.questionOptions['q1']).toBe('Options must be unique')
    })

    it('accepts 2 unique options', () => {
      const errors = validateFormBuilder(makeForm({
        questions: [makeQuestion({
          type: QuestionType.MultipleChoice,
          options: ['Yes', 'No'],
        })],
      }))
      expect(errors.questionOptions['q1']).toBeUndefined()
    })

    it('does not validate options for TEXT type', () => {
      const errors = validateFormBuilder(makeForm({
        questions: [makeQuestion({ type: QuestionType.Text, options: [] })],
      }))
      expect(errors.questionOptions['q1']).toBeUndefined()
    })
  })

  describe('isBuilderValid', () => {
    it('returns true for valid form', () => {
      const errors = validateFormBuilder(makeForm())
      expect(isBuilderValid(errors)).toBe(true)
    })

    it('returns false when title missing', () => {
      const errors = validateFormBuilder(makeForm({ title: '' }))
      expect(isBuilderValid(errors)).toBe(false)
    })

    it('returns false when question title missing', () => {
      const errors = validateFormBuilder(makeForm({
        questions: [makeQuestion({ title: '' })],
      }))
      expect(isBuilderValid(errors)).toBe(false)
    })
  })
})

// ── validateFormFiller ──────────────────────────────────────

describe('validateFormFiller', () => {
  const textQuestion = { id: 'q1', type: QuestionType.Text }
  const dateQuestion = { id: 'q2', type: QuestionType.Date }
  const checkboxQuestion = { id: 'q3', type: QuestionType.Checkbox }
  const mcQuestion = { id: 'q4', type: QuestionType.MultipleChoice }

  describe('TEXT questions', () => {
    it('requires answer for TEXT question', () => {
      const errors = validateFormFiller([textQuestion], {})
      expect(errors.answers['q1']).toBe('This field is required')
    })

    it('rejects whitespace-only answer', () => {
      const errors = validateFormFiller([textQuestion], { q1: '   ' })
      expect(errors.answers['q1']).toBe('This field is required')
    })

    it('accepts valid text answer', () => {
      const errors = validateFormFiller([textQuestion], { q1: 'My answer' })
      expect(errors.answers['q1']).toBeUndefined()
    })
  })

  describe('DATE questions', () => {
    it('requires date answer', () => {
      const errors = validateFormFiller([dateQuestion], {})
      expect(errors.answers['q2']).toBe('Please select a date')
    })

    it('rejects invalid date format', () => {
      const errors = validateFormFiller([dateQuestion], { q2: 'not-a-date' })
      expect(errors.answers['q2']).toBe('Invalid date format')
    })

    it('rejects year before 1900', () => {
      const errors = validateFormFiller([dateQuestion], { q2: '0001-01-01' })
      expect(errors.answers['q2']).toBe('Please enter a date between 1900 and 2100')
    })

    it('rejects year after 2100', () => {
      const errors = validateFormFiller([dateQuestion], { q2: '2101-01-01' })
      expect(errors.answers['q2']).toBe('Please enter a date between 1900 and 2100')
    })

    it('accepts valid date in range', () => {
      const errors = validateFormFiller([dateQuestion], { q2: '2024-06-15' })
      expect(errors.answers['q2']).toBeUndefined()
    })

    it('accepts boundary year 1900', () => {
      const errors = validateFormFiller([dateQuestion], { q2: '1900-01-01' })
      expect(errors.answers['q2']).toBeUndefined()
    })

    it('accepts boundary year 2100', () => {
      const errors = validateFormFiller([dateQuestion], { q2: '2100-12-31' })
      expect(errors.answers['q2']).toBeUndefined()
    })
  })

  describe('CHECKBOX questions', () => {
    it('requires at least one checkbox selected', () => {
      const errors = validateFormFiller([checkboxQuestion], { q3: [] })
      expect(errors.answers['q3']).toBe('Select at least one option')
    })

    it('rejects empty answers for checkbox', () => {
      const errors = validateFormFiller([checkboxQuestion], {})
      expect(errors.answers['q3']).toBe('Select at least one option')
    })

    it('accepts one selected option', () => {
      const errors = validateFormFiller([checkboxQuestion], { q3: ['Option A'] })
      expect(errors.answers['q3']).toBeUndefined()
    })

    it('accepts multiple selected options', () => {
      const errors = validateFormFiller([checkboxQuestion], { q3: ['Option A', 'Option B'] })
      expect(errors.answers['q3']).toBeUndefined()
    })
  })

  describe('MULTIPLE_CHOICE questions', () => {
    it('requires answer for MULTIPLE_CHOICE', () => {
      const errors = validateFormFiller([mcQuestion], {})
      expect(errors.answers['q4']).toBe('This field is required')
    })

    it('accepts valid selection', () => {
      const errors = validateFormFiller([mcQuestion], { q4: 'Option A' })
      expect(errors.answers['q4']).toBeUndefined()
    })
  })

  describe('multiple questions', () => {
    it('validates all questions independently', () => {
      const questions = [textQuestion, dateQuestion, checkboxQuestion]
      const errors = validateFormFiller(questions, {})
      expect(errors.answers['q1']).toBeDefined()
      expect(errors.answers['q2']).toBeDefined()
      expect(errors.answers['q3']).toBeDefined()
    })

    it('passes when all questions answered', () => {
      const questions = [textQuestion, dateQuestion, checkboxQuestion]
      const answers = {
        q1: 'My answer',
        q2: '2024-06-15',
        q3: ['Option A'],
      }
      const errors = validateFormFiller(questions, answers)
      expect(isFillerValid(errors)).toBe(true)
    })
  })

  describe('isFillerValid', () => {
    it('returns true when no errors', () => {
      const errors = validateFormFiller([textQuestion], { q1: 'answer' })
      expect(isFillerValid(errors)).toBe(true)
    })

    it('returns false when errors exist', () => {
      const errors = validateFormFiller([textQuestion], {})
      expect(isFillerValid(errors)).toBe(false)
    })
  })
})