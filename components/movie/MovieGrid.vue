<script setup lang="ts">
import type { Movie } from '~/composables/useTmdb'

// Props interface
interface Props {
  movies?: Movie[]
  loading?: boolean
  error?: string | null
  columns?: {
    xs?: number
    sm?: number
    md?: number
    lg?: number
    xl?: number
  }
  cardVariant?: 'default' | 'compact' | 'detailed'
  cardImageSize?: 'sm' | 'md' | 'lg'
  showFavorites?: boolean
  showRating?: boolean
  showOverview?: boolean
  emptyStateTitle?: string
  emptyStateMessage?: string
  emptyStateIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  movies: () => [],
  loading: false,
  error: null,
  columns: () => ({
    xs: 1,
    sm: 2, 
    md: 3,
    lg: 4,
    xl: 4
  }),
  cardVariant: 'default',
  cardImageSize: 'md',
  showFavorites: true,
  showRating: true,
  showOverview: true,
  emptyStateTitle: 'Nenhum filme encontrado',
  emptyStateMessage: 'Não há filmes para exibir no momento.',
  emptyStateIcon: 'bi-film'
})

// Emits
const emit = defineEmits<{
  movieClick: [movie: Movie]
  favoriteToggle: [movie: Movie]
  retryLoad: []
}>()

// Computed properties
const hasMovies = computed(() => props.movies && props.movies.length > 0)
const hasError = computed(() => !!props.error)
const isEmpty = computed(() => !props.loading && !hasError.value && !hasMovies.value)

const gridClasses = computed(() => [
  'movie-grid',
  'row',
  {
    'movie-grid-loading': props.loading,
    'movie-grid-error': hasError.value,
    'movie-grid-empty': isEmpty.value
  }
])

const columnClasses = computed(() => {
  const cols = props.columns
  return [
    `col-${12 / (cols.xs || 1)}`,
    cols.sm ? `col-sm-${12 / cols.sm}` : '',
    cols.md ? `col-md-${12 / cols.md}` : '',
    cols.lg ? `col-lg-${12 / cols.lg}` : '',
    cols.xl ? `col-xl-${12 / cols.xl}` : ''
  ].filter(Boolean).join(' ')
})

// Actions
const handleMovieClick = (movie: Movie) => {
  emit('movieClick', movie)
}

const handleFavoriteToggle = (movie: Movie) => {
  emit('favoriteToggle', movie)
}

const handleRetry = () => {
  emit('retryLoad')
}
</script>

<template>
  <div class="movie-grid-container">
    <!-- Loading State -->
    <div v-if="loading" class="movie-grid-loading-state">
      <LoadingSpinner 
        size="lg" 
        text="Carregando filmes..." 
        :centered="true"
      />
    </div>

    <!-- Error State -->
    <ErrorAlert
      v-else-if="hasError"
      title="Erro ao carregar filmes"
      :message="error"
      variant="danger"
      :dismissible="false"
      :retry-action="handleRetry"
      retry-text="Tentar novamente"
      class="mb-4"
    />

    <!-- Empty State -->
    <div v-else-if="isEmpty" class="movie-grid-empty-state">
      <div class="empty-state-content">
        <i :class="emptyStateIcon" class="empty-state-icon"></i>
        <h4 class="empty-state-title">{{ emptyStateTitle }}</h4>
        <p class="empty-state-message text-muted">{{ emptyStateMessage }}</p>
        
        <!-- Slot for custom empty state actions -->
        <div v-if="$slots.emptyActions" class="empty-state-actions">
          <slot name="emptyActions" />
        </div>
      </div>
    </div>

    <!-- Movies Grid -->
    <div v-else :class="gridClasses">
      <div 
        v-for="movie in movies" 
        :key="movie.id" 
        :class="columnClasses"
        class="mb-4 movie-grid-item"
      >
        <MovieCard
          :movie="movie"
          :variant="cardVariant"
          :image-size="cardImageSize"
          :show-favorite-button="showFavorites"
          :show-rating="showRating"
          :show-overview="showOverview"
          @click="handleMovieClick"
          @favorite-toggle="handleFavoriteToggle"
        />
      </div>
    </div>

    <!-- Slot for additional content (pagination, load more, etc.) -->
    <div v-if="$slots.footer" class="movie-grid-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style>
/* Import external CSS */
@import '~/assets/styles/components/movie-grid.css';
</style>