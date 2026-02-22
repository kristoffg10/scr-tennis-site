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
      <header class="flex flex-col gap-1">
        <p class="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]/70">Announcements</p>
        <h1 class="text-3xl md:text-4xl font-semibold text-white leading-tight">
          Add <span class="text-[#D4AF37]">Announcement</span>
        </h1>
        <p class="text-sm text-white/50 mt-1">Fill in the details below to create a new announcement.</p>
      </header>

      <!-- ── Form ── -->
      <Form id="form" @submit="submit()" class="flex flex-col gap-6">

        <!-- ── Announcement Information Card ── -->
        <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <!-- Gold top stripe -->
          <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />

          <!-- Card header -->
          <div class="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.511l-.657.38c-.551.318-1.26.117-1.527-.461a20.845 20.845 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.848 23.848 0 0 1 8.835 2.535M10.34 6.66a23.847 23.847 0 0 1 8.835-2.535m0 0A23.74 23.74 0 0 1 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46"/>
              </svg>
            </div>
            <div>
              <h2 class="text-base font-semibold text-white">Announcement Information</h2>
              <p class="text-xs text-white/40">Title, date, content, and visibility</p>
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
                  placeholder="e.g. Club closure notice"
                  :rules="'required|max:255'"
                  optionalMessage="Announcement title"
                />
              </div>
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Date <span class="text-[#D4AF37]">*</span>
                </label>
                <DateField
                  name="date"
                  v-model="formData.date"
                  placeholder="Select date"
                  :rules="'required'"
                  optionalMessage="Announcement date"
                />
              </div>
            </div>

            <!-- Content -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Content</label>
              <div class="rounded-xl overflow-hidden border border-[#C9A227]/20 bg-white/5 quill-dark">
                <Quill
                  v-model="formData.content"
                  :modelValue="formData.content"
                  name="content"
                  :max="0"
                  placeholder="Enter announcement content…"
                />
              </div>
            </div>

            <!-- Enabled -->
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-white/50">Status</label>
              <div class="flex items-center gap-3">
                <button
                  type="button"
                  role="switch"
                  :aria-checked="formData.enabled"
                  @click="formData.enabled = !formData.enabled"
                  class="relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border border-[#C9A227]/30 transition-colors focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/50 focus:ring-offset-2 focus:ring-offset-[#0D2818]"
                  :class="formData.enabled ? 'bg-[#C9A227]/40' : 'bg-white/10'"
                >
                  <span
                    class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition"
                    :class="formData.enabled ? 'translate-x-5' : 'translate-x-0.5'"
                  />
                </button>
                <span class="text-sm text-white/70">{{ formData.enabled ? 'Enabled' : 'Disabled' }}</span>
              </div>
            </div>

          </div>
        </div>

        <!-- ── Action Buttons ── -->
        <div class="flex items-center justify-end gap-3">
          <router-link
            to="/announcements"
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
            Save Announcement
          </button>
        </div>

      </Form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { usePageTitleStore } from '~/stores/pageTitle';
import { Form } from 'vee-validate';

definePageMeta({ middleware: 'authenticator' });

const TextField = defineAsyncComponent(() => import('@/components/TextField.vue'));
const DateField = defineAsyncComponent(() => import('@/components/DateField.vue'));
const Quill = defineAsyncComponent(() => import('@/components/form-fields/Quill.vue'));

const nuxtApp = useNuxtApp();
const pageTitle = usePageTitleStore();

const formData = reactive({
  title: '',
  content: '',
  date: '',
  enabled: true,
});

onMounted(() => {
  pageTitle.setTitle('Add Announcement');
  pageTitle.setBreadcrumbs(['Announcements', 'Announcements List', 'Add Announcement']);
  pageTitle.setPageFrom('Announcements List');
  pageTitle.setPageFromRoute('/announcements');
});

const submit = async () => {
  const formElement = document.getElementById('form');
  const form_data = new FormData(formElement);
  form_data.append('content', formData.content || '');
  form_data.append('enabled', formData.enabled ? '1' : '0');

  try {
    const response = await nuxtApp.$axios.post('/cms/announcements', form_data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const record = response.data.record;
    nuxtApp.$toast.success('Announcement created successfully!');
    useRouter().push(`/announcements/${record.id}`);
  } catch (error) {
    console.error('Error:', error);
    nuxtApp.$toast.error(error?.response?.data?.message || 'Error creating announcement. Please try again.');
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
