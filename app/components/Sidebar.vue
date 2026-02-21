<template>
  <!-- Desktop: always-visible sidebar on the left -->
  <aside
    class="sidebar-desktop hidden md:flex flex-col flex-shrink-0 h-screen sticky top-0 left-0 z-30 w-[260px] bg-gradient-to-br from-[#0D2818] via-[#1a3c29] to-[#2d5a3d] border-r border-[#C9A227]/20"
    aria-label="Main navigation"
  >
    <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
    <!-- Header height so its bottom aligns with topbar bottom (topbar h-[94px]; minus 2px for gold stripe) -->
    <div class="flex items-center h-[92px] px-4 border-b border-[#C9A227]/20 flex-shrink-0">
      <router-link to="/dashboard" class="flex items-center gap-2">
        <!-- <img v-if="logoSrc" :src="logoSrc" alt="Logo" class="h-9 w-auto object-contain max-w-[140px]" />
        <span v-else class="text-lg font-semibold text-white">Members Portal</span> -->
      </router-link>
    </div>
    <nav class="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-2">
      <router-link
        v-for="item in sidebarNavItems"
        :key="item.name"
        :to="item.link"
        class="sidebar-item group flex items-center gap-3 px-4 py-3 rounded-xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm hover:border-[#C9A227]/50 hover:bg-white/10 transition-all duration-200"
        :class="{ 'border-[#C9A227]/50 bg-[#C9A227]/10 text-[#D4AF37]': isActive(item) }"
        @click="onNavClick(item)"
      >
        <span
          class="flex w-10 h-10 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 items-center justify-center text-lg flex-shrink-0 group-hover:bg-[#C9A227]/25 transition-colors"
          v-html="item.emoji"
        />
        <div class="flex flex-col min-w-0 flex-1">
          <span class="text-sm font-semibold text-white group-hover:text-[#D4AF37] transition-colors truncate">{{ item.name }}</span>
          <span class="text-xs text-white/45 truncate">{{ item.description }}</span>
        </div>
        <span class="flex-shrink-0 w-7 h-7 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/25 inline-flex items-center justify-center text-[#D4AF37] group-hover:bg-[#C9A227]/30 transition-all [&_svg]:block">
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </span>
      </router-link>
    </nav>
  </aside>

  <!-- Mobile: overlay drawer (placement controlled by layout/Topbar) - ClientOnly so store reactivity works after hydration -->
  <ClientOnly>
    <Teleport to="body">
      <Transition name="drawer">
        <div
          v-if="mobileOpen"
          class="fixed inset-0 z-[60] md:hidden"
          aria-hidden="true"
        >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          aria-label="Close menu"
          @click="closeMobile"
        />
        <aside
          class="absolute top-0 left-0 bottom-0 w-[min(300px,85vw)] flex flex-col bg-gradient-to-br from-[#0D2818] via-[#1a3c29] to-[#2d5a3d] border-r border-[#C9A227]/20 shadow-2xl"
          role="dialog"
          aria-label="Navigation menu"
        >
          <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
          <div class="flex items-center justify-between h-16 px-4 border-b border-white/10 flex-shrink-0">
            <router-link to="/dashboard" class="flex items-center gap-2" @click="closeMobile">
              <img v-if="logoSrc" :src="logoSrc" alt="Logo" class="h-9 w-auto object-contain max-w-[140px]" />
              <span v-else class="text-lg font-semibold text-white">Members Portal</span>
            </router-link>
            <button
              type="button"
              class="p-2 rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close menu"
              @click="closeMobile"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
          <nav class="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-2">
            <router-link
              v-for="item in sidebarNavItems"
              :key="item.name"
              :to="item.link"
              class="sidebar-item group flex items-center gap-3 px-4 py-3 rounded-xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm hover:border-[#C9A227]/50 hover:bg-white/10 transition-all duration-200"
              :class="{ 'border-[#C9A227]/50 bg-[#C9A227]/10 text-[#D4AF37]': isActive(item) }"
              @click="closeMobile(); onNavClick(item)"
            >
              <span
                class="flex w-10 h-10 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 items-center justify-center text-lg flex-shrink-0"
                v-html="item.emoji"
              />
              <div class="flex flex-col min-w-0 flex-1">
                <span class="text-sm font-semibold text-white truncate">{{ item.name }}</span>
                <span class="text-xs text-white/45 truncate">{{ item.description }}</span>
              </div>
              <span class="flex-shrink-0 w-7 h-7 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/25 inline-flex items-center justify-center text-[#D4AF37] [&_svg]:block">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </span>
            </router-link>
          </nav>
        </aside>
        </div>
      </Transition>
    </Teleport>
    <template #fallback />
  </ClientOnly>
</template>

<script setup>
import { storeToRefs } from 'pinia';
import { useRoute } from 'vue-router';
import { useSidebarStore } from '~/stores/sidebar';
import { useAuthStore } from '~/stores/auth';

const route = useRoute();
const sidebarStore = useSidebarStore();
const authStore = useAuthStore();
const { mobileSidebarOpen: mobileOpen } = storeToRefs(sidebarStore);

// Same tile items as dashboard, excluding My Profile (sidebar shows only these)
const sidebarNavItems = computed(() => {
  const items = [
    {
      name: 'Dashboard',
      emoji: '🏠',
      description: 'Back to home',
      link: '/dashboard',
    },
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
  ];
  return items;
});

const logoSrc = '';

const isActive = (item) => {
  const path = route.path.replace(/^\//, '');
  const link = (item.link || '').replace(/^\//, '');
  if (!link) return false;
  if (link === 'dashboard') return path === 'dashboard' || path === '';
  return path === link || path.startsWith(link + '/');
};

const onNavClick = (item) => {
  sidebarStore.setActiveLink(item.name);
};

const closeMobile = () => {
  sidebarStore.setMobileSidebarOpen(false);
};
</script>

<style scoped>
.drawer-enter-active,
.drawer-leave-active {
  transition: opacity 0.2s ease;
}
.drawer-enter-from,
.drawer-leave-to {
  opacity: 0;
}
.drawer-enter-active aside,
.drawer-leave-active aside {
  transition: transform 0.25s ease;
}
.drawer-enter-from aside,
.drawer-leave-to aside {
  transform: translateX(-100%);
}
</style>
