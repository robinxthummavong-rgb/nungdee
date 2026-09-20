<template>
  <div>
    <!-- Hero Banner — featured trending TV show -->
    <HeroBanner :movie="heroShow" :genres="genreList" media-type="tv" />
    <!-- TV Show Row Sections -->
    <div class="-mt-6 sm:-mt-20 relative z-10 space-y-2">
      <MovieRow
        title="🔥 Trending TV Shows"
        :movies="trendingShows"
        :genres="genreList"
      />

      <MovieRow
        title="Popular Series"
        :movies="popularShows"
        :genres="genreList"
      />

      <MovieRow
        title="⭐ Top Rated"
        :movies="topRatedShows"
        :genres="genreList"
      />

      <MovieRow
        title="📺 Airing Today"
        :movies="airingTodayShows"
        :genres="genreList"
      />

      <MovieRow
        title="Currently On The Air"
        :movies="onTheAirShows"
        :genres="genreList"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * TV Shows Page
 *
 * Dedicated TV shows category page with Netflix-style layout:
 * - Hero banner with a random trending TV show
 * - Multiple category rows (Trending, Popular, Top Rated, Airing Today, On The Air)
 *
 * TV show data is normalized to TmdbMovie shape via normalizeTvToMovie()
 * so all existing components (MovieCard, MovieRow, HeroBanner) work seamlessly.
 */
import { normalizeTvToMovie } from '~/composables/useTmdb'

useHead({
  title: 'TV Shows — DungDee',
  meta: [
    {
      name: 'description',
      content: 'Browse TV shows and series on DungDee. Discover trending, popular, top-rated, and currently airing shows.',
    },
  ],
})

// ─── Data Fetching ─────────────────────────────────────────

const { data: trendingData } = await useTrendingTvShows()
const { data: popularData } = await usePopularTvShows()
const { data: topRatedData } = await useTopRatedTvShows()
const { data: airingTodayData } = await useAiringTodayTvShows()
const { data: onTheAirData } = await useOnTheAirTvShows()
const { data: genresData } = await useTvGenres()

// ─── Computed Properties ───────────────────────────────────

const genreList = computed(() => genresData.value?.genres ?? [])

/** Normalize all TV show data to TmdbMovie shape so components work */
const trendingShows = computed(() =>
  (trendingData.value?.results ?? []).map(normalizeTvToMovie),
)
const popularShows = computed(() =>
  (popularData.value?.results ?? []).map(normalizeTvToMovie),
)
const topRatedShows = computed(() =>
  (topRatedData.value?.results ?? []).map(normalizeTvToMovie),
)
const airingTodayShows = computed(() =>
  (airingTodayData.value?.results ?? []).map(normalizeTvToMovie),
)
const onTheAirShows = computed(() =>
  (onTheAirData.value?.results ?? []).map(normalizeTvToMovie),
)

/**
 * Pick a random TV show from trending results for the hero banner.
 * Only consider shows that have a backdrop image.
 */
const heroShow = computed(() => {
  const candidates = trendingShows.value.filter((m) => m.backdrop_path)
  if (candidates.length === 0) return null
  const index = Math.floor(Math.random() * Math.min(5, candidates.length))
  return candidates[index] ?? null
})
</script>
