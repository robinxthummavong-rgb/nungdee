/**
 * TMDB API Proxy
 *
 * Catch-all server route that proxies requests to the TMDB API v3.
 * Keeps the API key on the server side — never exposed to the browser.
 *
 * Usage:  /api/tmdb/trending/movie/week  →  https://api.themoviedb.org/3/trending/movie/week
 */

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const apiKey = config.tmdbApiKey

  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'TMDB API key is not configured',
    })
  }

  // Extract the dynamic path segments
  const path = getRouterParam(event, 'path') || ''

  // Forward any query params from the original request
  const query = getQuery(event)
  const queryParams = new URLSearchParams(query as Record<string, string>)
  queryParams.set('api_key', apiKey)

  const url = `https://api.themoviedb.org/3/${path}?${queryParams.toString()}`

  try {
    const data = await $fetch(url)
    return data
  }
  catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 502,
      statusMessage: error?.statusMessage || 'Failed to fetch from TMDB',
    })
  }
})
