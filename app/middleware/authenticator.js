// middleware/authenticator.js
import { defineNuxtRouteMiddleware, useAuth } from '#imports'
import { useAuthStore, SUPER_ADMIN_USER_ID } from '~/stores/auth'
import { usePermissionStore } from '~/stores/permissions'

const ALLOW_WITHOUT_CHECK = ['login', 'index', 'dashboard']

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return

  const auth = useAuth()
  if (!auth) {
    console.error('Auth composable is not available')
    return
  }
  try {
    const token = auth.getSession ? await auth.getSession() : auth.token
    const authStore = useAuthStore()

    if (token) {
      if (to.name === 'login') return navigateTo('/dashboard')

      const session = await auth.getSession()
      if (session && session.user) {
        authStore.setUser(session.user)

        // Route-level permission check: redirect to dashboard if user's role cannot access this route
        // Super admin user is exempt from all role restrictions
        const user = authStore.user
        if (user?.id === SUPER_ADMIN_USER_ID) {
          return
        }
        if (user?.role?.permissions) {
          const routeName = to.name || to.path.replace(/^\//, '').replace(/\//g, '-') || ''
          if (routeName && !ALLOW_WITHOUT_CHECK.includes(routeName)) {
            let userPermissions = []
            try {
              const raw = user.role.permissions
              const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
              userPermissions = Array.isArray(parsed) ? parsed : []
            } catch {
              // ignore parse error
            }

            const userUniques = userPermissions.map((p) => p?.unique).filter(Boolean)

            /** User has this module in their list with at least one CRUD (create/read/update/delete) checked. */
            const hasModuleAccess = (unique) => {
              const perm = userPermissions.find((p) => p?.unique === unique)
              if (!perm) return false
              return !!(perm.create || perm.read || perm.update || perm.delete)
            }

            const hasPermission = (unique) => {
              if (hasModuleAccess(unique)) return true
              if (unique === 'articles' && hasModuleAccess('news-and-articles')) return true
              // Backward compatibility: old 'admin-settings' permission grants access to new split permissions
              if (userUniques.includes('admin-settings')) {
                if (['cms-editors', 'roles', 'admin-settings-website-settings'].includes(unique)) {
                  return true
                }
              }
              // Parent 'plans' permission grants access to all child plan modules
              if (hasModuleAccess('plans')) {
                if (['plan-availments', 'plan-faqs', 'plan-highlights', 'plan-riders'].includes(unique)) {
                  return true
                }
              }
              return false
            }

            // Always allow access to /pages list (pages parent module)
            // Individual page sections will be checked by their specific route permissions below
            if (to.path === '/pages') {
              return
            }

            // Explicit path-based check: careers routes require 'careers' with at least one CRUD
            if (to.path === '/careers' || to.path.startsWith('/careers/')) {
              if (!hasModuleAccess('careers')) return navigateTo('/dashboard')
              return
            }

            // Explicit path-based check: announcements routes require 'announcements' with at least one CRUD
            if (to.path === '/announcements' || to.path.startsWith('/announcements/')) {
              if (!hasModuleAccess('announcements')) return navigateTo('/dashboard')
              return
            }

            // Explicit path-based check: activity logs (read-only module, access = read permission)
            if (to.path === '/activity-logs' || to.path.startsWith('/activity-logs/')) {
              if (!hasModuleAccess('activity-logs')) return navigateTo('/dashboard')
              return
            }

            // Explicit path-based check: events routes require 'events' with at least one CRUD
            if (to.path === '/events' || to.path.startsWith('/events/')) {
              if (!hasModuleAccess('events')) return navigateTo('/dashboard')
              return
            }

            // Explicit path-based check: members (cms-editors) routes
            if (to.path === '/admin-settings/cms-editors' || to.path.startsWith('/admin-settings/cms-editors/')) {
              if (!hasModuleAccess('cms-editors')) return navigateTo('/dashboard')
              return
            }

            // Explicit path-based check: roles routes
            if (to.path === '/admin-settings/roles' || to.path.startsWith('/admin-settings/roles/')) {
              if (!hasModuleAccess('roles')) return navigateTo('/dashboard')
              return
            }

            const permissionStore = usePermissionStore()
            const permissions = permissionStore?.permissions || []
            const requiredUniques = new Set()
            for (const perm of permissions) {
              const routeNames = perm.route_name || []
              for (const rn of routeNames) {
                if (routeName === rn || routeName.startsWith(rn + '-')) {
                  requiredUniques.add(perm.unique)
                  break
                }
              }
            }
            if (requiredUniques.size > 0) {
              const hasAny = [...requiredUniques].some((u) => hasPermission(u))
              if (!hasAny) return navigateTo('/dashboard')
            }
          }
        }
        return
      }
    } else {
      if (to.name !== 'login') return navigateTo('/')
    }
  } catch (err) {
    console.error('Error handling middleware:', err)
  }
})
