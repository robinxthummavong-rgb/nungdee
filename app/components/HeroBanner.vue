<template>
  <section class="relative w-full h-[85vh] sm:h-[90vh] overflow-hidden">
    <!-- Backdrop Image -->
    <div class="absolute inset-0">
      <img
        v-if="movie"
        :src="getImageUrl(movie.backdrop_path, 'original')"
        :alt="movie.title"
        class="w-full h-full object-cover object-top animate-fade-in"
      />
      <div v-else class="w-full h-full skeleton" />
    </div>

    <!-- Gradient Overlays -->
    <div class="absolute inset-0 gradient-overlay-left" />
    <div class="absolute inset-0 gradient-overlay-bottom" />

    <!-- Additional dark overlay for readability -->
    <div class="absolute inset-0 bg-surface-900/30" />

    <!-- Content -->
    <div
      v-if="movie"
      class="relative z-10 flex flex-col justify-end h-full px-4 sm:px-8 lg:px-12 pb-24 sm:pb-32 max-w-3xl"
    >
      <!-- Title -->
      <h1
        class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-4 animate-fade-in-up"
      >
        {{ movie.title }}
      </h1>

      <!-- Meta Info -->
      <div class="flex flex-wrap items-center gap-3 mb-4 animate-fade-in-up" style="animation-delay: 0.1s">
        <!-- Rating Badge -->
        <span class="flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary-600/80 text-sm font-semibold">
          <Icon name="mdi:star" class="text-yellow-400 text-base" />
          {{ formatRating(movie.vote_average) }}
        </span>

        <!-- Year -->
        <span class="text-sm text-gray-300 font-medium">
          {{ extractYear(movie.release_date) }}
        </span>

        <!-- Genres -->
        <div class="flex flex-wrap gap-2">
          <span
            v-for="genre in movieGenres"
            :key="genre"
            class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/10 text-gray-200 border border-white/10"
          >
            {{ genre }}
          </span>
        </div>
      </div>

      <!-- Overview -->
      <p
        class="text-sm sm:text-base text-gray-300 leading-relaxed mb-6 max-w-2xl animate-fade-in-up"
        style="animation-delay: 0.2s"
      >
        {{ truncateText(movie.overview, 220) }}
      </p>

      <!-- Buttons -->
      <div class="flex items-center gap-3 animate-fade-in-up" style="animation-delay: 0.3s">
        <button
          class="flex items-center gap-2 px-6 py-2.5 bg-white text-surface-900 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 text-sm sm:text-base"
        >
          <Icon name="mdi:play" class="text-xl" />
          Play
        </button>
        <button
          class="flex items-center gap-2 px-6 py-2.5 glass text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 text-sm sm:text-base"
        >
          <Icon name="mdi:information-outline" class="text-xl" />
          More Info
        </button>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-else class="relative z-10 flex flex-col justify-end h-full px-4 sm:px-8 lg:px-12 pb-24 sm:pb-32 max-w-3xl">
      <div class="h-12 w-96 max-w-full skeleton rounded-lg mb-4" />
      <div class="h-5 w-64 max-w-full skeleton rounded mb-4" />
      <div class="h-20 w-full skeleton rounded mb-6" />
      <div class="flex gap-3">
        <div class="h-11 w-28 skeleton rounded-lg" />
        <div class="h-11 w-36 skeleton rounded-lg" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * HeroBanner
 *
 * Full-viewport hero section that showcases a featured movie.
 * Displays backdrop image with gradient overlays, title, rating,
 * genre badges, overview, and action buttons.
 */
import { getImageUrl, formatRating, extractYear, truncateText, getGenreNames } from '~/utils/tmdb'

interface Props {
  movie: import('~/composables/useTmdb').TmdbMovie | null
  genres: import('~/composables/useTmdb').TmdbGenre[]
}

const props = withDefaults(defineProps<Props>(), {
  movie: null,
  genres: () => [],
})

const movieGenres = computed(() => {
  if (!props.movie) return []
  return getGenreNames(props.movie.genre_ids, props.genres).slice(0, 3)
})
</script>
