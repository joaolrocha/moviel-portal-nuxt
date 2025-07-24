<script setup lang="ts">
import type { Credits, MovieDetails } from '~/composables/useTmdb'
import { useFavoritesStore } from '~/store/favorites'
import { useMoviesStore } from '~/store/movies'

// Get route params
const route = useRoute()
const router = useRouter()
const movieId = parseInt(route.params.id as string)

// Stores
const moviesStore = useMoviesStore()
const favoritesStore = useFavoritesStore()

// Composables
const { getImageUrl } = useTmdb()

// Reactive data
const movie = ref<MovieDetails | null>(null)
const credits = ref<Credits | null>(null)
const isLoading = ref(true)
const error = ref<string | null>(null)

// Computed properties
const backdropUrl = computed(() => 
  movie.value?.backdrop_path 
    ? getImageUrl(movie.value.backdrop_path, 'original')
    : null
)

const posterUrl = computed(() => 
  movie.value?.poster_path 
    ? getImageUrl(movie.value.poster_path, 'w500')
    : null
)

const isFavorite = computed(() => 
  movie.value ? favoritesStore.isFavorite(movie.value.id) : false
)

// Actions
const toggleFavorite = async () => {
  if (movie.value) {
    await favoritesStore.toggleFavorite(movie.value)
  }
}

const goBack = () => {
  router.back()
}

const fetchMovieData = async () => {
  if (!movieId || isNaN(movieId)) {
    error.value = 'ID do filme inválido'
    isLoading.value = false
    return
  }

  try {
    isLoading.value = true
    error.value = null

    // Fetch movie details and credits in parallel
    const [movieDetails, movieCredits] = await Promise.all([
      moviesStore.fetchMovieDetails(movieId),
      useTmdb().getMovieCredits(movieId)
    ])

    movie.value = movieDetails
    credits.value = movieCredits
    
  } catch (err: any) {
    error.value = `Erro ao carregar detalhes: ${err.message}`
    console.error('Error fetching movie data:', err)
  } finally {
    isLoading.value = false
  }
}

// Initialize
onMounted(async () => {
  favoritesStore.initializeFavorites()
  await fetchMovieData()
})

// SEO
useHead(() => ({
  title: movie.value ? `${movie.value.title} - Movie Portal` : 'Detalhes do Filme - Movie Portal',
  meta: [
    { 
      name: 'description', 
      content: movie.value?.overview || 'Detalhes completos do filme'
    },
    { 
      property: 'og:title', 
      content: movie.value?.title || 'Movie Portal'
    },
    { 
      property: 'og:description', 
      content: movie.value?.overview || 'Detalhes completos do filme'
    },
    { 
      property: 'og:image', 
      content: posterUrl.value || ''
    }
  ]
}))
</script>

<template>
  <div class="movie-details-page">
    <!-- Loading State -->
    <LoadingSpinner 
      v-if="isLoading"
      size="lg"
      text="Carregando detalhes do filme..."
      :full-height="true"
    />

    <!-- Error State -->
    <div v-else-if="error" class="container mt-4">
      <ErrorAlert
        title="Erro ao carregar filme"
        :message="error"
        variant="danger"
        :retry-action="fetchMovieData"
        retry-text="Tentar novamente"
      />
      
      <!-- Back button -->
      <div class="text-center mt-4">
        <button @click="goBack" class="btn btn-outline-primary">
          <i class="bi bi-arrow-left me-2"></i>
          Voltar
        </button>
      </div>
    </div>

    <!-- Movie Details -->
    <div v-else-if="movie" class="movie-details-content">
      <!-- Hero Section with Backdrop -->
      <HeroSection
        :movie="movie"
        :backdrop-url="backdropUrl"
        :poster-url="posterUrl"
        :is-favorite="isFavorite"
        :show-back-button="true"
        :show-favorite-button="true"
        @back="goBack"
        @favorite-toggle="toggleFavorite"
      />

      <!-- Details Section -->
      <div class="details-section py-5">
        <div class="container">
          <div class="row">
            <!-- Cast & Crew -->
            <div class="col-lg-8 mb-5">
              <CastSection
                :credits="credits"
                :max-cast-members="8"
                :show-director="true"
                :show-cast="true"
              />
            </div>

            <!-- Movie Info Sidebar -->
            <div class="col-lg-4">
              <MovieInfoSidebar
                :movie="movie"
                :show-budget="true"
                :show-revenue="true"
                :show-status="true"
                :show-languages="true"
                :show-companies="true"
                :show-external-links="true"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Import external CSS */
@import '~/assets/styles/pages/movie-details.css';
</style>