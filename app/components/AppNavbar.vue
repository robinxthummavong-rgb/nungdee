<template>
  <nav
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
      isScrolled
        ? 'bg-surface-900/95 backdrop-blur-md shadow-lg shadow-primary-950/30'
        : 'bg-gradient-to-b from-surface-900/80 to-transparent',
    ]"
  >
    <div class="flex items-center justify-between px-4 sm:px-8 lg:px-12 py-3">
      <!-- Logo & Nav Links -->
      <div class="flex items-center gap-6 lg:gap-10">
        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 shrink-0">
          <div class="relative">
            <Icon
              name="mdi:movie-open"
              class="text-3xl sm:text-4xl text-primary-400"
            />
            <div class="absolute -inset-1 bg-primary-500/20 rounded-full blur-md -z-10" />
          </div>
          <span class="text-gradient-blue text-xl sm:text-2xl font-extrabold tracking-tight">
            DungDee
          </span>
        </NuxtLink>

        <!-- Desktop Nav Links -->
        <ul class="hidden lg:flex items-center gap-6 text-sm font-medium">
          <li v-for="link in navLinks" :key="link.label">
            <NuxtLink
              :to="link.to"
              class="text-gray-300 hover:text-white transition-colors duration-200 relative group"
              :class="route.path === link.to ? '' : ''"
            >
              {{ link.label }}
              <span :class="route.path === link.to ? 'absolute -bottom-1 left-0 w-full h-0.5 bg-primary-400 group-hover:w-full transition-all duration-300 rounded' : 'absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-400 group-hover:w-full transition-all duration-300 rounded'" />
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Right Actions -->
      <div class="flex items-center gap-3 sm:gap-4">
        <!-- Search -->
        <button
          class="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
          aria-label="Search"
        >
          <Icon name="mdi:magnify" class="text-xl" />
        </button>

        <!-- Notifications -->
        <button
          class="p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200 hidden sm:block"
          aria-label="Notifications"
        >
          <Icon name="mdi:bell-outline" class="text-xl" />
        </button>

        <!-- Profile Avatar -->
        <button
          class="w-8 h-8 rounded-md bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-sm font-bold hover:ring-2 hover:ring-primary-400 transition-all duration-200"
          aria-label="Profile"
        >
          D
        </button>

        <!-- Mobile menu -->
        <button
          class="lg:hidden p-2 text-gray-300 hover:text-white hover:bg-white/10 rounded-full transition-all duration-200"
          aria-label="Menu"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <Icon :name="isMobileMenuOpen ? 'mdi:close' : 'mdi:menu'" class="text-xl" />
        </button>
      </div>
    </div>

    <!-- Mobile Nav Drawer -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 -translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-2"
    >
      <div
        v-if="isMobileMenuOpen"
        class="lg:hidden glass mx-4 mb-3 rounded-xl overflow-hidden"
      >
        <ul class="flex flex-col p-3 gap-1">
          <li v-for="link in navLinks" :key="link.label">
            <NuxtLink
              :to="link.to"
              class="block px-4 py-2.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-200"
              @click="isMobileMenuOpen = false"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
/**
 * AppNavbar
 *
 * Fixed top navigation bar with:
 * - DungDee logo with blue gradient
 * - Desktop nav links with hover underline
 * - Search, notification, and profile actions
 * - Mobile drawer menu
 * - Transparent → solid background on scroll
 */

 const route = useRoute()

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'Movies', to: '/movies' },
  { label: 'TV Shows', to: '/tv' },
  { label: 'My List', to: '/' },
]

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

function handleScroll() {
  isScrolled.value = window.scrollY > 50
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
