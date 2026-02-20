// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    // Run CMS as SPA to avoid SSR 500s on hard refresh/back
    ssr: false,
    compatibilityDate: '2024-12-31',
    devtools: { enabled: true },

    // Avoid "Cannot read properties of undefined (reading 'entries')" in _sortRoutesMap
    // when route manifest is missing (e.g. SPA mode, certain deploy setups).
    experimental: {
        appManifest: false,
    },

    app: {
        head: {
            link: [
                { rel: 'icon', type: 'image/x-icon', href: '/inlife-favicon.ico' },
                { rel: 'shortcut icon', type: 'image/x-icon', href: '/inlife-favicon.ico' },
            ],
        },
    },

    modules: ['@sidebase/nuxt-auth', '@nuxtjs/tailwindcss', '@pinia/nuxt'],
    runtimeConfig: {
        public: {
            apiURL: process.env.NUXT_PUBLIC_API_URL || 'https://ilb-api.designbluemanila.com/api/v1',
            baseURL: '/',
            webURL: process.env.NUXT_PUBLIC_WEB_URL,
            /** Optional: ip-api.com Pro key (https://ip-api.com/docs/api) – leave empty for free tier */
            ipApiKey: process.env.NUXT_PUBLIC_IP_API_KEY || '',
        },
    },

    nitro: {
        routeRules: {
        '/**': {
          headers: {
            'X-Frame-Options': 'DENY',
            'Content-Security-Policy': "frame-ancestors 'none';",
          },
        },
      },
    },
    auth: {
        baseURL: process.env.NUXT_PUBLIC_API_URL || 'https://ilb-api.designbluemanila.com/api/v1',
        enableGlobalAppMiddleware: false,
        // Disable server-side auth to prevent SSR calls from failing in production
        disableServerSideAuth: true,
        provider: {
            type: 'local',
            endpoints: {
                signIn: { path: `global/user/login`, method: 'post' }, // Login endpoint
                signOut: { path: `global/user/logout`, method: 'post' }, // Logout endpoint
                // user: { path: `global/user/check-token`, method: 'get' }, // User token check endpoint
                getSession: { path: `global/user/check-token`, method: 'get' },
            },
            token: {
                signInResponseTokenPointer: '/token',
                type: 'Bearer',
                cookieName: 'auth.token',
                maxAgeInSeconds: 60 * 60 * 24,
                sameSiteAttribute: 'lax', // or 'none' for cross-site requests over HTTPS
                secureCookieAttribute: false, // Set to true if using HTTPS
                // sameSiteAttribute: 'none', // or 'none' for cross-site requests over HTTPS
                // secureCookieAttribute: true, // Set to true if using HTTPS
            },
        },
    },

    // Plugins in app/plugins/ are auto-discovered in Nuxt 4

    css: [
        '~/assets/css/main.css', // adjust the path as necessary
    ],
});