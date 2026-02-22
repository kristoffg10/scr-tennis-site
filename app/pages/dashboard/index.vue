<template>
  <div
    class="min-h-screen w-full relative bg-gradient-to-br from-[#0D2818] via-[#1a3c29] to-[#2d5a3d] overflow-y-auto overflow-x-hidden pt-[150px] pb-16"
  >
    <!-- Texture overlay -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.03]"
      style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"
      aria-hidden="true"
    />
    <!-- Gold glow top right -->
    <div class="glow-orb glow-orb--tr pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A227]/10 rounded-full blur-3xl -z-0" aria-hidden="true" />
    <!-- Gold glow bottom left -->
    <div class="glow-orb glow-orb--bl pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C9A227]/5 rounded-full blur-3xl -z-0" aria-hidden="true" />

    <div class="relative z-10 max-w-6xl mx-auto px-4 lg:px-8 flex flex-col gap-10 dashboard-content">

      <!-- ── Header ── -->
      <header class="flex flex-col gap-1 dashboard-head animate-in">
        <p class="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]/70">Members Portal</p>
        <h1 class="text-3xl md:text-4xl font-semibold text-white leading-tight">
          Welcome back, <span class="text-[#D4AF37]">{{ memberName }}</span>
        </h1>
        <p class="text-sm text-white/50 mt-1">What would you like to do today?</p>
      </header>

      <!-- ── Card Stack Slider (Swiper) ── -->
      <section class="animate-in dashboard-section-1">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-base font-semibold text-white/80 tracking-wide uppercase text-xs">Quick Actions</h2>
          <!-- Nav arrows -->
          <div class="flex items-center gap-2">
            <button
              class="quick-actions-prev w-9 h-9 rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 hover:bg-[#C9A227]/25 flex items-center justify-center text-[#D4AF37] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Previous"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button
              class="quick-actions-next w-9 h-9 rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 hover:bg-[#C9A227]/25 flex items-center justify-center text-[#D4AF37] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Next"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Swiper card slider: mask fades tile edges when partially visible -->
        <div class="quick-actions-mask -mx-4 px-4 md:-mx-8 md:px-8 overflow-hidden">
          <Swiper
            :modules="swiperModules"
            :slides-per-view="'auto'"
            :space-between="16"
            :loop="true"
            :centered-slides="false"
            class="quick-actions-swiper !pb-3"
            @swiper="onSwiper"
            @slide-change="onSlideChange"
            :navigation="{
              prevEl: '.quick-actions-prev',
              nextEl: '.quick-actions-next',
            }"
          >
          <SwiperSlide
            v-for="(tile, index) in tileItems"
            :key="tile.name"
            class="!h-auto"
          >
            <router-link
              :to="tile.link"
              class="block group relative rounded-2xl overflow-hidden border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm hover:border-[#C9A227]/60 hover:bg-white/10 transition-all duration-300 cursor-pointer h-full"
              style="transition: transform 0.25s ease, box-shadow 0.25s ease;"
              @mouseenter="(e) => e.currentTarget.style.transform = 'translateY(-4px)'"
              @mouseleave="(e) => e.currentTarget.style.transform = 'translateY(0)'"
            >
              <!-- Card gold top stripe -->
              <div class="card-stripe h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />

              <div class="p-6 flex flex-col gap-4 h-full">
                <!-- Icon circle -->
                <div class="w-12 h-12 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center flex-shrink-0">
                  <span class="text-[#D4AF37] text-xl" v-html="tile.emoji"></span>
                </div>

                <div class="flex flex-col gap-1 flex-1">
                  <p class="text-base font-semibold text-white group-hover:text-[#D4AF37] transition-colors">{{ tile.name }}</p>
                  <p class="text-xs text-white/45 leading-relaxed">{{ tile.description }}</p>
                </div>

                <!-- Arrow -->
                <div class="flex items-center justify-end">
                  <span class="inline-flex w-7 h-7 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/25 items-center justify-center text-[#D4AF37] group-hover:bg-[#C9A227]/30 transition-all">
                    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                    </svg>
                  </span>
                </div>
              </div>
            </router-link>
          </SwiperSlide>
        </Swiper>
        </div>

        <!-- Dot indicators (pagination) -->
        <div class="flex items-center justify-center gap-2 mt-4">
          <button
            v-for="(tile, i) in tileItems"
            :key="i"
            @click="slideToIndex(i)"
            :class="[
              'rounded-full transition-all duration-300',
              activeIndex === i
                ? 'w-5 h-2 bg-[#D4AF37]'
                : 'w-2 h-2 bg-white/20 hover:bg-white/40'
            ]"
          />
        </div>
      </section>

      <!-- Upcoming Event (left) + Latest Announcement (right) -->
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in dashboard-section-2">
        <!-- Left: Upcoming Event -->
        <div
          class="dashboard-card rounded-2xl overflow-hidden border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm"
        >
          <div class="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <div class="w-8 h-8 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
              </svg>
            </div>
            <h2 class="text-sm font-semibold text-white/90 tracking-wide uppercase">Upcoming Event</h2>
          </div>
          <div class="p-4">
            <template v-if="upcomingEvent">
              <NuxtLink
                :to="`/events/view/${upcomingEvent.id}`"
                class="block group rounded-xl border border-[#C9A227]/20 bg-white/5 hover:border-[#C9A227]/40 hover:bg-white/10 transition-all p-4"
              >
                <p class="text-base font-semibold text-white group-hover:text-[#D4AF37] transition-colors">{{ upcomingEvent.title || '—' }}</p>
                <p class="text-xs text-white/50 mt-1">{{ $moment(upcomingEvent.date).format('ddd, MMM DD, YYYY') }}</p>
                <span class="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-[#D4AF37]">
                  View event
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </NuxtLink>
            </template>
            <p v-else class="text-sm text-white/40 py-4">No upcoming events.</p>
          </div>
        </div>

        <!-- Right: Latest Announcement -->
        <div
          class="dashboard-card rounded-2xl overflow-hidden border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm"
        >
          <div class="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <div class="w-8 h-8 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 1 8.835-2.535m0 0A23.74 23.74 0 0 1 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"/>
              </svg>
            </div>
            <h2 class="text-sm font-semibold text-white/90 tracking-wide uppercase">Latest Announcement</h2>
          </div>
          <div class="p-4">
            <template v-if="latestAnnouncement">
              <button
                type="button"
                @click="showAnnouncementModal = true"
                class="w-full text-left block group rounded-xl border border-[#C9A227]/20 bg-white/5 hover:border-[#C9A227]/40 hover:bg-white/10 transition-all p-4 cursor-pointer"
              >
                <p class="text-base font-semibold text-white group-hover:text-[#D4AF37] transition-colors">{{ latestAnnouncement.title || 'Announcement' }}</p>
                <p class="text-xs text-white/50 mt-1">{{ $moment(latestAnnouncement.date).format('MMM DD, YYYY') }}</p>
                <p v-if="announcementExcerpt" class="text-sm text-white/60 mt-2 line-clamp-2">{{ announcementExcerpt }}</p>
                <span class="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-[#D4AF37]">
                  View details
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </button>
              <NuxtLink
                to="/announcements"
                class="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-[#D4AF37] hover:text-[#C9A227] transition-colors"
              >
                View all announcements
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </NuxtLink>
            </template>
            <p v-else class="text-sm text-white/40 py-4">No announcements yet.</p>
          </div>
        </div>
      </section>

      <!-- Announcement detail modal (from Latest Announcement card) -->
      <AnnouncementPopup
        :show="showAnnouncementModal"
        :announcement="latestAnnouncement || { title: '', content: '', date: null }"
        @dismiss="showAnnouncementModal = false"
        @close="showAnnouncementModal = false"
      />

      <!-- Most Recent Event (score & team) -->
      <section class="animate-in dashboard-section-3">
        <div
          class="dashboard-card rounded-2xl overflow-hidden border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm"
        >
          <div class="flex items-center gap-2 px-4 py-3 border-b border-white/10">
            <div class="w-8 h-8 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"/>
              </svg>
            </div>
            <h2 class="text-sm font-semibold text-white/90 tracking-wide uppercase">Most Recent Event</h2>
          </div>
          <div class="p-4">
            <template v-if="mostRecentEvent">
              <NuxtLink
                :to="`/events/view/${mostRecentEvent.id}`"
                class="block group rounded-xl border border-[#C9A227]/20 bg-white/5 hover:border-[#C9A227]/40 hover:bg-white/10 transition-all p-4"
              >
                <p class="text-base font-semibold text-white group-hover:text-[#D4AF37] transition-colors">{{ mostRecentEvent.title || '—' }}</p>
                <p class="text-xs text-white/50 mt-1">{{ $moment(mostRecentEvent.date).format('ddd, MMM DD, YYYY') }}</p>

                <!-- Teams (doubles/mixed) -->
                <div
                  v-if="(mostRecentEvent.match_type === 'doubles' || mostRecentEvent.match_type === 'mixed') && (mostRecentEvent.team_one_label || mostRecentEvent.team_two_label)"
                  class="mt-3 flex flex-wrap items-center gap-2 text-sm"
                >
                  <span class="text-white/70">{{ mostRecentEvent.team_one_label || '—' }}</span>
                  <span class="text-white/40 font-medium">vs</span>
                  <span class="text-white/70">{{ mostRecentEvent.team_two_label || '—' }}</span>
                </div>

                <!-- Score & Winner -->
                <div v-if="mostRecentEvent.final_score || mostRecentEvent.winner_name" class="mt-3 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <span v-if="mostRecentEvent.final_score" class="text-lg font-bold text-[#D4AF37]">{{ mostRecentEvent.final_score }}</span>
                  <span v-if="mostRecentEvent.winner_name" class="text-sm text-white/80">
                    Winner: <span class="font-medium text-white/90">{{ mostRecentEvent.winner_name }}</span>
                  </span>
                </div>
                <p v-else class="text-sm text-white/40 mt-3">Score not yet recorded.</p>

                <span class="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-[#D4AF37]">
                  View event
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </NuxtLink>
            </template>
            <p v-else class="text-sm text-white/40 py-4">No recent events with results yet.</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useAuthStore } from '~/stores/auth';

