<template>
  <div class="fixed top-0 left-0 md:left-[260px] right-0 flex items-center justify-between h-[94px] bg-gradient-to-br from-[#0D2818] via-[#1a3c29] to-[#2d5a3d] border-b border-[#C9A227]/20 backdrop-blur-sm z-40 px-4 lg:px-8">
      <!-- Gold top stripe -->
      <div class="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />

      <!-- Mobile: menu button to open sidebar drawer -->
      <button
        type="button"
        class="md:hidden relative z-10 flex items-center justify-center w-10 h-10 rounded-full border border-[#C9A227]/25 bg-[#C9A227]/10 hover:bg-[#C9A227]/20 text-[#D4AF37] transition-colors touch-manipulation"
        aria-label="Open menu"
        @click.stop="openSidebar"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
        </svg>
      </button>

      <!-- Desktop: Home button (hidden on mobile when we show menu) -->
      <router-link
          to="/dashboard"
          class="hidden md:flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A227]/25 bg-[#C9A227]/10 hover:bg-[#C9A227]/20 hover:border-[#C9A227]/50 transition-colors group"
          aria-label="Go to Dashboard"
      >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-[#D4AF37]">
              <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H15V15H9V21H4C3.44772 21 3 20.5523 3 20V9.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="text-sm font-medium text-white/80 group-hover:text-[#D4AF37] transition-colors hidden sm:inline">Dashboard</span>
      </router-link>

      <!-- Right: time & weather, notification (activity logs), user dropdown -->
      <div class="flex justify-end items-center gap-x-[12px] ml-auto">
          <!-- Time & weather (IP-based location) -->
          <div class="hidden sm:flex items-center gap-3 px-3 py-1.5 rounded-full border border-[#C9A227]/25 bg-[#C9A227]/5 text-white/80">
              <div class="flex items-center gap-1.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 text-[#D4AF37]/80 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-sm tabular-nums">{{ currentTime }}</span>
              </div>
              <div v-if="weatherLoading" class="flex items-center gap-1.5 text-white/50">
                  <span class="w-4 h-4 rounded-full border-2 border-[#C9A227]/30 border-t-[#D4AF37] animate-spin" />
                  <span class="text-xs">Weather…</span>
              </div>
              <button
                  v-else-if="weatherError"
                  type="button"
                  class="flex items-center gap-1.5 text-white/50 hover:text-white/70 transition-colors"
                  title="Weather couldn’t be loaded. Click to retry."
                  @click="fetchLocationAndWeather()"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"/>
                  </svg>
                  <span class="text-xs">Retry weather</span>
              </button>
              <div v-else-if="weatherTemp != null" class="flex items-center gap-1.5 flex-wrap" :title="weatherLocation ? `${weatherDesc} in ${weatherLocation}` : weatherDesc">
                  <span class="text-[#D4AF37]/90">{{ weatherIcon }}</span>
                  <span class="text-sm tabular-nums">{{ weatherTemp }}°</span>
                  <span v-if="weatherDesc" class="text-xs text-white/60">{{ weatherDesc }}</span>
                  <span v-if="weatherLocation" class="text-xs text-white/50 truncate max-w-[80px]" :title="weatherLocation">{{ weatherLocation }}</span>
              </div>
          </div>
          <!-- Activity logs bell: on mobile go to page, on desktop open popup -->
          <NuxtLink
              to="/activity-logs"
              class="md:hidden flex items-center justify-center w-10 h-10 rounded-full border border-[#C9A227]/25 bg-[#C9A227]/10 hover:bg-[#C9A227]/20 text-[#D4AF37] transition-colors"
              aria-label="Activity logs"
          >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
              </svg>
          </NuxtLink>
          <div class="hidden md:block relative" data-activity-popup>
              <button
                  type="button"
                  @click.stop="toggleActivityPopup"
                  class="flex items-center justify-center w-10 h-10 rounded-full border border-[#C9A227]/25 bg-[#C9A227]/10 hover:bg-[#C9A227]/20 text-[#D4AF37] transition-colors"
                  :class="{ 'bg-[#C9A227]/20 border-[#C9A227]/40': showActivityPopup }"
                  aria-label="Activity logs"
                  aria-haspopup="true"
                  :aria-expanded="showActivityPopup"
              >
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
                  </svg>
              </button>

              <!-- Activity logs popup (messenger-style, desktop only) -->
              <Transition name="dropdown">
                  <div
                      v-show="showActivityPopup"
                      class="absolute top-full left-0 right-0 mx-3 mt-2 sm:left-auto sm:right-0 sm:mx-0 sm:w-[380px] rounded-2xl border border-[#C9A227]/25 bg-[#0D2818] shadow-2xl overflow-hidden flex flex-col max-h-[70vh] sm:max-h-[480px] z-50"
                      role="dialog"
                      aria-label="Recent activity"
                  >
                      <div class="h-0.5 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37] shrink-0" />
                      <div class="px-4 sm:px-5 py-4 border-b border-white/10 shrink-0">
                          <h3 class="text-base font-semibold text-white">Recent activity</h3>
                          <p class="text-xs text-white/50 mt-1">Latest 5 logs</p>
                      </div>
                      <div class="activity-logs-scroll overflow-y-auto flex-1 min-h-0 px-3 sm:px-4 py-4 flex flex-col gap-3">
                          <div v-if="activityLogsLoading" class="py-10 flex items-center justify-center">
                              <span class="w-6 h-6 rounded-full border-2 border-[#C9A227]/30 border-t-[#D4AF37] animate-spin" />
                          </div>
                          <template v-else-if="latestActivityLogs.length">
                              <div
                                  v-for="record in latestActivityLogs"
                                  :key="record.id"
                                  :class="[
                                      'px-4 py-3.5 rounded-xl flex flex-col gap-2 transition-colors',
                                      isLoginAction(record.action) && 'bg-emerald-500/10 border border-emerald-400/25',
                                      isLogoutAction(record.action) && 'bg-rose-500/10 border border-rose-400/25',
                                      !isLoginAction(record.action) && !isLogoutAction(record.action) && 'bg-white/[0.06] border border-white/10'
                                  ]"
                              >
                                  <div class="flex flex-wrap items-center justify-between gap-2">
                                      <p class="text-sm font-medium text-white truncate">
                                          {{ record.user?.user_detail?.full_name || record.user?.email || '--' }}
                                      </p>
                                      <span
                                          :class="[
                                              'inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full shrink-0',
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
                                  <p v-if="record.page || record.item_name" class="text-xs text-white/60 leading-snug">
                                      {{ record.page ? record.page : '' }}{{ record.page && record.item_name ? ' · ' : '' }}{{ record.item_name || '' }}
                                  </p>
                                  <p class="text-xs text-white/45">
                                      {{ $moment(record.created_at).format('MMM DD, hh:mm A') }}
                                  </p>
                              </div>
                          </template>
                          <div v-else class="py-10 text-center text-sm text-white/40">
                              No recent activity.
                          </div>
                      </div>
                      <div class="px-3 sm:px-4 py-4 border-t border-white/10 shrink-0 bg-[#0D2818]">
                          <NuxtLink
                              to="/activity-logs"
                              class="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-[#C9A227]/30 bg-[#C9A227]/15 hover:bg-[#C9A227]/25 text-[#D4AF37] text-sm font-medium transition-colors"
                              @click="showActivityPopup = false"
                          >
                              View all logs
                          </NuxtLink>
                      </div>
                  </div>
              </Transition>
          </div>
          <div @click="toggled()" class="flex justify-center gap-x-[8px] items-center py-[6px] px-[14px] relative cursor-pointer rounded-full border border-[#C9A227]/25 bg-[#C9A227]/10 hover:bg-[#C9A227]/20 transition-colors" :class="{'bg-[#C9A227]/20 border-[#C9A227]/40' : isToggled}">
              <h1 v-if="displayUser" class="text-base font-medium text-white" :class="{'text-[#D4AF37]' : isToggled}">{{ displayUser?.user_detail?.full_name ?? displayUser?.email ?? 'User' }}</h1>
              <p v-else class="text-sm text-white/60">Loading user data...</p>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-[#D4AF37] transition-transform duration-200" :class="{'rotate-180' : isToggled}">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M12.3982 15.6634C12.1785 15.8831 11.8224 15.8831 11.6027 15.6634L5.86788 9.92853C5.64821 9.70886 5.64821 9.35276 5.86788 9.13308L6.13305 8.86788C6.35271 8.64821 6.70887 8.64821 6.92854 8.86788L12.0005 13.9398L17.0724 8.86788C17.2921 8.64821 17.6482 8.64821 17.8679 8.86788L18.1331 9.13308C18.3527 9.35276 18.3527 9.70886 18.1331 9.92853L12.3982 15.6634Z" fill="currentColor"/>
              </svg>

              <div v-show="isToggled" class="min-w-[200px] absolute top-full right-0 mt-2 rounded-2xl border border-[#C9A227]/20 bg-[#1a3c29]/95 backdrop-blur-sm z-50 p-2 flex flex-col gap-y-1 shadow-xl">
                  <router-link :to="`/admin-settings/cms-editors/${displayUser?.id}/update`" class="flex items-center gap-x-3 px-3 py-2.5 rounded-xl text-white/90 hover:bg-[#C9A227]/15 hover:text-[#D4AF37] transition-colors">
                      <svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-[#D4AF37] flex-shrink-0">
                          <path d="M2.16732 22.75H8.66732C8.95464 22.75 9.23018 22.6359 9.43335 22.4327C9.63651 22.2296 9.75065 21.954 9.75065 21.6667C9.75065 21.3794 9.63651 21.1038 9.43335 20.9007C9.23018 20.6975 8.95464 20.5834 8.66732 20.5834H3.32757C3.59045 18.7794 4.49338 17.1302 5.8715 15.9369C7.24963 14.7435 9.01099 14.0856 10.834 14.0834C12.1096 14.0944 13.3489 13.6589 14.337 12.8521C15.3252 12.0454 16 10.9184 16.2444 9.66639C16.4889 8.41438 16.2876 7.1163 15.6755 5.99712C15.0633 4.87794 14.0789 4.00819 12.8929 3.53861C11.7068 3.06903 10.3938 3.02921 9.18146 3.42605C7.96911 3.8229 6.93381 4.63139 6.25498 5.71143C5.57615 6.79146 5.29658 8.07495 5.46471 9.33947C5.63285 10.604 6.2381 11.7698 7.17557 12.635C5.37746 13.3644 3.83757 14.6132 2.75254 16.2219C1.66752 17.8307 1.0866 19.7263 1.08398 21.6667C1.08398 21.954 1.19812 22.2296 1.40129 22.4327C1.60445 22.6359 1.88 22.75 2.16732 22.75ZM10.834 5.4167C11.4768 5.4167 12.1051 5.60731 12.6396 5.96443C13.174 6.32154 13.5906 6.82912 13.8366 7.42298C14.0826 8.01684 14.1469 8.67031 14.0215 9.30075C13.8961 9.93118 13.5866 10.5103 13.1321 10.9648C12.6776 11.4193 12.0985 11.7289 11.468 11.8543C10.8376 11.9797 10.1841 11.9153 9.59026 11.6693C8.9964 11.4233 8.48882 11.0068 8.13171 10.4723C7.77459 9.93785 7.58398 9.30949 7.58398 8.6667C7.58398 7.80475 7.92639 6.9781 8.53589 6.36861C9.14538 5.75911 9.97203 5.4167 10.834 5.4167ZM21.8916 10.0675C21.6884 9.86436 21.4129 9.75027 21.1256 9.75027C20.8384 9.75027 20.5629 9.86436 20.3597 10.0675L13.5889 16.8383C13.4705 16.9576 13.3812 17.1025 13.3278 17.2619L11.9737 21.3244C11.9194 21.4871 11.9047 21.6605 11.9305 21.8301C11.9564 21.9997 12.0222 22.1607 12.1225 22.2999C12.2227 22.4391 12.3547 22.5525 12.5073 22.6308C12.66 22.709 12.8291 22.7499 13.0007 22.75C13.117 22.7499 13.2325 22.7312 13.343 22.6948L17.4055 21.3406C17.5651 21.2873 17.7102 21.1976 17.8291 21.0785L24.5999 14.3076C24.803 14.1045 24.9171 13.829 24.9171 13.5417C24.9171 13.2544 24.803 12.9789 24.5999 12.7758L21.8916 10.0675ZM16.4749 19.3657L14.7102 19.954L15.2984 18.1892L21.1256 12.3652L22.3021 13.5417L16.4749 19.3657Z" fill="currentColor"/>
                      </svg>
                      <span class="text-sm font-medium">Edit My Profile</span>
                  </router-link>
                  <div class="h-px bg-white/10 my-1" />
                  <button
                      type="button"
                      @click="showLogoutConfirm = true; isToggled = false"
                      class="flex items-center gap-x-3 px-3 py-2.5 rounded-xl text-white/90 hover:bg-red-500/15 hover:text-red-400 transition-colors w-full text-left"
                  >
                      <svg width="20" height="20" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="flex-shrink-0">
                          <path d="M12.6667 16.2499L15.9167 12.9999M15.9167 12.9999L12.6667 9.74992M15.9167 12.9999H4M9.41667 7.85256V7.80014C9.41667 6.58668 9.41667 5.97951 9.65282 5.51604C9.86054 5.10834 10.1918 4.77713 10.5994 4.56941C11.0629 4.33325 11.6701 4.33325 12.8836 4.33325H17.8669C19.0803 4.33325 19.6862 4.33325 20.1497 4.56941C20.5573 4.77713 20.8897 5.10834 21.0974 5.51604C21.3333 5.97905 21.3333 6.58549 21.3333 7.79657V18.2038C21.3333 19.4149 21.3333 20.0205 21.0974 20.4835C20.8897 20.8911 20.5573 21.223 20.1497 21.4306C19.6867 21.6666 19.0811 21.6666 17.87 21.6666H12.88C11.6689 21.6666 11.0625 21.6666 10.5994 21.4306C10.1918 21.223 9.86054 20.8908 9.65282 20.4832C9.41667 20.0197 9.41667 19.4134 9.41667 18.1999V18.1458" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                      <span class="text-sm font-medium">Log out</span>
                  </button>
              </div>
          </div>
      </div>
  </div>

  <!-- ── Logout confirmation dialog ── -->
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="showLogoutConfirm"
        class="fixed inset-0 z-[60] flex items-center justify-center p-4"
        @click.self="showLogoutConfirm = false"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm" aria-hidden="true" />

        <!-- Dialog card -->
        <div class="relative w-full max-w-sm bg-gradient-to-br from-[#0D2818] via-[#1a3c29] to-[#1a3c29] rounded-2xl border border-[#C9A227]/25 shadow-2xl overflow-hidden">
          <!-- Gold stripe -->
          <div class="h-0.5 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />

          <!-- Close button -->
          <button
            type="button"
            @click="showLogoutConfirm = false"
            :disabled="isLoggingOut"
            class="absolute top-4 right-4 p-1 rounded-lg text-white/30 hover:text-white/70 hover:bg-white/10 transition-colors disabled:opacity-40"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>

          <div class="px-6 py-7 flex flex-col items-center gap-5 text-center">
            <!-- Icon -->
            <div class="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/25 flex items-center justify-center">
              <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg" class="text-red-400">
                <path d="M12.6667 16.2499L15.9167 12.9999M15.9167 12.9999L12.6667 9.74992M15.9167 12.9999H4M9.41667 7.85256V7.80014C9.41667 6.58668 9.41667 5.97951 9.65282 5.51604C9.86054 5.10834 10.1918 4.77713 10.5994 4.56941C11.0629 4.33325 11.6701 4.33325 12.8836 4.33325H17.8669C19.0803 4.33325 19.6862 4.33325 20.1497 4.56941C20.5573 4.77713 20.8897 5.10834 21.0974 5.51604C21.3333 5.97905 21.3333 6.58549 21.3333 7.79657V18.2038C21.3333 19.4149 21.3333 20.0205 21.0974 20.4835C20.8897 20.8911 20.5573 21.223 20.1497 21.4306C19.6867 21.6666 19.0811 21.6666 17.87 21.6666H12.88C11.6689 21.6666 11.0625 21.6666 10.5994 21.4306C10.1918 21.223 9.86054 20.8908 9.65282 20.4832C9.41667 20.0197 9.41667 19.4134 9.41667 18.1999V18.1458" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>

            <!-- Copy -->
            <div class="flex flex-col gap-1.5">
              <h2 class="text-lg font-semibold text-white">Sign out?</h2>
              <p class="text-sm text-white/50 leading-relaxed">You'll need your invitation credentials to sign back in to the members' portal.</p>
            </div>

            <!-- Actions -->
            <div class="flex gap-3 w-full pt-1">
              <button
                type="button"
                :disabled="isLoggingOut"
                @click="showLogoutConfirm = false"
                class="flex-1 px-4 py-2.5 rounded-xl border border-white/15 text-white/70 text-sm font-medium hover:bg-white/5 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="button"
                @click="logout()"
                :disabled="isLoggingOut"
                class="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/80 hover:bg-red-500 text-white text-sm font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <span v-if="isLoggingOut" class="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>{{ isLoggingOut ? 'Signing out…' : 'Yes, sign out' }}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';
import { useAuth } from '#imports';
import { useAuthStore } from '~/stores/auth';
import { useSidebarStore } from '~/stores/sidebar';

const auth = useAuth();
const sidebarStore = useSidebarStore();
const nuxtApp = useNuxtApp();

const openSidebar = () => {
  sidebarStore.setMobileSidebarOpen(true);
};
const user = ref(null);
const authStore = useAuthStore();

const displayUser = computed(() => authStore.user || user.value);

onMounted(async () => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
  fetchLocationAndWeather();
  try {
    const session = await auth.getSession();
    if (session && session.user) {
      user.value = session.user;
      authStore.setUser(session.user);
    } else if (authStore.user) {
      user.value = authStore.user;
    }
  } catch (error) {
    console.error('Failed to fetch user session:', error);
    if (authStore.user) {
      user.value = authStore.user;
    }
  }
});

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval);
});

