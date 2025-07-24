<script setup lang="ts">
import type { MovieDetails, Credits } from '~/composables/useTmdb'
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

const formattedBudget = computed(() => {
  if (!movie.value?.budget || movie.value.budget === 0) return 'Não informado'
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(movie.value.budget)
})

const formattedRevenue = computed(() => {
  if (!movie.value?.revenue || movie.value.revenue === 0) return 'Não informado'
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(movie.value.revenue)
})

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
              <div class="movie-info-sidebar">
                <h3 class="section-title">Informações</h3>
                
                <div class="info-list">
                  <!-- Status -->
                  <div class="info-item">
                    <strong>Status:</strong>
                    <span>{{ movie.status || 'Não informado' }}</span>
                  </div>

                  <!-- Budget -->
                  <div class="info-item">
                    <strong>Orçamento:</strong>
                    <span>{{ formattedBudget }}</span>
                  </div>

                  <!-- Revenue -->
                  <div class="info-item">
                    <strong>Bilheteria:</strong>
                    <span>{{ formattedRevenue }}</span>
                  </div>

                  <!-- Languages -->
                  <div v-if="movie.spoken_languages && movie.spoken_languages.length" class="info-item">
                    <strong>Idiomas:</strong>
                    <span>{{ movie.spoken_languages.map(lang => lang.name).join(', ') }}</span>
                  </div>

                  <!-- Production Companies -->
                  <div v-if="movie.production_companies && movie.production_companies.length" class="info-item">
                    <strong>Produtoras:</strong>
                    <span>{{ movie.production_companies.map(company => company.name).join(', ') }}</span>
                  </div>

                  <!-- IMDB Link -->
                  <div v-if="movie.imdb_id" class="info-item">
                    <strong>IMDB:</strong>
                    <a 
                      :href="`https://www.imdb.com/title/${movie.imdb_id}`"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-decoration-none"
                    >
                      Ver no IMDB <i class="bi bi-box-arrow-up-right"></i>
                    </a>
                  </div>

                  <!-- Homepage -->
                  <div v-if="movie.homepage" class="info-item">
                    <strong>Site Oficial:</strong>
                    <a 
                      :href="movie.homepage"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="text-decoration-none"
                    >
                      Visitar site <i class="bi bi-box-arrow-up-right"></i>
                    </a>
                  </div>
                </div>
              </div>
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