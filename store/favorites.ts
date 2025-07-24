import { defineStore } from 'pinia'
import type { Movie } from '~/composables/useTmdb'
import { useMoviesStore } from './movies'

// Types específicas da store de favoritos
interface FavoritesState {
  favoriteIds: number[]
  favoriteMovies: Movie[]
  isLoading: boolean
  error: string | null
}

export const useFavoritesStore = defineStore('favorites', {
  // 🏗️ STATE - Lista de favoritos
  state: (): FavoritesState => ({
    favoriteIds: [],
    favoriteMovies: [],
    isLoading: false,
    error: null
  }),

  // 🧮 GETTERS - Computed Properties
  getters: {
    // Número total de favoritos
    favoritesCount: (state): number => state.favoriteIds.length,

    // Verifica se tem favoritos
    hasFavorites: (state): boolean => state.favoriteIds.length > 0,

    // Verifica se um filme é favorito
    isFavorite: (state) => (movieId: number): boolean => {
      return state.favoriteIds.includes(movieId)
    },

    // Lista de IDs como string (para localStorage)
    favoritesAsString: (state): string => {
      return JSON.stringify(state.favoriteIds)
    },

    // Favoritos ordenados por data de adição (mais recente primeiro)
    favoritesSorted: (state): Movie[] => {
      return [...state.favoriteMovies].reverse()
    }
  },

  // 🎬 ACTIONS - Business Logic
  actions: {
    // 💾 Inicializar favoritos do localStorage
    initializeFavorites() {
      if (import.meta.client) {
        try {
          const stored = localStorage.getItem('movie-favorites')
          if (stored) {
            this.favoriteIds = JSON.parse(stored)
          }
        } catch (error) {
          console.error('Error loading favorites from localStorage:', error)
          this.favoriteIds = []
        }
      }
    },

    // 💾 Salvar no localStorage
    persistFavorites() {
      if (import.meta.client) {
        try {
          localStorage.setItem('movie-favorites', this.favoritesAsString)
        } catch (error) {
          console.error('Error saving favorites to localStorage:', error)
          this.error = 'Erro ao salvar favoritos'
        }
      }
    },

    // ❤️ Adicionar aos favoritos
    async addToFavorites(movie: Movie) {
      // Evita duplicatas
      if (this.isFavorite(movie.id)) {
        return
      }

      try {
        // Adiciona ID
        this.favoriteIds.push(movie.id)

        // Adiciona movie completo
        this.favoriteMovies.push(movie)

        // Persiste
        this.persistFavorites()

        this.error = null

      } catch (error: any) {
        this.error = `Erro ao adicionar favorito: ${error.message}`
        console.error('Error adding to favorites:', error)

        // Reverte mudanças em caso de erro
        this.favoriteIds = this.favoriteIds.filter(id => id !== movie.id)
        this.favoriteMovies = this.favoriteMovies.filter(m => m.id !== movie.id)
      }
    },

    // 💔 Remover dos favoritos
    async removeFromFavorites(movieId: number) {
      if (!this.isFavorite(movieId)) {
        return
      }

      try {
        // Remove ID
        this.favoriteIds = this.favoriteIds.filter(id => id !== movieId)

        // Remove movie
        this.favoriteMovies = this.favoriteMovies.filter(movie => movie.id !== movieId)

        // Persiste
        this.persistFavorites()

        this.error = null

      } catch (error: any) {
        this.error = `Erro ao remover favorito: ${error.message}`
        console.error('Error removing from favorites:', error)
      }
    },

    // 🔄 Toggle favorito
    async toggleFavorite(movie: Movie) {
      if (this.isFavorite(movie.id)) {
        await this.removeFromFavorites(movie.id)
      } else {
        await this.addToFavorites(movie)
      }
    },

    // 📚 Carregar detalhes dos filmes favoritos
    async loadFavoriteMoviesDetails() {
      if (this.favoriteIds.length === 0) {
        return
      }

      this.isLoading = true
      this.error = null

      try {
        const moviesStore = useMoviesStore()
        const favoriteMovies: Movie[] = []

        // Para cada ID, busca os detalhes
        for (const movieId of this.favoriteIds) {
          try {
            // Tenta usar cache primeiro
            let movie = moviesStore.getMovieById(movieId)

            // Se não tem no cache, busca na API
            if (!movie) {
              movie = await moviesStore.fetchMovieDetails(movieId)
            }

            if (movie) {
              favoriteMovies.push(movie as Movie)
            }
          } catch (error) {
            console.warn(`Could not load details for movie ${movieId}:`, error)
          }
        }

        this.favoriteMovies = favoriteMovies

      } catch (error: any) {
        this.error = `Erro ao carregar favoritos: ${error.message}`
        console.error('Error loading favorite movies:', error)
      } finally {
        this.isLoading = false
      }
    },

    // 🧹 Limpar todos os favoritos
    clearAllFavorites() {
      this.favoriteIds = []
      this.favoriteMovies = []
      this.persistFavorites()
    },

    // 🗑️ Limpar erros
    clearError() {
      this.error = null
    },

    // 📊 Exportar favoritos (para backup)
    exportFavorites(): { ids: number[], movies: Movie[], exportDate: string } {
      return {
        ids: [...this.favoriteIds],
        movies: [...this.favoriteMovies],
        exportDate: new Date().toISOString()
      }
    },

    // 📥 Importar favoritos (de backup)
    async importFavorites(backup: { ids: number[], movies: Movie[] }) {
      try {
        this.favoriteIds = [...backup.ids]
        this.favoriteMovies = [...backup.movies]
        this.persistFavorites()
        this.error = null
      } catch (error: any) {
        this.error = `Erro ao importar favoritos: ${error.message}`
        throw error
      }
    }
  }
})