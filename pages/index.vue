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

// Actions
const toggleFavorite = async (movie: any) => {
  await favoritesStore.toggleFavorite(movie)
}

const forceReload = async () => {
  await moviesStore.fetchPopularMovies(1, true)
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
    
    <!-- Loading, Error, or Movies Grid -->
    <MovieGrid
      :movies="movies"
      :loading="isLoading"
      :error="error"
      :columns="{ xs: 1, sm: 2, md: 3, lg: 4 }"
      card-variant="default"
      card-image-size="md"
      :show-favorites="true"
      :show-rating="true"
      :show-overview="true"
      empty-state-title="Nenhum filme popular encontrado"
      empty-state-message="Não conseguimos carregar os filmes populares no momento."
      empty-state-icon="bi-film"
      @movie-click="$router.push(`/item/${$event.id}`)"
      @favorite-toggle="toggleFavorite"
      @retry-load="handleErrorRetry"
    />
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