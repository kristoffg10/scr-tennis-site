/**
 * Composable for role-based CRUD permissions per module.
 * Returns permission state for a module (create, read, update, delete) and whether user has any access.
 * @returns { { getModuleCrud: (unique: string) => { create: boolean, read: boolean, update: boolean, delete: boolean, hasAccess: boolean }, hasModuleAccess: (unique: string) => boolean } }
 */
export function useModuleCrud() {
  const authStore = useAuthStore();

  const parsedPermissions = computed(() => {
    const user = authStore?.user;
    if (!user?.role?.permissions) return [];
    try {
      const raw = user.role.permissions;
      const parsed = typeof raw === 'string' ? JSON.parse(raw) : raw;
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  const getModuleCrud = (unique) => {
    if (authStore?.isSuperAdmin) {
      return { create: true, read: true, update: true, delete: true, hasAccess: true };
    }
    const perm = parsedPermissions.value.find((p) => p?.unique === unique);
    if (!perm) return { create: false, read: false, update: false, delete: false, hasAccess: false };
    const create = !!perm.create;
    const read = !!perm.read;
    const update = !!perm.update;
    const delete_ = !!perm.delete;
    const hasAccess = create || read || update || delete_;
    return { create, read, update, delete: delete_, hasAccess };
  };

  const hasModuleAccess = (unique) => getModuleCrud(unique).hasAccess;

  return { getModuleCrud, hasModuleAccess, parsedPermissions };
}
