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

    <div class="relative z-10 max-w-4xl mx-auto px-4 lg:px-8 flex flex-col gap-8">
      <header class="flex flex-col gap-1">
        <p class="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]/70">Admin Settings</p>
        <h1 class="text-3xl md:text-4xl font-semibold text-white leading-tight">
          Edit <span class="text-[#D4AF37]">Role</span>
        </h1>
        <p class="text-sm text-white/50 mt-1">Update role name and permissions.</p>
      </header>

      <Form v-if="roleData" id="form" @submit="submit()" class="flex flex-col gap-6">
        <!-- Role Information Card -->
        <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
          <div class="px-6 py-5 border-b border-white/10 flex items-center gap-3">
            <div class="w-9 h-9 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
              </svg>
            </div>
            <div>
              <h2 class="text-base font-semibold text-white">Role Information</h2>
              <p class="text-xs text-white/40">Name and permissions</p>
            </div>
          </div>
          <div class="p-6 flex flex-col gap-5">
            <div class="flex flex-col gap-1.5">
              <label class="text-xs font-semibold uppercase tracking-wider text-white/50">
                Role Name <span class="text-[#D4AF37]">*</span>
              </label>
              <TextField
                name="name"
                v-model="formData.name"
                placeholder="e.g. CMS Admin"
                :rules="'required|max:50'"
                optionalMessage="Max 50 characters"
              />
            </div>
          </div>
        </div>

        <!-- Permissions Card -->
        <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
          <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
          <div class="px-6 py-5 border-b border-white/10 flex flex-col gap-1">
            <h2 class="text-base font-semibold text-white">Role Permissions</h2>
            <p class="text-xs text-white/40">Select which modules this role can access and which actions (Create, Read, Update, Delete) are allowed for each.</p>
          </div>
          <div class="p-6 flex flex-col gap-4">
            <div class="overflow-x-auto rounded-xl border border-[#C9A227]/20 bg-white/5">
              <table class="min-w-full">
                <thead>
                  <tr class="border-b border-white/10">
                    <th class="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-white/35 w-[200px]">Module</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white/35 w-[100px]">Create</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white/35 w-[100px]">Read</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white/35 w-[100px]">Update</th>
                    <th class="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white/35 w-[100px]">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="(mod, idx) in modulePermissions"
                    :key="mod.unique"
                    class="border-b border-white/5"
                    :class="idx % 2 === 0 ? 'bg-white/5' : 'bg-white/[0.02]'"
                  >
                    <td class="px-4 py-3">
                      <div class="flex items-center gap-2">
                        <span class="text-xl leading-none">{{ mod.icon }}</span>
                        <span class="font-medium text-white/90">{{ mod.name }}</span>
                      </div>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <label class="inline-flex items-center justify-center w-8 h-8 rounded-lg border-2 cursor-pointer transition-colors"
                        :class="mod.create ? 'border-[#C9A227] bg-[#C9A227]/20 text-[#D4AF37]' : 'border-white/30 hover:border-white/50 text-white/20'">
                        <input type="checkbox" v-model="mod.create" class="sr-only" />
                        <svg v-if="mod.create" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </label>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <label class="inline-flex items-center justify-center w-8 h-8 rounded-lg border-2 cursor-pointer transition-colors"
                        :class="mod.read ? 'border-[#C9A227] bg-[#C9A227]/20 text-[#D4AF37]' : 'border-white/30 hover:border-white/50 text-white/20'">
                        <input type="checkbox" v-model="mod.read" class="sr-only" />
                        <svg v-if="mod.read" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </label>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <label class="inline-flex items-center justify-center w-8 h-8 rounded-lg border-2 cursor-pointer transition-colors"
                        :class="mod.update ? 'border-[#C9A227] bg-[#C9A227]/20 text-[#D4AF37]' : 'border-white/30 hover:border-white/50 text-white/20'">
                        <input type="checkbox" v-model="mod.update" class="sr-only" />
                        <svg v-if="mod.update" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </label>
                    </td>
                    <td class="px-4 py-3 text-center">
                      <label class="inline-flex items-center justify-center w-8 h-8 rounded-lg border-2 cursor-pointer transition-colors"
                        :class="mod.delete ? 'border-[#C9A227] bg-[#C9A227]/20 text-[#D4AF37]' : 'border-white/30 hover:border-white/50 text-white/20'">
                        <input type="checkbox" v-model="mod.delete" class="sr-only" />
                        <svg v-if="mod.delete" xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                        </svg>
                      </label>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p class="text-xs text-white/40">Only these modules are configurable: Club Events, Members, Announcements, Activity Logs, Roles.</p>
            <ErrorMessage name="permission" class="text-red-400 font-medium text-sm" />
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            class="px-6 py-3 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-[#0D2818] text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-[#C9A227]/20"
          >
            Save Changes
          </button>
        </div>
      </Form>
    </div>
  </div>
