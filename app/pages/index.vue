<template>
  <div
    class="min-h-screen w-full relative bg-gradient-to-br from-[#0D2818] via-[#1a3c29] to-[#2d5a3d] flex items-center justify-center px-6 py-10"
  >
    <!-- Subtle texture overlay -->
    <div
      class="pointer-events-none absolute inset-0 opacity-[0.03]"
      style="background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"
      aria-hidden="true"
    />

    <!-- Decorative gold accent -->
    <div
      class="pointer-events-none absolute -z-10 top-0 right-0 w-96 h-96 bg-[#C9A227]/10 rounded-full blur-3xl"
      aria-hidden="true"
    />

    <!-- Hero content - centered homepage -->
    <section class="relative w-full max-w-2xl mx-auto text-center flex flex-col items-center gap-8">
      <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40">
        <span class="text-[#D4AF37] text-lg">🎾</span>
        <span class="text-xs font-semibold tracking-widest uppercase text-[#D4AF37]">Members Only</span>
      </div>

      <div class="space-y-4">
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-semibold leading-tight text-white">
          Welcome to<br />
          <span class="text-[#D4AF37]">SCR Tennis Club</span>
        </h1>
        <p class="text-base md:text-lg text-white/85 max-w-lg mx-auto">
          Access SCR Tennis Club benefits, court bookings, and exclusive member content. This private area is reserved for invited members only.
        </p>
      </div>

      <div class="flex flex-wrap items-center justify-center gap-6 text-sm text-white/70">
        <div class="flex items-center gap-2">
          <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#C9A227]/20 border border-[#C9A227]/30">
            <span class="h-1.5 w-1.5 rounded-full bg-[#D4AF37]"></span>
          </span>
          <span>Invitation code required</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#C9A227]/20 border border-[#C9A227]/30">
            <span class="h-1.5 w-1.5 rounded-full bg-[#D4AF37]"></span>
          </span>
          <span>Secure member access</span>
        </div>
      </div>

      <button
        type="button"
        @click="showLoginModal = true"
        class="inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-[#0D2818] bg-[#C9A227] hover:bg-[#B8860B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C9A227] focus:ring-offset-[#1a3c29] transition-colors shadow-lg border border-[#B8860B]/30 rounded-xl"
      >
        Access Portal
      </button>
    </section>

    <!-- Login modal popup -->
    <Teleport to="body">
      <Transition name="modal">
        <div
          v-if="showLoginModal"
          class="fixed inset-0 z-50 flex items-center justify-center p-4"
          @click.self="showLoginModal = false"
        >
          <div class="absolute inset-0 bg-black/60" aria-hidden="true" />
          <section
            class="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-[#C9A227]/30 overflow-hidden"
          >
            <!-- Close button -->
            <button
              type="button"
              @click="showLoginModal = false"
              class="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <!-- Modal content -->
            <div class="px-8 py-8 md:py-10 flex flex-col items-stretch gap-6">
              <div class="flex flex-col items-center mb-2">
                <div class="w-14 h-14 rounded-full bg-gradient-to-br from-[#1a3c29] to-[#0D2818] flex items-center justify-center border-2 border-[#C9A227]/50 mb-3">
                  <span class="text-2xl">🎾</span>
                </div>
                <h2 class="text-lg font-bold text-[#1a3c29] tracking-tight">
                  SCR Tennis Club — Members' Sign In
                </h2>
                <p class="text-sm text-[#B8860B] mt-0.5">
                  Enter your invitation details to continue
                </p>
              </div>

              <form @submit.prevent="onSubmit" class="w-full flex flex-col gap-4 mt-0">
                <div class="flex flex-col w-full gap-y-1.5 relative">
                  <label for="email" class="text-sm font-medium text-[#1a3c29]">Email address</label>
                  <Field
                    name="email"
                    type="email"
                    class="border border-[#2d5a3d]/30 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#C9A227] focus:border-transparent transition-colors placeholder:text-gray-400 bg-white"
                    :class="{ 'border-red-500 ring-1 ring-red-400 focus:ring-red-400 focus:ring-offset-1': errors.email }"
                    v-model="email"
                    placeholder="member@scrtennisclub.com"
                    :disabled="isLoading"
                  />
                  <ErrorMessage name="email" class="text-red-500 mt-1 text-xs absolute -bottom-5" />
                </div>

                <div class="flex flex-col w-full gap-y-1.5 relative">
                  <label for="password" class="text-sm font-medium text-[#1a3c29]">Password</label>
                  <div class="relative">
                    <Field
                      name="password"
                      :type="passwordFieldType"
                      v-model="password"
                      placeholder="Enter your password"
                      :class="{ 'border-red-500 ring-1 ring-red-400 focus:ring-red-400 focus:ring-offset-1': errors.password }"
                      class="w-full border border-[#2d5a3d]/30 rounded-xl px-3.5 py-2.5 text-sm pr-10 outline-none focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-[#C9A227] focus:border-transparent transition-colors placeholder:text-gray-400 bg-white"
                      :disabled="isLoading"
                    />
                    <button
                      type="button"
                      @click="togglePasswordVisibility"
                      class="absolute inset-y-0 right-0 flex items-center pr-3 text-[#2d5a3d]/50 hover:text-[#1a3c29] transition-colors"
                      :class="{ 'pointer-events-none opacity-50': isLoading }"
                      aria-label="Toggle password visibility"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 27 19" fill="none">
                        <path
                          d="M0.229542 9.13756C0.268696 9.04918 1.21619 6.94724 3.32261 4.84081C6.12931 2.03411 9.67432 0.550781 13.5762 0.550781C17.478 0.550781 21.0231 2.03411 23.8298 4.84081C25.9362 6.94724 26.8881 9.05254 26.9228 9.13756C26.9737 9.25201 27 9.37587 27 9.50112C27 9.62637 26.9737 9.75023 26.9228 9.86468C26.8837 9.95305 25.9362 12.0539 23.8298 14.1603C21.0231 16.9659 17.478 18.4492 13.5762 18.4492C9.67432 18.4492 6.12931 16.9659 3.32261 14.1603C1.21619 12.0539 0.268696 9.95305 0.229542 9.86468C0.178658 9.75023 0.152365 9.62637 0.152365 9.50112C0.152365 9.37587 0.178658 9.25201 0.229542 9.13756ZM13.5762 16.6594C17.0194 16.6594 20.0275 15.4076 22.5176 12.9399C23.5393 11.9238 24.4086 10.7651 25.0983 9.5C24.4087 8.23474 23.5395 7.07608 22.5176 6.06014C20.0275 3.5924 17.0194 2.34063 13.5762 2.34063C10.133 2.34063 7.12492 3.5924 4.6348 6.06014C3.61108 7.07583 2.73992 8.23449 2.04847 9.5C2.85502 11.0057 6.36871 16.6594 13.5762 16.6594ZM13.5762 4.13047C14.6382 4.13047 15.6763 4.44539 16.5593 5.0354C17.4423 5.62541 18.1306 6.46402 18.537 7.44517C18.9434 8.42632 19.0497 9.50596 18.8425 10.5475C18.6354 11.5891 18.124 12.5459 17.373 13.2968C16.6221 14.0478 15.6653 14.5592 14.6237 14.7664C13.5821 14.9735 12.5025 14.8672 11.5214 14.4608C10.5402 14.0544 9.70159 13.3662 9.11158 12.4832C8.52157 11.6001 8.20665 10.562 8.20665 9.5C8.20813 8.07637 8.77432 6.71147 9.78098 5.7048C10.7876 4.69814 12.1525 4.13195 13.5762 4.13047ZM13.5762 13.0797C14.2842 13.0797 14.9763 12.8697 15.5649 12.4764C16.1536 12.0831 16.6124 11.524 16.8834 10.8699C17.1543 10.2158 17.2252 9.49603 17.0871 8.80164C16.949 8.10725 16.608 7.46941 16.1074 6.96878C15.6068 6.46815 14.9689 6.12722 14.2745 5.9891C13.5802 5.85097 12.8604 5.92186 12.2063 6.1928C11.5522 6.46374 10.9931 6.92256 10.5998 7.51123C10.2064 8.09991 9.9965 8.792 9.9965 9.5C9.9965 10.4494 10.3736 11.3599 11.045 12.0312C11.7163 12.7025 12.6268 13.0797 13.5762 13.0797Z"
                          fill="currentColor"
                        />
                      </svg>
                    </button>
                  </div>
                  <ErrorMessage name="password" class="text-red-500 mt-1 text-xs absolute -bottom-5" />
                </div>

                <p class="text-xs text-[#B8860B] -mt-1">
                  No invitation? Contact the SCR Tennis Club secretary for membership access.
                </p>

                <button
                  type="submit"
                  :disabled="isLoading"
                  class="mt-2 inline-flex items-center justify-center rounded-xl w-full px-4 py-3 text-sm font-semibold text-[#0D2818] bg-[#C9A227] hover:bg-[#B8860B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C9A227] disabled:opacity-60 disabled:cursor-not-allowed transition-colors shadow-lg border border-[#B8860B]/30"
                >
                  <span
                    v-if="isLoading"
                    class="mr-2 inline-flex h-4 w-4 animate-spin rounded-full border-2 border-transparent border-t-[#0D2818]"
                  ></span>
                  <span>{{ isLoading ? "Signing in..." : "Access Members' Portal" }}</span>
                </button>

                <div
                  v-if="errorMessage"
                  class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 flex items-start gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-4 h-4 mt-0.5 flex-shrink-0">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.5a.75.75 0 00-1.5 0v5a.75.75 0 001.5 0v-5zM10 13.75a.875.875 0 100 1.75.875.875 0 000-1.75z"
                      clip-rule="evenodd"
                    />
                  </svg>
                  <span>{{ errorMessage }}</span>
                </div>
              </form>
            </div>
          </section>
        </div>
      </Transition>
    </Teleport>

    <!-- Loading overlay (full screen, when submitting) -->
    <div
      v-if="isLoading"
      class="fixed inset-0 bg-black/50 flex items-center justify-center z-[60]"
    >
      <div class="bg-[#1a3c29] border border-[#C9A227]/30 rounded-xl p-8 flex flex-col items-center gap-4">
        <div
          class="animate-spin rounded-full h-10 w-10 border-2 border-[#C9A227]/40 border-t-[#C9A227]"
        ></div>
        <p class="text-[#D4AF37] font-medium">Verifying membership...</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useForm, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import { useAuth } from "#imports";
