/**
 * TMDB Data Fetching Composables
 *
 * Wrappers around `useAsyncData` + `$fetch` that call our server proxy at /api/tmdb/*.
 * Each composable returns the standard Nuxt async data shape: { data, pending, error }.
 */

interface TmdbListResponse<T = TmdbMovie> {
  page: number
  results: T[]
  total_pages: number
  total_results: number
}

export interface TmdbMovie {
  id: number
  title: string
  original_title: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
  adult: boolean
  media_type?: string
}

export interface TmdbGenre {
  id: number
  name: string
}

interface TmdbGenreResponse {
  genres: TmdbGenre[]
}

interface TmdbVideo {
  id: string
  key: string
  name: string
  site: string
  type: string
  official: boolean
}

interface TmdbVideosResponse {
  id: number
  results: TmdbVideo[]
}

/**
 * Internal helper — fetch from our server proxy.
 */
function tmdbFetch<T>(path: string, params?: Record<string, string>) {
  const query = new URLSearchParams({ language: 'en-US', ...params }).toString()
  return $fetch<T>(`/api/tmdb/${path}?${query}`)
}

// ─── Movie Lists ────────────────────────────────────────────

export function useTrendingMovies() {
  return useAsyncData('trending-movies', () =>
    tmdbFetch<TmdbListResponse>('trending/movie/week'),
  )
}

export function usePopularMovies() {
  return useAsyncData('popular-movies', () =>
    tmdbFetch<TmdbListResponse>('movie/popular'),
  )
}

export function useTopRatedMovies() {
  return useAsyncData('top-rated-movies', () =>
    tmdbFetch<TmdbListResponse>('movie/top_rated'),
  )
}

export function useUpcomingMovies() {
  return useAsyncData('upcoming-movies', () =>
    tmdbFetch<TmdbListResponse>('movie/upcoming'),
  )
}

export function useNowPlayingMovies() {
  return useAsyncData('now-playing-movies', () =>
    tmdbFetch<TmdbListResponse>('movie/now_playing'),
  )
}

// ─── Supporting Data ────────────────────────────────────────

export function useMovieGenres() {
  return useAsyncData('movie-genres', () =>
    tmdbFetch<TmdbGenreResponse>('genre/movie/list'),
  )
}

export function useMovieVideos(movieId: number) {
  return useAsyncData(`movie-videos-${movieId}`, () =>
    tmdbFetch<TmdbVideosResponse>(`movie/${movieId}/videos`),
  )
}

// ─── Movie Details ──────────────────────────────────────────

export interface TmdbMovieDetail extends TmdbMovie {
  runtime: number | null
  tagline: string
  genres: TmdbGenre[]
  status: string
  budget: number
  revenue: number
  production_companies: { id: number; name: string; logo_path: string | null }[]
}

export interface TmdbCastMember {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface TmdbCrewMember {
  id: number
  name: string
  job: string
  department: string
  profile_path: string | null
}

interface TmdbCreditsResponse {
  id: number
  cast: TmdbCastMember[]
  crew: TmdbCrewMember[]
}

export function useMovieDetail(movieId: Ref<number | null>) {
  return useAsyncData(
    () => `movie-detail-${movieId.value}`,
    () => {
      if (!movieId.value) return Promise.resolve(null)
      return tmdbFetch<TmdbMovieDetail>(`movie/${movieId.value}`)
    },
    { watch: [movieId] },
  )
}

export function useMovieCredits(movieId: Ref<number | null>) {
  return useAsyncData(
    () => `movie-credits-${movieId.value}`,
    () => {
      if (!movieId.value) return Promise.resolve(null)
      return tmdbFetch<TmdbCreditsResponse>(`movie/${movieId.value}/credits`)
    },
    { watch: [movieId] },
  )
}

export function useSimilarMovies(movieId: Ref<number | null>) {
  return useAsyncData(
    () => `similar-movies-${movieId.value}`,
    () => {
      if (!movieId.value) return Promise.resolve(null)
      return tmdbFetch<TmdbListResponse>(`movie/${movieId.value}/similar`)
    },
    { watch: [movieId] },
  )
}

export function useMovieVideosDynamic(movieId: Ref<number | null>) {
  return useAsyncData(
    () => `movie-videos-dynamic-${movieId.value}`,
    () => {
      if (!movieId.value) return Promise.resolve(null)
      return tmdbFetch<TmdbVideosResponse>(`movie/${movieId.value}/videos`)
    },
    { watch: [movieId] },
  )
}
