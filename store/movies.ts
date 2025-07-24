import { defineStore } from 'pinia'
import type { Movie, MovieDetails, TMDBResponse } from '~/composables/useTmdb'

// Types específicas da store
interface MoviesState {
  // Cache de filmes
  popularMovies: Movie[]
  nowPlayingMovies: Movie[]
  movieDetails: Record<number, MovieDetails>
  searchResults: Movie[]
  
  // Estados de loading
  isLoadingPopular: boolean
  isLoadingNowPlaying: boolean
  isLoadingDetails: boolean
  isSearching: boolean
  
  // Metadata
  popularPage: number
  nowPlayingPage: number
  searchPage: number
  searchQuery: string
  
  // Errors
  error: string | null
}

export const useMoviesStore = defineStore('movies', {
  // 🏗️ STATE - Single Source of Truth
  state: (): MoviesState => ({
    // Cache arrays
    popularMovies: [],
    nowPlayingMovies: [],
    movieDetails: {},
    searchResults: [],
    
    // Loading states
    isLoadingPopular: false,
    isLoadingNowPlaying: false,
    isLoadingDetails: false,
    isSearching: false,
    
    // Pagination
    popularPage: 0,
    nowPlayingPage: 0,
    searchPage: 0,
    searchQuery: '',
    
    // Error handling
    error: null
  }),

  // 🧮 GETTERS - Computed Properties
  getters: {
    // Verifica se os filmes populares estão carregados
    hasPopularMovies: (state): boolean => state.popularMovies.length > 0,
    
    // Verifica se os filmes em cartaz estão carregados
    hasNowPlayingMovies: (state): boolean => state.nowPlayingMovies.length > 0,
    
    // Pega detalhes de um filme específico
    getMovieById: (state) => (id: number): MovieDetails | undefined => {
      return state.movieDetails[id]
    },
    
    // Verifica se um filme está carregado
    isMovieLoaded: (state) => (id: number): boolean => {
      return !!state.movieDetails[id]
    },
    
    // Filmes populares paginados
    popularMoviesPaginated: (state) => (page: number): Movie[] => {
      const startIndex = (page - 1) * 20
      const endIndex = startIndex + 20
      return state.popularMovies.slice(startIndex, endIndex)
    },
    
    // Estado geral de loading
    isLoading: (state): boolean => {
      return state.isLoadingPopular || 
             state.isLoadingNowPlaying || 
             state.isLoadingDetails || 
             state.isSearching
    }
  },

  // 🎬 ACTIONS - Business Logic
  actions: {
    // 🚀 Buscar filmes populares
    async fetchPopularMovies(page: number = 1, forceRefresh: boolean = false) {
      // Evita requisições desnecessárias
      if (!forceRefresh && this.popularPage >= page && this.hasPopularMovies) {
        return this.popularMoviesPaginated(page)
      }

      this.isLoadingPopular = true
      this.error = null

      try {
        const { getPopularMovies } = useTmdb()
        const response: TMDBResponse<Movie> = await getPopularMovies(page)
        
        // Se é a primeira página, substitui. Senão, adiciona
        if (page === 1) {
          this.popularMovies = response.results
        } else {
          // Evita duplicatas
          const newMovies = response.results.filter(
            movie => !this.popularMovies.some(existing => existing.id === movie.id)
          )
          this.popularMovies.push(...newMovies)
        }
        
        this.popularPage = Math.max(this.popularPage, page)
        return response.results
        
      } catch (error: any) {
        this.error = `Erro ao buscar filmes populares: ${error.message}`
        console.error('Error fetching popular movies:', error)
        throw error
      } finally {
        this.isLoadingPopular = false
      }
    },

    // 🎭 Buscar filmes em cartaz
    async fetchNowPlayingMovies(page: number = 1, forceRefresh: boolean = false) {
      if (!forceRefresh && this.nowPlayingPage >= page && this.hasNowPlayingMovies) {
        return this.nowPlayingMovies
      }

      this.isLoadingNowPlaying = true
      this.error = null

      try {
        const { getNowPlayingMovies } = useTmdb()
        const response: TMDBResponse<Movie> = await getNowPlayingMovies(page)
        
        if (page === 1) {
          this.nowPlayingMovies = response.results
        } else {
          const newMovies = response.results.filter(
            movie => !this.nowPlayingMovies.some(existing => existing.id === movie.id)
          )
          this.nowPlayingMovies.push(...newMovies)
        }
        
        this.nowPlayingPage = Math.max(this.nowPlayingPage, page)
        return response.results
        
      } catch (error: any) {
        this.error = `Erro ao buscar filmes em cartaz: ${error.message}`
        console.error('Error fetching now playing movies:', error)
        throw error
      } finally {
        this.isLoadingNowPlaying = false
      }
    },

    // 🔍 Buscar detalhes de um filme
    async fetchMovieDetails(movieId: number, forceRefresh: boolean = false) {
      // Cache hit - retorna se já temos os dados
      if (!forceRefresh && this.isMovieLoaded(movieId)) {
        return this.movieDetails[movieId]
      }

      this.isLoadingDetails = true
      this.error = null

      try {
        const { getMovieDetails } = useTmdb()
        const movieDetails: MovieDetails = await getMovieDetails(movieId)
        
        // Cache the result
        this.movieDetails[movieId] = movieDetails
        
        return movieDetails
        
      } catch (error: any) {
        this.error = `Erro ao buscar detalhes do filme: ${error.message}`
        console.error('Error fetching movie details:', error)
        throw error
      } finally {
        this.isLoadingDetails = false
      }
    },

    // 🔎 Buscar filmes por termo
    async searchMovies(query: string, page: number = 1) {
      // Se é uma nova busca, limpa os resultados
      if (query !== this.searchQuery) {
        this.searchResults = []
        this.searchPage = 0
      }

      this.isSearching = true
      this.error = null
      this.searchQuery = query

      try {
        const { searchMovies } = useTmdb()
        const response: TMDBResponse<Movie> = await searchMovies(query, page)
        
        if (page === 1) {
          this.searchResults = response.results
        } else {
          const newMovies = response.results.filter(
            movie => !this.searchResults.some(existing => existing.id === movie.id)
          )
          this.searchResults.push(...newMovies)
        }
        
        this.searchPage = Math.max(this.searchPage, page)
        return response.results
        
      } catch (error: any) {
        this.error = `Erro na busca: ${error.message}`
        console.error('Error searching movies:', error)
        throw error
      } finally {
        this.isSearching = false
      }
    },

    // 🧹 Limpar busca
    clearSearch() {
      this.searchResults = []
      this.searchQuery = ''
      this.searchPage = 0
    },

    // 🔄 Reset da store
    resetStore() {
      this.$reset()
    },

    // 🗑️ Limpar erros
    clearError() {
      this.error = null
    }
  }
})