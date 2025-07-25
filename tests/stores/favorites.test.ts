// tests/stores/favorites.ultra-simple.test.ts
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'

// Mock ALL dependencies before importing anything
vi.mock('~/store/auth', () => ({
  useAuthStore: () => ({ isLoggedIn: true })
}))

vi.mock('~/store/movies', () => ({
  useMoviesStore: () => ({
    getMovieById: vi.fn(),
    fetchMovieDetails: vi.fn()
  })
}))

vi.stubGlobal('useRouter', () => ({ push: vi.fn() }))
vi.stubGlobal('useRoute', () => ({ fullPath: '/test' }))

// Simple localStorage mock
const localStorageMock = {
  getItem: vi.fn(() => null),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

import { useFavoritesStore } from '~/store/favorites'

describe('Favorites Store', () => {
  let store: any

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useFavoritesStore()
    vi.clearAllMocks()
  })

  it('deve ter estado inicial correto', () => {
    expect(store.favoriteIds).toEqual([])
    expect(store.favoriteMovies).toEqual([])
  })

  it('deve calcular favoritesCount corretamente', () => {
    expect(store.favoritesCount).toBe(0)
    
    store.favoriteIds = [1, 2]
    expect(store.favoritesCount).toBe(2)
  })

  it('deve verificar isFavorite corretamente', () => {
    store.favoriteIds = [1, 2, 3]
    
    expect(store.isFavorite(2)).toBe(true)
    expect(store.isFavorite(5)).toBe(false)
  })

  it('deve limpar favoritos', () => {
    store.favoriteIds = [1, 2, 3]
    store.favoriteMovies = [{ id: 1 }]
    
    store.clearAllFavorites()
    
    expect(store.favoriteIds).toEqual([])
    expect(store.favoriteMovies).toEqual([])
  })
})