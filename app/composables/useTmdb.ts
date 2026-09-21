/**
 * TMDB Data Fetching Composables
 *
 * Wrappers around `useFetch` that call our server proxy at /api/tmdb/*.
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

/** Shared options for every TMDB useFetch call. `lazy` keeps navigation instant. */
const defaultOpts = { query: { language: 'en-US' }, lazy: true } as const

// ─── Movie Lists ────────────────────────────────────────────

export function useTrendingMovies() {
  return useFetch<TmdbListResponse>('/api/tmdb/trending/movie/week', {
    key: 'trending-movies',
    ...defaultOpts,
  })
}

export function usePopularMovies() {
  return useFetch<TmdbListResponse>('/api/tmdb/movie/popular', {
    key: 'popular-movies',
    ...defaultOpts,
  })
}

export function useTopRatedMovies() {
  return useFetch<TmdbListResponse>('/api/tmdb/movie/top_rated', {
    key: 'top-rated-movies',
    ...defaultOpts,
  })
}

export function useUpcomingMovies() {
  return useFetch<TmdbListResponse>('/api/tmdb/movie/upcoming', {
    key: 'upcoming-movies',
    ...defaultOpts,
  })
}

export function useNowPlayingMovies() {
  return useFetch<TmdbListResponse>('/api/tmdb/movie/now_playing', {
    key: 'now-playing-movies',
    ...defaultOpts,
  })
}

// ─── Supporting Data ────────────────────────────────────────

export function useMovieGenres() {
  return useFetch<TmdbGenreResponse>('/api/tmdb/genre/movie/list', {
    key: 'movie-genres',
    ...defaultOpts,
  })
}

export function useMovieVideos(movieId: number) {
  return useFetch<TmdbVideosResponse>(`/api/tmdb/movie/${movieId}/videos`, {
    key: `movie-videos-${movieId}`,
    ...defaultOpts,
  })
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
  const url = computed(() =>
    movieId.value ? `/api/tmdb/movie/${movieId.value}` : undefined,
  )
  return useFetch<TmdbMovieDetail>(url as ComputedRef<string>, {
    key: computed(() => `movie-detail-${movieId.value}`) as unknown as string,
    ...defaultOpts,
    watch: [movieId],
  })
}

export function useMovieCredits(movieId: Ref<number | null>) {
  const url = computed(() =>
    movieId.value ? `/api/tmdb/movie/${movieId.value}/credits` : undefined,
  )
  return useFetch<TmdbCreditsResponse>(url as ComputedRef<string>, {
    key: computed(() => `movie-credits-${movieId.value}`) as unknown as string,
    ...defaultOpts,
    watch: [movieId],
  })
}

export function useSimilarMovies(movieId: Ref<number | null>) {
  const url = computed(() =>
    movieId.value ? `/api/tmdb/movie/${movieId.value}/similar` : undefined,
  )
  return useFetch<TmdbListResponse>(url as ComputedRef<string>, {
    key: computed(() => `similar-movies-${movieId.value}`) as unknown as string,
    ...defaultOpts,
    watch: [movieId],
  })
}

export function useMovieVideosDynamic(movieId: Ref<number | null>) {
  const url = computed(() =>
    movieId.value ? `/api/tmdb/movie/${movieId.value}/videos` : undefined,
  )
  return useFetch<TmdbVideosResponse>(url as ComputedRef<string>, {
    key: computed(() => `movie-videos-dynamic-${movieId.value}`) as unknown as string,
    ...defaultOpts,
    watch: [movieId],
  })
}

// ─── TV Show Types ──────────────────────────────────────────

export interface TmdbTvShow {
  id: number
  name: string
  original_name: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  first_air_date: string
  vote_average: number
  vote_count: number
  genre_ids: number[]
  popularity: number
  adult: boolean
  media_type?: string
}

export interface TmdbTvDetail extends TmdbTvShow {
  genres: TmdbGenre[]
  number_of_seasons: number
  number_of_episodes: number
  episode_run_time: number[]
  status: string
  tagline: string
  seasons: {
    id: number
    season_number: number
    name: string
    episode_count: number
    air_date: string | null
    poster_path: string | null
    overview: string
  }[]
}

export interface TmdbEpisode {
  id: number
  name: string
  overview: string
  episode_number: number
  season_number: number
  air_date: string | null
  still_path: string | null
  vote_average: number
  runtime: number | null
}

export interface TmdbSeasonDetail {
  id: number
  name: string
  overview: string
  season_number: number
  episodes: TmdbEpisode[]
}

// ─── TV Show Lists ──────────────────────────────────────────

export function useTrendingTvShows() {
  return useFetch<TmdbListResponse<TmdbTvShow>>('/api/tmdb/trending/tv/week', {
    key: 'trending-tv',
    ...defaultOpts,
  })
}

