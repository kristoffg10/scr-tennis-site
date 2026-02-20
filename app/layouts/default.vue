<template>
  <div class="flex bg-offwhite h-screen overflow-hidden">
    <template v-if="showChrome">
      <Topbar />
      <div class="flex flex-col w-full overflow-x-auto">
        <PageTitle v-if="route.name !== 'dashboard' && pageTitle.title" />
        <slot />
      </div>
    </template>
    <template v-else>
      <div class="flex flex-col w-full overflow-x-auto">
        <slot />
      </div>
    </template>
  </div>
</template>
<script setup>
import { useAuthStore } from '~/stores/auth'; // Adjust path as necessary
import { useSidebarStore } from '~/stores/sidebar';
import { usePermissionStore } from '~/stores/permissions'; // Adjust path as necessary
import { useRoute } from 'vue-router';
import { usePageTitleStore } from '~/stores/pageTitle';
import { navigateTo } from 'nuxt/app'; // Ensure navigateTo is imported
import { onMounted, onBeforeUnmount } from 'vue';

const authStore = useAuthStore();
const sidebar = useSidebarStore();
const permissionStore = usePermissionStore();
const route = useRoute();
const pageTitle = usePageTitleStore();
const auth = useAuth();
const showChrome = computed(() => route.name !== 'login');

// Timeout duration (e.g., 10 minutes = 600000 milliseconds)
const inactivityTimeout = 1000 * 60 * 60 * 2;
let timeoutId = null;
let lastActivityTime = null;

