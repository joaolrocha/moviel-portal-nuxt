<script setup lang="ts">
import type { MovieDetails } from '~/composables/useTmdb'

// Props interface
interface Props {
  movie: MovieDetails
  backdropUrl?: string | null
  posterUrl?: string | null
  isFavorite?: boolean
  showBackButton?: boolean
  showFavoriteButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  backdropUrl: null,
  posterUrl: null,
  isFavorite: false,
  showBackButton: true,
  showFavoriteButton: true
})

// Emits
const emit = defineEmits<{
  back: []
  favoriteToggle: []
}>()

// Computed properties
const formattedDate = computed(() => {
  if (!props.movie.release_date) return 'Data não disponível'
  
  const date = new Date(props.movie.release_date)
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const formattedRuntime = computed(() => {
  if (!props.movie.runtime) return 'Duração não informada'
  
  const hours = Math.floor(props.movie.runtime / 60)
  const minutes = props.movie.runtime % 60
  return `${hours}h ${minutes}min`
})

const ratingColor = computed(() => {
  const rating = props.movie.vote_average
  if (rating >= 8) return 'success'
  if (rating >= 6) return 'warning'
  return 'danger'
})

// Actions
const handleBack = () => {
  emit('back')
}

const handleFavoriteToggle = () => {
  emit('favoriteToggle')
}
</script>

<template>
  <div class="hero-section" :style="backdropUrl ? `background-image: url(${backdropUrl})` : ''">
    <div class="hero-overlay">
      <div class="container">
        <div class="row align-items-center min-vh-50">
          <!-- Poster Column -->
          <div class="col-lg-4 col-md-5 mb-4 mb-md-0">
            <div class="poster-container">
              <img 
                v-if="posterUrl"
                :src="posterUrl" 
                :alt="`Poster de ${movie.title}`"
                class="movie-poster img-fluid rounded shadow-lg"
              >
              <div v-else class="poster-placeholder">
                <i class="bi bi-film"></i>
              </div>
            </div>
          </div>

          <!-- Info Column -->
          <div class="col-lg-8 col-md-7">
            <div class="movie-info text-white">
              <!-- Back Button -->
              <button 
                v-if="showBackButton"
                @click="handleBack" 
                class="btn btn-outline-light btn-sm mb-3"
              >
                <i class="bi bi-arrow-left me-2"></i>
                Voltar
              </button>

              <!-- Title -->
              <h1 class="movie-title display-4 fw-bold mb-3">
                {{ movie.title }}
              </h1>

              <!-- Original Title -->
              <h2 
                v-if="movie.original_title !== movie.title" 
                class="movie-original-title h5 text-light mb-3"
              >
                {{ movie.original_title }}
              </h2>

              <!-- Meta Info -->
              <div class="movie-meta mb-4">
                <div class="d-flex flex-wrap gap-3 align-items-center">
                  <!-- Rating -->
                  <span class="badge fs-6" :class="`bg-${ratingColor}`">
                    <i class="bi bi-star-fill me-1"></i>
                    {{ movie.vote_average.toFixed(1) }}
                    <small class="ms-1">({{ movie.vote_count }} votos)</small>
                  </span>

                  <!-- Release Date -->
                  <span class="text-light">
                    <i class="bi bi-calendar me-1"></i>
                    {{ formattedDate }}
                  </span>

                  <!-- Runtime -->
                  <span class="text-light">
                    <i class="bi bi-clock me-1"></i>
                    {{ formattedRuntime }}
                  </span>
                </div>
              </div>

              <!-- Genres -->
              <div v-if="movie.genres && movie.genres.length" class="movie-genres mb-4">
                <span 
                  v-for="genre in movie.genres" 
                  :key="genre.id"
                  class="badge bg-secondary me-2 mb-2"
                >
                  {{ genre.name }}
                </span>
              </div>

              <!-- Overview -->
              <div class="movie-overview mb-4">
                <h3 class="h5 mb-3">Sinopse</h3>
                <p class="lead">{{ movie.overview || 'Sinopse não disponível.' }}</p>
              </div>

              <!-- Actions -->
              <div class="movie-actions">
                <FavoriteButton
                  v-if="showFavoriteButton"
                  :is-favorite="isFavorite"
                  @toggle="handleFavoriteToggle"
                  size="lg"
                  variant="filled"
                  favorite-text="Adicionar aos Favoritos"
                  unfavorite-text="Remover dos Favoritos"
                />
                
                <!-- Slot for additional actions -->
                <slot name="actions" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
</style>