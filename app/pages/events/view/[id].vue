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
          <p class="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]/70">Club Events</p>
          <h1 class="text-3xl md:text-4xl font-semibold text-white leading-tight">
            View <span class="text-[#D4AF37]">Event</span>
          </h1>
        </div>
        <div class="shrink-0 mt-1 flex items-center gap-2">
          <span v-if="eventData?.event_type" class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#C9A227]/15 text-[#D4AF37] border border-[#C9A227]/25 capitalize">
            <span class="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            {{ eventData.event_type }}
          </span>
          <span v-if="eventData?.event_status" class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 text-white/80 border border-white/15 capitalize">
            {{ eventData.event_status }}
          </span>
        </div>
      </header>

      <!-- Loading -->
      <template v-if="!eventData">
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
        <!-- Event Information -->
        <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
          <div class="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-base font-semibold text-white">Event Information</h2>
            </div>
          </div>
          <div class="p-6 flex flex-col gap-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Title</span>
                <p class="text-sm font-medium text-white/90">{{ eventData.title || '—' }}</p>
              </div>
              <div class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Event Date</span>
                <p class="text-sm text-white/80">{{ eventData.date ? $moment(eventData.date).format('MMM DD, YYYY') : '—' }}</p>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Location</span>
                <p class="text-sm text-white/80">{{ eventData.location || '—' }}</p>
              </div>
              <div class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Event Type</span>
                <p class="text-sm text-white/80 capitalize">{{ eventData.event_type || '—' }}</p>
              </div>
            </div>
            <div v-if="eventData.content" class="flex flex-col gap-1.5">
              <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Description</span>
              <div
                class="rounded-xl border border-[#C9A227]/20 bg-white/5 p-4 text-sm text-white/85 prose prose-invert prose-sm max-w-none event-content"
                v-html="eventData.content"
              />
            </div>
          </div>
        </div>

        <!-- Match Result / Score (only if any score data set) -->
        <div
          v-if="hasScoreData"
          class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden"
        >
          <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
          <div class="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"/>
              </svg>
            </div>
            <div>
              <h2 class="text-base font-semibold text-white">Match Result</h2>
              <p class="text-xs text-white/40">Final score and winner</p>
            </div>
          </div>
          <div class="p-6 flex flex-col gap-5">
            <template v-if="(eventData.match_type === 'doubles' || eventData.match_type === 'mixed') && (eventData.team_one_label || eventData.team_two_label)">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div v-if="eventData.team_one_label" class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Team / Pair 1</span>
                  <p class="text-sm text-white/90">{{ eventData.team_one_label }}</p>
                </div>
                <div v-if="eventData.team_two_label" class="flex flex-col gap-1.5">
                  <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Team / Pair 2</span>
                  <p class="text-sm text-white/90">{{ eventData.team_two_label }}</p>
                </div>
              </div>
            </template>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div v-if="eventData.final_score" class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Final Score</span>
                <p class="text-lg font-semibold text-[#D4AF37]">{{ eventData.final_score }}</p>
              </div>
              <div v-if="eventData.winner_name" class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Winner</span>
                <p class="text-sm font-medium text-white/90">{{ eventData.winner_name }}</p>
              </div>
            </div>
            <div v-if="eventData.match_notes" class="flex flex-col gap-1.5">
              <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Match Notes</span>
              <p class="text-sm text-white/80">{{ eventData.match_notes }}</p>
            </div>
          </div>
        </div>

        <!-- Tennis-Specific Fields (only if any set) -->
        <div
          v-if="eventData.match_type || eventData.format || eventData.scoring_format || eventData.assigned_coach"
          class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden"
        >
          <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
          <div class="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M3.75 9h16.5m-7.5 6h.008v.008h-.008V15zM3.75 3.75h.008v.008H3.75V3.75zm0 12h.008v.008H3.75v-.008zm12 0h.008v.008h-.008v-.008zm0-12h.008v.008h-.008V3.75z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-base font-semibold text-white">Tennis-Specific</h2>
              <p class="text-xs text-white/40">Match type, format, scoring, assigned coach</p>
            </div>
          </div>
          <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div v-if="eventData.match_type" class="flex flex-col gap-1.5">
              <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Match Type</span>
              <p class="text-sm text-white/80 capitalize">{{ eventData.match_type }}</p>
            </div>
            <div v-if="eventData.format" class="flex flex-col gap-1.5">
              <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Format</span>
              <p class="text-sm text-white/80">{{ formatLabel(eventData.format) }}</p>
            </div>
            <div v-if="eventData.scoring_format" class="flex flex-col gap-1.5">
              <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Scoring Format</span>
              <p class="text-sm text-white/80">{{ eventData.scoring_format }}</p>
            </div>
            <div v-if="eventData.assigned_coach" class="flex flex-col gap-1.5">
              <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Assigned Coach</span>
              <p class="text-sm text-white/80">{{ eventData.assigned_coach }}</p>
            </div>
          </div>
        </div>

        <!-- Gallery -->
        <div v-if="eventGallery.length" class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
          <div class="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-base font-semibold text-white">Gallery</h2>
              <p class="text-xs text-white/40">{{ eventGallery.length }} image(s)</p>
            </div>
          </div>
          <div class="p-6">
            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <button
                v-for="(img, i) in eventGallery"
                :key="img.id || i"
                type="button"
                class="aspect-[4/3] rounded-xl overflow-hidden border border-white/10 bg-white/5 cursor-pointer hover:border-[#C9A227]/40 hover:ring-2 hover:ring-[#C9A227]/30 transition-all text-left focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50 focus:ring-offset-2 focus:ring-offset-[#1a3c29]"
                @click="openLightbox(i)"
              >
                <img
                  :src="img.url || img.path || img.src"
                  :alt="img.alt || eventData.title"
                  class="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            </div>
          </div>
        </div>

        <!-- Image lightbox -->
        <Teleport to="body">
          <Transition name="lightbox">
            <div
              v-if="lightboxOpen"
              class="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
              role="dialog"
              aria-modal="true"
              aria-label="View image"
              @click.self="closeLightbox"
            >
              <button
                type="button"
                class="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                aria-label="Close"
                @click="closeLightbox"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
              <button
                v-if="eventGallery.length > 1"
                type="button"
                class="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                aria-label="Previous image"
                @click.stop="prevLightbox"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              <button
                v-if="eventGallery.length > 1"
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                aria-label="Next image"
                @click.stop="nextLightbox"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              <img
                v-if="currentLightboxImage"
                :src="currentLightboxImage.url || currentLightboxImage.path || currentLightboxImage.src"
                :alt="currentLightboxImage.alt || eventData.title"
                class="max-w-full max-h-[90vh] w-auto h-auto object-contain select-none"
                draggable="false"
                @click.stop
              />
              <p v-if="eventGallery.length > 1" class="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
                {{ lightboxIndex + 1 }} / {{ eventGallery.length }}
              </p>
            </div>
          </Transition>
        </Teleport>

        <!-- Actions -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <router-link
            to="/schedule"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-white/60 text-sm font-medium hover:border-white/30 hover:text-white/80 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Schedule
          </router-link>
          <router-link
            v-if="eventsCrud.update"
            :to="`/events/${route.params.id}`"
            class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-[#0D2818] text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-[#C9A227]/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"/>
            </svg>
            Edit Event
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePageTitleStore } from '~/stores/pageTitle';

