<template>
  <div class="player-page" @mousemove="showControls" @click="showControls">
    <!-- Full-screen Player -->
    <div class="fixed inset-0 bg-black z-0">
      <iframe
        v-if="movieId"
        ref="playerIframe"
        :src="playerSrc"
        class="w-full h-full"
        frameborder="0"
        allowfullscreen
        allow="autoplay; fullscreen"
      />
    </div>

    <!-- Top overlay for move mouse for show/hide controll bar -->
    <div class="fixed top-0 w-full h-24 z-30" @mousemove="showControls" @click="showControls" />

    <!-- Top Overlay Bar -->
    <Transition name="fade-slide-down">
      <div
        v-show="controlsVisible"
        class="fixed top-0 left-0 right-0 z-30 player-top-bar"
      >
        <div class="flex items-center gap-4 px-4 sm:px-8 py-4">
          <!-- Back Button -->
          <button
            class="flex items-center gap-2 text-white/80 hover:text-white transition-colors duration-200 cursor-pointer group"
            @click="goBack"
          >
            <div class="w-10 h-10 flex items-center justify-center rounded-full bg-white/10 group-hover:bg-white/20 backdrop-blur-md transition-all duration-200">
              <Icon name="mdi:arrow-left" class="text-xl" />
            </div>
            <span class="hidden sm:inline text-sm font-medium">Back</span>
          </button>

          <!-- Movie Title -->
          <div v-if="detail" class="flex-1 min-w-0">
            <h1 class="text-white text-sm sm:text-lg font-semibold truncate">
              {{ detail.title }}
            </h1>
            <div class="flex items-center gap-2 text-xs text-white/50">
              <span v-if="detail.release_date">{{ extractYear(detail.release_date) }}</span>
              <span v-if="detail.runtime" class="hidden sm:inline">·</span>
              <span v-if="detail.runtime" class="hidden sm:inline">{{ formatRuntime(detail.runtime) }}</span>
              <span v-if="detail.vote_average" class="hidden sm:inline">·</span>
              <span v-if="detail.vote_average" class="hidden sm:inline flex items-center gap-0.5">
                <Icon name="mdi:star" class="text-yellow-400 text-[10px]" />
                {{ formatRating(detail.vote_average) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Loading State -->
    <div v-if="pending" class="fixed inset-0 z-20 flex items-center justify-center bg-black">
      <div class="flex flex-col items-center gap-4">
        <div class="w-12 h-12 border-2 border-primary-500 border-t-transparent rounded-full animate-spin" />
        <p class="text-white/60 text-sm">Loading player...</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Play Page — /play/:id
 *
 * Full-screen cinematic movie player using vidsrc.sh embed.
 * Features:
 * - Immersive full-viewport player
 * - Auto-hiding top bar with movie info and back button
 * - Resume playback support via localStorage
 * - Player event listening for progress tracking
 */
import { extractYear, formatRating } from '~/utils/tmdb'
import type { TmdbMovieDetail } from '~/composables/useTmdb'

// Use a blank layout (no navbar/footer)
definePageMeta({
  layout: false,
})

const route = useRoute()
const router = useRouter()
const movieId = computed(() => Number(route.params.id))

// ─── Data Fetching ─────────────────────────────────────────

const { data: detail, pending } = await useMovieDetail(computed(() => movieId.value))

// ─── SEO ───────────────────────────────────────────────────

useHead({
  title: computed(() => detail.value ? `${detail.value.title} — DungDee` : 'Playing — DungDee'),
  meta: [
    {
      name: 'description',
      content: computed(() => detail.value?.overview ?? 'Watch now on DungDee'),
    },
  ],
})

// ─── Player Source ─────────────────────────────────────────

const playerSrc = computed(() => {
  const id = movieId.value
  if (!id) return ''

  // Check for saved progress to resume
  let savedProgress: string | null = null
  if (import.meta.client) {
    savedProgress = localStorage.getItem(`watch_progress_${id}`)
  }

  const base = `https://vidsrc.sh/embed/movie/${id}`
  const params = new URLSearchParams()
  params.set('autoplay', '1')

  if (savedProgress && Number(savedProgress) > 30) {
    params.set('startAt', String(Math.floor(Number(savedProgress))))
  }

  return `${base}?${params.toString()}`
})

// ─── Auto-hide Controls ───────────────────────────────────

const controlsVisible = ref(true)
let hideTimeout: ReturnType<typeof setTimeout> | null = null

function showControls() {
  controlsVisible.value = true
  document.body.style.cursor = ''
  resetHideTimer()
}

function resetHideTimer() {
  if (hideTimeout) clearTimeout(hideTimeout)
  hideTimeout = setTimeout(() => {
    controlsVisible.value = false
    // Hide cursor when controls hide (Netflix-style)
    document.body.style.cursor = 'none'
  }, 3000)
}

// ─── Player Events (progress tracking) ────────────────────

function handlePlayerEvent(event: MessageEvent) {
  if (!event.data || event.data.type !== 'PLAYER_EVENT') return
  const { player_status, player_progress } = event.data.data ?? {}

  if (player_status === 'playing' && player_progress != null) {
    localStorage.setItem(`watch_progress_${movieId.value}`, String(player_progress))
  }

  if (player_status === 'completed') {
    localStorage.removeItem(`watch_progress_${movieId.value}`)
  }
}

// ─── Helpers ──────────────────────────────────────────────

function formatRuntime(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return h > 0 ? `${h}h ${m}m` : `${m}m`
}

function goBack() {
  if (window.history.length > 1) {
    router.back()
  } else {
    router.push('/')
  }
}

// ─── Lifecycle ────────────────────────────────────────────

onMounted(() => {
  resetHideTimer()
  window.addEventListener('message', handlePlayerEvent)
  // Hide cursor when controls are hidden
  document.body.style.overflow = 'hidden'
})

onUnmounted(() => {
  if (hideTimeout) clearTimeout(hideTimeout)
  window.removeEventListener('message', handlePlayerEvent)
  document.body.style.overflow = ''
  document.body.style.cursor = ''
})
</script>

<style scoped>
.player-page {
  position: fixed;
  inset: 0;
  background: #000;
  cursor: default;
}

.player-top-bar {
  background: linear-gradient(
    to bottom,
    rgba(0, 0, 0, 0.85) 0%,
    rgba(0, 0, 0, 0.5) 60%,
    transparent 100%
  );
  pointer-events: auto;
}

/* Transition: fade + slide down from top */
.fade-slide-down-enter-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-slide-down-leave-active {
  transition: opacity 0.4s ease, transform 0.4s ease;
}
.fade-slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}
.fade-slide-down-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.animate-spin {
  animation: spin 1s linear infinite;
}
</style>
