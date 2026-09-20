<template>
  <div>
    <!-- Hero Banner — featured popular movie -->
    <HeroBanner :movie="heroMovie" :genres="genreList" media-type="movie" />
    <!-- Movie Row Sections -->
    <div class="-mt-6 sm:-mt-20 relative z-10 space-y-2">
      <MovieRow
        title="🎬 Now Playing"
        :movies="nowPlayingMovies"
        :genres="genreList"
      />

      <MovieRow
        title="Popular Movies"
        :movies="popularMovies"
        :genres="genreList"
      />

      <MovieRow
        title="⭐ Top Rated"
        :movies="topRatedMovies"
        :genres="genreList"
      />

      <MovieRow
        title="Coming Soon"
        :movies="upcomingMovies"
        :genres="genreList"
      />

      <MovieRow
        title="🔥 Trending This Week"
        :movies="trendingMovies"
        :genres="genreList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Movies Page
 *
 * Dedicated movies category page with Netflix-style layout:
 * - Hero banner with a random popular movie
 * - Multiple category rows (Now Playing, Popular, Top Rated, Upcoming, Trending)
 */

useHead({
  title: 'Movies — DungDee',
  meta: [
    {
      name: 'description',
      content: 'Browse movies on DungDee. Discover now playing, popular, top-rated, and upcoming films.',
    },
  ],
})

// ─── Data Fetching ─────────────────────────────────────────

const { data: trendingData } = await useTrendingMovies()
const { data: popularData } = await usePopularMovies()
const { data: topRatedData } = await useTopRatedMovies()
const { data: upcomingData } = await useUpcomingMovies()
const { data: nowPlayingData } = await useNowPlayingMovies()
const { data: genresData } = await useMovieGenres()

// ─── Computed Properties ───────────────────────────────────

const genreList = computed(() => genresData.value?.genres ?? [])

const trendingMovies = computed(() => trendingData.value?.results ?? [])
const popularMovies = computed(() => popularData.value?.results ?? [])
const topRatedMovies = computed(() => topRatedData.value?.results ?? [])
const upcomingMovies = computed(() => upcomingData.value?.results ?? [])
const nowPlayingMovies = computed(() => nowPlayingData.value?.results ?? [])

/**
 * Pick a random movie from popular results for the hero banner.
 * Only consider movies that have a backdrop image.
 */
const heroMovie = computed(() => {
  const candidates = popularMovies.value.filter((m) => m.backdrop_path)
  if (candidates.length === 0) return null
  const index = Math.floor(Math.random() * Math.min(5, candidates.length))
  return candidates[index] ?? null
})
</script>
