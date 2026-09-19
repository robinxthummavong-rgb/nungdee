<template>
  <div>
    <!-- Hero Banner — featured trending movie -->
    <HeroBanner :movie="heroMovie" :genres="genreList" />
    <!-- Movie Row Sections -->
    <div class="-mt-6 sm:-mt-20 relative z-10 space-y-2">
      <MovieRow
        title="🔥 Trending This Week"
        :movies="trendingMovies"
        :genres="genreList"
      />

      <MovieRow
        title="Popular on DungDee"
        :movies="popularMovies"
        :genres="genreList"
      />

      <MovieRow
        title="Top Rated"
        :movies="topRatedMovies"
        :genres="genreList"
      />

      <MovieRow
        title="Now Playing in Theaters"
        :movies="nowPlayingMovies"
        :genres="genreList"
      />

      <MovieRow
        title="Upcoming"
        :movies="upcomingMovies"
        :genres="genreList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Homepage
 *
 * Assembles the Netflix-style landing page:
 * 1. Hero banner with a random trending movie
 * 2. Multiple horizontal movie carousels (Trending, Popular, Top Rated, etc.)
 *
 * All data is fetched concurrently from the TMDB API via composables.
 */

// SEO
useHead({
  title: 'DungDee — Watch Movies Online',
  meta: [
    {
      name: 'description',
      content:
        'Discover trending, popular, top-rated, and upcoming movies on DungDee. Your premium movie browsing experience.',
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
 * Pick a random movie from trending results for the hero banner.
 * Only consider movies that have a backdrop image.
 */
const heroMovie = computed(() => {
  const candidates = trendingMovies.value.filter((m) => m.backdrop_path)
  if (candidates.length === 0) return null
  const index = Math.floor(Math.random() * Math.min(5, candidates.length))
  return candidates[index] ?? null
})
</script>
