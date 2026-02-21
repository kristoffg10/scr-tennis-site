<template>
  <div
    class="min-h-screen w-full relative bg-gradient-to-br from-[#0D2818] via-[#1a3c29] to-[#2d5a3d] overflow-y-auto overflow-x-hidden pt-[220px] pb-16"
  >
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.03]"
      style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"
      aria-hidden="true"
    />
    <div class="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A227]/10 rounded-full blur-3xl" aria-hidden="true" />
    <div class="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C9A227]/5 rounded-full blur-3xl" aria-hidden="true" />

    <div class="relative z-10 max-w-6xl mx-auto px-4 lg:px-8 flex flex-col gap-8">
      <header class="flex flex-col gap-1">
        <p class="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]/70">Admin Settings</p>
        <h1 class="text-3xl md:text-4xl font-semibold text-white leading-tight">
          <span class="text-[#D4AF37]">Roles</span>
        </h1>
        <p class="text-sm text-white/50 mt-1">Manage roles and their permissions.</p>
      </header>

      <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4">
        <div class="flex-1 relative">
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-[#D4AF37]/50 pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
            </svg>
          </span>
          <input
            v-model="keyword"
            type="text"
            placeholder="Search for a role…"
            class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-[#C9A227]/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A227]/60 focus:bg-white/10 transition-all"
          />
        </div>
        <div class="flex items-center gap-4 shrink-0">
          <p v-if="roles && roles.data" class="text-xs text-white/40 hidden sm:block">
            <span class="font-medium text-white/70">{{ roles.total > 0 ? roles.from : 0 }}–{{ roles.total > 0 ? roles.to : 0 }}</span>
            of
            <span class="font-medium text-white/70">{{ roles.total ?? 0 }}</span>
          </p>
          <router-link
            to="/admin-settings/roles/create"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-[#0D2818] text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-[#C9A227]/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Add a New Role
          </router-link>
        </div>
      </div>

      <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
        <div v-if="roles && roles.data && roles.data.length" class="md:hidden divide-y divide-white/5">
          <div
            v-for="role in roles.data"
            :key="role.id"
            class="px-4 sm:px-6 py-4 flex flex-col gap-3 hover:bg-white/5 transition-colors"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-white/90">{{ role.name }}</p>
                  <p class="text-xs text-white/40 mt-0.5">{{ role.users_count ?? 0 }} {{ (role.users_count ?? 0) === 1 ? 'User' : 'Users' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <router-link
                  :to="`/admin-settings/roles/${role.id}`"
                  class="w-8 h-8 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/25 flex items-center justify-center text-[#D4AF37] hover:bg-[#C9A227]/30 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM3.86165 17.4505L13.9334 7.3787L16.5192 9.96448L6.44744 20.0363C6.30784 20.1759 6.13004 20.271 5.93645 20.3097L3.00111 20.8968L3.86165 17.4505Z" fill="currentColor"/>
                  </svg>
                </router-link>
                <button
                  type="button"
                  class="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  :disabled="isDeleteDisabled(role)"
                  @click="!isDeleteDisabled(role) && openDeletePopup(`/cms/roles/${role.id}`)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 23" fill="none">
                    <path d="M7.78 17.78a1.11 1.11 0 001.57 0 1.11 1.11 0 000-1.57V10a1.1 1.1 0 00-1.57-1.56 1.11 1.11 0 000 1.57v6.67zm11.11-13.33h-4.44V3.33a2.22 2.22 0 00-2.22-2.22H8.89a2.22 2.22 0 00-2.22 2.22v1.11H1.11a1.11 1.11 0 000 2.22h1.11v12.22A2.22 2.22 0 005.56 21h10a2.22 2.22 0 002.22-2.22V6.67h1.11a1.11 1.11 0 100-2.22zM7.78 3.33V4.44h5.55V3.33a.56.56 0 00-.55-.55H8.33a.56.56 0 00-.55.55zm7.78 15.56H5.56V6.67h11.11v12.22z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-3 text-xs">
              <span class="text-white/35">Edited {{ $moment(role.updated_at).format('MMM DD, YYYY · hh:mm A') }}</span>
            </div>
          </div>
        </div>

        <div class="hidden md:block overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-white/10">
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/35">Role Name</th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/35">Used by</th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/35 cursor-pointer" @click="toggleSort('date')">
                  <span class="inline-flex items-center gap-1.5">
                    Last Edited
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 18 18" fill="none" class="text-white/35">
                      <path d="M5.22 7.35L8.58 3.16C8.88 2.78 9.37 2.78 9.67 3.16L13.03 7.35C13.33 7.73 13.19 8.05 12.68 8.05H5.57C5.06 8.05 4.92 7.73 5.22 7.35Z" :fill="sortBy === 'updated_at' && sortDirection === 'asc' ? '#D4AF37' : 'currentColor'"/>
                      <path d="M13.03 10.65L9.67 14.84C9.37 15.22 8.88 15.22 8.58 14.84L5.22 10.65C4.92 10.27 5.06 9.95 5.57 9.95H12.68C13.19 9.95 13.33 10.27 13.03 10.65Z" :fill="sortBy === 'updated_at' && sortDirection === 'desc' ? '#D4AF37' : 'currentColor'"/>
                    </svg>
                  </span>
                </th>
                <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-white/35">Actions</th>
              </tr>
            </thead>
            <tbody v-if="roles && roles.data && roles.data.length">
              <tr
                v-for="role in roles.data"
                :key="role.id"
                class="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                      </svg>
                    </div>
                    <span class="text-sm font-semibold text-white/90">{{ role.name }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-white/55">{{ role.users_count ?? 0 }} {{ (role.users_count ?? 0) === 1 ? 'User' : 'Users' }}</td>
                <td class="px-6 py-4 text-xs text-white/55 leading-relaxed">
                  {{ $moment(role.updated_at).format('MMM DD, YYYY') }}<br />
                  <span class="text-white/35">{{ $moment(role.updated_at).format('hh:mm A') }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <router-link
                      :to="`/admin-settings/roles/${role.id}`"
                      class="w-8 h-8 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/25 flex items-center justify-center text-[#D4AF37] hover:bg-[#C9A227]/30 hover:border-[#C9A227]/50 transition-all"
                      :title="`Edit ${role.name}`"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM3.86165 17.4505L13.9334 7.3787L16.5192 9.96448L6.44744 20.0363C6.30784 20.1759 6.13004 20.271 5.93645 20.3097L3.00111 20.8968L3.86165 17.4505Z" fill="currentColor"/>
                      </svg>
                    </router-link>
                    <button
                      type="button"
                      class="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                      :class="isDeleteDisabled(role)
                        ? 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                        : 'bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/25 hover:border-red-400/40'"
                      :disabled="isDeleteDisabled(role)"
                      :title="isDeleteDisabled(role) ? getDeleteDisabledReason(role) : `Delete ${role.name}`"
                      @click="!isDeleteDisabled(role) && openDeletePopup(`/cms/roles/${role.id}`)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 23" fill="none">
                        <path d="M7.78 17.78a1.11 1.11 0 001.57 0 1.11 1.11 0 000-1.57V10a1.1 1.1 0 00-1.57-1.56 1.11 1.11 0 000 1.57v6.67zm11.11-13.33h-4.44V3.33a2.22 2.22 0 00-2.22-2.22H8.89a2.22 2.22 0 00-2.22 2.22v1.11H1.11a1.11 1.11 0 000 2.22h1.11v12.22A2.22 2.22 0 005.56 21h10a2.22 2.22 0 002.22-2.22V6.67h1.11a1.11 1.11 0 100-2.22zM7.78 3.33V4.44h5.55V3.33a.56.56 0 00-.55-.55H8.33a.56.56 0 00-.55.55zm7.78 15.56H5.56V6.67h11.11v12.22z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="!roles?.data?.length" class="px-6 py-16 text-center">
          <div class="w-14 h-14 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="text-[#D4AF37]/50">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
            </svg>
          </div>
          <p class="text-white/30 text-sm">No roles found.</p>
        </div>
      </div>

      <div class="mx-auto w-full">
        <Pagination />
      </div>
    </div>

    <PopupDelete
      v-model:show="showDeletePopup"
      :deletePath="deletePath"
      @delete-success="fetchRecords(1)"
    />
  </div>
  </template>

<script setup>
import { usePageTitleStore } from '~/stores/pageTitle';
import { usePaginationStore } from '~/stores/pagination';

definePageMeta({ middleware: 'authenticator' });

const PopupDelete = defineAsyncComponent(() => import('~/components/popup/delete.vue'));
const Pagination = defineAsyncComponent(() => import('@/components/Pagination.vue'));

const pageTitle = usePageTitleStore();
const pagination = usePaginationStore();
const nuxtApp = useNuxtApp();
const roles = ref(null);
const keyword = ref('');
const showDeletePopup = ref(false);
const deletePath = ref('');
const sortBy = ref('updated_at');
const sortDirection = ref('desc');

const PRIMARY_ROLE_IDS = [
  'fa5e772f-5715-4dea-9922-351e8e27bdab',
  'f269b653-5ef6-4fed-aa4b-1e1c81bdbc99',
];

const reorderRolesWithPriority = (records) => {
  if (!records || !Array.isArray(records.data)) return records;
  const priorityIndex = new Map(PRIMARY_ROLE_IDS.map((id, idx) => [id, idx]));
  const reordered = [...records.data].sort((a, b) => {
    const pa = priorityIndex.has(a.id) ? priorityIndex.get(a.id) : -1;
    const pb = priorityIndex.has(b.id) ? priorityIndex.get(b.id) : -1;
    if (pa === -1 && pb === -1) return 0;
    if (pa === -1) return 1;
    if (pb === -1) return -1;
    return pa - pb;
  });
  return { ...records, data: reordered };
};

const fetchRecords = async () => {
  try {
    const user_response = await nuxtApp.$axios.get(`/cms/roles?page=${pagination.page}&sortBy=${sortBy.value}&sortDirection=${sortDirection.value}&keyword=${keyword.value}`);
    const records = user_response.data.records;
    roles.value = reorderRolesWithPriority(records);
    pagination.setTotalPages(roles.value?.last_page ?? 1);
  } catch (error) {
    console.error('Error:', error);
  }
};

const toggleSort = async (column) => {
  if (sortBy.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc';
  } else {
    sortBy.value = column;
    sortDirection.value = 'asc';
  }
  await fetchRecords();
};

const PROTECTED_ROLE_IDS = [...PRIMARY_ROLE_IDS];
const isDeleteDisabled = (role) => {
  if (!role) return true;
  if (PROTECTED_ROLE_IDS.includes(role.id)) return true;
  return (role.users_count ?? 0) >= 1;
};
const getDeleteDisabledReason = (role) => {
  if (!role) return 'This role cannot be deleted';
  if (PROTECTED_ROLE_IDS.includes(role.id)) return 'This role cannot be deleted';
  const n = role.users_count ?? 0;
  if (n >= 1) return `Cannot delete: ${n} user(s) assigned to this role`;
  return 'This role cannot be deleted';
};

const openDeletePopup = (url) => {
  showDeletePopup.value = true;
  deletePath.value = url;
};

onMounted(() => {
  pagination.reset();
  fetchRecords();
  pageTitle.setTitle('Roles');
  pageTitle.setBreadcrumbs(['Admin Settings', 'Roles']);
  pageTitle.setPageFrom('');
  pageTitle.setPageFromRoute('');
});

watch(keyword, () => { pagination.reset(); fetchRecords(); });
watch(() => pagination.page, () => fetchRecords());
</script>
