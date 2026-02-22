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
    <!-- Gold glow top right -->
    <div class="pointer-events-none absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A227]/10 rounded-full blur-3xl" aria-hidden="true" />
    <!-- Gold glow bottom left -->
    <div class="pointer-events-none absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#C9A227]/5 rounded-full blur-3xl" aria-hidden="true" />

    <div class="relative z-10 max-w-4xl mx-auto px-4 lg:px-8 flex flex-col gap-8">

      <!-- ── Header ── -->
      <header class="flex items-start justify-between gap-4">
        <div class="flex flex-col gap-1">
          <p class="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]/70">Club Events</p>
          <h1 class="text-3xl md:text-4xl font-semibold text-white leading-tight">
            Edit <span class="text-[#D4AF37]">Event</span>
          </h1>
          <p class="text-sm text-white/50 mt-1">Update the details for this club event.</p>
        </div>

        <!-- Event type & status badges (populated after fetch) -->
        <div class="shrink-0 mt-1 flex items-center gap-2">
          <span v-if="eventData?.event_type" class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-[#C9A227]/15 text-[#D4AF37] border border-[#C9A227]/25 capitalize">
            <span class="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
            {{ eventData.event_type }}
          </span>
          <span v-if="eventData?.event_status" class="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-white/10 text-white/80 border border-white/15 capitalize">
            {{ eventData.event_status }}
          </span>
        </div>
      </header>

      <!-- ── Loading skeleton ── -->
      <template v-if="!eventData">
        <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden animate-pulse">
          <div class="h-1 w-full bg-[#C9A227]/30" />
          <div class="p-6 flex flex-col gap-4">
            <div class="h-5 w-48 bg-white/10 rounded-lg" />
            <div class="grid grid-cols-2 gap-4">
              <div class="h-11 bg-white/10 rounded-xl" />
              <div class="h-11 bg-white/10 rounded-xl" />
            </div>
            <div class="grid grid-cols-2 gap-4">
              <div class="h-11 bg-white/10 rounded-xl" />
              <div class="h-11 bg-white/10 rounded-xl" />
            </div>
            <div class="h-40 bg-white/10 rounded-xl" />
          </div>
        </div>
      </template>

      <!-- ── Form (shown once data is loaded) ── -->
      <Form v-if="eventData" id="form" @submit="submit()" class="flex flex-col gap-6">

        <!-- ── Event Information Card ── -->
        <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />

          <div class="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 6v.75m0 3v.75m0 3v.75m0 3V18m-9-5.25h5.25M7.5 15h3M3.375 5.25c-.621 0-1.125.504-1.125 1.125v3.026a2.999 2.999 0 0 1 0 5.198v3.026c0 .621.504 1.125 1.125 1.125h17.25c.621 0 1.125-.504 1.125-1.125v-3.026a2.999 2.999 0 0 1 0-5.198V6.375c0-.621-.504-1.125-1.125-1.125H3.375Z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-base font-semibold text-white">Event Information</h2>
              <p class="text-xs text-white/40">Title, date, location, and description</p>
            </div>
          </div>

          <div class="p-6 flex flex-col gap-5">

            <!-- Title + Date -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Title <span class="text-[#D4AF37]">*</span>
                </label>
                <TextField
                  name="title"
                  v-model="formData.title"
                  placeholder="e.g. Summer Mixer"
                  :rules="'required|max:255'"
                  optionalMessage="Event title"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Event Date <span class="text-[#D4AF37]">*</span>
                </label>
                <DateField
                  name="date"
                  v-model="formData.date"
                  placeholder="Select date"
                  :rules="'required'"
                  optionalMessage="Event date"
                />
              </div>
            </div>

            <!-- Location + Event Type -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Location
                  <span class="text-white/30 font-normal normal-case tracking-normal ml-1">optional</span>
                </label>
                <TextField
                  name="location"
                  v-model="formData.location"
                  placeholder="e.g. Main courts"
                  :rules="'max:255'"
                  optionalMessage="Event location"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Event Type
                  <span class="text-white/30 font-normal normal-case tracking-normal ml-1">optional</span>
                </label>
                <SelectField
                  name="event_type"
                  v-model="formData.event_type"
                  placeholder="Select type"
                  :options="eventTypeOptions"
                  :rules="''"
                />
              </div>
            </div>

            <!-- Description -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Description</label>
              <div class="rounded-xl overflow-hidden border border-[#C9A227]/20 bg-white/5 quill-dark">
                <Quill
                  v-model="formData.content"
                  :modelValue="formData.content"
                  name="content"
                  :max="0"
                  placeholder="Enter event description…"
                />
              </div>
            </div>

          </div>
        </div>

        <!-- ── Tennis-Specific Fields Card ── -->
        <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
          <div class="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 21h16.5M3.75 9h16.5m-7.5 6h.008v.008h-.008V15zM3.75 3.75h.008v.008H3.75V3.75zm0 12h.008v.008H3.75v-.008zm12 0h.008v.008h-.008v-.008zm0-12h.008v.008h-.008V3.75z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-base font-semibold text-white">Tennis-Specific Fields</h2>
              <p class="text-xs text-white/40">Match type, format, and scoring (for tennis-related events)</p>
            </div>
          </div>
          <div class="p-6 flex flex-col gap-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Match Type</label>
                <SelectField
                  name="match_type"
                  v-model="formData.match_type"
                  placeholder="Select"
                  :options="matchTypeOptions"
                  :rules="''"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Format</label>
                <SelectField
                  name="format"
                  v-model="formData.format"
                  placeholder="Select"
                  :options="formatOptions"
                  :rules="''"
                />
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Scoring format</label>
              <TextField
                name="scoring_format"
                v-model="formData.scoring_format"
                placeholder="e.g. 1 set, 8-game pro set"
                :rules="'max:255'"
                optionalMessage="Scoring format"
              />
            </div>
          </div>
        </div>

        <!-- ── Match result / Score Card (tennis) ── -->
        <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
          <div class="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 0 1 3 3h-15a3 3 0 0 1 3-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 0 1-.982-3.172M9.497 14.25a7.454 7.454 0 0 0 .981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 0 0 7.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 0 0 2.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 0 1 2.916.52 6.003 6.003 0 0 1-5.395 4.972m0 0a6.726 6.726 0 0 1-2.749 1.35m0 0a6.772 6.772 0 0 1-3.044 0"/>
              </svg>
            </div>
            <div>
              <h2 class="text-base font-semibold text-white">Match Result / Score</h2>
              <p class="text-xs text-white/40">Log the final score and winner (for completed matches)</p>
            </div>
          </div>
          <div class="p-6 flex flex-col gap-5">
            <!-- Singles: Player 1 vs Player 2, Winner = one of them -->
            <template v-if="formData.match_type === 'singles'">
              <p v-if="formData.team_one_label || formData.team_two_label" class="text-xs text-white/40">Current: {{ formData.team_one_label || '—' }} vs {{ formData.team_two_label || '—' }}</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Player 1</label>
                  <SelectField
                    name="player_1_id"
                    v-model="formData.player_1_id"
                    placeholder="Select member"
                    :options="userOptions"
                    :rules="''"
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Player 2</label>
                  <SelectField
                    name="player_2_id"
                    v-model="formData.player_2_id"
                    placeholder="Select member"
                    :options="userOptions"
                    :rules="''"
                  />
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Winner</label>
                <SelectField
                  name="winner_user_id"
                  v-model="formData.winner_user_id"
                  placeholder="Select winner"
                  :options="singlesWinnerOptions"
                  :rules="''"
                />
              </div>
            </template>

            <!-- Doubles / Mixed: two pairs of players -->
            <template v-if="formData.match_type === 'doubles' || formData.match_type === 'mixed'">
              <p v-if="formData.team_one_label || formData.team_two_label" class="text-xs text-white/40">Current: {{ formData.team_one_label || '—' }} vs {{ formData.team_two_label || '—' }}</p>
              <div class="space-y-4">
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Team / Pair 1</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div class="flex flex-col gap-1.5">
                      <label class="text-xs text-white/40">Player 1</label>
                      <SelectField
                        name="team_one_player_1_id"
                        v-model="formData.team_one_player_1_id"
                        placeholder="Select member"
                        :options="userOptions"
                        :rules="''"
                      />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="text-xs text-white/40">Player 2</label>
                      <SelectField
                        name="team_one_player_2_id"
                        v-model="formData.team_one_player_2_id"
                        placeholder="Select member"
                        :options="userOptions"
                        :rules="''"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <p class="text-xs font-semibold uppercase tracking-wider text-white/50 mb-2">Team / Pair 2</p>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div class="flex flex-col gap-1.5">
                      <label class="text-xs text-white/40">Player 1</label>
                      <SelectField
                        name="team_two_player_1_id"
                        v-model="formData.team_two_player_1_id"
                        placeholder="Select member"
                        :options="userOptions"
                        :rules="''"
                      />
                    </div>
                    <div class="flex flex-col gap-1.5">
                      <label class="text-xs text-white/40">Player 2</label>
                      <SelectField
                        name="team_two_player_2_id"
                        v-model="formData.team_two_player_2_id"
                        placeholder="Select member"
                        :options="userOptions"
                        :rules="''"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Winner</label>
                <SelectField
                  name="winner_side"
                  v-model="formData.winner_side"
                  placeholder="Select winning team"
                  :options="doublesWinnerOptions"
                  :rules="''"
                />
              </div>
            </template>

            <!-- No match type: optional manual labels (fallback) -->
            <template v-if="!formData.match_type || (formData.match_type && !['singles', 'doubles', 'mixed'].includes(formData.match_type))">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Team / Pair 1</label>
                  <TextField
                    name="team_one_label"
                    v-model="formData.team_one_label"
                    placeholder="e.g. Smith / Jones"
                    :rules="'max:255'"
                    optionalMessage="Team one"
                  />
                </div>
                <div class="flex flex-col gap-1.5">
                  <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Team / Pair 2</label>
                  <TextField
                    name="team_two_label"
                    v-model="formData.team_two_label"
                    placeholder="e.g. Doe / Brown"
                    :rules="'max:255'"
                    optionalMessage="Team two"
                  />
                </div>
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Winner</label>
                <TextField
                  name="winner_name"
                  v-model="formData.winner_name"
                  placeholder="Winner name or team"
                  :rules="'max:255'"
                  optionalMessage="Winner"
                />
              </div>
            </template>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Final Score</label>
                <TextField
                  name="final_score"
                  v-model="formData.final_score"
                  :placeholder="formData.match_type === 'doubles' || formData.match_type === 'mixed' ? 'e.g. 6-4, 6-3' : 'e.g. 6-4, 6-3 or 8-6'"
                  :rules="'max:255'"
                  optionalMessage="Final score"
                />
              </div>
            </div>
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Match Notes</label>
              <TextField
                name="match_notes"
                v-model="formData.match_notes"
                placeholder="e.g. Tiebreak 7-5, retirement, etc."
                :rules="'max:1000'"
                optionalMessage="Match notes"
              />
            </div>
          </div>
        </div>

        <!-- ── Host & Management Card ── -->
        <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
          <div class="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-base font-semibold text-white">Host & Management</h2>
              <p class="text-xs text-white/40">Assigned coach and event status</p>
            </div>
          </div>
          <div class="p-6 flex flex-col gap-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Assigned Coach</label>
                <TextField
                  name="assigned_coach"
                  v-model="formData.assigned_coach"
                  placeholder="Coach name"
                  :rules="'max:255'"
                  optionalMessage="Assigned coach"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Event Status</label>
                <SelectField
                  name="event_status"
                  v-model="formData.event_status"
                  placeholder="Select status"
                  :options="eventStatusOptions"
                  :rules="''"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- ── Gallery Card ── -->
        <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />

          <div class="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"/>
              </svg>
            </div>
            <div class="flex-1">
              <h2 class="text-base font-semibold text-white">Gallery Images</h2>
              <p class="text-xs text-white/40">JPG, PNG, WebP · Max 5 MB per image · Up to 20 photos</p>
            </div>
            <!-- Existing image count badge -->
            <span v-if="eventGallery.length" class="inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-[#C9A227]/15 text-[#D4AF37] border border-[#C9A227]/20">
              <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909"/>
              </svg>
              {{ eventGallery.length }} existing
            </span>
          </div>

          <div class="p-6">
            <ImageHandler
              ref="galleryHandler"
              label="Event Gallery"
              max="20"
              size="5"
              :dimension="{ width: 812, height: 440 }"
              type="amenity_gallery"
              :existing_images="eventGallery"
              :input_payload="{
                identifier: 'event_gallery',
                id: 'event_gallery_id',
                category: 'event_gallery_category',
                category_value: 'event_gallery',
                alt: 'event_gallery_alt',
              }"
              @update:file="handleFileUpdate('event_gallery', $event)"
            />
          </div>
        </div>

        <!-- ── Action Buttons ── -->
        <div class="flex items-center justify-end gap-3">
          <router-link
            to="/events"
            class="px-5 py-2.5 rounded-xl border border-white/15 text-white/60 text-sm font-medium hover:border-white/30 hover:text-white/80 transition-all"
          >
            Cancel
          </router-link>
          <button
            type="submit"
            class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-[#0D2818] text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-[#C9A227]/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7l-4-4z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M17 3v4H7V3m5 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z"/>
            </svg>
            Save Changes
          </button>
        </div>

      </Form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { usePageTitleStore } from '~/stores/pageTitle';
import { Form } from 'vee-validate';
import { useRoute } from 'vue-router';

definePageMeta({ middleware: 'authenticator' });

const TextField    = defineAsyncComponent(() => import('@/components/TextField.vue'));
const DateField    = defineAsyncComponent(() => import('@/components/DateField.vue'));
const SelectField  = defineAsyncComponent(() => import('@/components/SelectField.vue'));
const Quill        = defineAsyncComponent(() => import('@/components/form-fields/Quill.vue'));
const ImageHandler = defineAsyncComponent(() => import('@/components/form-fields/ImageHandler.vue'));

const nuxtApp   = useNuxtApp();
const route     = useRoute();
const pageTitle = usePageTitleStore();
const id        = route.params.id;

// ── User list for player selectors ─────────────────────────────────────
const userList = ref([]);

const fetchUsers = async () => {
  try {
    const res = await nuxtApp.$axios.get('/cms/users', { params: { page: 1, per_page: 300 } });
    const rec = res.data?.records;
    const data = rec?.data ?? (Array.isArray(rec) ? rec : []);
    userList.value = data || [];
  } catch (e) {
    console.error('Fetch users error:', e);
    userList.value = [];
  }
};

const userDisplayName = (user) => user?.user_detail?.full_name || user?.email || '—';

const userOptions = computed(() => {
  const list = userList.value || [];
  return [
    { value: '', label: '— Select —' },
    ...list.map((u) => ({ value: u.id, label: userDisplayName(u) })),
  ];
});

const singlesWinnerOptions = computed(() => {
  const p1 = formData.player_1_id;
  const p2 = formData.player_2_id;
  const list = userList.value || [];
  const opts = [{ value: '', label: '— Select winner —' }];
  if (p1) {
    const u = list.find((x) => x.id === p1);
    opts.push({ value: p1, label: userDisplayName(u) || 'Player 1' });
  }
  if (p2) {
    const u = list.find((x) => x.id === p2);
    opts.push({ value: p2, label: userDisplayName(u) || 'Player 2' });
  }
  return opts;
});

const doublesWinnerOptions = computed(() => {
  const t1p1 = formData.team_one_player_1_id;
  const t1p2 = formData.team_one_player_2_id;
  const t2p1 = formData.team_two_player_1_id;
  const t2p2 = formData.team_two_player_2_id;
  const list = userList.value || [];
  const name = (id) => id ? userDisplayName(list.find((x) => x.id === id)) : '';
  const team1Label = [t1p1, t1p2].filter(Boolean).map(name).filter(Boolean).join(' / ') || 'Team 1';
  const team2Label = [t2p1, t2p2].filter(Boolean).map(name).filter(Boolean).join(' / ') || 'Team 2';
  return [
    { value: '', label: '— Select winning team —' },
    ...(t1p1 || t1p2 ? [{ value: 'team_one', label: team1Label }] : []),
    ...(t2p1 || t2p2 ? [{ value: 'team_two', label: team2Label }] : []),
  ];
});

const eventTypeOptions = [
  { value: '',           label: '— Select —'  },
  { value: 'tournament', label: 'Tournament'  },
  { value: 'mixer',      label: 'Mixer'       },
  { value: 'social',     label: 'Social'      },
  { value: 'other',      label: 'Other'       },
];

const matchTypeOptions = [
  { value: '',        label: '— Select —' },
  { value: 'singles', label: 'Singles'    },
  { value: 'doubles', label: 'Doubles'    },
  { value: 'mixed',   label: 'Mixed'      },
];

const formatOptions = [
  { value: '',            label: '— Select —'   },
  { value: 'round_robin', label: 'Round Robin'  },
  { value: 'knockout',    label: 'Knockout'     },
  { value: 'ladder',      label: 'Ladder'       },
  { value: 'timed_play',  label: 'Timed Play'   },
];

const eventStatusOptions = [
  { value: '',           label: '— Select —'  },
  { value: 'draft',      label: 'Draft'       },
  { value: 'published',  label: 'Published'  },
  { value: 'cancelled',  label: 'Cancelled'  },
  { value: 'completed',  label: 'Completed'   },
];

const formData = reactive({
  title:           '',
  content:         '',
  date:            '',
  location:        '',
  event_type:      '',
  enabled:         true,
  match_type:      '',
  format:          '',
  scoring_format:  '',
  assigned_coach:  '',
  event_status:    '',
  final_score:     '',
  winner_name:     '',
  match_notes:     '',
  team_one_label:  '',
  team_two_label:  '',
  player_1_id:     '',
  player_2_id:     '',
  winner_user_id:  '',
  team_one_player_1_id: '',
  team_one_player_2_id: '',
  team_two_player_1_id: '',
  team_two_player_2_id: '',
  winner_side:     '',
});

const formDataFiles = reactive({ event_gallery: [] });
const eventData     = ref(null);
const eventGallery  = ref([]);
const galleryHandler = ref(null);

const handleFileUpdate = (field, files) => {
  formDataFiles[field] = Array.isArray(files) ? files : [];
};

onMounted(() => {
  pageTitle.setTitle('Edit Event');
  pageTitle.setBreadcrumbs(['Club Events', 'Events List', 'Edit Event']);
  pageTitle.setPageFrom('Events List');
  pageTitle.setPageFromRoute('/events');
  fetchUsers();
  fetchRecord();
});

const fetchRecord = async () => {
  try {
    const response = await nuxtApp.$axios.get(`/cms/events/${id}`);
    eventData.value = response.data.record;
    populateData(eventData.value);
  } catch (error) {
    console.error('Error:', error);
    nuxtApp.$toast?.error(error?.response?.data?.message || 'Failed to load event.');
  }
};

const populateData = (data) => {
  if (!data) return;
  formData.title           = data.title           || '';
  formData.content         = data.content         || '';
  formData.date            = data.date
    ? (typeof data.date === 'string' && data.date.includes(' ') ? data.date.split(' ')[0] : data.date)
    : '';
  formData.location        = data.location        || '';
  formData.event_type      = data.event_type      || '';
  formData.enabled         = Boolean(data.enabled);
  formData.match_type      = data.match_type      || '';
  formData.format          = data.format          || '';
  formData.scoring_format  = data.scoring_format  || '';
  formData.assigned_coach  = data.assigned_coach  || '';
  formData.event_status    = data.event_status   || '';
  formData.final_score     = data.final_score    || '';
  formData.winner_name     = data.winner_name    || '';
  formData.match_notes     = data.match_notes    || '';
  formData.team_one_label  = data.team_one_label || '';
  formData.team_two_label  = data.team_two_label || '';
  formData.player_1_id     = '';
  formData.player_2_id     = '';
  formData.winner_user_id  = '';
  formData.team_one_player_1_id = '';
  formData.team_one_player_2_id = '';
  formData.team_two_player_1_id = '';
  formData.team_two_player_2_id = '';
  formData.winner_side     = '';

  const gallery = data.gallery
    || data.images?.filter((img) => img.category === 'event_gallery')
    || data.images
    || [];
  eventGallery.value = Array.isArray(gallery) ? gallery : [];
};

function computedMatchResultLabels() {
  const list = userList.value || [];
  const name = (id) => (id ? (list.find((x) => x.id === id)?.user_detail?.full_name || list.find((x) => x.id === id)?.email) : null) || '';
  let teamOne = '';
  let teamTwo = '';
  let winner = '';
  if (formData.match_type === 'singles') {
    teamOne = name(formData.player_1_id);
    teamTwo = name(formData.player_2_id);
    winner = name(formData.winner_user_id);
  } else if (formData.match_type === 'doubles' || formData.match_type === 'mixed') {
    teamOne = [formData.team_one_player_1_id, formData.team_one_player_2_id].filter(Boolean).map(name).filter(Boolean).join(' / ');
    teamTwo = [formData.team_two_player_1_id, formData.team_two_player_2_id].filter(Boolean).map(name).filter(Boolean).join(' / ');
    winner = formData.winner_side === 'team_one' ? teamOne : formData.winner_side === 'team_two' ? teamTwo : '';
  } else {
    teamOne = formData.team_one_label || '';
    teamTwo = formData.team_two_label || '';
    winner = formData.winner_name || '';
  }
  return { teamOne, teamTwo, winner };
}

const submit = async () => {
  const { teamOne, teamTwo, winner } = computedMatchResultLabels();
  const formElement = document.getElementById('form');
  const form_data   = new FormData(formElement);
  form_data.append('_method',     'PATCH');
  form_data.append('content',          formData.content          || '');
  form_data.append('location',         formData.location         || '');
  form_data.append('event_type',       formData.event_type       || '');
  form_data.append('enabled',          formData.enabled ? '1' : '0');
  form_data.append('match_type',       formData.match_type       || '');
  form_data.append('format',           formData.format           || '');
  form_data.append('scoring_format',   formData.scoring_format   || '');
  form_data.append('assigned_coach',   formData.assigned_coach   || '');
  form_data.append('event_status',     formData.event_status     || '');
  form_data.append('final_score',      formData.final_score     || '');
  form_data.append('winner_name',      winner);
  form_data.append('match_notes',      formData.match_notes     || '');
  form_data.append('team_one_label',   teamOne);
  form_data.append('team_two_label',   teamTwo);

  (formDataFiles.event_gallery || []).forEach((file) => {
    if (file instanceof File) form_data.append('event_gallery[]', file);
  });

  try {
    await nuxtApp.$axios.post(`/cms/events/${id}`, form_data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    await fetchRecord();
    nuxtApp.$toast.success('Event updated successfully!');
  } catch (error) {
    console.error('Error:', error);
    nuxtApp.$toast.error(error?.response?.data?.message || 'Error updating event. Please try again.');
  }
};
</script>

<style scoped>
.quill-dark :deep(.ql-toolbar) {
  background: rgba(255, 255, 255, 0.05);
  border: none;
  border-bottom: 1px solid rgba(201, 162, 39, 0.2);
}
.quill-dark :deep(.ql-toolbar .ql-stroke) { stroke: rgba(255,255,255,0.5); }
.quill-dark :deep(.ql-toolbar .ql-fill)   { fill:  rgba(255,255,255,0.5); }
.quill-dark :deep(.ql-toolbar button:hover .ql-stroke),
.quill-dark :deep(.ql-toolbar button.ql-active .ql-stroke) { stroke: #D4AF37; }
.quill-dark :deep(.ql-toolbar button:hover .ql-fill),
.quill-dark :deep(.ql-toolbar button.ql-active .ql-fill)   { fill:  #D4AF37; }
.quill-dark :deep(.ql-toolbar .ql-picker-label) { color: rgba(255,255,255,0.5); }
.quill-dark :deep(.ql-container) { background: transparent; border: none; min-height: 180px; }
.quill-dark :deep(.ql-editor)    { color: rgba(255,255,255,0.85); font-size: 0.875rem; min-height: 180px; }
.quill-dark :deep(.ql-editor.ql-blank::before) { color: rgba(255,255,255,0.25); font-style: normal; }
</style>