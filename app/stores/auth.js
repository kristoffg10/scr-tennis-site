// stores/auth.js
import { defineStore } from 'pinia';

/** User ID exempt from all role restrictions (super admin). */
export const SUPER_ADMIN_USER_ID = '59ce9e0c-f1e9-4eee-a840-2a17b68dbc10';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null, // Store user data
  }),
  getters: {
    isSuperAdmin: (state) => state.user?.id === SUPER_ADMIN_USER_ID,
  },
  actions: {
    setUser(userData) {
      this.user = userData; // Set user data
    },
    resetUser() {
      this.user = null; // Reset user data
    },
    async checkSession(auth) {
        try {
            const session = await auth.getSession();
            if (session && session.user) {
                this.setUser(session.user); // Set user if session is valid
            } else {
                this.resetUser(); // Reset user if session is invalid
            }
        } catch (error) {
            console.error('Session check failed:', error);
            this.resetUser(); // Reset user on error
        }
    },
  },
});
