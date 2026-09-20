<template>
  <section class="relative w-full h-[70vh] sm:h-[85vh] lg:h-[90vh] overflow-hidden">
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
    <div class="absolute inset-0 bg-surface-900/40 sm:bg-surface-900/30" />

    <!-- Content -->
    <div
      v-if="movie"
      class="relative z-10 flex flex-col justify-end h-full px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24 lg:pb-32 max-w-3xl"
    >
      <!-- Title -->
      <h1
        class="text-2xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight leading-tight mb-3 sm:mb-4 animate-fade-in-up"
      >
        {{ movie.title }}
      </h1>

      <!-- Meta Info -->
      <div class="flex flex-wrap items-center gap-2 sm:gap-3 mb-3 sm:mb-4 animate-fade-in-up" style="animation-delay: 0.1s">
        <!-- Rating Badge -->
        <span class="flex items-center gap-1 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md bg-primary-600/80 text-xs sm:text-sm font-semibold">
          <Icon name="mdi:star" class="text-yellow-400 text-base" />
          {{ formatRating(movie.vote_average) }}
        </span>

        <!-- Year -->
        <span class="text-xs sm:text-sm text-gray-300 font-medium">
          {{ extractYear(movie.release_date) }}
        </span>

        <!-- Genres -->
        <div class="flex flex-wrap gap-1.5 sm:gap-2">
          <span
            v-for="genre in displayedGenres"
            :key="genre"
            class="px-2 sm:px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-white/10 text-gray-200 border border-white/10"
          >
            {{ genre }}
          </span>
        </div>
      </div>

      <!-- Overview -->
      <p
        class="hidden sm:block text-base text-gray-300 leading-relaxed mb-6 max-w-2xl animate-fade-in-up"
        style="animation-delay: 0.2s"
      >
        {{ truncateText(movie.overview, 220) }}
      </p>
      <p
        class="block sm:hidden text-xs text-gray-300 leading-relaxed mb-4 animate-fade-in-up line-clamp-3"
        style="animation-delay: 0.2s"
      >
        {{ truncateText(movie.overview, 120) }}
      </p>

      <!-- Buttons -->
      <div class="flex items-center gap-2 sm:gap-3 animate-fade-in-up" style="animation-delay: 0.3s">
        <NuxtLink
          :to="`/play/${movie.id}`"
          class="flex items-center justify-center gap-1.5 sm:gap-2 flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 bg-white text-surface-900 font-semibold rounded-lg hover:bg-gray-200 transition-all duration-200 text-xs sm:text-base no-underline"
        >
          <Icon name="mdi:play" class="text-lg sm:text-xl" />
          Play
        </NuxtLink>
        <button
          class="flex items-center justify-center gap-1.5 sm:gap-2 flex-1 sm:flex-none px-4 sm:px-6 py-2 sm:py-2.5 glass text-white font-semibold rounded-lg hover:bg-white/20 transition-all duration-200 text-xs sm:text-base"
        >
          <Icon name="mdi:information-outline" class="text-lg sm:text-xl" />
          More Info
        </button>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-else class="relative z-10 flex flex-col justify-end h-full px-4 sm:px-8 lg:px-12 pb-16 sm:pb-24 lg:pb-32 max-w-3xl">
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

// Show fewer genre badges on mobile (handled via a breakpoint-aware computed)
const isMobile = ref(false)

function checkMobile() {
  isMobile.value = window.innerWidth < 640
}

onMounted(() => {
  checkMobile()
  window.addEventListener('resize', checkMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
})

const displayedGenres = computed(() => {
  return isMobile.value ? movieGenres.value.slice(0, 2) : movieGenres.value
})
</script>
