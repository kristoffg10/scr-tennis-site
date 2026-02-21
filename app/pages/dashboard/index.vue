<template>
  <div
    class="min-h-screen w-full relative bg-gradient-to-br from-[#0D2818] via-[#1a3c29] to-[#2d5a3d] overflow-y-auto overflow-x-hidden pt-[220px] pb-16"
  >
    <!-- Texture overlay -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.03]"
      style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"
      aria-hidden="true"
    />
    <!-- Gold glow top right -->
    <div class="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A227]/10 rounded-full blur-3xl -z-0" aria-hidden="true" />
    <!-- Gold glow bottom left -->
    <div class="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C9A227]/5 rounded-full blur-3xl -z-0" aria-hidden="true" />

    <div class="relative z-10 max-w-6xl mx-auto px-4 lg:px-8 flex flex-col gap-10">

      <!-- ── Header ── -->
      <header class="flex flex-col gap-1">
        <p class="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]/70">Members Portal</p>
        <h1 class="text-3xl md:text-4xl font-semibold text-white leading-tight">
          Welcome back, <span class="text-[#D4AF37]">{{ memberName }}</span>
        </h1>
        <p class="text-sm text-white/50 mt-1">What would you like to do today?</p>
      </header>

      <!-- ── Card Stack Slider (Swiper) ── -->
      <section>
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
              <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />

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
      <section class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Left: Upcoming Event -->
        <div
          class="rounded-2xl overflow-hidden border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm"
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
          class="rounded-2xl overflow-hidden border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm"
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
              <NuxtLink
                to="/announcements"
                class="block group rounded-xl border border-[#C9A227]/20 bg-white/5 hover:border-[#C9A227]/40 hover:bg-white/10 transition-all p-4"
              >
                <p class="text-base font-semibold text-white group-hover:text-[#D4AF37] transition-colors">{{ latestAnnouncement.title || 'Announcement' }}</p>
                <p class="text-xs text-white/50 mt-1">{{ $moment(latestAnnouncement.date).format('MMM DD, YYYY') }}</p>
                <p v-if="announcementExcerpt" class="text-sm text-white/60 mt-2 line-clamp-2">{{ announcementExcerpt }}</p>
                <span class="inline-flex items-center gap-1.5 mt-3 text-xs font-medium text-[#D4AF37]">
                  View all announcements
                  <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                  </svg>
                </span>
              </NuxtLink>
            </template>
            <p v-else class="text-sm text-white/40 py-4">No announcements yet.</p>
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
    const nuxtApp = useNuxtApp(); // ← was missing!
    const todayStr = nuxtApp.$moment().format('YYYY-MM-DD');
    const oneYearLater = nuxtApp.$moment().add(1, 'year').format('YYYY-MM-DD');

    const response = await nuxtApp.$axios.get('/cms/events', {
      params: { from_date: todayStr, to_date: oneYearLater, all: 1 },
    });

    const body = response?.data ?? {};

    // Your API returns: { records: { data: [...], current_page: 1, ... } }
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
// Strip HTML and truncate for announcement excerpt
const announcementExcerpt = computed(() => {
  const raw = latestAnnouncement.value?.content;
  if (!raw || typeof raw !== 'string') return '';
  const text = raw.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > 120 ? text.slice(0, 120) + '…' : text;
});

// ── Latest announcement (for dashboard card only) ─────────────────────────
const latestAnnouncement = ref(null);

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
});
</script>

<style scoped>
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