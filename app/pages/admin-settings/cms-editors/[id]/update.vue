<template>
  <div class="min-h-screen w-full relative bg-gradient-to-br from-[#0D2818] via-[#1a3c29] to-[#2d5a3d] overflow-y-auto px-4 lg:px-8 pt-[220px] pb-16">
    <!-- Texture overlay -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.03]"
      style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"
      aria-hidden="true"
    />
    <!-- Glow accents -->
    <div class="pointer-events-none absolute top-0 right-0 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl" aria-hidden="true" />
    <div class="pointer-events-none absolute bottom-0 left-0 w-80 h-80 bg-[#C9A227]/5 rounded-full blur-3xl" aria-hidden="true" />

    <div class="relative z-10 max-w-3xl mx-auto flex flex-col gap-6">

      <!-- Page header -->
      <header class="flex flex-col gap-1">
        <p class="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]/70">Account</p>
        <h1 class="text-2xl md:text-3xl font-semibold text-white">Edit Profile</h1>
        <p class="text-sm text-white/45">Update your membership details and credentials.</p>
      </header>

      <!-- Loading state -->
      <div v-if="loading" class="rounded-2xl border border-[#C9A227]/20 bg-white/5 px-8 py-10 text-center text-white/50 text-sm">
        Loading member data…
      </div>

      <!-- Not found state -->
      <div v-else-if="!userData" class="rounded-2xl border border-red-500/20 bg-red-500/10 px-8 py-10 text-center text-red-300 text-sm">
        Member not found or failed to load.
      </div>

      <!-- Form -->
      <Form v-else id="form" @submit="submit()" class="flex flex-col gap-6">

        <!-- User Information card -->
        <section class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <!-- Card header stripe -->
          <div class="h-0.5 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
          <div class="px-6 md:px-8 py-5 border-b border-white/10">
            <h2 class="text-base font-semibold text-white">User Information</h2>
            <p class="text-xs text-white/40 mt-0.5">Basic details tied to this membership account.</p>
          </div>

          <div class="px-6 md:px-8 py-6 flex flex-col gap-5">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <!-- First Name -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-medium text-white/60 uppercase tracking-wide">First Name</label>
                <TextField
                  name="first_name"
                  v-model="formData.first_name"
                  placeholder="e.g. Juan"
                  :rules="'required|max:50'"
                  optionalMessage=""
                  class="!bg-white/5 !border-white/15 !text-white !placeholder-white/25 !rounded-xl focus:!ring-[#C9A227] focus:!border-[#C9A227]"
                />
              </div>
              <!-- Last Name -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-medium text-white/60 uppercase tracking-wide">Last Name</label>
                <TextField
                  name="last_name"
                  v-model="formData.last_name"
                  placeholder="e.g. Dela Cruz"
                  :rules="'required|max:50'"
                  optionalMessage=""
                  class="!bg-white/5 !border-white/15 !text-white !placeholder-white/25 !rounded-xl focus:!ring-[#C9A227] focus:!border-[#C9A227]"
                />
              </div>
              <!-- Email -->
              <div class="flex flex-col gap-1.5 sm:col-span-2">
                <label class="text-xs font-medium text-white/60 uppercase tracking-wide">Email Address</label>
                <TextField
                  name="email"
                  v-model="formData.email"
                  placeholder="e.g. juandelacruz@email.com"
                  :rules="'required|email'"
                  optionalMessage=""
                  class="!bg-white/5 !border-white/15 !text-white !placeholder-white/25 !rounded-xl focus:!ring-[#C9A227] focus:!border-[#C9A227]"
                />
                <p class="text-xs text-[#D4AF37]/60">Confirmation will be sent to this email address.</p>
              </div>
              <!-- Role (conditional) -->
              <div v-if="canChangeEditorRole" class="flex flex-col gap-1.5 sm:col-span-2">
                <label class="text-xs font-medium text-white/60 uppercase tracking-wide">Role</label>
                <SelectField
                  name="role_id"
                  v-model="formData.role_id"
                  placeholder="Choose a role"
                  :options="roleOptions"
                  rules="required"
                  class="!bg-white/5 !border-white/15 !text-white !rounded-xl"
                />
              </div>
            </div>
          </div>
        </section>

        <!-- Profile Image card -->
        <section class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div class="h-0.5 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
          <div class="px-6 md:px-8 py-5 border-b border-white/10">
            <h2 class="text-base font-semibold text-white">Profile Image</h2>
            <p class="text-xs text-white/40 mt-0.5">Recommended: 100×100px. Max 5MB.</p>
          </div>
          <div class="px-6 md:px-8 py-6">
            <ImageHandler
              label=""
              max="1"
              size="5"
              :data="main_image"
              :dimension="{ width: 100, height: 100 }"
              :input_payload="{
                identifier: 'profile_image',
                id: 'profile_image_id',
                category: 'profile_image_category',
                category_value: 'profile_image',
                alt: 'profile_image_alt',
              }"
              @update:file="handleFileUpdate('profile_image', $event)"
            />
          </div>
        </section>

        <!-- Change Password card (own profile only) -->
        <section
          v-if="authStore.user?.id === route.params.id"
          class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden"
        >
          <div class="h-0.5 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
          <div class="px-6 md:px-8 py-5 border-b border-white/10">
            <h2 class="text-base font-semibold text-white">Password</h2>
            <p class="text-xs text-white/40 mt-0.5">A confirmation link will be sent to your registered email.</p>
          </div>
          <div class="px-6 md:px-8 py-6">
            <router-link
              :to="`/admin-settings/cms-editors/${route.params.id}/change-password`"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#C9A227]/35 bg-[#C9A227]/10 text-[#D4AF37] text-sm font-medium hover:bg-[#C9A227]/20 hover:border-[#C9A227]/60 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25a3 3 0 013 3m3 0a6 6 0 01-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1121.75 8.25z"/>
              </svg>
              Change Password
            </router-link>
          </div>
        </section>

        <!-- Actions -->
        <div class="flex justify-end gap-3">
          <router-link
            to="/dashboard"
            class="px-6 py-2.5 rounded-xl border border-white/15 text-white/60 text-sm font-medium hover:bg-white/5 hover:text-white transition-colors"
          >
            Cancel
          </router-link>
          <button
            type="submit"
            class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#C9A227] hover:bg-[#B8860B] text-[#0D2818] text-sm font-semibold shadow-lg border border-[#B8860B]/30 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
            </svg>
            Save Changes
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from '~/stores/auth';
import { usePageTitleStore } from '~/stores/pageTitle';
import { Form } from 'vee-validate';
import { useRoute } from 'vue-router';

