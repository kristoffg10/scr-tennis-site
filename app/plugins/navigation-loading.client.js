export default defineNuxtPlugin((nuxtApp) => {
  const router = useRouter();
  const isNavigating = ref(false);

  const MIN_DISPLAY_MS = 1000;
  let showStartedAt = 0;

  router.beforeEach(() => {
    isNavigating.value = true;
    showStartedAt = Date.now();
  });

  router.afterEach(() => {
    const elapsed = Date.now() - showStartedAt;
    const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);
    if (remaining > 0) {
      setTimeout(() => {
        isNavigating.value = false;
      }, remaining);
    } else {
      isNavigating.value = false;
    }
  });

  router.onError(() => {
    isNavigating.value = false;
  });

  nuxtApp.provide('isNavigating', isNavigating);
});
