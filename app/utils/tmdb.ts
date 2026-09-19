/**
 * TMDB Utility Helpers
 *
 * Pure helper functions for formatting and transforming TMDB data.
 * No API calls — those live in composables/useTmdb.ts
 */

/** Base URL for TMDB image CDN */
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p'

/** Available poster sizes on TMDB CDN */
export type PosterSize = 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original'

/** Available backdrop sizes on TMDB CDN */
export type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original'

/**
 * Build a full image URL from a TMDB file path.
 * Returns a placeholder if the path is null/undefined.
 */
export function getImageUrl(
  path: string | null | undefined,
  size: PosterSize | BackdropSize = 'w500',
): string {
  if (!path) {
    return 'https://via.placeholder.com/500x750/0f1629/3b82f6?text=No+Image'
  }
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

/**
 * Resolve genre IDs to their display names.
 */
export function getGenreNames(
  genreIds: number[],
  genreList: { id: number; name: string }[],
): string[] {
  return genreIds
    .map((id) => genreList.find((g) => g.id === id)?.name)
    .filter(Boolean) as string[]
}

/**
 * Format a vote average (0-10) to a single decimal string.
 */
export function formatRating(vote: number): string {
  return vote.toFixed(1)
}

/**
 * Extract the year from a TMDB date string (YYYY-MM-DD).
 */
export function extractYear(dateString: string | null | undefined): string {
  if (!dateString) return 'N/A'
  return dateString.split('-')[0] ?? 'N/A'
}

/**
 * Truncate text to a maximum length, appending an ellipsis if needed.
 */
export function truncateText(text: string, maxLength: number = 200): string {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trimEnd() + '…'
}
