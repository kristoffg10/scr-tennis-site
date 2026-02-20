<template>
    <div class="relative w-full p-[16px] bg-offwhite flex flex-col gap-[16px] overflow-y-auto mb-[32px]">
      <Form id="form" @submit="submit()" class="w-full justify-between flex flex-col h-auto min-h-[600px]">
        <div class="w-full gap-[16px] flex flex-col">
  
          <!-- Role Name -->
          <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
            <h2 class="font-semibold text-xl text-start w-full">Role Information</h2>
            <div class="grid grid-cols-1 gap-[16px]">
              <TextField
                label="Role Name"
                name="name"
                v-model="formData.name"
                placeholder="e.g. Role ABC"
                :rules="'required|max:50'"
                optionalMessage="Max 50 characters"
              />
            </div>
          </div>
  
          <!-- Permissions Card -->
          <div class="bg-white p-[16px] flex flex-col gap-[16px] rounded-[10px] w-full">
            <div class="flex flex-col gap-[4px]">
              <h2 class="font-semibold text-xl text-start w-full">Role Permissions</h2>
              <p class="text-sm text-gray-400">Choose which parts of the site this role can edit. You can select multiple.</p>
            </div>
  
            <!-- Summary bar -->
            <div class="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-[10px] px-4 py-3">
              <div class="flex items-center gap-2">
                <span class="text-sm font-medium text-gray-600">Selected:</span>
                <span class="inline-flex items-center justify-center min-w-[24px] h-[24px] rounded-full bg-ui-color text-white text-xs font-bold px-1.5">{{ selectedItems.length }}</span>
                <span class="text-sm text-gray-400">of {{ allPermissionOptions.length }} sections</span>
              </div>
              <div class="flex items-center gap-3">
                <button type="button" @click="toggleSelectAll" class="text-sm font-medium text-ui-color hover:opacity-70 transition">
                  {{ isAllSelected ? 'Deselect All' : 'Select All' }}
                </button>
                <span class="text-gray-200 select-none">|</span>
                <button type="button" @click="clearSelections" class="text-sm font-medium text-danger/60 hover:text-danger transition">
                  Clear All
                </button>
              </div>
            </div>
  
            <!-- Search -->
            <div class="relative">
              <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
              </svg>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Search for a section..."
                class="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-ui-color/20 focus:border-ui-color transition"
              />
              <button v-if="searchQuery" type="button" @click="searchQuery = ''" class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10 8.586L14.95 3.636l1.414 1.414L11.414 10l4.95 4.95-1.414 1.414L10 11.414l-4.95 4.95-1.414-1.414L8.586 10 3.636 5.05 5.05 3.636 10 8.586z" clip-rule="evenodd"/>
                </svg>
              </button>
            </div>
  
            <!-- Grouped permission tiles -->
            <div class="flex flex-col gap-5">
  
              <!-- Search results (flat, no groups) -->
              <template v-if="searchQuery.trim()">
                <div v-if="filteredOptions.length > 0" class="grid grid-cols-2 sm:grid-cols-3 gap-[10px]">
                  <button
                    v-for="option in filteredOptions"
                    :key="option.unique"
                    type="button"
                    @click="toggleItem(option)"
                    :class="[
                      'group flex items-start gap-3 p-3 rounded-[10px] border-2 text-left cursor-pointer transition-all duration-150 w-full',
                      isSelected(option)
                        ? 'border-ui-color bg-ui-color/5 shadow-sm'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    ]"
                  >
                    <span :class="['shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-colors', isSelected(option) ? 'bg-ui-color border-ui-color' : 'border-gray-300 group-hover:border-gray-400']">
                      <svg v-if="isSelected(option)" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </span>
                    <span class="flex flex-col min-w-0">
                      <span class="flex items-center gap-1.5">
                        <span class="text-base leading-none">{{ getTileIcon(option.unique) }}</span>
                        <span :class="['text-sm font-medium leading-snug truncate', isSelected(option) ? 'text-ui-color' : 'text-gray-700']" :title="option.name">{{ option.name }}</span>
                      </span>
                    </span>
                  </button>
                </div>
                <div v-else class="flex flex-col items-center gap-2 py-10 text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-10 h-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p class="text-sm">No sections match <strong>"{{ searchQuery }}"</strong></p>
                </div>
              </template>
  
              <!-- Grouped tiles when not searching -->
              <template v-else>
                <div v-for="group in groupedPermissions" :key="group.label" class="flex flex-col gap-3">
                  <!-- Group header -->
                  <div class="flex items-center gap-3">
                    <div class="flex items-center gap-2">
                      <div class="w-7 h-7 rounded-[7px] flex items-center justify-center shrink-0" :class="group.iconBg">
                        <span v-html="group.icon" class="w-4 h-4" :class="group.iconColor"></span>
                      </div>
                      <span class="text-sm font-semibold text-gray-700">{{ group.label }}</span>
                    </div>
                    <div class="flex-1 h-px bg-gray-100"></div>
                    <button
                      type="button"
                      class="text-xs text-gray-400 hover:text-ui-color transition shrink-0"
                      @click="toggleGroupAll(group)"
                    >
                      {{ isGroupAllSelected(group) ? 'Deselect group' : 'Select all in group' }}
                    </button>
                  </div>
  
                  <!-- Tiles grid -->
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-[10px]">
                    <button
                      v-for="option in group.items"
                      :key="option.unique"
                      type="button"
                      @click="toggleItem(option)"
                      :class="[
                        'group flex items-start gap-3 p-3 rounded-[10px] border-2 text-left cursor-pointer transition-all duration-150 w-full',
                        isSelected(option)
                          ? 'border-ui-color bg-ui-color/5 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                      ]"
                    >
                      <span :class="['shrink-0 mt-0.5 w-5 h-5 rounded-[5px] border-2 flex items-center justify-center transition-colors', isSelected(option) ? 'bg-ui-color border-ui-color' : 'border-gray-300 group-hover:border-gray-400']">
                        <svg v-if="isSelected(option)" xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </span>
                      <span class="flex flex-col min-w-0">
                        <span class="flex items-center gap-1.5">
                          <span class="text-base leading-none">{{ getTileIcon(option.unique) }}</span>
                          <span :class="['text-sm font-medium leading-snug truncate', isSelected(option) ? 'text-ui-color' : 'text-gray-700']" :title="option.name">{{ option.name }}</span>
                        </span>
                      </span>
                    </button>
                  </div>
                </div>
              </template>
            </div>
  
            <ErrorMessage name="permission" class="text-[#F12222] font-[500] text-sm" />
          </div>
        </div>
  
        <!-- Save -->
        <div class="flex self-end justify-self-end gap-[16px] mt-4">
          <button type="submit" class="px-[24px] py-[12px] bg-ui-color text-white text-center rounded-[10px] font-medium hover:opacity-90 transition">
            Create Role
          </button>
        </div>
      </Form>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '~/stores/auth';
  import { usePageTitleStore } from '~/stores/pageTitle';
  import { usePermissionStore } from '~/stores/permissions';
  import { Form, Field, ErrorMessage } from 'vee-validate';
  import { useRoute } from 'vue-router';
  
  definePageMeta({ middleware: 'authenticator' });
  
  const nuxtApp = useNuxtApp();
  const authStore = useAuthStore();
  const route = useRoute();
  const pageTitle = usePageTitleStore();
  const permissionStore = usePermissionStore();
  
  const isClient = ref(false);
  
  const formData = reactive({
    name: '',
  });
  
  const allPermissionOptions = ref([]);
  const allPagesWithCategories = ref([]);
  
  const slugFromPage = (page) => {
    const base = page.slug || page.identifier || (page.name || '').toLowerCase().replace(/ /g, '-').replace(/[^a-z0-9-]/g, '');
    return base ? `pages-${base}` : null;
  };
  
  const fetchPermissionOptions = async () => {
    try {
      const pagesRes = await nuxtApp.$axios.get('/cms/pages?all=1');
      const data = pagesRes.data ?? {};
      let list = data.records;
      if (list && !Array.isArray(list) && list.data) list = list.data;
      if (!Array.isArray(list)) list = data.data ?? [];
  
      // Store all pages with their category info for filtering
      allPagesWithCategories.value = list || [];
      
      // Only show parent/category level permissions from store, not individual child pages
      // Child pages are controlled by their parent category permission
      const storePagePermissions = permissionStore.permissions.filter(
        (p) => p.unique && p.unique.startsWith('pages-') && p.unique !== 'pages-all'
      );
  
      // Filter out child plan permissions - they're controlled by parent 'plans' permission
      const childPlanPermissions = ['plan-availments', 'plan-faqs', 'plan-highlights', 'plan-riders'];
      const nonPagePermissions = permissionStore.permissions.filter(
        (p) => !p.unique.startsWith('pages-') && !childPlanPermissions.includes(p.unique)
      );
      
      allPermissionOptions.value = [...storePagePermissions, ...nonPagePermissions];
    } catch (e) {
      console.error('Error fetching pages for permissions:', e);
      allPermissionOptions.value = [...permissionStore.permissions];
    }
  };
  
  onMounted(async () => {
    pageTitle.setTitle('Add Role');
    pageTitle.setBreadcrumbs(['Admin Settings', 'Roles', 'Add Role']);
    pageTitle.setPageFrom('Roles');
    pageTitle.setPageFromRoute('/admin-settings/roles');
    isClient.value = true;
    await fetchPermissionOptions();
  });
  
  // ─── Icon helper ──────────────────────────────────────────────────────────────
  const ICON_MAP = {
    'pages-': '📄',
    'articles': '📰',
    'agents': '👤',
    'providers': '🏢',
    'leaders': '🏅',
    'annual-reports': '📊',
    'careers': '💼',
    'news-and-articles': '📰',
    'plans': '📋',
    'payment-channels': '💳',
    'inquiries': '✉️',
    'taxonomies': '🗂️',
    'taxonomy-cta': '🔖',
    'admin-settings': '⚙️',
    'roles': '🔑',
    'cms-editors': '✏️',
  };
  
  const getTileIcon = (unique = '') => {
    for (const [key, val] of Object.entries(ICON_MAP)) {
      if (unique.startsWith(key) || unique === key) return val;
    }
    return '📌';
  };
  
  // ─── Group config ─────────────────────────────────────────────────────────────
  const GROUP_CONFIG = {
    pages: {
      label: 'Page Modules',
      order: 1,
      iconBg: 'bg-blue-50',
      iconColor: 'text-blue-500',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>`,
    },
    content: {
      label: 'Content Management',
      order: 2,
      iconBg: 'bg-emerald-50',
      iconColor: 'text-emerald-500',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>`,
    },
    plans: {
      label: 'Plans & Services',
      order: 3,
      iconBg: 'bg-violet-50',
      iconColor: 'text-violet-500',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/></svg>`,
    },
    inquiries: {
      label: 'Inquiries & Forms',
      order: 4,
      iconBg: 'bg-amber-50',
      iconColor: 'text-amber-500',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>`,
    },
    taxonomies: {
      label: 'Taxonomies & Global Settings',
      order: 5,
      iconBg: 'bg-teal-50',
      iconColor: 'text-teal-500',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"/></svg>`,
    },
    system: {
      label: 'System Administration',
      order: 6,
      iconBg: 'bg-rose-50',
      iconColor: 'text-rose-500',
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>`,
    },
  };
  
  // ─── Permissions state ────────────────────────────────────────────────────────
  const selectedItems = ref([]);
  const searchQuery = ref('');
  
  const filteredOptions = computed(() => {
    const q = (searchQuery.value || '').trim().toLowerCase();
    if (!q) return allPermissionOptions.value;
    return allPermissionOptions.value.filter((p) => p.name && p.name.toLowerCase().includes(q));
  });
  
  const groupedPermissions = computed(() => {
    const cats = Object.fromEntries(
      Object.entries(GROUP_CONFIG).map(([k, v]) => [k, { ...v, items: [] }])
    );
  
    allPermissionOptions.value.forEach((option) => {
      const u = option.unique || '';
      if (u.startsWith('pages-')) {
        cats.pages.items.push(option);
      } else if (['articles', 'agents', 'providers', 'leaders', 'annual-reports', 'careers', 'news-and-articles'].includes(u)) {
        cats.content.items.push(option);
      } else if (u.startsWith('plan') || u === 'plans' || u === 'payment-channels') {
        cats.plans.items.push(option);
      } else if (u === 'inquiries') {
        cats.inquiries.items.push(option);
      } else if (u.startsWith('taxonomies') || u === 'taxonomy-cta') {
        cats.taxonomies.items.push(option);
      } else if (u.startsWith('admin-settings') || u === 'roles' || u === 'cms-editors' || u === 'admin-settings-website-settings') {
        cats.system.items.push(option);
      } else {
        cats.content.items.push(option);
      }
    });
  
    return Object.values(cats)
      .filter((g) => g.items.length > 0)
      .sort((a, b) => a.order - b.order);
  });
  
  const isSelected = (option) => selectedItems.value.some((item) => item.unique === option.unique);
  
  const isAllSelected = computed(() => {
    const options = allPermissionOptions.value;
    return options.length > 0 && options.every((opt) => isSelected(opt));
  });
  
  const isGroupAllSelected = (group) => group.items.every((opt) => isSelected(opt));
  
  const toggleItem = (option) => {
    if (isSelected(option)) {
      selectedItems.value = selectedItems.value.filter((s) => s.unique !== option.unique);
    } else {
      selectedItems.value.push(option);
    }
  };
  
  const toggleSelectAll = () => {
    if (isAllSelected.value) {
      selectedItems.value = [];
    } else {
      const existing = new Set(selectedItems.value.map((s) => s.unique));
      allPermissionOptions.value.forEach((opt) => {
        if (!existing.has(opt.unique)) {
          selectedItems.value.push(opt);
          existing.add(opt.unique);
        }
      });
    }
  };
  
  const toggleGroupAll = (group) => {
    if (isGroupAllSelected(group)) {
      const uniques = new Set(group.items.map((o) => o.unique));
      selectedItems.value = selectedItems.value.filter((s) => !uniques.has(s.unique));
    } else {
      const existing = new Set(selectedItems.value.map((s) => s.unique));
      group.items.forEach((opt) => {
        if (!existing.has(opt.unique)) {
          selectedItems.value.push(opt);
          existing.add(opt.unique);
        }
      });
    }
  };
  
  const clearSelections = () => {
    selectedItems.value = [];
  };
  
  // ─── Submit ───────────────────────────────────────────────────────────────────
  const submit = async () => {
    if (selectedItems.value.length === 0) {
      nuxtApp.$toast.error('Please select at least one permission');
      return;
    }
  
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    const filteredPermissions = selectedItems.value.filter((s) => s.unique !== 'pages-all');
    form_data.append('permissions', JSON.stringify(filteredPermissions));
  
    try {
      const response = await nuxtApp.$axios.post('/cms/roles', form_data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      const record = response.data.record;
      nuxtApp.$toast.success('Role created successfully!');
      useRouter().push(`/admin-settings/roles/${record.id}`);
    } catch (error) {
      console.error('Error:', error);
      nuxtApp.$toast.error(error.response?.data?.errors?.[0] ?? 'Create failed');
    }
  };
  </script>image.png