<template>
    <div class="fixed top-[94px] left-0 md:left-[260px] right-0 z-30 flex flex-col">
      <!-- Back link -->
      <router-link
        v-if="pageTitle.pageFrom"
        :to="pageTitle.pageFromRoute"
        class="flex items-center gap-2 px-4 sm:px-6 py-2.5 bg-[#0D2818]/95 border-b border-[#C9A227]/15 text-[#D4AF37] text-sm font-medium hover:bg-[#1a3c29] transition-colors group backdrop-blur-sm"
      >
        <span class="inline-flex items-center justify-center w-6 h-6 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 group-hover:bg-[#C9A227]/20 transition-colors flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </span>
        <span class="min-w-0 truncate">Back to {{ pageTitle.pageFrom }}</span>
      </router-link>

      <!-- Title + breadcrumbs bar: stack on mobile, row on sm+ -->
      <div class="flex flex-col sm:flex-row sm:items-center gap-0 bg-[#0D2818]/90 border-b border-[#C9A227]/20 backdrop-blur-sm px-4 sm:px-6">
        <!-- Title -->
        <div class="flex items-center gap-3 py-3 sm:pr-6 border-[#C9A227]/20 border-b sm:border-b-0 sm:border-r flex-shrink-0 min-w-0">
          <span class="text-lg font-semibold text-white tracking-tight truncate">{{ pageTitle.title }}</span>
        </div>

        <!-- Breadcrumbs -->
        <nav class="flex items-center py-2.5 sm:py-3 px-0 sm:px-6 overflow-x-auto min-w-0" aria-label="Breadcrumb">
          <ul class="flex items-center gap-1.5 text-sm flex-nowrap whitespace-nowrap">
            <li
              v-for="(crumb, index) in pageTitle.breadcrumbs"
              :key="index"
              class="flex items-center gap-1.5 flex-shrink-0"
            >
              <!-- Separator -->
              <span v-if="index !== 0" class="text-white/20 text-xs">/</span>
              <!-- Last crumb = active -->
              <span
                v-if="index === pageTitle.breadcrumbs.length - 1"
                class="text-[#D4AF37] font-medium"
              >{{ crumb }}</span>
              <!-- Other crumbs -->
              <span v-else class="text-white/35 font-normal">{{ crumb }}</span>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  </template>
  
  <script setup>
  import { usePageTitleStore } from '~/stores/pageTitle';
  import { useRoute } from 'vue-router';
  
  const pageTitle = usePageTitleStore();
  const route = useRoute();
  </script>