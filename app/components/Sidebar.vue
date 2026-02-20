<template>
    <div class="h-screen bg-white border-r border-gray-200 shadow-sm relative z-30 flex flex-col" :class="{'min-w-[260px] w-auto' : isSidebarToggled, 'w-[72px]' : !isSidebarToggled}">
        <div class="w-full h-16 border-b border-gray-100 px-4 md:px-6 flex items-center">
            <img v-if="isSidebarToggled" src="/images/inlife-logo.png" alt="inlife_logo" class="w-[130px] h-[44px] object-contain">
        </div>
        <div class="w-full h-[calc(100vh-64px)] overflow-auto px-[16px] py-[12px]" @mouseover="handleMouseOver()" @mouseleave="handleMouseLeave()">
            <div v-for="(item, index) in filteredLinks" :key="item.unique || item.name" class="h-auto" 
            :class="{'min-h-[46px]' : item.unique !== 'dashboard' &&  item.unique !== 'pages', 
            'min-h-[0px]' : !(item.unique !== 'dashboard' &&  item.unique !== 'pages')}">
                <div v-if=" item.unique !== 'dashboard' &&  item.unique !== 'pages'" @click="toggle(item, index)" class="w-full h-full p-[8px] hover:rounded-[10px] hover:bg-ui-hover cursor-pointer group flex justify-between" :class="{'bg-ui-hover rounded-[10px]' : isActiveLink(item.name)}">
                    <div class="flex justify-start items-center gap-x-[8px]">
                        <span class="fill-black group-hover:fill-ui-color transition" v-html="item.icon"></span>
                        <h1 v-show="isSidebarToggled" class="text-base font-[500] text-black group-hover:font-semibold transition" :class="{'font-semibold' : isActiveLink(item.name)}">{{ item.name }}</h1>
                    </div>
                    <span v-show="isSidebarToggled" v-if="subsForLink(item).length">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" class="transition" :class="{'rotate-180' : openedItems[index], 'rotate-0' : !openedItems[index]}">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.66688 13.0522C9.84994 13.2352 10.1467 13.2352 10.3298 13.0522L15.1088 8.27312C15.2919 8.09006 15.2919 7.79331 15.1088 7.61025L14.8878 7.38925C14.7048 7.20619 14.408 7.20619 14.2249 7.38925L9.99831 11.6159L5.77169 7.38925C5.58863 7.20619 5.29188 7.20619 5.10881 7.38925L4.88781 7.61025C4.70475 7.79331 4.70475 8.09006 4.88781 8.27312L9.66688 13.0522Z" fill="#2A2A2A" />
                        </svg>
                    </span>
                </div>
                <div v-else-if="item.unique === 'pages' || item.unique === 'dashboard'" @click="toggle(item, index)" class="w-full h-full p-[8px] hover:rounded-[10px] hover:bg-ui-hover cursor-pointer group flex justify-between" :class="{'bg-ui-hover rounded-[10px]' : isActiveLink(item.name)}">
                    <div class="flex justify-start items-center gap-x-[8px]">
                        <span class="fill-black group-hover:fill-ui-color transition" v-html="item.icon"></span>
                        <h1 v-show="isSidebarToggled" class="text-base font-[500] text-black group-hover:font-semibold transition" :class="{'font-semibold' : isActiveLink(item.name)}">{{ item.name }}</h1>
                    </div>
                    <span v-show="isSidebarToggled" v-if="subsForLink(item).length">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none" class="transition" :class="{'rotate-180' : openedItems[index], 'rotate-0' : !openedItems[index]}">
                            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.66688 13.0522C9.84994 13.2352 10.1467 13.2352 10.3298 13.0522L15.1088 8.27312C15.2919 8.09006 15.2919 7.79331 15.1088 7.61025L14.8878 7.38925C14.7048 7.20619 14.408 7.20619 14.2249 7.38925L9.99831 11.6159L5.77169 7.38925C5.58863 7.20619 5.29188 7.20619 5.10881 7.38925L4.88781 7.61025C4.70475 7.79331 4.70475 8.09006 4.88781 8.27312L9.66688 13.0522Z" fill="#2A2A2A" />
                        </svg>
                    </span>
                </div>
                <div v-show="isSidebarToggled" v-if="subsForLink(item).length && openedItems[index]" class="w-full h-auto py-[6px]">
                    <div v-for="(sub, subIndex) in subsForLink(item)" :key="sub.unique || sub.name || subIndex" class="w-full">
                        <div v-if="item.unique === 'pages'" class="w-full h-full p-[8px] pl-[48px] hover:rounded-[10px] hover:bg-ui-hover cursor-pointer group flex justify-between" :class="{'bg-ui-hover rounded-[10px]' : isActiveLink(sub.name)}">
                                <div @click="toggleSub(sub, item, subIndex)" class="flex justify-start items-center gap-x-[8px] w-full">
                                <h1 class="text-sm font-[500] group-hover:font-semibold transition" :class="{'font-semibold text-ui-color' : isActiveLink(sub.name), 'text-black' : !isActiveLink(sub.name)}">{{ sub.name }}</h1>
                                <span v-if="sub.subs" class="ml-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" class="transition" :class="{'rotate-180' : openedSubItems[`${index}-${subIndex}`], 'rotate-0' : !openedSubItems[`${index}-${subIndex}`]}">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.66688 13.0522C9.84994 13.2352 10.1467 13.2352 10.3298 13.0522L15.1088 8.27312C15.2919 8.09006 15.2919 7.79331 15.1088 7.61025L14.8878 7.38925C14.7048 7.20619 14.408 7.20619 14.2249 7.38925L9.99831 11.6159L5.77169 7.38925C5.58863 7.20619 5.29188 7.20619 5.10881 7.38925L4.88781 7.61025C4.70475 7.79331 4.70475 8.09006 4.88781 8.27312L9.66688 13.0522Z" fill="#2A2A2A" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div v-if="item.unique !== 'pages'" class="w-full h-full p-[8px] pl-[48px] hover:rounded-[10px] hover:bg-ui-hover cursor-pointer group flex justify-between" :class="{'bg-ui-hover rounded-[10px]' : isActiveLink(sub.name)}">
                            <div @click="toggleSub(sub, item, subIndex)" class="flex justify-start items-center gap-x-[8px] w-full">
                                <h1 class="text-sm font-[500] group-hover:font-semibold transition" :class="{'font-semibold text-ui-color' : isActiveLink(sub.name), 'text-black' : !isActiveLink(sub.name)}">{{ sub.name }}</h1>
                                <span v-if="sub.subs" class="ml-auto">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="none" class="transition" :class="{'rotate-180' : openedSubItems[`${index}-${subIndex}`], 'rotate-0' : !openedSubItems[`${index}-${subIndex}`]}">
                                        <path fill-rule="evenodd" clip-rule="evenodd" d="M9.66688 13.0522C9.84994 13.2352 10.1467 13.2352 10.3298 13.0522L15.1088 8.27312C15.2919 8.09006 15.2919 7.79331 15.1088 7.61025L14.8878 7.38925C14.7048 7.20619 14.408 7.20619 14.2249 7.38925L9.99831 11.6159L5.77169 7.38925C5.58863 7.20619 5.29188 7.20619 5.10881 7.38925L4.88781 7.61025C4.70475 7.79331 4.70475 8.09006 4.88781 8.27312L9.66688 13.0522Z" fill="#2A2A2A" />
                                    </svg>
                                </span>
                            </div>
                        </div>
                        <div v-if="sub.subs && openedSubItems[`${index}-${subIndex}`]" class="pl-[64px]">
                            <div v-for="subItem in sub.subs" :key="subItem.name" @click="toggleSub(subItem, item, subIndex)" class="p-[8px] hover:rounded-[10px] hover:bg-ui-hover cursor-pointer">
                                <span class="text-sm font-[500] text-black">{{ subItem.name }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-if=" item.unique !== 'dashboard' &&  item.unique !== 'pages'" class="h-px opacity-10 border-t border-black my-[8px]"></div>
                <div v-if=" item.unique == 'dashboard' || item.unique === 'pages'" class="h-px opacity-10 border-t border-black my-[8px]"></div>
            </div>
        </div>
        <div @click="toggleSidebar()" class="absolute right-[-16px] top-1/2 transform -translate-y-1/2 w-[33px] h-[33px] z-40">
            <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none" class="cursor-pointer drop-shadow-md" :class="{'rotate-180' : !isSidebarToggled, 'rotate-0' : isSidebarToggled}">
                <circle cx="16.5" cy="16.5" r="16.5" fill="#283894"/>
                <path fill-rule="evenodd" clip-rule="evenodd" d="M11.2312 17.5684C10.9229 17.2544 10.9229 16.7455 11.2312 16.4316L19.2801 8.23546C19.5885 7.92151 20.0882 7.92151 20.3966 8.23546L20.7688 8.61443C21.0771 8.92837 21.0771 9.43738 20.7688 9.75133L13.6503 17L20.7688 24.2487C21.0771 24.5626 21.0771 25.0716 20.7688 25.3855L20.3966 25.7645C20.0882 26.0785 19.5885 26.0785 19.2801 25.7645L11.2312 17.5684Z" fill="#FCFCFC"/>
            </svg>
        </div>
    </div>
</template>

<script setup>
﻿import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useSidebarStore } from '~/stores/sidebar';
import { useAuthStore } from '~/stores/auth';
import { useFilterStore } from '~/stores/filters';
import { usePermissionStore } from '~/stores/permissions';

