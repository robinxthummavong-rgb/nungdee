/**
 * Movie Modal Composable
 *
 * Global state for the Netflix-style movie detail modal.
 * Any component can open/close the modal by calling open(movie) / close().
 */
import type { TmdbMovie, TmdbGenre } from '~/composables/useTmdb'

interface MovieModalState {
  isOpen: boolean
  movie: TmdbMovie | null
  genres: TmdbGenre[]
}

const state = reactive<MovieModalState>({
  isOpen: false,
  movie: null,
  genres: [],
})

export function useMovieModal() {
  function open(movie: TmdbMovie, genres: readonly TmdbGenre[] = []) {
    state.movie = movie
    state.genres = [...genres]
    state.isOpen = true
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
  }

  function close() {
    state.isOpen = false
    document.body.style.overflow = ''
    // Delay clearing movie data so exit animation can play
    setTimeout(() => {
      if (!state.isOpen) {
        state.movie = null
        state.genres = []
      }
    }, 400)
  }

  return {
    state: readonly(state),
    open,
    close,
  }
}
