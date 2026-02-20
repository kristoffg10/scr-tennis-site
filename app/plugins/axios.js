import axios from 'axios'
import { useRuntimeConfig } from '#imports';

export default defineNuxtPlugin(() => {
    const runtimeConfig = useRuntimeConfig();

    const axiosInstance = axios.create({
        baseURL: runtimeConfig.public.apiURL,
        withCredentials: true, // 🔥 REQUIRED for cookies + CSRF
    })

    axiosInstance.interceptors.request.use(
        (config) => {
            // Read auth token from cookie (SSR-safe)
            const authCookie = useCookie('auth.token')
            const authToken = authCookie?.value
            if (authToken) {
                config.headers.Authorization = `Bearer ${authToken}`
            }

            // Read CSRF token from cookie (SSR + client) or meta tag (client-only)
            const csrfCookie = useCookie('csrf_token')
            let csrfToken = csrfCookie?.value

            // Fallback to meta tag only on client to avoid SSR "document is not defined"
            if (!csrfToken && process.client) {
                const metaToken = document
                    .querySelector('meta[name="csrf-token"]')
                    ?.getAttribute('content')
                if (metaToken) {
                    csrfToken = metaToken
                }
            }

            if (csrfToken) {
                config.headers['X-CSRF-TOKEN'] = csrfToken
            }

            return config
        },
        (error) => Promise.reject(error)
    )

    return {
        provide: {
            axios: axiosInstance,
        },
    }
})