const route = useRoute();
const sidebar = useSidebarStore();
const authStore = useAuthStore();
const filter = useFilterStore();
const permissionStore = usePermissionStore();

// User permission uniques from role (parsed once per computed)
const userUniques = computed(() => {
  const user = authStore.user;
  if (!user?.role?.permissions) return [];
  try {
    const raw = user.role.permissions;
    const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
    return (parsed || []).map((p) => p?.unique).filter(Boolean);
  } catch {
    return [];
  }
});

const hasPermission = (unique) => {
  if (!unique) return false;
  const u = userUniques.value;
  if (u.includes(unique)) return true;
  if (unique === 'articles' && u.includes('news-and-articles')) return true;
  
  // Backward compatibility: old 'admin-settings' permission grants access to new split permissions
  if (u.includes('admin-settings')) {
    if (['cms-editors', 'roles', 'admin-settings-website-settings'].includes(unique)) {
      return true;
    }
  }
  
  // Parent 'plans' permission grants access to all child plan modules
  if (u.includes('plans')) {
    if (['plan-availments', 'plan-faqs', 'plan-highlights', 'plan-riders'].includes(unique)) {
      return true;
    }
  }
  
  return false;
};

const hasAnyPagePermission = computed(
  () =>
    userUniques.value.some((u) => u && u.startsWith('pages-') && u !== 'pages-all')
);

