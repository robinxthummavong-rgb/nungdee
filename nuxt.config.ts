// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: [
    '@nuxt/eslint',
    '@nuxt/content',
    '@nuxt/a11y',
    '@nuxt/icon',
    '@nuxt/fonts',
  ],

  css: ['~/assets/css/main.css'],

  vite: {
    plugins: [tailwindcss()],
  },

  runtimeConfig: {
    // Server-only — never sent to the client
    tmdbApiKey: process.env.TMDB_API_KEY || '',
  },

  app: {
    head: {
      title: 'DungDee — Watch Movies Online',
      htmlAttrs: { lang: 'en' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'DungDee — Your premium destination for discovering and watching the best movies. Browse trending, popular, top-rated, and upcoming films.',
        },
        { name: 'theme-color', content: '#0a0e1a' },
      ],
      link: [
        {
          rel: 'preconnect',
          href: 'https://image.tmdb.org',
        },
      ],
    },
  },

  fonts: {
    families: [
      { name: 'Inter', provider: 'google', weights: [300, 400, 500, 600, 700, 800, 900] },
    ],
  },

  icon: {
    serverBundle: 'local',
  },
})