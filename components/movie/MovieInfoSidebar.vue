<script setup lang="ts">
import type { MovieDetails } from '~/composables/useTmdb'

// Props interface
interface Props {
  movie: MovieDetails
  showBudget?: boolean
  showRevenue?: boolean
  showStatus?: boolean
  showLanguages?: boolean
  showCompanies?: boolean
  showExternalLinks?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showBudget: true,
  showRevenue: true,
  showStatus: true,
  showLanguages: true,
  showCompanies: true,
  showExternalLinks: true
})

// Computed properties
const formattedBudget = computed(() => {
  if (!props.movie.budget || props.movie.budget === 0) return 'Não informado'
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(props.movie.budget)
})

const formattedRevenue = computed(() => {
  if (!props.movie.revenue || props.movie.revenue === 0) return 'Não informado'
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(props.movie.revenue)
})

const spokenLanguages = computed(() => {
  if (!props.movie.spoken_languages || props.movie.spoken_languages.length === 0) {
    return 'Não informado'
  }
  return props.movie.spoken_languages.map(lang => lang.name).join(', ')
})

const productionCompanies = computed(() => {
  if (!props.movie.production_companies || props.movie.production_companies.length === 0) {
    return 'Não informado'
  }
  return props.movie.production_companies.map(company => company.name).join(', ')
})

const movieStatus = computed(() => {
  return props.movie.status || 'Não informado'
})

const hasExternalLinks = computed(() => {
  return !!(props.movie.imdb_id || props.movie.homepage)
})

// Info items computed
const infoItems = computed(() => {
  const items = []

  if (props.showStatus) {
    items.push({
      label: 'Status',
      value: movieStatus.value,
      type: 'text'
    })
  }

  if (props.showBudget) {
    items.push({
      label: 'Orçamento',
      value: formattedBudget.value,
      type: 'text'
    })
  }

  if (props.showRevenue) {
    items.push({
      label: 'Bilheteria',
      value: formattedRevenue.value,
      type: 'text'
    })
  }

  if (props.showLanguages) {
    items.push({
      label: 'Idiomas',
      value: spokenLanguages.value,
      type: 'text'
    })
  }

  if (props.showCompanies) {
    items.push({
      label: 'Produtoras',
      value: productionCompanies.value,
      type: 'text'
    })
  }

  return items
})

const externalLinks = computed(() => {
  const links = []

  if (props.movie.imdb_id) {
    links.push({
      label: 'IMDB',
      url: `https://www.imdb.com/title/${props.movie.imdb_id}`,
      icon: 'bi-box-arrow-up-right'
    })
  }

  if (props.movie.homepage) {
    links.push({
      label: 'Site Oficial',
      url: props.movie.homepage,
      icon: 'bi-box-arrow-up-right'
    })
  }

  return links
})
</script>

<template>
  <div class="movie-info-sidebar">
    <h3 class="section-title">Informações</h3>
    
    <div class="info-list">
      <!-- Basic Info Items -->
      <div 
        v-for="item in infoItems" 
        :key="item.label"
        class="info-item"
      >
        <strong>{{ item.label }}:</strong>
        <span>{{ item.value }}</span>
      </div>

      <!-- External Links -->
      <div 
        v-if="showExternalLinks && hasExternalLinks"
        v-for="link in externalLinks"
        :key="link.label"
        class="info-item"
      >
        <strong>{{ link.label }}:</strong>
        <a 
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-decoration-none"
        >
          {{ link.label === 'IMDB' ? 'Ver no IMDB' : 'Visitar site' }}
          <i :class="link.icon" class="ms-1"></i>
        </a>
      </div>

      <!-- Slot for additional info -->
      <slot name="additional-info" :movie="movie" />
    </div>

    <!-- Slot for actions or additional content -->
    <div v-if="$slots.actions" class="sidebar-actions mt-4">
      <slot name="actions" />
    </div>
  </div>
</template>

<style>
</style>