// Show a sidebar link only if the module is in the role's permissions
const filteredLinks = computed(() => {
  const links = sidebar.links || [];
  return links.filter((link) => {
    if (link.unique === 'dashboard') return true;
    // Pages parent is always visible (no permission required)
    if (link.unique === 'pages') return true;
    if (hasPermission(link.unique)) return true;
    const subs = link.subs || [];
    return subs.some((sub) =>
      sub.unique ? hasPermission(sub.unique) : hasPermission(link.unique)
    );
  });
});

// Pages subs for display: show "All Pages" only if user has ALL page permissions
const ALL_PAGES_ENTRY = { name: 'All Pages', slug: '/pages', unique: 'pages-all' };
const pagesSubsForDisplay = computed(() => {
  const pageLink = sidebar.links.find((l) => l.unique === 'pages');
  const subs = pageLink?.subs ?? [];
  
  // Get ALL available page permissions from the permission store (not just the ones in sidebar)
  const allAvailablePagePermissions = permissionStore.permissions.filter(
    (p) => p.unique && p.unique.startsWith('pages-') && p.unique !== 'pages-all'
  );
  
  // Filter subpages - only show those with specific permissions
  const filteredSubs = subs.filter((s) => {
    if (s.unique === 'pages-all') return false;
    return s.unique && hasPermission(s.unique);
  });
  
  // Only show "All Pages" if user has ALL available page permissions from the store
  const hasAllPagePermissions = allAvailablePagePermissions.length > 0 && 
    allAvailablePagePermissions.every((p) => hasPermission(p.unique));
  
  if (hasAllPagePermissions) {
    return [ALL_PAGES_ENTRY, ...filteredSubs];
  }
  
  // Otherwise, just show the filtered subpages they have access to
  return filteredSubs;
});

