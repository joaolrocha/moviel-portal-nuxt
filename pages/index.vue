<script setup lang="ts">
import { useTmdb } from '~/composables/useTmdb'

// Imports
const { getPopularMovies, getImageUrl } = useTmdb()

// Meta tags
useHead({
  title: 'Movie Portal - Filmes Populares',
  meta: [
    { name: 'description', content: 'Descubra os filmes mais populares do momento' }
  ]
})

// Fetch data
const { data, pending, error } = await useLazyAsyncData('popular-movies', () => 
  getPopularMovies(1)
)

// Helper functions
const formatDate = (dateString: string): string => {
  if (!dateString) return 'Data não disponível'
  
  const date = new Date(dateString)
  return date.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Movie Portal - Teste TMDB API</h1>
    
    <!-- Loading State -->
    <div v-if="pending" class="text-center">
      <div class="spinner-border" role="status">
        <span class="visually-hidden">Carregando...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      <h4>Erro ao carregar filmes:</h4>
      <p>{{ error.message }}</p>
    </div>

    <!-- Success State -->
    <div v-else-if="data">
      <div class="row mb-4">
        <div class="col">
          <h2>Filmes Populares</h2>
          <p class="text-muted">Total de {{ data.total_results }} filmes encontrados</p>
        </div>
      </div>

      <div class="row">
        <div v-for="movie in data.results.slice(0, 12)" :key="movie.id" class="col-md-3 col-sm-6 mb-4">
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
                <div class="d-flex justify-content-between align-items-center">
                  <small class="text-muted">{{ formatDate(movie.release_date) }}</small>
                  <span class="badge bg-warning text-dark">
                    <i class="bi bi-star-fill"></i> {{ movie.vote_average.toFixed(1) }}
                  </span>
                </div>
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