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
  
      <div class="relative z-10 max-w-3xl mx-auto px-4 lg:px-8 flex flex-col gap-8">
  
        <!-- ── Header ── -->
        <header class="flex flex-col gap-1">
          <p class="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]/70">Admin Settings · Users</p>
          <h1 class="text-3xl md:text-4xl font-semibold text-white leading-tight">
            Change <span class="text-[#D4AF37]">Password</span>
          </h1>
          <p class="text-sm text-white/50 mt-1">Set a new secure password for this account.</p>
        </header>
  
        <!-- ── Form ── -->
        <Form id="form" @submit="submit()" class="flex flex-col gap-6">
  
          <!-- Password Card -->
          <div class="rounded-2xl border border-[#C9A227]/20 bg-white/5 backdrop-blur-sm overflow-hidden">
            <!-- Gold top stripe -->
            <div class="h-1 w-full bg-gradient-to-r from-[#C9A227] to-[#D4AF37]" />
  
            <!-- Card header -->
            <div class="px-6 py-5 border-b border-white/10 flex items-center gap-3">
              <div class="w-9 h-9 rounded-full bg-[#C9A227]/15 border border-[#C9A227]/30 flex items-center justify-center text-[#D4AF37] shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>
                </svg>
              </div>
              <div>
                <h2 class="text-base font-semibold text-white">Password Information</h2>
                <p class="text-xs text-white/40">Must be at least 6 characters long</p>
              </div>
            </div>
  
            <!-- Fields -->
            <div class="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
  
              <!-- New Password -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-white/50">
                  New Password <span class="text-[#D4AF37]">*</span>
                </label>
                <div class="relative">
                  <Field
                    name="password"
                    :type="passwordFieldType.password.type"
                    v-model="password"
                    placeholder="Enter new password"
                    rules="required|min:6|password"
                    class="w-full pr-11 pl-4 py-3 rounded-xl bg-white/5 border border-[#C9A227]/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#C9A227]/60 focus:bg-white/10 transition-all"
                  />
                  <!-- Toggle visibility -->
                  <button
                    type="button"
                    @click="togglePasswordVisibility('password')"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#D4AF37] transition-colors"
                  >
                    <!-- Eye icon (show) -->
                    <svg v-if="passwordFieldType.password.type === 'password'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    </svg>
                    <!-- Eye-slash icon (hide) -->
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
                    </svg>
                  </button>
                </div>
                <ErrorMessage name="password" class="text-red-400 text-xs mt-0.5" />
              </div>
  
              <!-- Confirm Password -->
              <div class="flex flex-col gap-1.5">
                <label class="text-xs font-semibold uppercase tracking-wider text-white/50">
                  Confirm Password <span class="text-[#D4AF37]">*</span>
                </label>
                <div class="relative">
                  <Field
                    name="password_confirmation"
                    :type="passwordFieldType.password_confirmation.type"
                    v-model="password_confirmation"
                    placeholder="Confirm new password"
                    :rules="`required|min:6|password|confirmed:${password}`"
                    class="w-full pr-11 pl-4 py-3 rounded-xl bg-white/5 border border-[#C9A227]/20 text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#C9A227]/60 focus:bg-white/10 transition-all"
                  />
                  <!-- Toggle visibility -->
                  <button
                    type="button"
                    @click="togglePasswordVisibility('password_confirmation')"
                    class="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#D4AF37] transition-colors"
                  >
                    <svg v-if="passwordFieldType.password_confirmation.type === 'password'" xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"/>
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"/>
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"/>
                    </svg>
                  </button>
                </div>
                <ErrorMessage name="password_confirmation" class="text-red-400 text-xs mt-0.5" />
              </div>
  
            </div>
  
            <!-- Password hint bar -->
            <div class="px-6 pb-6">
              <div class="rounded-xl bg-white/3 border border-white/8 px-4 py-3 flex items-start gap-3">
                <div class="w-5 h-5 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/30 flex items-center justify-center shrink-0 mt-0.5">
                  <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5" class="text-[#D4AF37]">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"/>
                  </svg>
                </div>
                <p class="text-xs text-white/40 leading-relaxed">
                  Password must be at least <span class="text-white/60 font-medium">6 characters</span>. Both fields must match before saving.
                </p>
              </div>
            </div>
          </div>
  
          <!-- ── Action Buttons ── -->
          <div class="flex items-center justify-end gap-3">
            <router-link
              :to="`/admin-settings/cms-editors/${route.params.id}/update`"
              class="px-5 py-2.5 rounded-xl border border-white/15 text-white/60 text-sm font-medium hover:border-white/30 hover:text-white/80 transition-all"
            >
              Cancel
            </router-link>
            <button
              type="submit"
              class="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A227] to-[#D4AF37] text-[#0D2818] text-sm font-semibold hover:brightness-110 transition-all shadow-lg shadow-[#C9A227]/20"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"/>
              </svg>
              Change Password
            </button>
          </div>
  
        </Form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { usePageTitleStore } from '~/stores/pageTitle';
  import { Form, Field, ErrorMessage } from 'vee-validate';
  import { useRoute } from 'vue-router';
  
  definePageMeta({ middleware: 'authenticator' });
  
  const nuxtApp = useNuxtApp();
  const router = useRouter();
  const route = useRoute();
  const pageTitle = usePageTitleStore();
  
  const password = ref('');
  const password_confirmation = ref('');
  
  const passwordFieldType = ref({
    password: { type: 'password' },
    password_confirmation: { type: 'password' },
  });
  
  const togglePasswordVisibility = (field) => {
    passwordFieldType.value[field].type =
      passwordFieldType.value[field].type === 'password' ? 'text' : 'password';
  };
  
  onMounted(() => {
    pageTitle.setTitle('Change Password');
    pageTitle.setBreadcrumbs(['Admin Settings', 'Users', 'Edit User', 'Change Password']);
    pageTitle.setPageFrom('Edit User');
    pageTitle.setPageFromRoute(`/admin-settings/cms-editors/${route.params.id}/update`);
  });
  
  const submit = async () => {
    const formElement = document.getElementById('form');
    const form_data = new FormData(formElement);
    form_data.append('password', password.value);
    form_data.append('password_confirmation', password_confirmation.value);
    form_data.append('update_password', 1);
    form_data.append('_method', 'PATCH');
  
    try {
      await nuxtApp.$axios.post(`/cms/users/${route.params.id}`, form_data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      nuxtApp.$toast.success('Password changed successfully!');
      setTimeout(() => {
        router.push(`/admin-settings/cms-editors/${route.params.id}/update`);
      }, 2500);
    } catch (error) {
      console.error('Error:', error);
      nuxtApp.$toast.error(error?.response?.data?.errors?.[0] || 'Error changing password.');
    }
  };
  </script>