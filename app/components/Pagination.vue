<template>
  <div class="w-full border-t border-[#C9A227]/20 h-16 flex justify-end items-center fixed bottom-0 left-0 right-0 z-10 bg-[#1a3c29] px-4 lg:px-8">
    <div class="flex items-center gap-2 sm:gap-3 flex-wrap justify-end">
      <!-- Page selector -->
      <div class="flex items-center gap-2 group relative">
        <button
          type="button"
          @click="toggled = !toggled"
          class="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#C9A227]/25 bg-[#C9A227]/10 hover:bg-[#C9A227]/20 text-white font-medium text-sm transition-colors"
        >
          <span>{{ pagination.page }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" class="text-[#D4AF37] transition-transform" :class="{ 'rotate-180': toggled }">
            <path fill="currentColor" fill-rule="evenodd" clip-rule="evenodd" d="M10.3331 12.6694C10.1501 12.8524 9.85331 12.8524 9.67025 12.6694L4.8912 7.89031C4.70814 7.70725 4.70814 7.4105 4.8912 7.22744L5.11217 7.00644C5.29523 6.82338 5.59202 6.82338 5.77509 7.00644L10.0017 11.2331L14.2283 7.00644C14.4114 6.82338 14.7081 6.82338 14.8912 7.00644L15.1122 7.22744C15.2952 7.4105 15.2952 7.70725 15.1122 7.89031L10.3331 12.6694Z"/>
          </svg>
        </button>
        <span class="text-sm text-white/50">of</span>
        <span class="text-sm text-white/70 font-medium">{{ pagination.totalPages }} pages</span>

        <!-- Dropdown -->
        <div
          v-if="toggled"
          class="absolute bottom-full mb-2 right-0 min-w-[80px] max-h-[200px] overflow-y-auto rounded-xl border border-[#C9A227]/20 bg-[#1a3c29] shadow-xl z-20 py-2"
        >
          <button
            v-for="page in Array.from({ length: pagination.totalPages }, (_, i) => i + 1)"
            :key="page"
            type="button"
            @click="pagination.setPage(page); toggled = false"
            :class="[
              'w-full px-4 py-2 text-left text-sm transition-colors',
              pagination.page === page
                ? 'bg-[#C9A227]/20 text-[#D4AF37] font-medium'
                : 'text-white/80 hover:bg-[#C9A227]/10 hover:text-[#D4AF37]'
            ]"
          >
            {{ page }}
          </button>
        </div>
      </div>

      <!-- Prev / Next -->
      <div class="flex items-center border border-[#C9A227]/20 rounded-xl overflow-hidden">
        <button
          type="button"
          @click="prevPage()"
          :disabled="pagination.page <= 1"
          class="h-10 w-10 flex items-center justify-center bg-[#C9A227]/10 hover:bg-[#C9A227]/25 text-[#D4AF37] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#C9A227]/10"
          aria-label="Previous page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="22" viewBox="0 0 12 22" fill="currentColor">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M0.277483 11.6947C-0.0924939 11.311 -0.0924939 10.689 0.277483 10.3052L9.93617 0.287781C10.3061 -0.095927 10.9059 -0.095927 11.2759 0.287781L11.7225 0.750971C12.0925 1.13468 12.0925 1.7568 11.7225 2.14052L3.18033 11L11.7225 19.8595C12.0925 20.2432 12.0925 20.8652 11.7225 21.249L11.2759 21.7122C10.9059 22.0959 10.3061 22.0959 9.93617 21.7122L0.277483 11.6947Z"/>
          </svg>
        </button>
        <button
          type="button"
          @click="nextPage()"
          :disabled="pagination.page >= pagination.totalPages"
          class="h-10 w-10 flex items-center justify-center border-l border-[#C9A227]/20 bg-[#C9A227]/10 hover:bg-[#C9A227]/25 text-[#D4AF37] transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-[#C9A227]/10"
          aria-label="Next page"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="22" viewBox="0 0 12 22" fill="currentColor">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M11.7225 11.6947C12.0925 11.311 12.0925 10.689 11.7225 10.3052L2.06383 0.287781C1.69385 -0.095927 1.09411 -0.095927 0.724132 0.287781L0.277483 0.750971C-0.0924943 1.13468 -0.0924943 1.7568 0.277483 2.14052L8.81967 11L0.277483 19.8595C-0.0924945 20.2432 -0.0924945 20.8652 0.277483 21.249L0.724132 21.7122C1.09411 22.0959 1.69385 22.0959 2.06383 21.7122L11.7225 11.6947Z"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { usePaginationStore } from '~/stores/pagination';

const pagination = usePaginationStore();
const toggled = ref(false);

const prevPage = () => {
  pagination.page > 1 ? pagination.setPage(pagination.page - 1) : pagination.setPage(1);
};

const nextPage = () => {
  pagination.page < pagination.totalPages ? pagination.setPage(pagination.page + 1) : pagination.setPage(pagination.totalPages);
};
</script>