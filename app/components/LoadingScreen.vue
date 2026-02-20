<template>
  <Transition name="loading-fade">
    <div
      v-if="isLoading"
      class="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#0D2818] via-[#1a3c29] to-[#2d5a3d]"
      role="status"
      aria-live="polite"
      aria-label="Loading"
    >
      <!-- Texture overlay (same as dashboard) -->
      <div
        class="pointer-events-none absolute inset-0 opacity-[0.03]"
        style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"
        aria-hidden="true"
      />
      <!-- Gold glows -->
      <div class="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A227]/10 rounded-full blur-3xl" aria-hidden="true" />
      <div class="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C9A227]/5 rounded-full blur-3xl" aria-hidden="true" />

      <div class="relative z-10 flex flex-col items-center gap-6">
        <!-- Spinner ring -->
        <div
          class="w-14 h-14 rounded-full border-2 border-[#C9A227]/30 border-t-[#D4AF37] animate-spin"
          aria-hidden="true"
        />
        <!-- Label -->
        <p class="text-sm font-medium tracking-wide text-[#D4AF37]/90">Loading...</p>
        <!-- Progress bar track -->
        <div class="w-48 h-1 rounded-full bg-white/10 overflow-hidden">
          <div
            class="h-full rounded-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37] loading-bar"
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped>
.loading-fade-enter-active,
.loading-fade-leave-active {
  transition: opacity 0.2s ease;
}
.loading-fade-enter-from,
.loading-fade-leave-to {
  opacity: 0;
}

.loading-bar {
  animation: loading-shimmer 1.2s ease-in-out infinite;
  width: 40%;
  min-width: 40%;
}

@keyframes loading-shimmer {
  0% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(150%);
  }
  100% {
    transform: translateX(-100%);
  }
}
</style>
