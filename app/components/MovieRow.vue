<template>
  <section class="relative px-4 sm:px-8 lg:px-12 mb-8 sm:mb-10">
    <!-- Section Header -->
    <div class="flex items-center justify-between mb-3 sm:mb-4">
      <h2 class="text-lg sm:text-xl lg:text-2xl font-bold tracking-tight">
        {{ title }}
      </h2>
      <button
        class="text-xs sm:text-sm text-primary-400 hover:text-primary-300 font-medium transition-colors duration-200 flex items-center gap-1"
      >
        See All
        <Icon name="mdi:chevron-right" class="text-base" />
      </button>
    </div>

    <!-- Carousel Container -->
    <div class="group/row relative">
      <!-- Left Scroll Button -->
      <button
        v-show="canScrollLeft"
        class="absolute left-0 top-0 bottom-8 z-20 w-10 sm:w-12 flex items-center justify-center bg-gradient-to-r from-surface-900/90 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 cursor-pointer"
        aria-label="Scroll left"
        @click="scrollBy(-1)"
      >
        <Icon name="mdi:chevron-left" class="text-2xl sm:text-3xl text-white drop-shadow-lg" />
      </button>

      <!-- Scrollable Row -->
      <div
        ref="scrollContainer"
        class="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide scroll-smooth pb-2"
        @scroll="updateScrollState"
      >
        <!-- Loading Skeletons -->
        <template v-if="!movies || movies.length === 0">
          <div
            v-for="i in 8"
            :key="`skeleton-${i}`"
            class="flex-shrink-0"
            :style="{ width: cardWidth }"
          >
            <div class="aspect-[2/3] skeleton rounded-lg" />
            <div class="h-3 w-3/4 skeleton rounded mt-2" />
          </div>
        </template>

        <!-- Movie Cards -->
        <MovieCard
          v-for="movie in movies"
          :key="movie.id"
          :movie="movie"
          :genres="genres"
          :card-width="cardWidth"
        />
      </div>

      <!-- Right Scroll Button -->
      <button
        v-show="canScrollRight"
        class="absolute right-0 top-0 bottom-8 z-20 w-10 sm:w-12 flex items-center justify-center bg-gradient-to-l from-surface-900/90 to-transparent opacity-0 group-hover/row:opacity-100 transition-opacity duration-300 cursor-pointer"
        aria-label="Scroll right"
        @click="scrollBy(1)"
      >
        <Icon name="mdi:chevron-right" class="text-2xl sm:text-3xl text-white drop-shadow-lg" />
      </button>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * MovieRow
 *
 * Horizontal scrollable carousel of MovieCards.
 * - Section title with "See All" link
 * - Left/right scroll buttons appear on row hover
 * - Loading skeletons while data is pending
 */
import type { TmdbMovie, TmdbGenre } from '~/composables/useTmdb'

interface Props {
  title: string
  movies: TmdbMovie[]
  genres: TmdbGenre[]
  cardWidth?: string
}

withDefaults(defineProps<Props>(), {
  movies: () => [],
  genres: () => [],
  cardWidth: '180px',
})

const scrollContainer = ref<HTMLElement | null>(null)
const canScrollLeft = ref(false)
const canScrollRight = ref(true)

function updateScrollState() {
  const el = scrollContainer.value
  if (!el) return
  canScrollLeft.value = el.scrollLeft > 20
  canScrollRight.value = el.scrollLeft < el.scrollWidth - el.clientWidth - 20
}

function scrollBy(direction: 1 | -1) {
  const el = scrollContainer.value
  if (!el) return
  const amount = el.clientWidth * 0.75
  el.scrollBy({ left: direction * amount, behavior: 'smooth' })
}

onMounted(() => {
  nextTick(updateScrollState)
})
</script>
