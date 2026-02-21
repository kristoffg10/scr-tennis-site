<template>
  <div
    class="min-h-screen w-full relative bg-gradient-to-br from-[#0D2818] via-[#1a3c29] to-[#2d5a3d] overflow-y-auto overflow-x-hidden pt-[220px] pb-16"
  >
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.03]"
      style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"
      aria-hidden="true"
    />
    <div class="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A227]/10 rounded-full blur-3xl -z-0" aria-hidden="true" />
    <div class="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C9A227]/5 rounded-full blur-3xl -z-0" aria-hidden="true" />

    <div class="relative z-10 max-w-6xl mx-auto px-4 lg:px-8 flex flex-col gap-8">
      <header class="flex flex-col gap-1">
        <p class="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]/70">Content Management</p>
        <h1 class="text-3xl md:text-4xl font-semibold text-white leading-tight">
          <span class="text-[#D4AF37]">Schedule</span>
        </h1>
        <p class="text-sm text-white/50 mt-1">View upcoming matches and reservations. Click an event to view details.</p>
        <!-- Status legend -->
        <div class="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2">
          <span class="text-xs font-semibold uppercase tracking-wider text-white/50">Event status</span>
          <div class="flex flex-wrap items-center gap-3">
            <span class="inline-flex items-center gap-2">
              <span class="w-4 h-4 rounded border border-[#C9A227]/30 bg-[#C9A227]/20 shrink-0" aria-hidden="true" />
              <span class="text-xs text-white/70">Draft / Pending / No status</span>
            </span>
            <span class="inline-flex items-center gap-2">
              <span class="w-4 h-4 rounded border border-emerald-400/30 bg-emerald-500/20 shrink-0" aria-hidden="true" />
              <span class="text-xs text-white/70">Published</span>
            </span>
            <span class="inline-flex items-center gap-2">
              <span class="w-4 h-4 rounded border border-rose-400/30 bg-rose-500/20 shrink-0" aria-hidden="true" />
              <span class="text-xs text-white/70">Cancelled</span>
            </span>
            <span class="inline-flex items-center gap-2">
              <span class="w-4 h-4 rounded border border-slate-400/30 bg-slate-400/20 shrink-0" aria-hidden="true" />
              <span class="text-xs text-white/70">Completed</span>
            </span>
          </div>
        </div>
      </header>

      <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
        <!-- Month navigation: 3 columns so title never overlaps arrows -->
        <div class="px-4 sm:px-6 py-4 border-b border-white/10 grid grid-cols-[auto_1fr_auto] items-center gap-4">
          <div class="flex items-center gap-2">
            <button
              type="button"
              class="w-10 h-10 rounded-xl border border-[#C9A227]/30 bg-[#C9A227]/10 hover:bg-[#C9A227]/20 flex items-center justify-center text-[#D4AF37] transition-all shrink-0"
              aria-label="Previous month"
              @click="prevMonth"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
              </svg>
            </button>
            <button
              type="button"
              class="w-10 h-10 rounded-xl border border-[#C9A227]/30 bg-[#C9A227]/10 hover:bg-[#C9A227]/20 flex items-center justify-center text-[#D4AF37] transition-all shrink-0"
              aria-label="Next month"
              @click="nextMonth"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
              </svg>
            </button>
          </div>
          <h2 class="text-xl font-semibold text-white text-center truncate min-w-0">
            {{ monthLabel }}
          </h2>
          <div class="flex justify-end">
            <button
              v-if="!isCurrentMonth"
              type="button"
              class="text-sm font-medium text-[#D4AF37] hover:text-[#C9A227] transition-colors shrink-0"
              @click="goToToday"
            >
              Today
            </button>
            <span v-else class="inline-block w-14" aria-hidden="true" />
          </div>
        </div>

        <!-- Loading -->
        <div v-if="isLoading" class="px-6 py-12 flex justify-center">
          <div class="w-8 h-8 rounded-full border-2 border-[#C9A227]/40 border-t-[#D4AF37] animate-spin" />
        </div>

        <!-- Calendar grid -->
        <template v-else>
          <div class="p-4 sm:p-6 w-full overflow-x-auto">
            <!-- Weekday headers: one row, 7 equal columns -->
            <div
              class="gap-px mb-1 w-full min-w-[280px]"
              style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr));"
            >
              <div
                v-for="day in weekdayLabels"
                :key="day"
                class="py-2 text-center text-xs font-semibold uppercase tracking-wider text-white/50 min-w-0"
              >
                {{ day }}
              </div>
            </div>
            <!-- Days grid: 6 rows × 7 columns -->
            <div
              class="gap-px w-full min-w-[280px] border border-white/10 rounded-xl overflow-hidden bg-white/5"
              style="display: grid; grid-template-columns: repeat(7, minmax(0, 1fr));"
            >
              <div
                v-for="(cell, idx) in calendarDays"
                :key="idx"
                :class="[
                  'h-[100px] sm:h-[120px] p-2 flex flex-col border border-white/5 min-w-0 overflow-hidden',
                  cell.isCurrentMonth ? 'bg-white/5' : 'bg-white/[0.02]'
                ]"
              >
                <span
                  :class="[
                    'text-sm font-medium shrink-0 inline-flex w-7 h-7 items-center justify-center',
                    cell.isCurrentMonth ? 'text-white/80' : 'text-white/30',
                    cell.isToday ? 'rounded-full bg-[#C9A227] text-[#0D2818]' : ''
                  ]"
                >
                  {{ cell.dayOfMonth }}
                </span>
                <div class="mt-1 flex-1 min-h-0 overflow-y-auto overflow-x-hidden space-y-1">
                  <router-link
                    v-for="event in cell.events"
                    :key="event.id"
                    :to="`/events/view/${event.id}`"
                    :class="['block rounded-lg px-2 py-1.5 text-xs font-medium border transition-all truncate', eventChipClasses(event)]"
                    :title="event.title"
                  >
                    {{ event.title || 'Event' }}
                  </router-link>
                </div>
              </div>
            </div>
          </div>

          <div v-if="!calendarDays.length" class="px-6 py-12 text-center text-white/40 text-sm">
            No days in range.
          </div>
        </template>
      </div>

      <div class="flex items-center justify-between text-sm text-white/40">
        <router-link
          to="/events"
          class="inline-flex items-center gap-2 text-[#D4AF37]/80 hover:text-[#D4AF37] transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
          </svg>
          Manage events
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { usePageTitleStore } from '~/stores/pageTitle';