definePageMeta({ middleware: 'authenticator' });

const route = useRoute();
const pageTitle = usePageTitleStore();
const nuxtApp = useNuxtApp();
const id = route.params.id;
const { getModuleCrud } = useModuleCrud();
const eventsCrud = computed(() => getModuleCrud('events'));

const eventData = ref(null);
const eventGallery = ref([]);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

const currentLightboxImage = computed(() => {
  const list = eventGallery.value;
  const idx = lightboxIndex.value;
  if (!list.length || idx < 0 || idx >= list.length) return null;
  return list[idx];
});

const hasScoreData = computed(() => {
  const d = eventData.value;
  if (!d) return false;
  return !!(d.final_score || d.winner_name || d.match_notes || d.team_one_label || d.team_two_label);
});

function openLightbox(index) {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
}

function closeLightbox() {
  lightboxOpen.value = false;
}

function prevLightbox() {
  const n = eventGallery.value.length;
  if (n <= 1) return;
  lightboxIndex.value = (lightboxIndex.value - 1 + n) % n;
}

function nextLightbox() {
  const n = eventGallery.value.length;
  if (n <= 1) return;
  lightboxIndex.value = (lightboxIndex.value + 1) % n;
}

function onLightboxKeydown(e) {
  if (!lightboxOpen.value) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') prevLightbox();
  if (e.key === 'ArrowRight') nextLightbox();
}

onMounted(() => {
  window.addEventListener('keydown', onLightboxKeydown);
  pageTitle.setTitle('View Event');
  pageTitle.setBreadcrumbs(['Schedule', 'View Event']);
  pageTitle.setPageFrom('Schedule');
  pageTitle.setPageFromRoute('/schedule');
  fetchRecord();
});

onUnmounted(() => {
  window.removeEventListener('keydown', onLightboxKeydown);
});

function formatLabel(value) {
  const labels = { round_robin: 'Round Robin', knockout: 'Knockout', ladder: 'Ladder', timed_play: 'Timed Play' };
  return labels[value] || value;
}

async function fetchRecord() {
  try {
    const response = await nuxtApp.$axios.get(`/cms/events/${id}`);
    eventData.value = response.data.record;
    const data = eventData.value;
    const gallery = data?.gallery
      || data?.images?.filter((img) => img.category === 'event_gallery')
      || data?.images
      || [];
    eventGallery.value = Array.isArray(gallery) ? gallery : [];
  } catch (error) {
    console.error('Error:', error);
    nuxtApp.$toast?.error(error?.response?.data?.message || 'Failed to load event.');
  }
}
</script>

<style scoped>
.event-content :deep(p) { margin-bottom: 0.5rem; }
.event-content :deep(p:last-child) { margin-bottom: 0; }
.event-content :deep(a) { color: #D4AF37; text-decoration: underline; }
.event-content :deep(ul), .event-content :deep(ol) { padding-left: 1.25rem; margin: 0.5rem 0; }

.lightbox-enter-active,
.lightbox-leave-active {
  transition: opacity 0.2s ease;
}
.lightbox-enter-from,
.lightbox-leave-to {
  opacity: 0;
}
.lightbox-enter-active img,
.lightbox-leave-active img {
  transition: transform 0.2s ease;
}
.lightbox-enter-from img,
.lightbox-leave-to img {
  transform: scale(0.95);
}
</style>
