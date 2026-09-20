/**
 * Movie Modal Composable
 *
 * Global state for the Netflix-style movie detail modal.
 * Any component can open/close the modal by calling open(movie) / close().
 * Supports both movies and TV shows via the mediaType field.
 */
import type { TmdbMovie, TmdbGenre } from '~/composables/useTmdb'

interface MovieModalState {
  isOpen: boolean
  movie: TmdbMovie | null
  genres: TmdbGenre[]
  mediaType: 'movie' | 'tv'
}

const state = reactive<MovieModalState>({
  isOpen: false,
  movie: null,
  genres: [],
  mediaType: 'movie',
})

export function useMovieModal() {
  function open(movie: TmdbMovie, genres: readonly TmdbGenre[] = []) {
    state.movie = movie
    state.genres = [...genres]
    state.mediaType = movie.media_type === 'tv' ? 'tv' : 'movie'
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
        state.mediaType = 'movie'
      }
    }, 400)
  }

  return {
    state: readonly(state),
    open,
    close,
  }
}
