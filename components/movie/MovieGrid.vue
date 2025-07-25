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
  infiniteScroll?: boolean
  hasMoreData?: boolean
  isLoadingMore?: boolean
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
  emptyStateIcon: 'bi-film',
  infiniteScroll: false,
  hasMoreData: true,
  isLoadingMore: false
})

// Emits
const emit = defineEmits<{
  movieClick: [movie: Movie]
  favoriteToggle: [movie: Movie]
  retryLoad: []
  loadMore: []
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

// Infinite Scroll Logic
const infiniteScrollRef = ref<HTMLElement>()
let observer: IntersectionObserver | null = null

const handleLoadMore = async () => {
  if (props.isLoadingMore || props.loading || !props.hasMoreData) {
    return
  }
  
  emit('loadMore')
}

// Intersection Observer for infinite scroll
const setupInfiniteScroll = () => {
  // Disconnect existing observer
  if (observer) {
    observer.disconnect()
    observer = null
  }

  if (!props.infiniteScroll || !infiniteScrollRef.value) {
    return
  }

  observer = new IntersectionObserver(
    (entries) => {
      const [entry] = entries
      
      if (entry.isIntersecting && props.hasMoreData && !props.loading && !props.isLoadingMore) {
        handleLoadMore()
      }
    },
    {
      root: null,
      rootMargin: '200px',
      threshold: 0.1
    }
  )

  observer.observe(infiniteScrollRef.value)

  // Cleanup on unmount
  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })
}

// Setup infinite scroll when component mounts
onMounted(() => {
  if (props.infiniteScroll) {
    // Delay para garantir que o DOM está renderizado
    setTimeout(() => {
      setupInfiniteScroll()
    }, 100)
  }
})

// Watch for changes in movies array to re-setup observer
watch(() => [props.movies?.length, props.infiniteScroll], () => {
  if (props.infiniteScroll && props.movies && props.movies.length > 0) {
    nextTick(() => {
      setupInfiniteScroll()
    })
  }
}, { immediate: true })
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
    <div v-if="hasMovies" :class="gridClasses">
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

    <!-- Infinite Scroll Trigger -->
    <div 
      v-if="infiniteScroll && hasMovies" 
      ref="infiniteScrollRef" 
      class="infinite-scroll-trigger"
    >
      <!-- Loading More Indicator -->
      <div v-if="isLoadingMore" class="loading-more-container">
        <div class="d-flex align-items-center justify-content-center">
          <div class="spinner-border text-primary me-3" role="status">
            <span class="visually-hidden">Carregando...</span>
          </div>
          <span class="text-muted">Carregando mais filmes...</span>
        </div>
      </div>
      
      <!-- End of Results -->
      <div v-else-if="!hasMoreData" class="end-of-results">
        <div class="text-center py-4">
          <i class="bi bi-check-circle text-success fs-2 mb-2"></i>
          <p class="text-muted mb-0">
            Você viu todos os filmes disponíveis! 🎬
          </p>
        </div>
      </div>
      
      <!-- Scroll Trigger Zone (invisible) -->
      <div v-else class="scroll-trigger-zone">
        <div class="text-center py-3 text-muted">
          <small>Role para carregar mais filmes...</small>
        </div>
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