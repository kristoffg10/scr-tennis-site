<template>
  <div
    class="min-h-screen w-full relative bg-gradient-to-br from-[#0D2818] via-[#1a3c29] to-[#2d5a3d] overflow-y-auto overflow-x-hidden pt-[220px] pb-16"
  >
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.03]"
      style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"
      aria-hidden="true"
    />
    <div class="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A227]/10 rounded-full blur-3xl -z-0" aria-hidden="true" />
    <div class="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C9A227]/5 rounded-full blur-3xl -z-0" aria-hidden="true" />

    <div class="relative z-10 max-w-4xl mx-auto px-4 lg:px-8 flex flex-col gap-8">
      <!-- Header -->
      <header class="flex items-start justify-between gap-4">
        <div class="flex flex-col gap-1">
          <h1 class="text-3xl md:text-4xl font-semibold text-white leading-tight">
            View <span class="text-[#D4AF37]">Announcement</span>
          </h1>
        </div>

      </header>

      <!-- Loading -->
      <template v-if="!announcementData">
        <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden animate-pulse">
          <div class="h-1 w-full bg-[#C9A227]/30" />
          <div class="p-6 flex flex-col gap-4">
            <div class="h-5 w-48 bg-white/10 rounded-lg" />
            <div class="grid grid-cols-2 gap-4">
              <div class="h-11 bg-white/10 rounded-xl" />
              <div class="h-11 bg-white/10 rounded-xl" />
            </div>
            <div class="h-40 bg-white/10 rounded-xl" />
          </div>
        </div>
      </template>

      <!-- Content (read-only) -->
      <template v-else>
        <!-- Announcement Information -->
        <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
          <div class="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 1 8.835-2.535m0 0A23.74 23.74 0 0 1 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"/>
              </svg>
            </div>
            <div>
              <h2 class="text-base font-semibold text-white">{{ announcementData.title || '—' }}</h2>
            </div>
          </div>
          <div class="p-6 flex flex-col gap-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Date</span>
                <p class="text-sm text-white/80">{{ announcementData.date ? $moment(announcementData.date).format('MMM DD, YYYY') : '—' }}</p>
              </div>
            </div>
            <div v-if="announcementData.content" class="flex flex-col gap-1.5">
              <span class="text-xs font-semibold uppercase tracking-wider text-white/50"> </span>
              <div
                class="rounded-xl border border-[#C9A227]/20 bg-white/5 p-4 text-sm text-white/85 prose prose-invert prose-sm max-w-none announcement-content"
                v-html="announcementData.content"
              />
            </div>
            <div v-if="announcementData.updated_at" class="text-xs text-white/40 mt-2">
              Last edited {{ $moment(announcementData.updated_at).format('MMM DD, YYYY · hh:mm A') }}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <router-link
            to="/announcements"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-white/60 text-sm font-medium hover:border-white/30 hover:text-white/80 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Announcements
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePageTitleStore } from '~/stores/pageTitle';

definePageMeta({ middleware: 'authenticator' });

const route = useRoute();
const pageTitle = usePageTitleStore();
const nuxtApp = useNuxtApp();
const id = route.params.id;

const announcementData = ref(null);

onMounted(() => {
  pageTitle.setTitle('View Announcement');
  pageTitle.setBreadcrumbs(['Announcements', 'Announcements List', 'View Announcement']);
  pageTitle.setPageFrom('Announcements List');
  pageTitle.setPageFromRoute('/announcements');
  fetchRecord();
});

async function fetchRecord() {
  try {
    const response = await nuxtApp.$axios.get(`/cms/announcements/${id}`);
    announcementData.value = response.data.record;
  } catch (error) {
    console.error('Error:', error);
    nuxtApp.$toast?.error(error?.response?.data?.message || 'Failed to load announcement.');
  }
}
</script>

<style scoped>
.announcement-content :deep(p) { margin-bottom: 0.5rem; }
.announcement-content :deep(p:last-child) { margin-bottom: 0; }
.announcement-content :deep(a) { color: #D4AF37; text-decoration: underline; }
.announcement-content :deep(ul), .announcement-content :deep(ol) { padding-left: 1.25rem; margin: 0.5rem 0; }
</style>
