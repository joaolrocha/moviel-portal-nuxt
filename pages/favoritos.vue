<script setup lang="ts">
import { useAuthStore } from '~/store/auth'
import { useFavoritesStore } from '~/store/favorites'

// Apply auth middleware
definePageMeta({
  middleware: 'auth'
})

// Stores
const favoritesStore = useFavoritesStore()
const authStore = useAuthStore()

// SEO
useHead({
  title: 'Meus Favoritos - Movie Portal',
  meta: [
    { name: 'description', content: 'Seus filmes favoritos salvos no Movie Portal' }
  ]
})

// Computed properties
const favoriteMovies = computed(() => favoritesStore.favoritesSorted)
const hasNoFavorites = computed(() => !favoritesStore.hasFavorites)
const isLoading = computed(() => favoritesStore.isLoading)
const currentUser = computed(() => authStore.currentUser)

// Actions
const toggleFavorite = async (movie: any) => {
  await favoritesStore.toggleFavorite(movie)
}

const handleMovieClick = (movie: any) => {
  navigateTo(`/item/${movie.id}`)
}

// Initialize
onMounted(async () => {
  favoritesStore.initializeFavorites()
  
  if (favoritesStore.hasFavorites) {
    await favoritesStore.loadFavoriteMoviesDetails()
  }
})
</script>

<template>
  <div class="favorites-page">
    <div class="container mt-4">
      <!-- Header -->
      <div class="row mb-4">
        <div class="col">
          <div class="d-flex align-items-center justify-content-between">
            <div>
              <h1 class="display-5 fw-bold mb-2">
                <i class="bi bi-heart-fill text-danger me-3"></i>
                Meus Favoritos
              </h1>
              <p class="text-muted">
                Olá, <strong>{{ currentUser?.name }}</strong>! 
                Aqui estão seus filmes favoritos.
              </p>
            </div>
            <div class="text-end">
              <span class="badge bg-primary fs-6 px-3 py-2">
                {{ favoritesStore.favoritesCount }} 
                {{ favoritesStore.favoritesCount === 1 ? 'filme' : 'filmes' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <LoadingSpinner 
        v-if="isLoading"
        size="lg"
        text="Carregando seus favoritos..."
        :centered="true"
      />

      <!-- Empty State -->
      <div v-else-if="hasNoFavorites" class="empty-favorites">
        <div class="text-center py-5">
          <div class="mb-4">
            <i class="bi bi-heart display-1 text-muted"></i>
          </div>
          <h3 class="fw-bold mb-3">Nenhum favorito ainda</h3>
          <p class="text-muted mb-4 lead">
            Que tal explorar alguns filmes e adicionar aos seus favoritos?
          </p>
          <NuxtLink to="/" class="btn btn-primary btn-lg">
            <i class="bi bi-film me-2"></i>
            Descobrir Filmes
          </NuxtLink>
        </div>
      </div>

      <!-- Favorites Grid -->
      <div v-else>
        <MovieGrid
          :movies="favoriteMovies"
          :loading="false"
          :error="null"
          :columns="{ xs: 1, sm: 2, md: 3, lg: 4 }"
          card-variant="default"
          card-image-size="md"
          :show-favorites="true"
          :show-rating="true"
          :show-overview="true"
          empty-state-title="Erro ao carregar favoritos"
          empty-state-message="Não foi possível carregar seus filmes favoritos."
          empty-state-icon="bi-exclamation-triangle"
          @movie-click="handleMovieClick"
          @favorite-toggle="toggleFavorite"
        />

        <!-- Quick actions -->
        <div class="row mt-5">
          <div class="col text-center">
            <div class="p-4 bg-light rounded">
              <h5 class="fw-bold mb-3">Gostou dos seus favoritos?</h5>
              <div class="d-flex gap-3 justify-content-center flex-wrap">
                <NuxtLink to="/" class="btn btn-outline-primary">
                  <i class="bi bi-plus-circle me-2"></i>
                  Adicionar mais filmes
                </NuxtLink>
                <button 
                  @click="favoritesStore.clearAllFavorites"
                  class="btn btn-outline-danger"
                  v-if="favoritesStore.hasFavorites"
                >
                  <i class="bi bi-trash me-2"></i>
                  Limpar favoritos
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
.favorites-page {
  min-height: calc(100vh - 100px);
}

.badge {
  border-radius: 20px;
}

.empty-favorites {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Mobile adjustments */
@media (max-width: 576px) {
  .display-5 {
    font-size: 2rem;
  }
  
  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 1rem;
  }
  
  .text-end {
    text-align: start !important;
  }
}
</style>