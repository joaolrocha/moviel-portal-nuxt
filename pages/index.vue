<script setup lang="ts">
import { useFavoritesStore } from '~/store/favorites'
import { useMoviesStore } from '~/store/movies'

// Stores
const moviesStore = useMoviesStore()
const favoritesStore = useFavoritesStore()

// Meta tags
useHead({
  title: 'Movie Portal - Filmes Populares',
  meta: [
    { name: 'description', content: 'Descubra os filmes mais populares do momento' }
  ]
})

// Initialize stores and fetch data
onMounted(async () => {
  favoritesStore.initializeFavorites()
  // Fetch movies only if not already loaded (smart cache)
  if (!moviesStore.hasPopularMovies) {
    await moviesStore.fetchPopularMovies(1)
  }
})

// Computed properties - single source of truth from store
const isLoading = computed(() => moviesStore.isLoading)
const movies = computed(() => moviesStore.popularMovies.slice(0, 8))
const error = computed(() => moviesStore.error)

// Helper functions
const { getImageUrl } = useTmdb()

const formatDate = (dateString: string): string => {
  if (!dateString) return 'Data não disponível'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

// Actions
const toggleFavorite = async (movie: any) => {
  await favoritesStore.toggleFavorite(movie)
}


const forceReload = async () => {
  await moviesStore.fetchPopularMovies(1, true) // forceRefresh = true
}

// Error handling
const handleErrorRetry = async () => {
  moviesStore.clearError()
  await forceReload()
}
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Movie Portal - Filmes Populares</h1>
    
    <!-- Loading State -->
    <LoadingSpinner 
      v-if="isLoading" 
      size="lg" 
      text="Carregando filmes populares..." 
      :full-height="false"
    />

    <!-- Error State -->
    <ErrorAlert
      v-else-if="error"
      title="Erro ao carregar filmes"
      :message="error"
      variant="danger"
      :dismissible="true"
      :retry-action="handleErrorRetry"
      retry-text="Recarregar filmes"
      @dismiss="moviesStore.clearError"
    />

    <!-- Success State -->
    <div v-else-if="movies.length > 0">
      <div class="row mb-4">
        <div class="col">
          <h2>Filmes Populares</h2>
          <p class="text-muted">{{ movies.length }} filmes carregados</p>
        </div>
      </div>

      <div class="row">
        <div v-for="movie in movies" :key="movie.id" class="col-md-3 col-sm-6 mb-4">
          <div class="card h-100">
            <img 
              :src="getImageUrl(movie.poster_path)" 
              :alt="movie.title"
              class="card-img-top"
              style="height: 300px; object-fit: cover;"
            >
            <div class="card-body d-flex flex-column">
              <h6 class="card-title">{{ movie.title }}</h6>
              <p class="card-text text-muted small flex-grow-1">
                {{ movie.overview.substring(0, 100) }}...
              </p>
              <div class="mt-auto">
                <div class="d-flex justify-content-between align-items-center mb-2">
                  <small class="text-muted">{{ formatDate(movie.release_date) }}</small>
                  <span class="badge bg-warning text-dark">
                    <i class="bi bi-star-fill"></i> {{ movie.vote_average.toFixed(1) }}
                  </span>
                </div>
                <!-- Botão de favorito -->
                <button 
                  @click="toggleFavorite(movie)"
                  class="btn btn-sm w-100"
                  :class="favoritesStore.isFavorite(movie.id) ? 'btn-danger' : 'btn-outline-danger'"
                >
                  <i :class="favoritesStore.isFavorite(movie.id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
                  {{ favoritesStore.isFavorite(movie.id) ? 'Remover' : 'Favoritar' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-5">
      <h3 class="text-muted">Nenhum filme encontrado</h3>
      <p class="text-muted">Tente recarregar a página</p>
    </div>
  </div>
</template>

<style scoped>
.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}
</style>