import { ref } from "vue";

const auth = useAuth();
const showLoginModal = ref(false);

const { handleSubmit, errors } = useForm({
  validationSchema: yup.object({
    email: yup.string().required().email(),
    password: yup.string().required("Password is required"),
  }),
});

const email = ref("");
const password = ref("");
const errorMessage = ref("");
const passwordFieldType = ref("password");
const isLoading = ref(false);

const togglePasswordVisibility = () => {
  if (!isLoading.value) {
    passwordFieldType.value = passwordFieldType.value === "password" ? "text" : "password";
  }
};

const onSubmit = handleSubmit(async () => {
  try {
    isLoading.value = true;
    errorMessage.value = "";

    await auth.signIn(
      {
        email: email.value,
        password: password.value,
      },
      { redirect: false }
    );

    showLoginModal.value = false;
    navigateTo("/dashboard");
  } catch (error) {
    console.error("Error:", error);
    const anyError = error || {};
    const apiData = anyError.response?.data || anyError.data || anyError.body || {};
    const apiErrors = apiData?.errors;

    if (Array.isArray(apiErrors)) {
      errorMessage.value = apiErrors.join(" ");
    } else if (apiErrors && typeof apiErrors === "object") {
      const collected = Object.values(apiErrors).flat().filter(Boolean);
      errorMessage.value =
        collected.join(" ") || apiData?.message || "Invalid credentials. Please check your invitation code and try again.";
    } else {
      errorMessage.value =
        apiData?.message || "Access denied. Please verify your invitation code and credentials.";
    }
  } finally {
    isLoading.value = false;
  }
});

definePageMeta({
  name: "login",
  layout: false,
  middleware: "authenticator",
});
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
.modal-enter-active section,
.modal-leave-active section {
  transition: transform 0.2s ease;
}
.modal-enter-from section,
.modal-leave-to section {
  transform: scale(0.95);
}
</style>
