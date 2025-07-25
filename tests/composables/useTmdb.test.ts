// tests/composables/useTmdb.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock do useRuntimeConfig
const mockUseRuntimeConfig = vi.fn(() => ({
  public: {
    tmdbApiKey: 'test-api-key',
    tmdbBaseUrl: 'https://api.themoviedb.org/3',
    tmdbImageUrl: 'https://image.tmdb.org/t/p'
  }
}))

// Mock do $fetch
const mockFetch = vi.fn()

// Mock global
vi.stubGlobal('useRuntimeConfig', mockUseRuntimeConfig)
vi.stubGlobal('$fetch', mockFetch)

// Importar o composable
import { useTmdb } from '~/composables/useTmdb'

describe('useTmdb', () => {
  let tmdb: ReturnType<typeof useTmdb>

  beforeEach(() => {
    vi.clearAllMocks()
    tmdb = useTmdb() // Agora o mock vai ser chamado
  })

  describe('getImageUrl', () => {
    it('deve retornar URL completa da imagem', () => {
      const result = tmdb.getImageUrl('/test.jpg', 'w500')
      expect(result).toBe('https://image.tmdb.org/t/p/w500/test.jpg')
    })

    it('deve usar tamanho padrão w500', () => {
      const result = tmdb.getImageUrl('/test.jpg')
      expect(result).toBe('https://image.tmdb.org/t/p/w500/test.jpg')
    })

    it('deve retornar placeholder quando path é null', () => {
      const result = tmdb.getImageUrl(null)
      expect(result).toBe('/placeholder-movie.jpg')
    })

    it('deve adicionar barra no início se não tiver', () => {
      const result = tmdb.getImageUrl('test.jpg')
      expect(result).toBe('https://image.tmdb.org/t/p/w500/test.jpg')
    })
  })

  describe('getPopularMovies', () => {
    it('deve chamar API com parâmetros corretos', async () => {
      const mockResponse = {
        page: 1,
        results: [{ id: 1, title: 'Test Movie' }],
        total_pages: 100,
        total_results: 2000
      }

      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await tmdb.getPopularMovies()

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/popular?api_key=test-api-key&language=pt-BR&page=1'
      )
      expect(result).toEqual(mockResponse)
    })

    it('deve aceitar número da página customizado', async () => {
      const mockResponse = { page: 2, results: [] }
      mockFetch.mockResolvedValueOnce(mockResponse)

      await tmdb.getPopularMovies(2)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/popular?api_key=test-api-key&language=pt-BR&page=2'
      )
    })
  })

  describe('getMovieDetails', () => {
    it('deve buscar detalhes de um filme específico', async () => {
      const mockMovie = {
        id: 550,
        title: 'Fight Club',
        runtime: 139,
        genres: [{ id: 18, name: 'Drama' }]
      }

      mockFetch.mockResolvedValueOnce(mockMovie)

      const result = await tmdb.getMovieDetails(550)

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/movie/550?api_key=test-api-key&language=pt-BR'
      )
      expect(result).toEqual(mockMovie)
    })
  })

  describe('searchMovies', () => {
    it('deve buscar filmes por termo', async () => {
      const mockResponse = {
        page: 1,
        results: [{ id: 1, title: 'Fight Club' }]
      }

      mockFetch.mockResolvedValueOnce(mockResponse)

      const result = await tmdb.searchMovies('fight club')

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/search/movie?api_key=test-api-key&language=pt-BR&query=fight+club&page=1'
      )
      expect(result).toEqual(mockResponse)
    })
  })
})