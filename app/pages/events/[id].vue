<template>
  <div
    class="min-h-screen w-full relative bg-gradient-to-br from-[#0D2818] via-[#1a3c29] to-[#2d5a3d] overflow-y-auto overflow-x-hidden pt-[118px] pb-16"
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
import { ref, reactive, onMounted } from 'vue';
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

  const gallery = data.gallery
    || data.images?.filter((img) => img.category === 'event_gallery')
    || data.images
    || [];
  eventGallery.value = Array.isArray(gallery) ? gallery : [];
};

const submit = async () => {
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