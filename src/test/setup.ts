import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { afterAll, afterEach, beforeAll } from 'vitest'

// Clean up after each test
afterEach(() => {
  cleanup()
})

// Default handlers for local Next.js API routes
// These prevent ECONNREFUSED errors in tests that trigger token refresh or logout
const localApiHandlers = [
  http.post('http://localhost:3000/api/auth/set-tokens', () => {
    return HttpResponse.json({ success: true })
  }),
  http.post('http://localhost:3000/api/auth/refresh', () => {
    return HttpResponse.json({ success: true })
  }),
  http.post('http://localhost:3000/api/auth/logout', () => {
    return HttpResponse.json({ success: true })
  }),
]

// MSW Server setup for API mocking
export const server = setupServer(...localApiHandlers)

beforeAll(() => {
  server.listen({ onUnhandledRequest: 'warn' })
})

afterEach(() => {
  server.resetHandlers()
})

afterAll(() => {
  server.close()
})