definePageMeta({ middleware: 'authenticator' });

const ImageHandler = defineAsyncComponent(() => import('@/components/form-fields/ImageHandler.vue'));

const nuxtApp = useNuxtApp();
const authStore = useAuthStore();
const route = useRoute();
const pageTitle = usePageTitleStore();

const ALLOWED_ROLE_IDS_FOR_CHANGE_ROLE = [
  'f269b653-5ef6-4fed-aa4b-1e1c81bdbc99',
  'fa5e772f-5715-4dea-9922-351e8e27bdab',
];
const canChangeEditorRole = computed(() => {
  if (authStore.isSuperAdmin) return true;
  const roleId = authStore.user?.role?.id ?? authStore.user?.role_id ?? '';
  return ALLOWED_ROLE_IDS_FOR_CHANGE_ROLE.includes(roleId);
});

const formData = reactive({
  profile_image: [],
  enabled: 1,
  first_name: '',
  last_name: '',
  email: '',
  role_id: '',
});

const main_image = ref([]);
const roles = ref([]);
const roleOptions = computed(() => (Array.isArray(roles.value) ? roles.value : []));
const userData = ref(null);
const loading = ref(true);

const populateData = (data) => {
  if (!data) return;
  const images = Array.isArray(data.images) ? data.images : [];
  const ud = data.user_detail || {};
  main_image.value = images.filter((img) => img?.category === 'profile_image');
  formData.enabled = data.enabled ?? 1;
  formData.first_name = ud.first_name ?? '';
  formData.last_name = ud.last_name ?? '';
  formData.email = data.email ?? '';
  formData.role_id = data.role_id ?? data.role?.id ?? '';
};

const fetchRecords = async () => {
  loading.value = true;
  userData.value = null;
  try {
    try {
      const type_response = await nuxtApp.$axios.get(`/cms/roles?all=1`);
      const data = type_response.data ?? {};
      let list = data.records;
      if (list && !Array.isArray(list) && list.data) list = list.data;
      if (!Array.isArray(list)) list = data.data ?? [];
      roles.value = list.map((r) => ({ value: r.id, label: r.name }));
    } catch (e) {
      console.error('Error fetching roles:', e);
    }
    const user_response = await nuxtApp.$axios.get(`/cms/users/${route.params.id}`);
    const body = user_response.data;
    if (user_response.status === 204 || body == null) { userData.value = null; return; }
    const record = body.record ?? body.data;
    if (!record || (typeof record === 'object' && Object.keys(record).length === 0)) { userData.value = null; return; }
    userData.value = record;
    populateData(record);
  } catch (error) {
    console.error('Error fetching editor:', error);
    userData.value = null;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  pageTitle.setTitle('Edit User');
  pageTitle.setBreadcrumbs(['Admin Settings', 'Users', 'Edit User']);
  pageTitle.setPageFrom('Users List');
  pageTitle.setPageFromRoute('/admin-settings/cms-editors');
  fetchRecords();
});

const handleFileUpdate = (field, file) => {
  const idx = parseInt(field.match(/\d+$/), 10);
  const fieldName = field.replace(/\d+$/, '');
  if (!Number.isNaN(idx)) {
    formData[fieldName][idx] = file;
  } else {
    formData[fieldName] = file;
  }
};

const submit = async () => {
  try {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    form_data.append('enabled', formData.enabled);
    form_data.append('_method', 'PATCH');
    if (canChangeEditorRole.value && formData.role_id) {
      form_data.append('role_id', formData.role_id);
    }
    const arr = Array.isArray(formData.profile_image)
      ? formData.profile_image
      : (formData.profile_image ? [formData.profile_image] : []);
    arr.forEach((file) => form_data.append('profile_image[]', file));

    const response = await nuxtApp.$axios.post(`/cms/users/${route.params.id}`, form_data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const body = response.data;
    const record = body?.record ?? body?.data ?? body;
    nuxtApp.$toast.success('Profile updated successfully!');
    if (record) {
      userData.value = record;
      populateData(record);
      if (authStore.user?.id === record.id) {
        authStore.setUser(record);
      }
    }
  } catch (error) {
    console.error('Error:', error);
    const msg = error?.response?.data?.errors?.[0] ?? error?.message ?? 'Update failed';
    nuxtApp.$toast.error(msg);
  }
};
</script>