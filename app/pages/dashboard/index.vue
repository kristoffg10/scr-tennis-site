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
    </div>

    <!-- Newsletter-style announcement popup (pops up upon login / dashboard visit) -->
    <AnnouncementPopup
      :show="showAnnouncementPopup"
      :announcement="latestAnnouncement || {}"
      @dismiss="onAnnouncementDismiss"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { useAuthStore } from '~/stores/auth';

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
    name: 'Member Directory',
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
  const list = userUniques.value;
  if (!list.length) return true;
  return list.includes(unique);
};

// ── Announcement popup (newsletter on dashboard load) ─────────────────────
const latestAnnouncement = ref(null);
const showAnnouncementPopup = ref(false);
const ANNOUNCEMENT_DISMISSED_KEY = 'dashboard-announcement-dismissed-id';

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
      const dismissedId = typeof sessionStorage !== 'undefined' ? sessionStorage.getItem(ANNOUNCEMENT_DISMISSED_KEY) : null;
      if (String(latest.id) !== dismissedId) {
        showAnnouncementPopup.value = true;
      }
    }
  } catch (error) {
    console.error('Announcement fetch error:', error);
  }
};

const onAnnouncementDismiss = () => {
  showAnnouncementPopup.value = false;
  if (latestAnnouncement.value?.id && typeof sessionStorage !== 'undefined') {
    sessionStorage.setItem(ANNOUNCEMENT_DISMISSED_KEY, String(latestAnnouncement.value.id));
  }
};

onMounted(() => {
  fetchLatestAnnouncement();
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