const isToggled = ref(false);
const toggled = () => {
  isToggled.value = !isToggled.value;
};

// ── Time (updates every second) ──
const currentTime = ref('');
const updateTime = () => {
  const now = new Date();
  currentTime.value = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
};
let timeInterval = null;

// ── Weather (IP-based location: ip-api.com → Open-Meteo) ──
const weatherLoading = ref(true);
const weatherError = ref(false);
const weatherTemp = ref(null);
const weatherDesc = ref('');
const weatherLocation = ref('');
const weatherIcon = ref('');

const WEATHER_CODES = {
  0: { desc: 'Clear', icon: '☀️' },
  1: { desc: 'Mainly clear', icon: '🌤️' },
  2: { desc: 'Partly cloudy', icon: '⛅' },
  3: { desc: 'Overcast', icon: '☁️' },
  45: { desc: 'Foggy', icon: '🌫️' },
  48: { desc: 'Foggy', icon: '🌫️' },
  51: { desc: 'Drizzle', icon: '🌧️' },
  53: { desc: 'Drizzle', icon: '🌧️' },
  55: { desc: 'Drizzle', icon: '🌧️' },
  61: { desc: 'Rain', icon: '🌧️' },
  63: { desc: 'Rain', icon: '🌧️' },
  65: { desc: 'Heavy rain', icon: '⛈️' },
  71: { desc: 'Snow', icon: '❄️' },
  73: { desc: 'Snow', icon: '❄️' },
  75: { desc: 'Heavy snow', icon: '❄️' },
  77: { desc: 'Snow grains', icon: '❄️' },
  80: { desc: 'Showers', icon: '🌦️' },
  81: { desc: 'Showers', icon: '🌦️' },
  82: { desc: 'Heavy showers', icon: '⛈️' },
  85: { desc: 'Snow showers', icon: '🌨️' },
  86: { desc: 'Snow showers', icon: '🌨️' },
  95: { desc: 'Thunderstorm', icon: '⛈️' },
  96: { desc: 'Thunderstorm', icon: '⛈️' },
  99: { desc: 'Thunderstorm', icon: '⛈️' },
};

