import type { Profile, Role, ModuleKey } from './types';

export function canAccessTab(profile: Profile | null, role: Role | null, tabKey: string): boolean {
  if (!profile) return false;
  if (profile.is_super_admin) return true;
  if (!role) return false;
  return role.tabs.includes(tabKey);
}

export function hasPermission(
  profile: Profile | null,
  role: Role | null,
  moduleKey: ModuleKey,
  action: 'create' | 'read' | 'update' | 'delete'
): boolean {
  if (!profile) return false;
  if (profile.is_super_admin) return true;
  if (!role) return false;
  return !!role.permissions?.[moduleKey]?.[action];
}