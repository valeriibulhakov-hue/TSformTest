import { useMemo } from 'react'

export interface Answer {
  questionId: string
  value: string
}

export interface Response {
  id: string
  formId: string
  answers: Answer[]
}

export interface Question {
  id: string
  title: string
  type: string
}

export function useFormResponses(responses: Response[], questions: Question[]) {
  const questionMap = useMemo(
    () => Object.fromEntries(questions.map(q => [q.id, q])),
    [questions]
  )

  const stats = useMemo(() => ({
    total: responses.length,
    questionCount: questions.length,
    completionRate: responses.length === 0 ? 0 : Math.round(
      (responses.reduce((sum, r) => sum + r.answers.length, 0) /
        (responses.length * questions.length)) * 100
    ),
  }), [responses, questions])

  const getAnswerForQuestion = (response: Response, questionId: string) =>
    response.answers.find(a => a.questionId === questionId)?.value ?? null

  return { questionMap, stats, getAnswerForQuestion }
}