const fetchWithTimeout = (url, ms = 8000) => {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), ms);
  return fetch(url, { signal: ctrl.signal }).finally(() => clearTimeout(t));
};

const fetchLocationAndWeather = async () => {
  weatherLoading.value = true;
  weatherError.value = false;
  try {
    let lat = null;
    let lon = null;
    let city = '';

    const config = useRuntimeConfig();
    const key = (config.public?.ipApiKey || '').trim();
    const ipApiUrl = key
      ? `https://pro.ip-api.com/json/?key=${encodeURIComponent(key)}&fields=lat,lon,city,regionName`
      : 'https://ip-api.com/json/?fields=lat,lon,city,regionName';

    try {
      const ipRes = await fetchWithTimeout(ipApiUrl);
      if (!ipRes.ok) throw new Error(`ip-api ${ipRes.status}`);
      const ipData = await ipRes.json();
      if (ipData.lat != null && ipData.lon != null) {
        lat = ipData.lat;
        lon = ipData.lon;
        city = ipData.city || ipData.regionName || '';
      }
    } catch (_) {
      lat = null;
      lon = null;
    }

    if (lat == null || lon == null) {
      const fallbackRes = await fetchWithTimeout('https://ipapi.co/json/');
      if (!fallbackRes.ok) throw new Error('IP lookup failed');
      const fallbackData = await fallbackRes.json();
      lat = fallbackData.latitude;
      lon = fallbackData.longitude;
      city = fallbackData.city || fallbackData.region || '';
    }

    if (lat == null || lon == null) throw new Error('No location');
    if (city) weatherLocation.value = city;

    const weatherRes = await fetchWithTimeout(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`
    );
    if (!weatherRes.ok) throw new Error('Weather fetch failed');
    const weatherData = await weatherRes.json();
    const cur = weatherData?.current;
    if (!cur) throw new Error('No weather data');
    weatherTemp.value = Math.round(cur.temperature_2m);
    const code = cur.weather_code;
    const mapped = WEATHER_CODES[code] || { desc: 'Unknown', icon: '🌡️' };
    weatherDesc.value = mapped.desc;
    weatherIcon.value = mapped.icon;
  } catch (e) {
    console.warn('Weather by IP failed:', e);
    weatherError.value = true;
    weatherTemp.value = null;
    weatherDesc.value = '';
    weatherLocation.value = '';
    weatherIcon.value = '';
  } finally {
    weatherLoading.value = false;
  }
};

// Activity logs popup
const showActivityPopup = ref(false);
const activityLogsRaw = ref(null);
const activityLogsLoading = ref(false);

const latestActivityLogs = computed(() => {
  const rec = activityLogsRaw.value;
  if (!rec) return [];
  let list = [];
  if (Array.isArray(rec)) list = rec;
  else if (Array.isArray(rec.data)) list = rec.data;
  else if (rec.records && Array.isArray(rec.records.data)) list = rec.records.data;
  return list.slice(0, 5);
});

const fetchLatestLogs = async () => {
  activityLogsLoading.value = true;
  try {
    const response = await nuxtApp.$axios.get('/cms/dashboard?page=1');
    activityLogsRaw.value = response.data?.records ?? response.data ?? null;
  } catch (err) {
    console.error('Failed to fetch activity logs:', err);
    activityLogsRaw.value = null;
  } finally {
    activityLogsLoading.value = false;
  }
};

const toggleActivityPopup = () => {
  showActivityPopup.value = !showActivityPopup.value;
  if (showActivityPopup.value) {
    fetchLatestLogs();
    isToggled.value = false;
  }
};

let activityPopupClickCleanup = null;
watch(showActivityPopup, (open) => {
  if (activityPopupClickCleanup) {
    activityPopupClickCleanup();
    activityPopupClickCleanup = null;
  }
  if (!open) return;
  const close = (e) => {
    const el = e.target;
    if (el.closest('[data-activity-popup]')) return;
    showActivityPopup.value = false;
  };
  const remove = () => document.removeEventListener('click', close);
  activityPopupClickCleanup = remove;
  setTimeout(() => document.addEventListener('click', close), 0);
});

const isLoginAction = (action) =>
  typeof action === 'string' && action.toLowerCase().includes('logged in');
const isLogoutAction = (action) =>
  typeof action === 'string' && action.toLowerCase().includes('logout');

const getActionBadgeClass = (action) => {
  if (isLoginAction(action)) return 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30';
  if (isLogoutAction(action)) return 'bg-rose-500/20 text-rose-300 border border-rose-400/30';
  switch (action) {
    case 'Created': return 'bg-emerald-500/15 text-emerald-400 border border-transparent';
    case 'Deleted': return 'bg-red-500/15 text-red-400 border border-transparent';
    case 'Changed': return 'bg-amber-500/15 text-amber-400 border border-transparent';
    default: return 'bg-[#C9A227]/15 text-[#D4AF37] border border-transparent';
  }
};

const getActionDotClass = (action) => {
  if (isLoginAction(action)) return 'bg-emerald-400';
  if (isLogoutAction(action)) return 'bg-rose-400';
  switch (action) {
    case 'Created': return 'bg-emerald-400';
    case 'Deleted': return 'bg-red-400';
    case 'Changed': return 'bg-amber-400';
    default: return 'bg-[#D4AF37]';
  }
};

const getActionIcon = (action) => {
  if (isLoginAction(action)) return 'login';
  if (isLogoutAction(action)) return 'logout';
  return null;
};

const showLogoutConfirm = ref(false);
const isLoggingOut = ref(false);

const logout = async () => {
  try {
    isLoggingOut.value = true;
    await auth.signOut({ redirect: false });
    authStore.resetUser();
    await navigateTo('/');
  } catch (error) {
    console.error('Logout failed:', error);
    isLoggingOut.value = false;
    showLogoutConfirm.value = false;
  }
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
.modal-enter-active .relative,
.modal-leave-active .relative {
  transition: transform 0.2s ease;
}
.modal-enter-from .relative,
.modal-leave-to .relative {
  transform: scale(0.95);
}

.dropdown-enter-active,
.dropdown-leave-active {
  transition: opacity 0.15s ease, transform 0.15s ease;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* Themed scrollbar for activity logs popup (gold/olive, not blue) */
.activity-logs-scroll {
  scrollbar-color: #C9A227 #1a3c29;
  scrollbar-width: thin;
}
.activity-logs-scroll::-webkit-scrollbar {
  width: 6px;
}
.activity-logs-scroll::-webkit-scrollbar-track {
  background: #1a3c29;
  border-radius: 3px;
}
.activity-logs-scroll::-webkit-scrollbar-thumb {
  background: #C9A227;
  border-radius: 3px;
}
.activity-logs-scroll::-webkit-scrollbar-thumb:hover {
  background: #D4AF37;
}
</style>