const nuxtApp = useNuxtApp();
const swiperModules = [Navigation];

definePageMeta({
  name: 'dashboard',
  middleware: 'authenticator',
});

const auth = useAuthStore();

// Member display name
const memberName = computed(() => {
  const user = auth.user;
  return user?.user_detail?.full_name || user?.email?.split('@')[0] || 'Member';
});

// ── Swiper slider ───────────────────────────────────────
const swiperInstance = ref(null);
const activeIndex = ref(0);

const onSwiper = (swiper) => {
  swiperInstance.value = swiper;
  activeIndex.value = swiper.realIndex;
};

const onSlideChange = (swiper) => {
  activeIndex.value = swiper.realIndex;
};

const slideToIndex = (i) => {
  if (swiperInstance.value) {
    swiperInstance.value.slideToLoop(i);
  }
};

// ── Tile items ───────────────────────────────────────────
const tileItems = computed(() => [
  // {
  //   name: 'Book a Court',
  //   emoji: '🎾',
  //   description: 'Reserve your preferred court and time slot.',
  //   link: '/courts/book',
  // },
  {
    name: 'Schedules',
    emoji: '📅',
    description: 'View upcoming matches and reservations.',
    link: '/schedule',
  },
  {
    name: 'Club Events',
    emoji: '🏆',
    description: 'Browse tournaments, mixers, and social events.',
    link: '/events',
  },
  {
    name: 'Members',
    emoji: '👥',
    description: 'Find and connect with fellow club members.',
    link: '/admin-settings/cms-editors',
  },
  {
    name: 'Announcements',
    emoji: '📢',
    description: 'Stay up-to-date on club news and notices.',
    link: '/announcements',
  },
  {
    name: 'Roles',
    emoji: '🔑',
    description: 'Manage roles and permissions.',
    link: '/admin-settings/roles',
  },
  {
    name: 'My Profile',
    emoji: '👤',
    description: 'Manage your membership details and settings.',
    link: `/admin-settings/cms-editors/${auth.user?.id}/update`,
  },
]);