export function usePopularTvShows() {
  return useFetch<TmdbListResponse<TmdbTvShow>>('/api/tmdb/tv/popular', {
    key: 'popular-tv',
    ...defaultOpts,
  })
}

export function useTopRatedTvShows() {
  return useFetch<TmdbListResponse<TmdbTvShow>>('/api/tmdb/tv/top_rated', {
    key: 'top-rated-tv',
    ...defaultOpts,
  })
}

export function useAiringTodayTvShows() {
  return useFetch<TmdbListResponse<TmdbTvShow>>('/api/tmdb/tv/airing_today', {
    key: 'airing-today-tv',
    ...defaultOpts,
  })
}

export function useOnTheAirTvShows() {
  return useFetch<TmdbListResponse<TmdbTvShow>>('/api/tmdb/tv/on_the_air', {
    key: 'on-the-air-tv',
    ...defaultOpts,
  })
}

export function useTvGenres() {
  return useFetch<TmdbGenreResponse>('/api/tmdb/genre/tv/list', {
    key: 'tv-genres',
    ...defaultOpts,
  })
}

// ─── Generic Media Composables (Movie / TV) ─────────────────

export function useMediaDetail(mediaType: Ref<string>, mediaId: Ref<number | null>) {
  const url = computed(() => {
    if (!mediaId.value) return undefined
    const type = mediaType.value === 'tv' ? 'tv' : 'movie'
    return `/api/tmdb/${type}/${mediaId.value}`
  })
  return useFetch<any>(url as ComputedRef<string>, {
    key: computed(() => `${mediaType.value}-detail-${mediaId.value}`) as unknown as string,
    ...defaultOpts,
    watch: [mediaId, mediaType],
  })
}

export function useMediaCredits(mediaType: Ref<string>, mediaId: Ref<number | null>) {
  const url = computed(() => {
    if (!mediaId.value) return undefined
    const type = mediaType.value === 'tv' ? 'tv' : 'movie'
    return `/api/tmdb/${type}/${mediaId.value}/credits`
  })
  return useFetch<TmdbCreditsResponse>(url as ComputedRef<string>, {
    key: computed(() => `${mediaType.value}-credits-${mediaId.value}`) as unknown as string,
    ...defaultOpts,
    watch: [mediaId, mediaType],
  })
}

export function useMediaSimilar(mediaType: Ref<string>, mediaId: Ref<number | null>) {
  const url = computed(() => {
    if (!mediaId.value) return undefined
    const type = mediaType.value === 'tv' ? 'tv' : 'movie'
    return `/api/tmdb/${type}/${mediaId.value}/similar`
  })
  return useFetch<TmdbListResponse>(url as ComputedRef<string>, {
    key: computed(() => `${mediaType.value}-similar-${mediaId.value}`) as unknown as string,
    ...defaultOpts,
    watch: [mediaId, mediaType],
  })
}

export function useMediaVideos(mediaType: Ref<string>, mediaId: Ref<number | null>) {
  const url = computed(() => {
    if (!mediaId.value) return undefined
    const type = mediaType.value === 'tv' ? 'tv' : 'movie'
    return `/api/tmdb/${type}/${mediaId.value}/videos`
  })
  return useFetch<TmdbVideosResponse>(url as ComputedRef<string>, {
    key: computed(() => `${mediaType.value}-videos-${mediaId.value}`) as unknown as string,
    ...defaultOpts,
    watch: [mediaId, mediaType],
  })
}

// ─── TV Season Detail ───────────────────────────────────────

export function useTvSeasonDetail(tvId: Ref<number | null>, seasonNumber: Ref<number>) {
  const url = computed(() =>
    tvId.value ? `/api/tmdb/tv/${tvId.value}/season/${seasonNumber.value}` : undefined,
  )
  return useFetch<TmdbSeasonDetail>(url as ComputedRef<string>, {
    key: computed(() => `tv-season-${tvId.value}-${seasonNumber.value}`) as unknown as string,
    ...defaultOpts,
    watch: [tvId, seasonNumber],
  })
}

// ─── Normalization ──────────────────────────────────────────

/**
 * Normalize a TV show object into the TmdbMovie shape so existing
 * components (MovieCard, MovieRow, HeroBanner) can render it.
 */
export function normalizeTvToMovie(tv: TmdbTvShow): TmdbMovie {
  return {
    id: tv.id,
    title: tv.name,
    original_title: tv.original_name,
    overview: tv.overview,
    poster_path: tv.poster_path,
    backdrop_path: tv.backdrop_path,
    release_date: tv.first_air_date,
    vote_average: tv.vote_average,
    vote_count: tv.vote_count,
    genre_ids: tv.genre_ids,
    popularity: tv.popularity,
    adult: tv.adult,
    media_type: 'tv',
  }
}

