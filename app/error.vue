<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-offwhite p-[16px]">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-[#283894] mb-4">{{ error.statusCode || 404 }}</h1>
      <h2 class="text-2xl font-semibold text-black/70 mb-4">{{ error.statusMessage || 'Page Not Found' }}</h2>
      <p class="text-base text-black/60 mb-8">The page you're looking for doesn't exist.</p>
      <button
        @click="handleError"
        class="px-[24px] py-[12px] bg-[#283894] text-white rounded-[10px] font-medium hover:bg-[#1f2a6b] transition"
      >
        Go Back Home
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps(['error'])

const handleError = () => clearError({ redirect: '/' })

useHead({
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/inlife-favicon.ico' },
    { rel: 'shortcut icon', type: 'image/x-icon', href: '/inlife-favicon.ico' },
  ],
})
</script>
