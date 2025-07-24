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

// Initialize stores
onMounted(() => {
  favoritesStore.initializeFavorites()
})

// Fetch data usando a store
const { data: popularMovies, pending, error } = await useLazyAsyncData('popular-movies', async () => {
  return await moviesStore.fetchPopularMovies(1)
})

// Computed properties
const isLoading = computed(() => moviesStore.isLoading)
const movies = computed(() => moviesStore.popularMovies.slice(0, 8))

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

// Toggle favorite
const toggleFavorite = async (movie: any) => {
  await favoritesStore.toggleFavorite(movie)
}
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Movie Portal - Teste TMDB API</h1>
    
    <!-- Loading State -->
    <div v-if="isLoading" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error || moviesStore.error" class="alert alert-danger">
      <h4>Erro ao carregar filmes:</h4>
      <p>{{ error?.message || moviesStore.error }}</p>
    </div>

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