<template>
  <Teleport to="body">
    <Transition name="announcement-modal">
      <div
        v-if="show"
        class="fixed inset-0 z-[100] flex items-center justify-center p-4"
        @click.self="dismiss"
      >
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />
        <section
          class="relative w-full max-w-lg rounded-2xl border border-[#C9A227]/30 bg-gradient-to-br from-[#0D2818] via-[#1a3c29] to-[#2d5a3d] shadow-2xl overflow-hidden"
          role="dialog"
          aria-labelledby="announcement-title"
          aria-modal="true"
        >
          <!-- Gold top stripe (newsletter style) -->
          <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />

          <!-- Close button -->
          <button
            type="button"
            @click="dismiss"
            class="absolute top-4 right-4 p-1.5 rounded-lg text-white/50 hover:text-[#D4AF37] hover:bg-white/10 transition-colors z-10"
            aria-label="Close announcement"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <div class="px-6 py-6 sm:px-8 sm:py-8 flex flex-col gap-5">
            <!-- Header -->
            <div class="flex items-start gap-3 pr-8">
              <div class="w-10 h-10 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 1 8.835-2.535m0 0A23.74 23.74 0 0 1 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"/>
                </svg>
              </div>
              <div class="min-w-0 flex-1">
                <p class="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]/80">Club Newsletter</p>
                <h2 id="announcement-title" class="text-lg font-semibold text-white mt-0.5 leading-snug">
                  {{ announcement.title || 'Announcement' }}
                </h2>
                <p v-if="announcement.date" class="text-xs text-white/45 mt-1">
                  {{ $moment(announcement.date).format('MMM DD, YYYY') }}
                </p>
              </div>
            </div>

            <!-- Content (HTML from Quill) -->
            <div
              class="announcement-content text-sm text-white/80 leading-relaxed max-h-[40vh] overflow-y-auto pr-2 rounded-lg bg-white/5 border border-white/10 p-4"
              v-html="announcement.content || ''"
            />

            <!-- Actions -->
            <div class="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-white/10">
              <NuxtLink
                :to="'/announcements'"
                class="inline-flex items-center gap-2 text-sm font-medium text-[#D4AF37] hover:text-[#C9A227] transition-colors"
              >
                View all announcements
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </NuxtLink>
              <button
                type="button"
                @click="dismiss"
                class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C9A227]/20 border border-[#C9A227]/40 text-[#D4AF37] text-sm font-semibold hover:bg-[#C9A227]/30 transition-colors"
              >
                Dismiss
              </button>
            </div>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
const props = defineProps({
  show: { type: Boolean, default: false },
  announcement: {
    type: Object,
    default: () => ({ title: '', content: '', date: null }),
  },
});

const emit = defineEmits(['close', 'dismiss']);

const dismiss = () => {
  emit('dismiss');
  emit('close');
};
</script>

<style scoped>
.announcement-modal-enter-active,
.announcement-modal-leave-active {
  transition: opacity 0.2s ease;
}
.announcement-modal-enter-from,
.announcement-modal-leave-to {
  opacity: 0;
}
.announcement-modal-enter-active section,
.announcement-modal-leave-active section {
  transition: transform 0.25s ease;
}
.announcement-modal-enter-from section,
.announcement-modal-leave-to section {
  transform: scale(0.96);
}

/* Safe HTML content from Quill */
.announcement-content :deep(p) {
  margin-bottom: 0.5em;
}
.announcement-content :deep(p:last-child) {
  margin-bottom: 0;
}
.announcement-content :deep(a) {
  color: #D4AF37;
  text-decoration: underline;
}
.announcement-content :deep(ul),
.announcement-content :deep(ol) {
  padding-left: 1.25em;
  margin: 0.5em 0;
}
</style>