const signOutUser = async () => {
  try {
    // Offline/headless: skip API logout, just clear store and go to login
    authStore.resetUser();
    await navigateTo('/'); // Redirect to home page or login page after logout
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

// Reset the inactivity timeout when user interacts with the page
const resetTimeout = () => {
  clearTimeout(timeoutId);
  lastActivityTime = new Date().getTime(); // Record the time of the last activity
  startInactivityTimer();
};

// Start the inactivity timer
const startInactivityTimer = () => {
  timeoutId = setTimeout(() => {
    const currentTime = new Date().getTime();
    const timeElapsed = currentTime - lastActivityTime;

    // If the time elapsed is greater than the inactivity timeout, log the user out
    if (timeElapsed >= inactivityTimeout) {
      signOutUser();
    } else {
      // Restart the timer if it hasn't passed the timeout yet
      startInactivityTimer();
    }
  }, inactivityTimeout);
};

// Handle system sleep/hibernate by checking time difference on resume
const checkForSleep = () => {
  const currentTime = new Date().getTime();
  const timeElapsed = currentTime - lastActivityTime;

  if (timeElapsed >= inactivityTimeout) {
    // Auto-logout if the time passed during sleep/hibernate exceeds the timeout
    signOutUser();
  } else {
    // Otherwise, reset the timer and continue tracking activity
    resetTimeout();
  }
};

const handleBeforeUnload = (event) => {
  // Use the new PerformanceNavigationTiming API to check for a reload
  const [navigationEntry] = performance.getEntriesByType('navigation');

  if (navigationEntry && navigationEntry.type === 'reload') {
    // If it's a reload, don't trigger the logout
    return;
  }

  // Optionally, cancel the event as stated by the standard.
  event.preventDefault();

  // Set a flag indicating that a close attempt was made
  const closeAttempt = true;

  // Chrome requires returnValue to show the warning dialog
  event.returnValue = '';

  // Listen for the unload event which actually fires when the page is closed
  window.addEventListener('unload', () => {
    if (closeAttempt) {
      // Only log the user out if the unload event is triggered
      signOutUser();
    }
  });
};


onMounted(() => {
  // Ensure Pages always has at least "All Pages" on mount
  const pageLink = sidebar.links.find(link => link.unique === 'pages');
  if (pageLink && (!pageLink.subs || pageLink.subs.length === 0)) {
    pageLink.subs = [
      {
        name: 'All Pages',
        slug: '/pages',
        unique: 'pages-all',
      },
    ];
  }

  // Fetch records immediately - will be called again when user is available
  if (authStore.user) {
    fetchRecords();
  } else {
    // Even without user, ensure "All Pages" is available
    sidebar.setPages([
      {
        name: 'All Pages',
        slug: '/pages',
        unique: 'pages-all',
      },
    ]);
  }

  lastActivityTime = new Date().getTime(); // Set initial time of activity
  startInactivityTimer(); // Start the timer when the component is mounted

  // Listen for user activity and reset the timer
  window.addEventListener('mousemove', resetTimeout);
  window.addEventListener('keydown', resetTimeout);
  window.addEventListener('scroll', resetTimeout);

  // Listen for when the page regains focus after sleep or hibernate
  window.addEventListener('focus', checkForSleep);


  // Listen for browser/tab close or refresh event
  window.addEventListener('beforeunload', handleBeforeUnload);
});

onBeforeUnmount(() => {
  // Clean up listeners and timeout when the component is destroyed
  clearTimeout(timeoutId);
  window.removeEventListener('mousemove', resetTimeout);
  window.removeEventListener('keydown', resetTimeout);
  window.removeEventListener('scroll', resetTimeout);

  // Remove event listener for focus
  window.removeEventListener('focus', checkForSleep);

  // Remove beforeunload event listener
  window.removeEventListener('beforeunload', handleBeforeUnload);
});


const nuxtApp = useNuxtApp()

const records = ref(null);

// Format slug-like category strings into human-friendly titles
// e.g. "in-patient-availment" -> "In Patient Availment"
const formatCategoryName = (category) => {
  if (!category || typeof category !== 'string') return category;
  return category
    .split('-')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const fetchRecords = async () => {
  try {
    const user = authStore.user;
    let userUniques = [];
    if (user?.role?.permissions) {
      try {
        const raw = user.role.permissions;
        const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
        userUniques = (parsed || []).map((p) => p?.unique).filter(Boolean);
      } catch {
        // ignore
      }
    }
    const hasAnyPagePermission = () =>
      userUniques.includes('pages-all') || userUniques.some((u) => u && u.startsWith('pages-'));
    const hasPageAccess = (unique) =>
      userUniques.includes('pages-all') || userUniques.includes(unique);

    const categoriesResponse = await nuxtApp.$axios.get(`/cms/page-categories`);
    const categories = categoriesResponse.data.record || [];

    const pagesResponse = await nuxtApp.$axios.get(`/cms/pages?all=1`);
    let allPages = [];
    if (pagesResponse.data.records) {
      allPages = Array.isArray(pagesResponse.data.records)
        ? pagesResponse.data.records
        : (pagesResponse.data.records.data || []);
    }

    // Show all pages (not just those with modules), except Search Results
    const pagesWithModules = allPages.filter((page) => {
      const isSearchResults = (page.name || '').trim().toLowerCase() === 'search results';
      return !isSearchResults;
    });

    // Order: All Pages first (only if user has ALL page permissions), then categories, then uncategorized
    let pages = [];

    if (pagesWithModules.length === 0) {
      sidebar.setPages(pages);
      return;
    }

    const uncategorizedPages = [];
    const pagesByCategory = {};
    pagesWithModules.forEach((page) => {
      const category = page.category || null;
      if (category) {
        if (!pagesByCategory[category]) pagesByCategory[category] = [];
        pagesByCategory[category].push(page);
      } else {
        uncategorizedPages.push(page);
      }
    });

    if (categories && categories.length > 0) {
      const categoryItems = categories
        .filter(
          (cat) =>
            cat.category &&
            Array.isArray(pagesByCategory[cat.category]) &&
            pagesByCategory[cat.category].length > 0
        )
        .map((categoryRecord) => {
          const categoryName = categoryRecord.category;
          // Base permission key derived from category name
          const baseKey = categoryName
            .toLowerCase()
            .replace(/&/g, 'and')
            .replace(/'/g, '')
            .replace(/ /g, '-');

          // Default unique permission slug
          let unique = `pages-${baseKey}`;

          // Handle mismatches between category name and permission slug
          // e.g. "Partnerships & Accreditations" → permission key "pages-partnerships-accreditations"
          if (baseKey === 'partnerships-and-accreditations') {
            unique = 'pages-partnerships-accreditations';
          }

          return {
            name: formatCategoryName(categoryName),
            slug: `/pages`,
            unique,
            categoryKey: categoryName,
          };
        })
        .filter((item) => hasPageAccess(item.unique));
      pages = [...pages, ...categoryItems];
    }

    if (uncategorizedPages.length > 0) {
      const uncategorizedItems = uncategorizedPages
        .map((page) => {
          const slugBase =
            page.slug ||
            page.identifier ||
            (page.name || '').toLowerCase().replace(/ /g, '-');
          const unique = `pages-${slugBase}`;
          if (!hasPageAccess(unique)) return null;
          const sections = page.page_sections || [];
          let targetSlug = `/pages/${slugBase}`;
          if (sections.length > 0) {
            const firstSection = sections[0];
            if (firstSection?.id && firstSection?.name) {
              const sectionSlug = firstSection.name.toLowerCase().replace(/ /g, '-');
              targetSlug = `/pages/${slugBase}/${sectionSlug}/${firstSection.id}`;
            }
          }
          const displayName = page.name || formatCategoryName(slugBase);
          return {
            name: displayName,
            slug: targetSlug,
            unique,
          };
        })
        .filter(Boolean);
      pages = [...pages, ...uncategorizedItems];
    }

    // Add "All Pages" at the beginning ONLY if user has ALL available page permissions from the store
    // Get ALL page permissions from permission store (not just the ones we built)
    const allAvailablePagePermissions = permissionStore.permissions.filter(
      (p) => p.unique && p.unique.startsWith('pages-') && p.unique !== 'pages-all'
    );
    
    if (allAvailablePagePermissions.length > 0) {
      const hasAllPages = allAvailablePagePermissions.every((p) => hasPageAccess(p.unique));
      
      if (hasAllPages) {
        pages.unshift({
          name: 'All Pages',
          slug: '/pages',
          unique: 'pages-all',
        });
      }
    }

    sidebar.setPages(pages);
  } catch (error) {
    console.error('Error fetching page categories and pages:', error);
    sidebar.setPages([]);
  }
};

// Call fetchRecords immediately on mount and when user is available
onMounted(() => {
  if (authStore.user) {
    fetchRecords();
  }
});

watch(authStore, () => {
  if (authStore.user) {
    fetchRecords();
  }
}, { immediate: true });

useSeoMeta({
  title: 'SCR Tennis Members Portal',
  ogTitle: 'SCR Tennis Members Portal',
  description: '',
  ogDescription: '',
  // ogImage: '/suntrust_logo.png',
  twitterCard: 'summary_large_image',
});

</script>