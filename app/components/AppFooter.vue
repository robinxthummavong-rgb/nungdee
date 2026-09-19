<template>
  <footer class="mt-12 border-t border-white/5">
    <div class="px-4 sm:px-8 lg:px-12 py-10 sm:py-14">
      <!-- Top Row -->
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
        <!-- Logo -->
        <div class="flex items-center gap-2">
          <Icon name="mdi:movie-open" class="text-2xl text-primary-400" />
          <span class="text-gradient-blue text-xl font-extrabold tracking-tight">DungDee</span>
        </div>

        <!-- Social Icons -->
        <div class="flex items-center gap-3">
          <a
            v-for="social in socials"
            :key="social.icon"
            :href="social.href"
            target="_blank"
            rel="noopener noreferrer"
            class="p-2 text-gray-400 hover:text-primary-400 hover:bg-white/5 rounded-full transition-all duration-200"
            :aria-label="social.label"
          >
            <Icon :name="social.icon" class="text-lg" />
          </a>
        </div>
      </div>

      <!-- Links Grid -->
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8 text-sm">
        <div v-for="col in footerColumns" :key="col.title">
          <h4 class="text-gray-400 font-semibold mb-3 text-xs uppercase tracking-wider">
            {{ col.title }}
          </h4>
          <ul class="space-y-2">
            <li v-for="link in col.links" :key="link">
              <a href="#" class="text-gray-500 hover:text-gray-300 transition-colors duration-200">
                {{ link }}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <!-- Bottom Row -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-white/5 text-xs text-gray-600">
        <p>© {{ currentYear }} DungDee. All rights reserved.</p>
        <p>
          Powered by
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-primary-500 hover:text-primary-400 transition-colors"
          >
            TMDB
          </a>
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
/**
 * AppFooter
 *
 * Site footer with branding, social links, navigation columns,
 * and TMDB attribution.
 */

const currentYear = new Date().getFullYear()

const socials = [
  { icon: 'mdi:facebook', href: '#', label: 'Facebook' },
  { icon: 'mdi:instagram', href: '#', label: 'Instagram' },
  { icon: 'mdi:twitter', href: '#', label: 'Twitter' },
  { icon: 'mdi:youtube', href: '#', label: 'YouTube' },
]

const footerColumns = [
  {
    title: 'Navigation',
    links: ['Home', 'Movies', 'TV Shows', 'My List'],
  },
  {
    title: 'Categories',
    links: ['Action', 'Comedy', 'Drama', 'Thriller'],
  },
  {
    title: 'Help',
    links: ['FAQ', 'Contact Us', 'Terms of Use', 'Privacy'],
  },
  {
    title: 'Account',
    links: ['Sign In', 'Register', 'Settings', 'Subscriptions'],
  },
]
</script>