// ── Permissions ──────────────────────────────────────────
const userUniques = computed(() => {
  const user = auth.user;
  if (!user?.role?.permissions) return [];
  try {
    const raw = user.role.permissions;
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return (parsed || []).map((p) => p?.unique).filter(Boolean);
  } catch {
    return [];
  }
});

const isAuthorized = (unique) => {
  if (auth.isSuperAdmin) return true;
  const list = userUniques.value;
  if (!list.length) return true;
  return list.includes(unique);
};

// ── Upcoming event (left section) ────────────────────────────────────────
const upcomingEvent = ref(null);

const fetchUpcomingEvent = async () => {
  try {
    const nuxtApp = useNuxtApp();
    const todayStr = nuxtApp.$moment().format('YYYY-MM-DD');
    const oneYearLater = nuxtApp.$moment().add(1, 'year').format('YYYY-MM-DD');

    const response = await nuxtApp.$axios.get('/cms/events', {
      params: { from_date: todayStr, to_date: oneYearLater, all: 1 },
    });

    const body = response?.data ?? {};
    let data = [];
    const rec = body.records;
    if (rec && Array.isArray(rec.data)) {
      data = rec.data;
    } else if (Array.isArray(rec)) {
      data = rec;
    } else if (Array.isArray(body.data)) {
      data = body.data;
    }

    const future = data
      .filter((e) => {
        if (!e?.date) return false;
        const eventStr = nuxtApp.$moment(e.date).format('YYYY-MM-DD');
        return eventStr >= todayStr;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    upcomingEvent.value = future.length ? future[0] : null;
  } catch (error) {
    console.error('Upcoming event fetch error:', error);
    upcomingEvent.value = null;
  }
};

// ── Most recent event (past events with score/team) ───────────────────────
const mostRecentEvent = ref(null);

const fetchMostRecentEvent = async () => {
  try {
    const nuxtApp = useNuxtApp();
    const todayStr = nuxtApp.$moment().format('YYYY-MM-DD');
    const oneYearAgo = nuxtApp.$moment().subtract(1, 'year').format('YYYY-MM-DD');

    const response = await nuxtApp.$axios.get('/cms/events', {
      params: { from_date: oneYearAgo, to_date: todayStr, all: 1 },
    });

    const body = response?.data ?? {};
    let data = [];
    const rec = body.records;
    if (rec && Array.isArray(rec.data)) {
      data = rec.data;
    } else if (Array.isArray(rec)) {
      data = rec;
    } else if (Array.isArray(body.data)) {
      data = body.data;
    }

    const past = data
      .filter((e) => {
        if (!e?.date) return false;
        const eventStr = nuxtApp.$moment(e.date).format('YYYY-MM-DD');
        return eventStr < todayStr;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Prefer event that has score/winner/team data; otherwise show most recent past event
    const withScore = past.filter((e) => e.final_score || e.winner_name || e.team_one_label || e.team_two_label);
    mostRecentEvent.value = (withScore.length ? withScore[0] : past[0]) || null;
  } catch (error) {
    console.error('Most recent event fetch error:', error);
    mostRecentEvent.value = null;
  }
};
// Strip HTML and truncate for announcement excerpt
const announcementExcerpt = computed(() => {
  const raw = latestAnnouncement.value?.content;
  if (!raw || typeof raw !== 'string') return '';
  const text = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > 120 ? text.slice(0, 120) + '…' : text;
});

// ── Latest announcement (for dashboard card only) ─────────────────────────
const latestAnnouncement = ref(null);
const showAnnouncementModal = ref(false);

const fetchLatestAnnouncement = async () => {
  try {
    const response = await nuxtApp.$axios.get('/cms/announcements?page=1&per_page=10');
    const rec = response.data?.records;
    const data = Array.isArray(rec) ? rec : rec?.data;
    if (!Array.isArray(data) || !data.length) return;
    const enabledList = data.filter((a) => a.enabled);
    const latest = enabledList.length
      ? enabledList.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))[0]
      : null;
    if (latest) {
      latestAnnouncement.value = latest;
    }
  } catch (error) {
    console.error('Announcement fetch error:', error);
  }
};

onMounted(() => {
  fetchLatestAnnouncement();
  fetchUpcomingEvent();
  fetchMostRecentEvent();
});
</script>

<style scoped>
/* ── Entrance animations ── */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-in {
  animation: fade-in-up 0.5s ease-out forwards;
  opacity: 0;
}

.dashboard-head { animation-delay: 0.05s; }
.dashboard-section-1 { animation-delay: 0.12s; }
.dashboard-section-2 { animation-delay: 0.22s; }
.dashboard-section-3 { animation-delay: 0.32s; }

/* ── Card hover (subtle scale + border) ── */
.dashboard-card {
  transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
}
.dashboard-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  border-color: rgba(201, 162, 39, 0.35);
}

/* ── Gold stripe shimmer on quick-action cards ── */
@keyframes stripe-shine {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.85; }
}
.card-stripe {
  transition: opacity 0.3s ease;
}
.router-link-active .card-stripe,
a:hover .card-stripe {
  animation: stripe-shine 1.2s ease-in-out;
}

/* ── Subtle background glow pulse ── */
@keyframes glow-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.02); }
}
.glow-orb {
  animation: glow-pulse 8s ease-in-out infinite;
}
.glow-orb--bl {
  animation-delay: -2s;
}

/* Swiper overrides for card slider */
.quick-actions-swiper :deep(.swiper-slide) {
  width: 256px;
}
@media (min-width: 768px) {
  .quick-actions-swiper :deep(.swiper-slide) {
    width: 288px;
  }
}

/* Mask so tiles fade at left/right when partially visible */
.quick-actions-mask {
  --fade-width: 56px;
  mask-image: linear-gradient(
    to right,
    transparent 0,
    black var(--fade-width),
    black calc(100% - var(--fade-width)),
    transparent 100%
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent 0,
    black var(--fade-width),
    black calc(100% - var(--fade-width)),
    transparent 100%
  );
  mask-size: 100% 100%;
  -webkit-mask-size: 100% 100%;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
}
@media (min-width: 768px) {
  .quick-actions-mask {
    --fade-width: 72px;
  }
}
</style>