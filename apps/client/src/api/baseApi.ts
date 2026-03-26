import { createApi } from '@reduxjs/toolkit/query/react'

type GraphQLArgs = {
  document: { toString(): string }
  variables?: Record<string, unknown> | void
}

const graphqlBaseQuery = (baseUrl: string) =>
  async ({ document, variables }: GraphQLArgs) => {
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: document.toString(),
          variables: variables ?? undefined,
        }),
      })
      const json = await response.json()
      if (json.errors) return { error: json.errors }
      return { data: json.data }
    } catch (error) {
      return { error }
    }
  }

export const api = createApi({
  reducerPath: 'api',
  baseQuery: graphqlBaseQuery('http://localhost:4000/graphql'),
  tagTypes: ['Form', 'Response'],
  endpoints: () => ({}),
})