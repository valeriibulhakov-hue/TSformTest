import { resolvers } from '../graphql/resolvers'

const query = resolvers.Query
const mutation = resolvers.Mutation

const _ = undefined

describe('Form resolvers', () => {

  describe('createForm', () => {
    it('creates a form and returns it with id', () => {
      const form = mutation.createForm(_, {
        title: 'Test Form',
        description: 'Description',
        questions: [{ title: 'Q1', type: 'TEXT' }],
      })

      expect(form.id).toBeDefined()
      expect(form.title).toBe('Test Form')
      expect(form.description).toBe('Description')
      expect(form.questions).toHaveLength(1)
      expect(form.questions[0].title).toBe('Q1')
      expect(form.questions[0].id).toBeDefined()
    })

    it('creates form without description', () => {
      const form = mutation.createForm(_, {
        title: 'No Description',
        questions: [],
      })

      expect(form.title).toBe('No Description')
      expect(form.description).toBeUndefined()
    })

    it('assigns unique ids to questions', () => {
      const form = mutation.createForm(_, {
        title: 'Form',
        questions: [
          { title: 'Q1', type: 'TEXT' },
          { title: 'Q2', type: 'MULTIPLE_CHOICE', options: ['A', 'B'] },
        ],
      })

      const ids = form.questions.map(q => q.id)
      const uniqueIds = new Set(ids)
      expect(uniqueIds.size).toBe(ids.length)
    })
  })

  describe('forms query', () => {
    it('returns all created forms', () => {
      const before = query.forms().length

      mutation.createForm(_, { title: 'Form A', questions: [] })
      mutation.createForm(_, { title: 'Form B', questions: [] })

      const forms = query.forms()
      expect(forms.length).toBe(before + 2)
    })
  })

  describe('form query', () => {
    it('returns form by id', () => {
      const created = mutation.createForm(_, { title: 'Find Me', questions: [] })
      const found = query.form(_, { id: created.id })

      expect(found).toBeDefined()
      expect(found?.title).toBe('Find Me')
    })

    it('returns undefined for non-existent id', () => {
      const found = query.form(_, { id: 'non-existent-id' })
      expect(found).toBeUndefined()
    })
  })

  describe('deleteForm', () => {
    it('deletes existing form and returns true', () => {
      const form = mutation.createForm(_, { title: 'Delete Me', questions: [] })
      const result = mutation.deleteForm(_, { id: form.id })

      expect(result).toBe(true)
      expect(query.form(_, { id: form.id })).toBeUndefined()
    })

    it('returns false for non-existent form', () => {
      const result = mutation.deleteForm(_, { id: 'non-existent-id' })
      expect(result).toBe(false)
    })
  })
})

describe('Response resolvers', () => {

  describe('submitResponse', () => {
    it('creates response with id and formId', () => {
      const form = mutation.createForm(_, {
        title: 'Survey',
        questions: [{ title: 'Q1', type: 'TEXT' }],
      })

      const response = mutation.submitResponse(_, {
        formId: form.id,
        answers: [{ questionId: form.questions[0].id, value: 'My answer' }],
      })

      expect(response.id).toBeDefined()
      expect(response.formId).toBe(form.id)
      expect(response.answers).toHaveLength(1)
      expect(response.answers[0].value).toBe('My answer')
    })

    it('stores multiple answers', () => {
      const form = mutation.createForm(_, {
        title: 'Multi',
        questions: [
          { title: 'Q1', type: 'TEXT' },
          { title: 'Q2', type: 'TEXT' },
        ],
      })

      const response = mutation.submitResponse(_, {
        formId: form.id,
        answers: [
          { questionId: form.questions[0].id, value: 'Answer 1' },
          { questionId: form.questions[1].id, value: 'Answer 2' },
        ],
      })

      expect(response.answers).toHaveLength(2)
    })
  })

  describe('responses query', () => {
    it('returns responses for specific form', () => {
      const form = mutation.createForm(_, { title: 'Responses Test', questions: [] })

      mutation.submitResponse(_, { formId: form.id, answers: [] })
      mutation.submitResponse(_, { formId: form.id, answers: [] })

      const responses = query.responses(_, { formId: form.id })
      expect(responses.length).toBeGreaterThanOrEqual(2)
      responses.forEach(r => expect(r.formId).toBe(form.id))
    })

    it('does not return responses from other forms', () => {
      const form1 = mutation.createForm(_, { title: 'Form 1', questions: [] })
      const form2 = mutation.createForm(_, { title: 'Form 2', questions: [] })

      mutation.submitResponse(_, { formId: form1.id, answers: [] })

      const responses = query.responses(_, { formId: form2.id })
      expect(responses.every(r => r.formId === form2.id)).toBe(true)
    })
  })
})