</template>

<script setup>
import { usePageTitleStore } from '~/stores/pageTitle';
import { Form, ErrorMessage } from 'vee-validate';
import { useRoute } from 'vue-router';

definePageMeta({ middleware: 'authenticator' });

const nuxtApp = useNuxtApp();
const route = useRoute();
const pageTitle = usePageTitleStore();

const formData = reactive({
  name: '',
});

const MODULES = [
  { unique: 'events', name: 'Club Events', icon: '🏆' },
  { unique: 'cms-editors', name: 'Members', icon: '👥' },
  { unique: 'announcements', name: 'Announcements', icon: '📢' },
  { unique: 'activity-logs', name: 'Activity Logs', icon: '🔔' },
  { unique: 'roles', name: 'Roles', icon: '🔑' },
];

const modulePermissions = ref(
  MODULES.map((m) => ({
    ...m,
    create: false,
    read: false,
    update: false,
    delete: false,
  }))
);

const roleData = ref(null);

onMounted(() => {
  pageTitle.setTitle('Edit Role');
  pageTitle.setBreadcrumbs(['Admin Settings', 'Roles', 'Edit Role']);
  pageTitle.setPageFrom('Roles');
  pageTitle.setPageFromRoute('/admin-settings/roles');
  fetchRecords();
});

const fetchRecords = async () => {
  try {
    const user_response = await nuxtApp.$axios.get(`/cms/roles/${route.params.id}`);
    roleData.value = user_response.data.record;
    populateData(roleData.value);
  } catch (error) {
    console.error('Error:', error);
  }
};

const populateData = (data) => {
  if (!data) return;
  formData.name = data.name;
  const p = data.permissions;
  const list = Array.isArray(p) ? p : typeof p === 'string' ? JSON.parse(p || '[]') : [];
  const byUnique = new Map(list.map((item) => [item.unique, item]));

  modulePermissions.value = MODULES.map((m) => {
    const existing = byUnique.get(m.unique);
    const hasCrud = existing && ('create' in existing || 'read' in existing || 'update' in existing || 'delete' in existing);
    return {
      ...m,
      create: hasCrud ? !!existing.create : !!existing,
      read: hasCrud ? !!existing.read : !!existing,
      update: hasCrud ? !!existing.update : !!existing,
      delete: hasCrud ? !!existing.delete : !!existing,
    };
  });
};

const hasAtLeastOnePermission = () => {
  return modulePermissions.value.some(
    (m) => m.create || m.read || m.update || m.delete
  );
};

const submit = async () => {
  if (!hasAtLeastOnePermission()) {
    nuxtApp.$toast.error('Please select at least one permission (Create, Read, Update, or Delete) for at least one module.');
    return;
  }

  const formElement = document.getElementById('form');
  const form_data = new FormData(formElement);
  const permissions = modulePermissions.value.map((m) => ({
    unique: m.unique,
    name: m.name,
    create: !!m.create,
    read: !!m.read,
    update: !!m.update,
    delete: !!m.delete,
  }));
  form_data.append('permissions', JSON.stringify(permissions));
  form_data.append('_method', 'PATCH');

  try {
    await nuxtApp.$axios.post(`/cms/roles/${route.params.id}`, form_data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    const res = await nuxtApp.$axios.get(`/cms/roles/${route.params.id}`);
    populateData(res.data.record);
    nuxtApp.$toast.success('Role updated successfully!');
  } catch (error) {
    console.error('Error:', error);
    nuxtApp.$toast.error(error.response?.data?.errors?.[0] ?? 'Update failed');
  }
};
</script>
