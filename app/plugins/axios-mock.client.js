// Mock all axios integrations to keep the app headless / offline.
export default defineNuxtPlugin((nuxtApp) => {
  const mockResponse = (extra = {}) => ({
    data: {},
    record: [],
    records: { data: [], last_page: 1, ...extra.records },
    ...extra,
  });

  const log = (method, url) => {
    console.warn(`[mock-axios] ${method.toUpperCase()} ${url} skipped (headless mode)`);
  };

  const mockAxios = {
    get: async (url, ...rest) => {
      log('get', url);
      return mockResponse();
    },
    post: async (url, ...rest) => {
      log('post', url);
      return mockResponse();
    },
    put: async (url, ...rest) => {
      log('put', url);
      return mockResponse();
    },
    delete: async (url, ...rest) => {
      log('delete', url);
      return mockResponse();
    },
  };

  // Do NOT redefine/provide $axios to avoid non-configurable errors in Nuxt
  console.warn('[mock-axios] Skipping nuxtApp.provide($axios) to avoid redefine errors; axios calls will no-op if accessed directly.');
});

