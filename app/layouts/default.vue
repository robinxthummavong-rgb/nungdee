<template>
  <div class="min-h-screen bg-surface-900 text-white">
    <AppNavbar />
    <main>
      <slot />
    </main>
    <AppFooter />
    <MovieDetailModal />
  </div>
</template>

<script setup lang="ts">
/**
 * Default Layout
 *
 * Provides the persistent page shell: navbar + footer.
 * Page-specific content is injected via the <slot />.
 */
</script>
