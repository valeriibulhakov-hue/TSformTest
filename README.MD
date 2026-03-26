# TS_test_Forms

A simplified Google Forms clone built as a monorepo with React, Redux Toolkit, TypeScript on the frontend and a GraphQL API on the backend.

## Tech Stack

**Frontend**
- React 19 + TypeScript
- Redux Toolkit + RTK Query
- GraphQL code generation (`graphql-codegen`)
- React Router v7
- Tailwind CSS v4
- Vite 8

**Backend**
- Node.js + TypeScript
- GraphQL Yoga
- In-memory data store (no database)

## Project Structure

```
TS_test_Forms/
├── apps/
│   ├── client/          # React frontend
│   └── server/          # GraphQL backend
├── packages/
│   └── shared/          # Shared TypeScript types
├── package.json         # Root — workspace scripts
└── tsconfig.base.json
```

## Prerequisites

- Node.js **v22+**
- npm **v10+**

## Setup

### 1. Clone the repository

```bash
git clone <repo-url>
cd TS_test_Forms
```

### 2. Install dependencies

Install all workspace dependencies from the root:

```bash
npm install
```

## Running the project

### Run both client and server simultaneously

```bash
npm run dev
```

This starts:
- **Server** on `http://localhost:4000/graphql`
- **Client** on `http://localhost:5173`

### Run separately

```bash
# Server only
npm run dev:server

# Client only
npm run dev:client
```

## Available routes

| Route | Description |
|-------|-------------|
| `/` | Homepage — list of all forms |
| `/forms/new` | Form Builder — create a new form |
| `/forms/:id/fill` | Form Filler — fill out a form |
| `/forms/:id/responses` | Form Responses — view submitted responses |

## GraphQL API

The GraphQL playground is available at `http://localhost:4000/graphql`.

### Queries

```graphql
# Get all forms
query {
  forms {
    id
    title
    description
    questions { id title type options }
  }
}

# Get a single form
query {
  form(id: "form-id") {
    id title description
    questions { id title type options }
  }
}

# Get responses for a form
query {
  responses(formId: "form-id") {
    id formId
    answers { questionId value }
  }
}
```

### Mutations

```graphql
# Create a form
mutation {
  createForm(
    title: "My Form"
    description: "Optional description"
    questions: [
      { title: "What is your name?", type: TEXT }
      { title: "Your rating?", type: MULTIPLE_CHOICE, options: ["1", "2", "3"] }
    ]
  ) {
    id title
  }
}

# Submit a response
mutation {
  submitResponse(
    formId: "form-id"
    answers: [
      { questionId: "q-id", value: "John" }
    ]
  ) {
    id
  }
}

# Delete a form
mutation {
  deleteForm(id: "form-id")
}
```

### Question types

| Type | Description |
|------|-------------|
| `TEXT` | Free text input |
| `MULTIPLE_CHOICE` | Single choice from options (radio) |
| `CHECKBOX` | Multiple choice from options |
| `DATE` | Date picker |

## Code generation

RTK Query hooks are generated from the GraphQL schema. To regenerate after schema changes:

1. Make sure the server is running on port 4000
2. Run from `apps/client`:

```bash
npm run codegen
```

This updates `src/api/generated.ts` with typed hooks and TypeScript types.

## Testing

### Run all tests

```bash
# From the root — runs client and server tests sequentially
npm test
```

### Run separately

```bash
# Client tests only
npm test --workspace=client

# Server tests only
npm test --workspace=server
```

### Test structure

```
apps/
├── client/
│   └── src/
│       └── _lib/
│           └── __tests__/
│               └── validation.test.ts   # Unit tests — validation logic
└── server/
    └── src/
        ├── __mocks__/
        │   └── uuid.ts                  # uuid mock for deterministic ids
        └── __tests__/
            └── resolvers.test.ts        # Integration tests — GraphQL resolvers
```

### Client — unit tests (`apps/client`)

**File:** `src/_lib/__tests__/validation.test.ts`

**Type:** Unit tests

**What is tested:** Pure validation functions from `src/_lib/validation.ts` — no React, no network, no side effects.

| Test group | What is covered |
|------------|-----------------|
| `validateFormBuilder › title` | Requires non-empty title, rejects whitespace-only |
| `validateFormBuilder › questions` | Requires at least one question, requires question title |
| `validateFormBuilder › options` | Requires 2+ options for `MULTIPLE_CHOICE` and `CHECKBOX`, rejects duplicate options (case-insensitive) |
| `isBuilderValid` | Returns `true` only when all builder rules pass |
| `validateFormFiller › TEXT` | Requires non-empty answer, rejects whitespace |
| `validateFormFiller › DATE` | Requires a date, rejects invalid format, rejects years outside 1900–2100 |
| `validateFormFiller › CHECKBOX` | Requires at least one option selected |
| `validateFormFiller › MULTIPLE_CHOICE` | Requires a selection |
| `validateFormFiller › multiple questions` | Validates all questions independently, passes when all answered |
| `isFillerValid` | Returns `true` only when all filler answers are valid |

### Server — integration tests (`apps/server`)

**File:** `src/__tests__/resolvers.test.ts`

**Type:** Integration tests

**What is tested:** GraphQL resolvers end-to-end — from resolver call through service and repository to in-memory store. Tests use a real `FormService` and `ResponseService` with real repositories. The `uuid` package is replaced with a deterministic mock (`src/__mocks__/uuid.ts`) to avoid ESM compatibility issues and produce predictable ids.

| Test group | What is covered |
|------------|-----------------|
| `createForm` | Creates form with id, stores title and description, assigns unique ids to questions |
| `createForm` (edge case) | Creates form without description |
| `forms query` | Returns all previously created forms |
| `form query` | Returns a single form by id, returns `undefined` for unknown id |
| `deleteForm` | Deletes existing form and returns `true`, returns `false` for unknown id, form is no longer accessible after deletion |
| `submitResponse` | Creates response with id and formId, stores all answers correctly |
| `submitResponse` (multiple answers) | Stores multiple answers in a single response |
| `responses query` | Returns responses for the correct form only, does not leak responses from other forms |

## Notes

- Data is stored **in-memory** on the server — all forms and responses reset on server restart
- No authentication is required
- CORS is handled by GraphQL Yoga defaults