// Types para TMDB API
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
  original_language: string
  original_title: string
  video: boolean
}

export interface MovieDetails extends Movie {
  runtime: number | null
  genres: Genre[]
  budget: number
  revenue: number
  homepage: string | null
  imdb_id: string | null
  production_companies: ProductionCompany[]
  production_countries: ProductionCountry[]
  spoken_languages: SpokenLanguage[]
  status: string
  tagline: string | null
}

export interface Genre {
  id: number
  name: string
}

export interface ProductionCompany {
  id: number
  logo_path: string | null
  name: string
  origin_country: string
}

export interface ProductionCountry {
  iso_3166_1: string
  name: string
}

export interface SpokenLanguage {
  english_name: string
  iso_639_1: string
  name: string
}

export interface Credits {
  id: number
  cast: CastMember[]
  crew: CrewMember[]
}

export interface CastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface CrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

export interface TMDBResponse<T> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export const useTmdb = () => {
  const config = useRuntimeConfig()
  
  const apiKey = config.public.tmdbApiKey
  const baseUrl = config.public.tmdbBaseUrl
  const imageBaseUrl = config.public.tmdbImageUrl

  // Helper para construir URLs de imagem
  const getImageUrl = (path: string | null, size: string = 'w500'): string => {
    if (!path) return '/placeholder-movie.jpg'
    
    // Garantir que a URL está correta
    const cleanPath = path.startsWith('/') ? path : `/${path}`
    const fullUrl = `${imageBaseUrl}/${size}${cleanPath}`
    
    return fullUrl
  }

  // Helper para fazer requisições à API
  const apiRequest = async <T>(endpoint: string, params: Record<string, any> = {}): Promise<T> => {
    const query = new URLSearchParams({
      api_key: apiKey,
      language: 'pt-BR',
      ...params
    })

    return await $fetch<T>(`${baseUrl}${endpoint}?${query}`)
  }

  // Buscar filmes populares
  const getPopularMovies = async (page: number = 1): Promise<TMDBResponse<Movie>> => {
    return await apiRequest<TMDBResponse<Movie>>('/movie/popular', { page })
  }

  // Buscar filmes em cartaz
  const getNowPlayingMovies = async (page: number = 1): Promise<TMDBResponse<Movie>> => {
    return await apiRequest<TMDBResponse<Movie>>('/movie/now_playing', { page })
  }

  // Buscar detalhes de um filme
  const getMovieDetails = async (movieId: number): Promise<MovieDetails> => {
    return await apiRequest<MovieDetails>(`/movie/${movieId}`)
  }

  // Buscar créditos de um filme
  const getMovieCredits = async (movieId: number): Promise<Credits> => {
    return await apiRequest<Credits>(`/movie/${movieId}/credits`)
  }

  // Buscar filmes similares
  const getSimilarMovies = async (movieId: number, page: number = 1): Promise<TMDBResponse<Movie>> => {
    return await apiRequest<TMDBResponse<Movie>>(`/movie/${movieId}/similar`, { page })
  }

  // Buscar filmes por termo
  const searchMovies = async (query: string, page: number = 1): Promise<TMDBResponse<Movie>> => {
    return await apiRequest<TMDBResponse<Movie>>('/search/movie', { query, page })
  }

  // Buscar gêneros
  const getGenres = async (): Promise<{ genres: Genre[] }> => {
    return await apiRequest<{ genres: Genre[] }>('/genre/movie/list')
  }

  // Descobrir filmes por gênero
  const discoverMoviesByGenre = async (genreId: number, page: number = 1): Promise<TMDBResponse<Movie>> => {
    return await apiRequest<TMDBResponse<Movie>>('/discover/movie', {
      with_genres: genreId,
      page,
      sort_by: 'popularity.desc'
    })
  }

  return {
    // Helpers
    getImageUrl,
    
    // API Methods
    getPopularMovies,
    getNowPlayingMovies,
    getMovieDetails,
    getMovieCredits,
    getSimilarMovies,
    searchMovies,
    getGenres,
    discoverMoviesByGenre
  }
}