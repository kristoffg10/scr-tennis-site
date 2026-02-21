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
        <p class="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]/70">Content Management</p>
        <h1 class="text-3xl md:text-4xl font-semibold text-white leading-tight">
          Club <span class="text-[#D4AF37]">Events</span>
        </h1>
        <p class="text-sm text-white/50 mt-1">Browse and manage tournaments, mixers, and social events.</p>
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
            placeholder="Search events…"
            class="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white/5 border border-[#C9A227]/20 text-white placeholder-white/30 text-sm focus:outline-none focus:border-[#C9A227]/60 focus:bg-white/10 transition-all"
          />
        </div>
        <div class="flex items-center gap-4 shrink-0">
          <p v-if="events" class="text-xs text-white/40 hidden sm:block">
            <span class="font-medium text-white/70">{{ events.from ?? 0 }}–{{ events.to ?? 0 }}</span>
            of
            <span class="font-medium text-white/70">{{ events.total ?? 0 }}</span>
          </p>
          <router-link
            to="/events/create"
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-[#0D2818] text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-[#C9A227]/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/>
            </svg>
            Add Event
          </router-link>
        </div>
      </div>

      <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
        <div v-if="eventsData.length" class="md:hidden divide-y divide-white/5">
          <div
            v-for="event in eventsData"
            :key="event.id"
            class="px-4 sm:px-6 py-4 flex flex-col gap-3 hover:bg-white/5 transition-colors"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex items-start gap-3">
                <div class="w-9 h-9 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-semibold text-white/90">{{ event.title || '—' }}</p>
                  <p class="text-xs text-white/40 mt-0.5">{{ $moment(event.date).format('MMM DD, YYYY') }}</p>
                </div>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <router-link
                  :to="`/events/view/${event.id}`"
                  class="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white transition-all"
                  title="View"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                  </svg>
                </router-link>
                <router-link
                  :to="`/events/${event.id}`"
                  class="w-8 h-8 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/25 flex items-center justify-center text-[#D4AF37] hover:bg-[#C9A227]/30 transition-all"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM3.86165 17.4505L13.9334 7.3787L16.5192 9.96448L6.44744 20.0363C6.30784 20.1759 6.13004 20.271 5.93645 20.3097L3.00111 20.8968L3.86165 17.4505Z" fill="currentColor"/>
                  </svg>
                </router-link>
                <button
                  type="button"
                  class="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/25 transition-all"
                  @click="openDeletePopup(`/cms/events/${event.id}`)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 23" fill="none">
                    <path d="M7.77778 17.7778C8.07246 17.7778 8.35508 17.6607 8.56345 17.4523C8.77183 17.244 8.88889 16.9614 8.88889 16.6667V10C8.88889 9.70531 8.77183 9.4227 8.56345 9.21433C8.35508 9.00595 8.07246 8.88889 7.77778 8.88889C7.48309 8.88889 7.20048 9.00595 6.9921 9.21433C6.78373 9.4227 6.66667 9.70531 6.66667 10V16.6667C6.66667 16.9614 6.78373 17.244 6.9921 17.4523C7.20048 17.6607 7.48309 17.7778 7.77778 17.7778ZM18.8889 4.44444H14.4444V3.33333C14.4444 2.44928 14.0933 1.60143 13.4681 0.976311C12.843 0.35119 11.9952 0 11.1111 0H8.88889C8.00483 0 7.15699 0.35119 6.53187 0.976311C5.90674 1.60143 5.55556 2.44928 5.55556 3.33333V4.44444H1.11111C0.816426 4.44444 0.533811 4.56151 0.325437 4.76988C0.117063 4.97825 0 5.26087 0 5.55556C0 5.85024 0.117063 6.13286 0.325437 6.34123C0.533811 6.5496 0.816426 6.66667 1.11111 6.66667H2.22222V18.8889C2.22222 19.7729 2.57341 20.6208 3.19853 21.2459C3.82365 21.871 4.6715 22.2222 5.55556 22.2222H14.4444C15.3285 22.2222 16.1763 21.871 16.8015 21.2459C17.4266 20.6208 17.7778 19.7729 17.7778 18.8889V6.66667H18.8889C19.1836 6.66667 19.4662 6.5496 19.6746 6.34123C19.8829 6.13286 20 5.85024 20 5.55556C20 5.26087 19.8829 4.97825 19.6746 4.76988C19.4662 4.56151 19.1836 4.44444 18.8889 4.44444ZM7.77778 3.33333C7.77778 3.03865 7.89484 2.75603 8.10322 2.54766C8.31159 2.33929 8.5942 2.22222 8.88889 2.22222H11.1111C11.4058 2.22222 11.6884 2.33929 11.8968 2.54766C12.1052 2.75603 12.2222 3.03865 12.2222 3.33333V4.44444H7.77778V3.33333ZM15.5556 18.8889C15.5556 19.1836 15.4385 19.4662 15.2301 19.6746C15.0217 19.8829 14.7391 20 14.4444 20H5.55556C5.26087 20 4.97826 19.8829 4.76988 19.6746C4.56151 19.4662 4.44444 19.1836 4.44444 18.8889V6.66667H15.5556V18.8889ZM12.2222 17.7778C12.5169 17.7778 12.7995 17.6607 13.0079 17.4523C13.2163 17.244 13.3333 16.9614 13.3333 16.6667V10C13.3333 9.70531 13.2163 9.4227 13.0079 9.21433C12.7995 9.00595 12.5169 8.88889 12.2222 8.88889C11.9275 8.88889 11.6449 9.00595 11.4365 9.21433C11.2282 9.4227 11.1111 9.70531 11.1111 10V16.6667C11.1111 16.9614 11.2282 17.244 11.4365 17.4523C11.6449 17.6607 11.9275 17.7778 12.2222 17.7778Z" fill="currentColor"/>
                  </svg>
                </button>
              </div>
            </div>
            <div class="flex flex-wrap items-center gap-3 text-xs">
              <span class="text-white/35">Edited {{ $moment(event.updated_at).format('MMM DD, YYYY · hh:mm A') }}</span>
            </div>
          </div>
        </div>

        <div class="hidden md:block overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-white/10">
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/35">Title</th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/35">Date</th>
                <th class="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-white/35">Date Edited</th>
                <th class="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-white/35">Actions</th>
              </tr>
            </thead>
            <tbody v-if="eventsData.length">
              <tr
                v-for="event in eventsData"
                :key="event.id"
                class="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td class="px-6 py-4">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
                      </svg>
                    </div>
                    <span class="text-sm font-semibold text-white/90">{{ event.title || '—' }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-white/55">{{ $moment(event.date).format('MMM DD, YYYY') }}</td>
                <td class="px-6 py-4 text-xs text-white/55 leading-relaxed">
                  {{ $moment(event.updated_at).format('MMM DD, YYYY') }}<br />
                  <span class="text-white/35">{{ $moment(event.updated_at).format('hh:mm A') }}</span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center justify-end gap-2">
                    <router-link
                      :to="`/events/view/${event.id}`"
                      class="w-8 h-8 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white/70 hover:bg-white/15 hover:text-white hover:border-white/25 transition-all"
                      :title="`View ${event.title}`"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                        <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                      </svg>
                    </router-link>
                    <router-link
                      :to="`/events/${event.id}`"
                      class="w-8 h-8 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/25 flex items-center justify-center text-[#D4AF37] hover:bg-[#C9A227]/30 hover:border-[#C9A227]/50 transition-all"
                      :title="`Edit ${event.title}`"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM3.86165 17.4505L13.9334 7.3787L16.5192 9.96448L6.44744 20.0363C6.30784 20.1759 6.13004 20.271 5.93645 20.3097L3.00111 20.8968L3.86165 17.4505Z" fill="currentColor"/>
                      </svg>
                    </router-link>
                    <button
                      type="button"
                      class="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 hover:bg-red-500/25 hover:border-red-400/40 transition-all"
                      :title="`Delete ${event.title}`"
                      @click="openDeletePopup(`/cms/events/${event.id}`)"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 20 23" fill="none">
                        <path d="M7.77778 17.7778C8.07246 17.7778 8.35508 17.6607 8.56345 17.4523C8.77183 17.244 8.88889 16.9614 8.88889 16.6667V10C8.88889 9.70531 8.77183 9.4227 8.56345 9.21433C8.35508 9.00595 8.07246 8.88889 7.77778 8.88889C7.48309 8.88889 7.20048 9.00595 6.9921 9.21433C6.78373 9.4227 6.66667 9.70531 6.66667 10V16.6667C6.66667 16.9614 6.78373 17.244 6.9921 17.4523C7.20048 17.6607 7.48309 17.7778 7.77778 17.7778ZM18.8889 4.44444H14.4444V3.33333C14.4444 2.44928 14.0933 1.60143 13.4681 0.976311C12.843 0.35119 11.9952 0 11.1111 0H8.88889C8.00483 0 7.15699 0.35119 6.53187 0.976311C5.90674 1.60143 5.55556 2.44928 5.55556 3.33333V4.44444H1.11111C0.816426 4.44444 0.533811 4.56151 0.325437 4.76988C0.117063 4.97825 0 5.26087 0 5.55556C0 5.85024 0.117063 6.13286 0.325437 6.34123C0.533811 6.5496 0.816426 6.66667 1.11111 6.66667H2.22222V18.8889C2.22222 19.7729 2.57341 20.6208 3.19853 21.2459C3.82365 21.871 4.6715 22.2222 5.55556 22.2222H14.4444C15.3285 22.2222 16.1763 21.871 16.8015 21.2459C17.4266 20.6208 17.7778 19.7729 17.7778 18.8889V6.66667H18.8889C19.1836 6.66667 19.4662 6.5496 19.6746 6.34123C19.8829 6.13286 20 5.85024 20 5.55556C20 5.26087 19.8829 4.97825 19.6746 4.76988C19.4662 4.56151 19.1836 4.44444 18.8889 4.44444ZM7.77778 3.33333C7.77778 3.03865 7.89484 2.75603 8.10322 2.54766C8.31159 2.33929 8.5942 2.22222 8.88889 2.22222H11.1111C11.4058 2.22222 11.6884 2.33929 11.8968 2.54766C12.1052 2.75603 12.2222 3.03865 12.2222 3.33333V4.44444H7.77778V3.33333ZM15.5556 18.8889C15.5556 19.1836 15.4385 19.4662 15.2301 19.6746C15.0217 19.8829 14.7391 20 14.4444 20H5.55556C5.26087 20 4.97826 19.8829 4.76988 19.6746C4.56151 19.4662 4.44444 19.1836 4.44444 18.8889V6.66667H15.5556V18.8889ZM12.2222 17.7778C12.5169 17.7778 12.7995 17.6607 13.0079 17.4523C13.2163 17.244 13.3333 16.9614 13.3333 16.6667V10C13.3333 9.70531 13.2163 9.4227 13.0079 9.21433C12.7995 9.00595 12.5169 8.88889 12.2222 8.88889C11.9275 8.88889 11.6449 9.00595 11.4365 9.21433C11.2282 9.4227 11.1111 9.70531 11.1111 10V16.6667C11.1111 16.9614 11.2282 17.244 11.4365 17.4523C11.6449 17.6607 11.9275 17.7778 12.2222 17.7778Z" fill="currentColor"/>
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-if="!eventsData.length" class="px-6 py-16 text-center">
          <div class="w-14 h-14 rounded-full bg-[#C9A227]/10 border border-[#C9A227]/20 flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5" class="text-[#D4AF37]/50">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/>
            </svg>
          </div>
          <p class="text-white/30 text-sm">No events found.</p>
        </div>
      </div>

      <div class="mx-auto w-full">
        <Pagination />
      </div>
    </div>
    </div>

    <PopupDelete
      v-model:show="showDeletePopup"
      :deletePath="deletePath"
      @delete-success="fetchRecords"
    />
  </template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { usePageTitleStore } from '~/stores/pageTitle';
import { usePaginationStore } from '~/stores/pagination';

definePageMeta({ middleware: 'authenticator' });

const PopupDelete = defineAsyncComponent(() => import('~/components/popup/delete.vue'));
const Pagination = defineAsyncComponent(() => import('@/components/Pagination.vue'));

const pageTitle = usePageTitleStore();
const pagination = usePaginationStore();
const nuxtApp = useNuxtApp();

const events = ref(null);
const keyword = ref('');
const showDeletePopup = ref(false);
const deletePath = ref('');

const eventsData = computed(() => {
  if (!events.value) return [];
  if (Array.isArray(events.value)) return events.value;
  if (Array.isArray(events.value.data)) return events.value.data;
  return [];
});

const fetchRecords = async () => {
  try {
    const response = await nuxtApp.$axios.get(`/cms/events?page=${pagination.page}&keyword=${keyword.value || ''}`);
    const rec = response.data?.records;
    if (Array.isArray(rec)) {
      events.value = { data: rec, from: 1, to: rec.length, total: rec.length, last_page: 1 };
    } else if (rec && typeof rec === 'object' && Array.isArray(rec.data)) {
      events.value = rec;
    } else {
      events.value = { data: [], from: 0, to: 0, total: 0, last_page: 1 };
    }
    if (events.value?.last_page) {
      pagination.setTotalPages(events.value.last_page);
    }
  } catch (error) {
    console.error('Events fetch error:', error);
    events.value = { data: [], from: 0, to: 0, total: 0, last_page: 1 };
    nuxtApp.$toast?.error(error?.response?.data?.message || 'Failed to load events.');
  }
};

const openDeletePopup = (url) => {
  showDeletePopup.value = true;
  deletePath.value = url;
};

onMounted(async () => {
  pagination.reset();
  await fetchRecords();
  pageTitle.setTitle('Club Events');
  pageTitle.setBreadcrumbs(['Club Events', 'Events List']);
  pageTitle.setPageFrom('');
  pageTitle.setPageFromRoute('');
});

watch(keyword, () => { pagination.reset(); fetchRecords(); });
watch(() => pagination.page, () => fetchRecords());
</script>
