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
    <div class="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A227]/10 rounded-full blur-3xl -z-0" aria-hidden="true" />
    <div class="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C9A227]/5 rounded-full blur-3xl -z-0" aria-hidden="true" />

    <div class="relative z-10 max-w-6xl mx-auto px-4 lg:px-8 flex flex-col gap-10">
      <header class="flex flex-col gap-1">
        <p class="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]/70">Members Portal</p>
        <h1 class="text-3xl md:text-4xl font-semibold text-white leading-tight">
          Activity Logs
        </h1>
        <p class="text-sm text-white/50 mt-1">Audit key member activities over the past 30 days.</p>
      </header>

      <section>
        <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div class="px-4 sm:px-6 md:px-8 py-4 sm:py-5 border-b border-white/10 flex flex-wrap items-center justify-between gap-3">
            <div class="flex flex-col gap-0.5">
              <h2 class="text-lg font-semibold text-white">Activity Logs</h2>
              <p class="text-xs text-white/45">Covers the past 30 days · audit key member activities</p>
            </div>
            <p v-if="records" class="text-xs text-white/40">
              Showing
              <span class="font-medium text-white/70">{{ recordsMeta.from }}–{{ recordsMeta.to }}</span>
              of
              <span class="font-medium text-white/70">{{ recordsMeta.total }}</span>
            </p>
          </div>

          <!-- Mobile: card list -->
          <div v-if="recordsData.length" class="md:hidden divide-y divide-white/5">
            <div
              v-for="record in recordsData"
              :key="record.id"
              :class="[
                'px-4 sm:px-6 py-4 flex flex-col gap-3',
                isLoginAction(record.action) && 'border-l-4 border-emerald-400/40 bg-emerald-500/5',
                isLogoutAction(record.action) && 'border-l-4 border-rose-400/40 bg-rose-500/5'
              ]"
            >
              <div class="flex flex-wrap items-start justify-between gap-2">
                <p class="text-sm font-medium text-white/90">
                  {{ record.user?.user_detail?.full_name ? record.user.user_detail.full_name : record.user?.email || '--' }}
                </p>
                <span
                  :class="[
                    'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full shrink-0',
                    getActionBadgeClass(record.action)
                  ]"
                >
                  <template v-if="getActionIcon(record.action) === 'login'">
                    <svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                  </template>
                  <template v-else-if="getActionIcon(record.action) === 'logout'">
                    <svg class="w-3.5 h-3.5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </template>
                  <template v-else>
                    <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="getActionDotClass(record.action)" />
                  </template>
                  {{ record.action }}
                </span>
              </div>
              <div class="grid grid-cols-1 gap-1.5 text-xs">
                <p v-if="record.page" class="text-white/55"><span class="text-white/40">Page</span> {{ record.page }}</p>
                <p v-if="record.item_name" class="text-white/55"><span class="text-white/40">Item</span> {{ record.item_name }}</p>
                <p class="text-white/50">
                  {{ $moment(record.created_at).format('MMM DD, YYYY') }} · {{ $moment(record.created_at).format('hh:mm A') }}
                </p>
              </div>
            </div>
          </div>

          <!-- Desktop: table -->
          <div class="hidden md:block overflow-x-auto">
            <table class="min-w-full">
              <thead>
                <tr class="text-xs uppercase tracking-wider text-white/35 border-b border-white/10">
                  <th class="px-6 py-3 text-left font-medium">Member</th>
                  <th class="px-6 py-3 text-left font-medium">Action</th>
                  <th class="px-6 py-3 text-left font-medium">Page</th>
                  <th class="px-6 py-3 text-left font-medium">Item</th>
                  <th class="px-6 py-3 text-left font-medium">Date & Time</th>
                </tr>
              </thead>
              <tbody v-if="recordsData.length">
                <tr
                  v-for="record in recordsData"
                  :key="record.id"
                  :class="[
                    'border-b border-white/5 transition-colors',
                    isLoginAction(record.action) && 'hover:bg-emerald-500/5 border-l-4 border-l-emerald-400/50',
                    isLogoutAction(record.action) && 'hover:bg-rose-500/5 border-l-4 border-l-rose-400/50',
                    !isLoginAction(record.action) && !isLogoutAction(record.action) && 'hover:bg-white/5'
                  ]"
                >
                  <td class="px-6 py-4 text-sm text-white/80">
                    {{
                      record.user?.user_detail?.full_name
                        ? record.user.user_detail.full_name
                        : record.user?.email || '--'
                    }}
                  </td>
                  <td class="px-6 py-4">
                    <span
                      :class="[
                        'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-full',
                        getActionBadgeClass(record.action)
                      ]"
                    >
                      <template v-if="getActionIcon(record.action) === 'login'">
                        <svg class="w-3.5 h-3.5 text-emerald-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                        </svg>
                      </template>
                      <template v-else-if="getActionIcon(record.action) === 'logout'">
                        <svg class="w-3.5 h-3.5 text-rose-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </template>
                      <template v-else>
                        <span class="w-1.5 h-1.5 rounded-full shrink-0" :class="getActionDotClass(record.action)" />
                      </template>
                      {{ record.action }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-white/55">{{ record.page || '--' }}</td>
                  <td class="px-6 py-4 text-sm text-white/55">{{ record.item_name || '--' }}</td>
                  <td class="px-6 py-4 text-xs text-white/55 leading-relaxed">
                    {{ $moment(record.created_at).format('MMM DD, YYYY') }}<br />
                    <span class="text-white/35">{{ $moment(record.created_at).format('hh:mm A') }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div v-if="!recordsData.length" class="px-6 py-12 text-center text-white/30 text-sm">
            No activity records found for this period.
          </div>
        </div>
      </section>

      <div class="mx-auto w-full">
        <Pagination />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { usePaginationStore } from '~/stores/pagination';

definePageMeta({
  name: 'activity-logs',
  middleware: 'authenticator',
});

const Pagination = defineAsyncComponent(() => import('@/components/Pagination.vue'));

const nuxtApp = useNuxtApp();
const pagination = usePaginationStore();
const records = ref(null);

const recordsData = computed(() => {
  const rec = records.value;
  if (!rec) return [];
  if (Array.isArray(rec)) return rec;
  if (Array.isArray(rec.data)) return rec.data;
  if (rec.records && Array.isArray(rec.records.data)) return rec.records.data;
  return [];
});

const recordsMeta = computed(() => {
  const rec = records.value;
  if (!rec) return { from: 0, to: 0, total: 0, last_page: 1 };
  let src = rec;
  if (rec.records && typeof rec.records === 'object') src = rec.records;
  const dataArray = (Array.isArray(src.data) && src.data) || recordsData.value || [];
  return {
    from: src.from ?? (dataArray.length ? 1 : 0),
    to: src.to ?? dataArray.length,
    total: src.total ?? dataArray.length,
    last_page: src.last_page ?? 1,
  };
});

const fetchRecords = async () => {
  try {
    const response = await nuxtApp.$axios.get(`/cms/dashboard?page=${pagination.page}`);
    records.value = response.data.records;
    pagination.setTotalPages(recordsMeta.value.last_page);
  } catch (error) {
    console.error('Error:', error);
  }
};

onMounted(() => {
  pagination.setPage(1);
  fetchRecords();
});
watch(() => pagination.page, () => fetchRecords());

const isLoginAction = (action) =>
  typeof action === 'string' && action.toLowerCase().includes('logged in');
const isLogoutAction = (action) =>
  typeof action === 'string' && action.toLowerCase().includes('logout');

const getActionBadgeClass = (action) => {
  if (isLoginAction(action)) return 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 shadow-sm shadow-emerald-500/10';
  if (isLogoutAction(action)) return 'bg-rose-500/20 text-rose-300 border border-rose-400/30 shadow-sm shadow-rose-500/10';
  switch (action) {
    case 'Created':  return 'bg-emerald-500/15 text-emerald-400 border border-transparent';
    case 'Deleted':  return 'bg-red-500/15 text-red-400 border border-transparent';
    case 'Changed':  return 'bg-amber-500/15 text-amber-400 border border-transparent';
    default:         return 'bg-[#C9A227]/15 text-[#D4AF37] border border-transparent';
  }
};

const getActionDotClass = (action) => {
  if (isLoginAction(action)) return 'bg-emerald-400';
  if (isLogoutAction(action)) return 'bg-rose-400';
  switch (action) {
    case 'Created':  return 'bg-emerald-400';
    case 'Deleted':  return 'bg-red-400';
    case 'Changed':  return 'bg-amber-400';
    default:         return 'bg-[#D4AF37]';
  }
};

const getActionIcon = (action) => {
  if (isLoginAction(action)) return 'login';
  if (isLogoutAction(action)) return 'logout';
  return null;
};
</script>
