// tests/types/movie.ts
export interface Movie {
  id: number
  title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  adult: boolean
  video: boolean
  original_language: string
  original_title: string
}

// Declarações globais para TypeScript
declare global {
  var useRuntimeConfig: any
  var useRouter: any
  var useRoute: any
  var navigateTo: any
  var nextTick: any
  var useTmdb: any
  var useFavoritesStore: any
}

export {}