// Subs to show: for Pages module, ONLY show if user has the specific sub permission
// For other modules, parent permission can grant access to subs
const canShowSub = (sub, parent) => {
  // For Pages module: only specific subpage permissions count (pages-all doesn't grant access)
  if (parent.unique === 'pages') {
    return sub.unique && hasPermission(sub.unique);
  }
  // For other modules: parent permission grants access to all subs
  return hasPermission(parent.unique) || (sub.unique ? hasPermission(sub.unique) : false);
};

const subsForLink = (item) => {
  if (item.unique === 'pages') return pagesSubsForDisplay.value;
  const subs = item.subs || [];
  return subs.filter((sub) => canShowSub(sub, item));
};

const isSidebarToggled = ref(true);
const isHovered = ref(false);
const openedItems = ref({});
const openedSubItems = ref({});

const isActiveLink = (name) => {
    return sidebar.activeLink === name;
};

const toggle = (item, index) => {
    if (!item.subs) {
        navigateTo(item.slug);
        sidebar.setActiveLink(item.name);
    } else {
        openedItems.value[index] = !openedItems.value[index];
        sidebar.setActiveLink(item.name);
    }
};

const toggleSub = (sub, parent, subIndex) => {
    if (sub.subs) {
        const parentIndex = filteredLinks.value.findIndex((l) => l.unique === parent.unique);
        const key = `${parentIndex}-${subIndex}`;
        openedSubItems.value[key] = !openedSubItems.value[key];
        return;
    }

    // Special handling for Pages submenu: drive the Pages filter instead of per-category routes
    if (parent && parent.unique === 'pages') {
        if (sub.categoryKey) {
            // Set filter to this category so /pages shows only matching records
            filter.setName('Category');
            filter.setValue(sub.categoryKey);
        } else {
            // "All Pages" item or anything without a category key
            filter.reset();
        }

        sidebar.setActiveLink(sub.name);
        navigateTo('/pages');
        return;
    }

    // Default behavior for non-Pages sub items
    navigateTo(sub.slug);
    sidebar.setActiveLink(sub.name);
};

const handleMouseOver = () => {
    if (!isSidebarToggled.value && !isHovered.value) {
        isSidebarToggled.value = true;
        isHovered.value = true;
    }
};

const handleMouseLeave = () => {
    if (isSidebarToggled.value && isHovered.value) {
        isSidebarToggled.value = false;
        isHovered.value = false;
    }
};

const toggleSidebar = () => {
    isSidebarToggled.value = !isSidebarToggled.value;
};

onMounted(() => {
    const currentPath = route.path.replace(/^\//, '');
    const pathSegments = route.path.split('/');
    const secondLastSegment = pathSegments.length > 3 ? pathSegments[pathSegments.length - 3] : (currentPath === 'pages' ? 'All Pages' : currentPath);
    const normalized = secondLastSegment.replace(/\b\w/g, (char) => char.toUpperCase());

    filteredLinks.value.forEach((item, index) => {
        if (item.name === normalized) {
            sidebar.setActiveLink(item.name);
        }
        subsForLink(item).forEach((sub) => {
            if (sub.name === normalized) {
                sidebar.setActiveLink(sub.name);
                openedItems.value[index] = true;
            }
        });
    });
});
</script>