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
const isLoading = computed(() => moviesStore.isLoading && moviesStore.popularMovies.length === 0) // Só mostra loading se não tem filmes
const isLoadingMore = ref(false) // Loading para infinite scroll
const movies = computed(() => moviesStore.popularMovies) // Mostrar TODOS os filmes
const error = computed(() => moviesStore.error)
const hasMoreData = computed(() => {
  // TMDB tem até 500 páginas, cada uma com 20 filmes
  const maxMovies = 500 * 20
  return moviesStore.popularMovies.length < maxMovies
})

// Actions
const toggleFavorite = async (movie: any) => {
  await favoritesStore.toggleFavorite(movie)
}

const forceReload = async () => {
  await moviesStore.fetchPopularMovies(1, true) // forceRefresh = true
}

// Infinite scroll handler
const handleLoadMore = async () => {
  // Prevent multiple loads
  if (isLoadingMore.value) return
  
  isLoadingMore.value = true
  
  try {
    await moviesStore.loadMorePopularMovies()
  } catch (error) {
    console.error('Erro ao carregar mais filmes:', error)
  } finally {
    // Small delay to show loading state
    setTimeout(() => {
      isLoadingMore.value = false
    }, 500)
  }
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
    
    <!-- 🧪 TESTE: Botão para testar loading -->
    <div class="mb-3">
      <button @click="forceReload" class="btn btn-outline-primary btn-sm">
        🔄 Testar Loading
      </button>
    </div>
    
    <!-- Loading, Error, or Movies Grid -->
    <MovieGrid
      :movies="movies"
      :loading="isLoading"
      :is-loading-more="isLoadingMore"
      :error="error"
      :columns="{ xs: 1, sm: 2, md: 3, lg: 4 }"
      card-variant="default"
      card-image-size="md"
      :show-favorites="true"
      :show-rating="true"
      :show-overview="true"
      :infinite-scroll="true"
      :has-more-data="hasMoreData"
      empty-state-title="Nenhum filme popular encontrado"
      empty-state-message="Não conseguimos carregar os filmes populares no momento."
      empty-state-icon="bi-film"
      @movie-click="$router.push(`/item/${$event.id}`)"
      @favorite-toggle="toggleFavorite"
      @retry-load="handleErrorRetry"
      @load-more="handleLoadMore"
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