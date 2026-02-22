<template>
  <div class="min-h-screen w-full relative bg-gradient-to-br from-[#0D2818] via-[#1a3c29] to-[#2d5a3d] overflow-y-auto overflow-x-hidden pt-[220px] pb-16">
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
          <p class="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]/70">User Settings</p>
          <h1 class="text-3xl md:text-4xl font-semibold text-white leading-tight">
            View <span class="text-[#D4AF37]">Member</span>
          </h1>
          <p class="text-sm text-white/50 mt-1">Member details (read-only).</p>
        </div>
        <div v-if="userData?.role?.name" class="shrink-0 mt-1">
          <span class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#C9A227]/15 text-[#D4AF37] border border-[#C9A227]/25">
            <span class="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            {{ userData.role.name }}
          </span>
        </div>
      </header>

      <!-- Loading -->
      <template v-if="loading">
        <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden animate-pulse">
          <div class="h-1 w-full bg-[#C9A227]/30" />
          <div class="p-6 flex flex-col gap-4">
            <div class="h-14 w-14 rounded-full bg-white/10 mx-auto" />
            <div class="h-5 w-48 bg-white/10 rounded-lg mx-auto" />
            <div class="grid grid-cols-2 gap-4">
              <div class="h-11 bg-white/10 rounded-xl" />
              <div class="h-11 bg-white/10 rounded-xl" />
            </div>
          </div>
        </div>
      </template>

      <!-- Not found -->
      <template v-else-if="!userData">
        <div class="rounded-2xl border border-red-500/20 bg-red-500/10 px-8 py-10 text-center text-red-300 text-sm">
          Member not found or failed to load.
        </div>
      </template>

      <!-- Content (read-only) -->
      <template v-else>
        <!-- User Information -->
        <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
          <div class="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-base font-semibold text-white">User Information</h2>
              <p class="text-xs text-white/40">Basic details for this membership account.</p>
            </div>
          </div>
          <div class="p-6 flex flex-col gap-6">
            <!-- Profile image + name -->
            <div class="flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <div class="w-20 h-20 rounded-full bg-[#C9A227]/15 border-2 border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] text-2xl font-semibold shrink-0 overflow-hidden">
                <img
                  v-if="profileImageUrl"
                  :src="profileImageUrl"
                  :alt="userData?.user_detail?.full_name ?? userData?.email ?? 'Member'"
                  class="w-full h-full object-cover"
                />
                <span v-else>{{ initials(userData) }}</span>
              </div>
              <div class="flex-1 text-center sm:text-left">
                <h3 class="text-lg font-semibold text-white">{{ userData?.user_detail?.full_name ?? userData?.email ?? '—' }}</h3>
                <a v-if="userData?.email" :href="`mailto:${userData.email}`" class="text-sm text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors">{{ userData.email }}</a>
              </div>
            </div>
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold uppercase tracking-wider text-white/50">First Name</span>
                <p class="text-sm text-white/80">{{ userData?.user_detail?.first_name ?? '—' }}</p>
              </div>
              <div class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Last Name</span>
                <p class="text-sm text-white/80">{{ userData?.user_detail?.last_name ?? '—' }}</p>
              </div>
              <div class="flex flex-col gap-1.5 sm:col-span-2">
                <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Email Address</span>
                <p class="text-sm text-white/80">
                  <a v-if="userData?.email" :href="`mailto:${userData.email}`" class="text-[#D4AF37] hover:underline">{{ userData.email }}</a>
                  <span v-else>—</span>
                </p>
              </div>
              <div class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Role</span>
                <p class="text-sm text-white/80">{{ userData?.role?.name ?? '—' }}</p>
              </div>
              <div class="flex flex-col gap-1.5">
                <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Status</span>
                <span :class="[
                  'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full w-fit',
                  userData?.enabled ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' : 'bg-white/10 text-white/50 border border-white/15'
                ]">
                  <span class="w-1.5 h-1.5 rounded-full" :class="userData?.enabled ? 'bg-emerald-400' : 'bg-white/30'" />
                  {{ userData?.enabled ? 'Enabled' : 'Disabled' }}
                </span>
              </div>
            </div>
            <div v-if="userData?.updated_at || userData?.created_at" class="text-xs text-white/40 pt-2 border-t border-white/10">
              Last updated {{ $moment(userData.updated_at ?? userData.created_at).format('MMM DD, YYYY · hh:mm A') }}
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="flex flex-wrap items-center justify-between gap-4">
          <router-link
            to="/admin-settings/cms-editors"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/15 text-white/60 text-sm font-medium hover:border-white/30 hover:text-white/80 transition-all"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
            </svg>
            Back to Members
          </router-link>
          <router-link
            v-if="canEditUser(userData.id) && membersCrud.update"
            :to="`/admin-settings/cms-editors/${route.params.id}/update`"
            class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-[#0D2818] text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-[#C9A227]/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125"/>
            </svg>
            Edit Member
          </router-link>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { usePageTitleStore } from '~/stores/pageTitle';
import { useAuthStore } from '~/stores/auth';

definePageMeta({ middleware: 'authenticator' });

const route = useRoute();
const pageTitle = usePageTitleStore();
const authStore = useAuthStore();
const nuxtApp = useNuxtApp();
const id = route.params.id;
const { getModuleCrud } = useModuleCrud();
const membersCrud = computed(() => getModuleCrud('cms-editors'));

const userData = ref(null);
const loading = ref(true);

const PROTECTED_EDITOR_ID = '59ce9e0c-f1e9-4eee-a840-2a17b68dbc10';
const canEditUser = (userId) => userId !== PROTECTED_EDITOR_ID || authStore.user?.id === PROTECTED_EDITOR_ID;

const initials = (user) => {
  const name = user?.user_detail?.full_name || user?.email || '';
  return name.split(/[\s@]+/).slice(0, 2).map((n) => n[0]?.toUpperCase() ?? '').join('') || '?';
};

const profileImageUrl = computed(() => {
  const data = userData.value;
  if (!data?.images?.length) return null;
  const img = data.images.find((i) => i?.category === 'profile_image');
  return img?.url ?? img?.path ?? img?.src ?? null;
});

onMounted(() => {
  pageTitle.setTitle('View Member');
  pageTitle.setBreadcrumbs(['Admin Settings', 'Members', 'View Member']);
  pageTitle.setPageFrom('Members List');
  pageTitle.setPageFromRoute('/admin-settings/cms-editors');
  fetchRecord();
});

async function fetchRecord() {
  loading.value = true;
  userData.value = null;
  try {
    const response = await nuxtApp.$axios.get(`/cms/users/${id}`);
    const body = response.data;
    if (response.status === 204 || body == null) return;
    const record = body.record ?? body.data;
    if (record && (typeof record !== 'object' || Object.keys(record).length > 0)) {
      userData.value = record;
    }
  } catch (error) {
    console.error('Error:', error);
    nuxtApp.$toast?.error(error?.response?.data?.message || 'Failed to load member.');
  } finally {
    loading.value = false;
  }
}
</script>
