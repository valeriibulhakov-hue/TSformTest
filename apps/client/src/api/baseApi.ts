import { createApi, type BaseQueryFn } from '@reduxjs/toolkit/query/react'

type GraphQLArgs = {
  document: { toString(): string }
  variables?: Record<string, unknown> | void
}

const graphqlBaseQuery = (
  baseUrl: string,
): BaseQueryFn<GraphQLArgs, unknown, unknown> =>
  async ({ document, variables }) => {
    try {
      const response = await fetch(baseUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: document.toString(),
          variables: variables ?? undefined,
        }),
      })
      const json = await response.json() as { data?: unknown; errors?: unknown }
      if (json.errors) return { error: json.errors }
      return { data: json.data }
    } catch (error) {
      return { error }
    }
  }

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000/graphql'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: graphqlBaseQuery(API_URL),
  tagTypes: ['Form', 'Response'],
  endpoints: () => ({}),
})