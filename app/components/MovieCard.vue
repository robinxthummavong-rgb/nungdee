<template>
  <div
    class="group relative flex-shrink-0 cursor-pointer transition-transform duration-300 ease-out hover:scale-105 hover:z-10"
    :style="{ width: cardWidth }"
  >
    <!-- Poster -->
    <div class="relative aspect-[2/3] rounded-lg overflow-hidden bg-surface-700">
      <img
        :src="getImageUrl(movie.poster_path, 'w342')"
        :alt="movie.title"
        class="w-full h-full object-cover transition-all duration-300"
        loading="lazy"
      />

      <!-- Hover Overlay -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3"
      >
        <!-- Title -->
        <h3 class="text-sm font-bold leading-tight mb-1.5 line-clamp-2">
          {{ movie.title }}
        </h3>

        <!-- Meta row -->
        <div class="flex items-center gap-2 text-xs mb-2">
          <!-- Rating -->
          <span class="flex items-center gap-0.5 text-primary-300 font-semibold">
            <Icon name="mdi:star" class="text-yellow-400 text-xs" />
            {{ formatRating(movie.vote_average) }}
          </span>
          <!-- Year -->
          <span class="text-gray-400">
            {{ extractYear(movie.release_date) }}
          </span>
        </div>

        <!-- Genre Tags -->
        <div class="flex flex-wrap gap-1">
          <span
            v-for="genre in movieGenreNames"
            :key="genre"
            class="px-1.5 py-0.5 rounded text-[10px] font-medium bg-primary-600/60 text-primary-100"
          >
            {{ genre }}
          </span>
        </div>
      </div>

      <!-- Rating Badge (always visible) -->
      <div class="absolute top-2 right-2 flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-surface-900/80 text-xs font-semibold opacity-0 group-hover:opacity-0 sm:opacity-100">
        <Icon name="mdi:star" class="text-yellow-400 text-[10px]" />
        <span class="text-primary-200">{{ formatRating(movie.vote_average) }}</span>
      </div>
    </div>

    <!-- Title below poster (visible when not hovering) -->
    <p class="mt-2 text-xs sm:text-sm text-gray-300 font-medium truncate group-hover:text-white transition-colors duration-200">
      {{ movie.title }}
    </p>
  </div>
</template>

<script setup lang="ts">
/**
 * MovieCard
 *
 * Individual movie poster card used inside MovieRow carousels.
 * Shows poster image, and on hover reveals title, rating, year, and genre badges.
 */
import { getImageUrl, formatRating, extractYear, getGenreNames } from '~/utils/tmdb'
import type { TmdbMovie, TmdbGenre } from '~/composables/useTmdb'

interface Props {
  movie: TmdbMovie
  genres: TmdbGenre[]
  cardWidth?: string
}

const props = withDefaults(defineProps<Props>(), {
  genres: () => [],
  cardWidth: '180px',
})

const movieGenreNames = computed(() => {
  return getGenreNames(props.movie.genre_ids, props.genres).slice(0, 2)
})
</script>