definePageMeta({ middleware: 'authenticator' });

const pageTitle = usePageTitleStore();
const nuxtApp = useNuxtApp();

const currentMonth = ref(new Date());
const events = ref([]);
const isLoading = ref(false);

const weekdayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** Gold for no status / pending / draft; other statuses get distinct colors. */
function eventChipClasses(event) {
  const s = (event?.event_status || '').toLowerCase();
  if (!s || s === 'draft' || s === 'pending') {
    return 'bg-[#C9A227]/20 border-[#C9A227]/30 text-[#D4AF37] hover:bg-[#C9A227]/35 hover:border-[#C9A227]/50';
  }
  if (s === 'published') {
    return 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300 hover:bg-emerald-500/30 hover:border-emerald-400/50';
  }
  if (s === 'cancelled') {
    return 'bg-rose-500/20 border-rose-400/30 text-rose-300 hover:bg-rose-500/30 hover:border-rose-400/50';
  }
  if (s === 'completed') {
    return 'bg-slate-400/20 border-slate-400/30 text-slate-300 hover:bg-slate-400/30 hover:border-slate-400/50';
  }
  return 'bg-[#C9A227]/20 border-[#C9A227]/30 text-[#D4AF37] hover:bg-[#C9A227]/35 hover:border-[#C9A227]/50';
}

const monthLabel = computed(() => {
  const m = nuxtApp.$moment(currentMonth.value);
  return m.format('MMMM YYYY');
});

const isCurrentMonth = computed(() => {
  const now = nuxtApp.$moment();
  const m = nuxtApp.$moment(currentMonth.value);
  return m.isSame(now, 'month') && m.isSame(now, 'year');
});

const fromDate = computed(() => {
  return nuxtApp.$moment(currentMonth.value).startOf('month').format('YYYY-MM-DD');
});

const toDate = computed(() => {
  return nuxtApp.$moment(currentMonth.value).endOf('month').format('YYYY-MM-DD');
});

const eventsByDate = computed(() => {
  const map = {};
  (events.value || []).forEach((ev) => {
    const key = nuxtApp.$moment(ev.date).format('YYYY-MM-DD');
    if (!map[key]) map[key] = [];
    map[key].push(ev);
  });
  return map;
});

const calendarDays = computed(() => {
  const m = nuxtApp.$moment(currentMonth.value);
  const start = m.clone().startOf('month');
  const end = m.clone().endOf('month');
  const calendarStart = start.clone().startOf('week');
  const today = nuxtApp.$moment().format('YYYY-MM-DD');
  const cells = [];
  let day = calendarStart.clone();
  for (let i = 0; i < 42; i++) {
    const dateKey = day.format('YYYY-MM-DD');
    const isCurrentMonth = day.isSame(start, 'month');
    const isToday = dateKey === today;
    cells.push({
      date: dateKey,
      dayOfMonth: day.date(),
      isCurrentMonth,
      isToday,
      events: eventsByDate.value[dateKey] || [],
    });
    day = day.add(1, 'day');
  }
  return cells;
});

async function fetchEvents() {
  isLoading.value = true;
  try {
    const response = await nuxtApp.$axios.get('/cms/events', {
      params: { from_date: fromDate.value, to_date: toDate.value, all: 1 },
    });
    const rec = response.data?.records;
    events.value = Array.isArray(rec) ? rec : [];
  } catch (error) {
    console.error('Schedule fetch error:', error);
    events.value = [];
    nuxtApp.$toast?.error(error?.response?.data?.message || 'Failed to load schedule.');
  } finally {
    isLoading.value = false;
  }
}

function prevMonth() {
  currentMonth.value = nuxtApp.$moment(currentMonth.value).subtract(1, 'month').toDate();
}

function nextMonth() {
  currentMonth.value = nuxtApp.$moment(currentMonth.value).add(1, 'month').toDate();
}

function goToToday() {
  currentMonth.value = new Date();
}

watch([fromDate, toDate], () => fetchEvents(), { immediate: false });
onMounted(() => {
  fetchEvents();
  pageTitle.setTitle('Schedule');
  pageTitle.setBreadcrumbs(['Schedule']);
  pageTitle.setPageFrom('');
  pageTitle.setPageFromRoute('/schedule');
});
</script>
