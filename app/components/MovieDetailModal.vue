<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modalState.isOpen"
        class="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div class="fixed inset-0 bg-black/80 backdrop-blur-sm" @click="close" />

        <!-- Modal Content -->
        <div
          ref="modalRef"
          class="relative w-full max-w-3xl mx-auto my-6 sm:my-10 rounded-xl overflow-hidden bg-surface-900 shadow-2xl shadow-black/60 animate-modal-in"
        >
          <!-- Close Button -->
          <button
            class="absolute top-3 right-3 z-30 w-9 h-9 flex items-center justify-center rounded-full bg-surface-900/80 hover:bg-surface-800 border border-white/10 transition-all duration-200 cursor-pointer"
            aria-label="Close"
            @click="close"
          >
            <Icon name="mdi:close" class="text-xl text-white" />
          </button>

          <!-- Hero Section with Backdrop -->
          <div class="relative aspect-video w-full overflow-hidden">
            <!-- YouTube Trailer (if available) -->
            <iframe
              ref="ytIframeRef"
              v-if="trailerKey"
              :src="`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&showinfo=0&enablejsapi=1`"
              class="absolute inset-0 w-full h-full"
              frameborder="0"
              allow="autoplay; encrypted-media"
              allowfullscreen
            />
            <!-- Fallback to Backdrop Image -->
            <img
              v-else-if="movie"
              :src="getImageUrl(movie.backdrop_path, 'w1280')"
              :alt="movie.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full skeleton" />

            <!-- Bottom Gradient -->
            <div class="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-surface-900 via-surface-900/80 to-transparent" />

            <!-- Mute/Unmute Button -->
            <button
              v-if="trailerKey"
              class="absolute bottom-8 right-5 sm:bottom-12 sm:right-8 z-20 w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 border-gray-400 hover:border-white text-gray-300 hover:text-white transition-all duration-200 bg-surface-900/60 backdrop-blur-sm cursor-pointer"
              :title="isMuted ? 'เปิดเสียง' : 'ปิดเสียง'"
              :aria-label="isMuted ? 'Unmute' : 'Mute'"
              @click.stop="toggleMute"
            >
              <Icon :name="isMuted ? 'mdi:volume-off' : 'mdi:volume-high'" class="text-lg" />
            </button>

            <!-- Title & Buttons Overlay -->
            <div class="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
              <h2 class="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight mb-3 drop-shadow-lg">
                {{ movie?.title }}
              </h2>
              <div class="flex items-center gap-2 sm:gap-3 flex-wrap">
                <NuxtLink
                  :to="`/play/${movie?.id}`"
                  class="flex items-center gap-2 px-5 sm:px-7 py-2 sm:py-2.5 bg-white text-surface-900 font-bold rounded-md hover:bg-gray-200 transition-all duration-200 text-sm sm:text-base no-underline"
                  @click="close"
                >
                  <Icon name="mdi:play" class="text-xl" />
                  Play
                </NuxtLink>
                <button
                  class="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 border-gray-400 hover:border-white text-gray-300 hover:text-white transition-all duration-200"
                  title="Add to My List"
                >
                  <Icon name="mdi:plus" class="text-xl" />
                </button>
                <button
                  class="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full border-2 border-gray-400 hover:border-white text-gray-300 hover:text-white transition-all duration-200"
                  title="Like"
                >
                  <Icon name="mdi:thumb-up-outline" class="text-lg" />
                </button>
              </div>
            </div>
          </div>

          <!-- Info Section -->
          <div class="px-5 sm:px-8 py-6">
            <!-- Meta Row -->
            <div class="flex flex-wrap items-center gap-3 mb-4">
              <!-- Rating -->
              <span class="flex items-center gap-1 text-primary-400 font-bold text-sm">
                <Icon name="mdi:star" class="text-yellow-400" />
                {{ formatRating(movie?.vote_average ?? 0) }}
              </span>
              <!-- Year -->
              <span class="text-sm text-gray-400 font-medium">
                {{ extractYear(movie?.release_date) }}
              </span>
              <!-- Runtime -->
              <span v-if="detail?.runtime" class="text-sm text-gray-400 font-medium">
                {{ formatRuntime(detail.runtime) }}
              </span>
              <!-- Quality Badge -->
              <span class="px-1.5 py-0.5 border border-gray-500 text-[10px] text-gray-400 font-semibold rounded">
                HD
              </span>
            </div>

            <!-- Tagline -->
            <p v-if="detail?.tagline" class="text-sm italic text-gray-400 mb-3">
              "{{ detail.tagline }}"
            </p>

            <!-- Overview -->
            <p class="text-sm sm:text-base text-gray-300 leading-relaxed mb-6">
              {{ movie?.overview }}
            </p>

            <!-- Details Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-6 mb-8">
              <div class="space-y-2 text-sm">
                <!-- Cast -->
                <p v-if="topCast.length > 0" class="text-gray-400">
                  <span class="text-gray-500">Cast:</span>
                  {{ topCast.join(', ') }}
                </p>
                <!-- Genres -->
                <p v-if="genreNames.length > 0" class="text-gray-400">
                  <span class="text-gray-500">Genres:</span>
                  {{ genreNames.join(', ') }}
                </p>
                <!-- Director -->
                <p v-if="director" class="text-gray-400">
                  <span class="text-gray-500">Director:</span>
                  {{ director }}
                </p>
              </div>
            </div>

            <!-- Cast Section -->
            <div v-if="castMembers.length > 0" class="mb-8">
              <h3 class="text-lg font-bold mb-4">Cast</h3>
              <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
                <div
                  v-for="person in castMembers"
                  :key="person.id"
                  class="text-center"
                >
                  <div class="aspect-square rounded-lg overflow-hidden bg-surface-700 mb-1.5">
                    <img
                      v-if="person.profile_path"
                      :src="getImageUrl(person.profile_path, 'w185')"
                      :alt="person.name"
                      class="w-full h-full object-cover"
                      loading="lazy"
                    />
                    <div v-else class="w-full h-full flex items-center justify-center">
                      <Icon name="mdi:account" class="text-3xl text-gray-600" />
                    </div>
                  </div>
                  <p class="text-xs font-semibold text-gray-200 truncate">{{ person.name }}</p>
                  <p class="text-[10px] text-gray-500 truncate">{{ person.character }}</p>
                </div>
              </div>
            </div>

            <!-- Similar Movies / More Like This -->
            <div v-if="similarMoviesList.length > 0">
              <h3 class="text-lg font-bold mb-4">More Like This</h3>
              <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                <div
                  v-for="sim in similarMoviesList"
                  :key="sim.id"
                  class="group/sim cursor-pointer"
                  @click="switchMovie(sim)"
                >
                  <div class="relative aspect-[2/3] rounded-lg overflow-hidden bg-surface-700">
                    <img
                      :src="getImageUrl(sim.poster_path, 'w342')"
                      :alt="sim.title"
                      class="w-full h-full object-cover transition-transform duration-300 group-hover/sim:scale-105"
                      loading="lazy"
                    />
                    <!-- Hover overlay -->
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover/sim:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-2">
                      <span class="flex items-center gap-0.5 text-xs text-primary-300 font-semibold mb-0.5">
                        <Icon name="mdi:star" class="text-yellow-400 text-[10px]" />
                        {{ formatRating(sim.vote_average) }}
                      </span>
                      <span class="text-[10px] text-gray-400">{{ extractYear(sim.release_date) }}</span>
                    </div>
                  </div>
                  <p class="mt-1.5 text-xs text-gray-300 font-medium truncate">{{ sim.title }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
/**
 * MovieDetailModal
 *
 * Netflix-style popup modal that displays full movie details when a card is clicked.
 * Features:
 * - Backdrop / YouTube trailer hero
 * - Movie metadata (rating, year, runtime, genres)
 * - Cast grid with profile images
 * - "More Like This" similar movies section
 * - Click a similar movie to swap in-place
 */
import { getImageUrl, formatRating, extractYear } from '~/utils/tmdb'
import type { TmdbMovie } from '~/composables/useTmdb'

const { state: modalState, close, open } = useMovieModal()

const movie = computed(() => modalState.movie)
const genres = computed(() => modalState.genres)

const movieId = computed(() => movie.value?.id ?? null)

// ─── Data Fetching ─────────────────────────────────────────

const { data: detailData } = await useMovieDetail(movieId)
const { data: creditsData } = await useMovieCredits(movieId)
const { data: similarData } = await useSimilarMovies(movieId)
const { data: videosData } = await useMovieVideosDynamic(movieId)

// ─── Computed ──────────────────────────────────────────────

const detail = computed(() => detailData.value)

const trailerKey = computed(() => {
  const videos = videosData.value?.results ?? []
  const trailer = videos.find(
    (v) => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'),
  )
  return trailer?.key ?? null
})

const topCast = computed(() => {
  const cast = creditsData.value?.cast ?? []
  return cast.slice(0, 5).map((c) => c.name)
})

const castMembers = computed(() => {
  const cast = creditsData.value?.cast ?? []
  return cast.slice(0, 12)
})

const director = computed(() => {
  const crew = creditsData.value?.crew ?? []
  return crew.find((c) => c.job === 'Director')?.name ?? null
})

const genreNames = computed(() => {
  if (detail.value?.genres) {
    return detail.value.genres.map((g) => g.name)
  }
  if (movie.value && genres.value.length > 0) {
    return movie.value.genre_ids
      .map((id) => genres.value.find((g) => g.id === id)?.name)
      .filter(Boolean) as string[]
  }
  return []
})

const similarMoviesList = computed(() => {
  const results = similarData.value?.results ?? []
  return results.filter((m) => m.poster_path).slice(0, 10)
})

// ─── Methods ───────────────────────────────────────────────

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function switchMovie(newMovie: TmdbMovie) {
  open(newMovie, genres.value)
  // Scroll modal back to top
  nextTick(() => {
    modalRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

const modalRef = ref<HTMLElement | null>(null)

// ─── Mute/Unmute ───────────────────────────────────────────
const ytIframeRef = ref<HTMLIFrameElement | null>(null)
const isMuted = ref(true)

function toggleMute() {
  isMuted.value = !isMuted.value
  const func = isMuted.value ? 'mute' : 'unMute'
  ytIframeRef.value?.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func, args: [] }),
    '*',
  )
}

// Reset mute state when modal reopens (iframe restarts muted)
watch(() => modalState.isOpen, (isOpen) => {
  if (isOpen) {
    isMuted.value = true
  }
})

// Close on Escape key
function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape' && modalState.isOpen) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
/* Modal entrance animation */
@keyframes modal-in {
  from {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.animate-modal-in {
  animation: modal-in 0.35s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* Transition for the whole modal overlay */
.modal-enter-active {
  transition: opacity 0.3s ease;
}
.modal-leave-active {
  transition: opacity 0.25s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
