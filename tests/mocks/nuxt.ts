// tests/mocks/nuxt.ts
import { vi } from 'vitest'

// Mock useRuntimeConfig
export const useRuntimeConfig = vi.fn(() => ({
  public: {
    tmdbApiKey: 'test-api-key',
    tmdbBaseUrl: 'https://api.themoviedb.org/3',
    tmdbImageUrl: 'https://image.tmdb.org/t/p'
  }
}))

// Mock useRouter
export const useRouter = vi.fn(() => ({
  push: vi.fn(),
  back: vi.fn(),
  go: vi.fn(),
  replace: vi.fn()
}))

// Mock useRoute
export const useRoute = vi.fn(() => ({
  path: '/',
  params: {},
  query: {},
  fullPath: '/',
  hash: '',
  name: 'index'
}))

// Mock navigateTo
export const navigateTo = vi.fn()

// Mock nextTick
export const nextTick = vi.fn(() => Promise.resolve())

// Mock useFetch
export const useFetch = vi.fn()

// Mock useState
export const useState = vi.fn()

// Mock useHead
export const useHead = vi.fn()