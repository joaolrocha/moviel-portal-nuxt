<script setup lang="ts">
import type { Movie } from '~/composables/useTmdb'
import { useFavoritesStore } from '~/store/favorites'

// Props interface
interface Props {
  movie: Movie
  showFavoriteButton?: boolean
  showRating?: boolean
  showOverview?: boolean
  imageSize?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'compact' | 'detailed'
  clickable?: boolean
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showFavoriteButton: true,
  showRating: true,
  showOverview: true,
  imageSize: 'md',
  variant: 'default',
  clickable: true,
  loading: false
})

// Emits
const emit = defineEmits<{
  click: [movie: Movie]
  favoriteToggle: [movie: Movie]
}>()

// Composables
const { getImageUrl } = useTmdb()
const favoritesStore = useFavoritesStore()

// Computed properties
const cardClasses = computed(() => [
  'movie-card',
  'card',
  'h-100',
  {
    'movie-card-clickable': props.clickable,
    'movie-card-loading': props.loading,
    'movie-card-compact': props.variant === 'compact',
    'movie-card-detailed': props.variant === 'detailed'
  }
])

const imageClasses = computed(() => [
  'card-img-top',
  'movie-poster',
  {
    'movie-poster-sm': props.imageSize === 'sm',
    'movie-poster-md': props.imageSize === 'md',
    'movie-poster-lg': props.imageSize === 'lg'
  }
])

const formattedDate = computed(() => {
  if (!props.movie.release_date) return 'Data não disponível'
  
  const date = new Date(props.movie.release_date)
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
})

const formattedOverview = computed(() => {
  if (!props.movie.overview) return 'Sinopse não disponível'
  
  const maxLength = props.variant === 'compact' ? 80 : 150
  return props.movie.overview.length > maxLength 
    ? props.movie.overview.substring(0, maxLength) + '...'
    : props.movie.overview
})

const ratingColor = computed(() => {
  const rating = props.movie.vote_average
  if (rating >= 8) return 'success'
  if (rating >= 6) return 'warning'
  return 'danger'
})

const isFavorite = computed(() => 
  favoritesStore.isFavorite(props.movie.id)
)

// Actions
const handleCardClick = () => {
  if (props.clickable && !props.loading) {
    emit('click', props.movie)
  }
}

const handleFavoriteToggle = () => {
  emit('favoriteToggle', props.movie)
}

const handleFavoriteClick = (event: Event) => {
  // Previne event bubbling para não disparar o clique do card
  event.stopPropagation()
  event.preventDefault()
}

// Image loading state
const imageLoaded = ref(false)
const imageError = ref(false)
const retryCount = ref(0)
const maxRetries = 2

const imageSizes = ['w342', 'w500', 'w300'] // Tamanhos para tentar

const getCurrentImageUrl = (): string => {
  if (!props.movie.poster_path) return '/placeholder-movie.jpg'
  
  const sizeIndex = retryCount.value % imageSizes.length
  const size = imageSizes[sizeIndex]
  return getImageUrl(props.movie.poster_path, size)
}

const handleImageLoad = () => {
  imageLoaded.value = true
  imageError.value = false
}

const handleImageError = () => {
  
  if (retryCount.value < maxRetries) {
    retryCount.value++
    // Força um novo try com tamanho diferente
    nextTick(() => {
      const img = document.querySelector(`[data-movie-id="${props.movie.id}"] img`)
      if (img) {
        (img as HTMLImageElement).src = getCurrentImageUrl()
      }
    })
  } else {
    imageError.value = true
    imageLoaded.value = true
  }
}
</script>

<template>
  <div 
    :class="cardClasses"
    :data-movie-id="movie.id"
    @click="handleCardClick"
    :role="clickable ? 'button' : undefined"
    :tabindex="clickable ? 0 : undefined"
    :aria-label="clickable ? `Ver detalhes de ${movie.title}` : undefined"
    @keydown.enter="handleCardClick"
    @keydown.space.prevent="handleCardClick"
  >
    <!-- Loading overlay -->
    <div v-if="loading" class="movie-card-loader">
      <LoadingSpinner size="md" text="" />
    </div>

    <!-- Movie Poster -->
    <div class="movie-poster-container">
      <!-- Loading placeholder -->
      <div 
        v-if="!imageLoaded" 
        class="movie-poster-placeholder"
        :class="imageClasses"
      >
        <div class="placeholder-content">
          <i class="bi bi-image fs-1 text-muted"></i>
        </div>
      </div>

      <!-- Actual image -->
      <img 
        v-show="imageLoaded && !imageError"
        :src="getCurrentImageUrl()"
        :alt="`Poster do filme ${movie.title}`"
        :class="imageClasses"
        @load="handleImageLoad"
        @error="handleImageError"
      >

      <!-- Error fallback -->
      <div 
        v-if="imageError"
        class="movie-poster-error"
        :class="imageClasses"
      >
        <div class="error-content">
          <i class="bi bi-film fs-2 text-muted"></i>
          <small class="text-muted">Imagem indisponível</small>
        </div>
      </div>

      <!-- Rating badge (overlay) -->
      <div 
        v-if="showRating && movie.vote_average > 0" 
        class="rating-badge"
        :class="`bg-${ratingColor}`"
      >
        <i class="bi bi-star-fill me-1"></i>
        {{ movie.vote_average.toFixed(1) }}
      </div>

      <!-- Favorite button (overlay) -->
      <div 
        v-if="showFavoriteButton" 
        class="favorite-overlay"
        @click="handleFavoriteClick"
      >
        <FavoriteButton
          :is-favorite="isFavorite"
          @toggle="handleFavoriteToggle"
          size="sm"
          variant="minimal"
          :show-text="false"
          class="favorite-overlay-btn"
        />
      </div>
    </div>

    <!-- Card Body -->
    <div class="card-body d-flex flex-column">
      <!-- Title -->
      <h6 class="card-title movie-title mb-2">
        {{ movie.title }}
      </h6>

      <!-- Release date -->
      <small class="text-muted mb-2 movie-date">
        <i class="bi bi-calendar me-1"></i>
        {{ formattedDate }}
      </small>

      <!-- Overview -->
      <p 
        v-if="showOverview" 
        class="card-text text-muted movie-overview flex-grow-1"
      >
        {{ formattedOverview }}
      </p>

      <!-- Bottom info -->
      <div class="mt-auto movie-footer">
        <!-- Popularity indicator -->
        <div class="d-flex justify-content-between align-items-center">
          <small class="text-muted">
            <i class="bi bi-eye me-1"></i>
            {{ Math.round(movie.popularity) }} views
          </small>
          
          <!-- Click indicator -->
          <small v-if="clickable" class="text-primary">
            <i class="bi bi-arrow-right"></i>
          </small>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Import external CSS */
@import '~/assets/styles/components/movie-card.css';
</style>