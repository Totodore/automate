export const checkAdminPermissions = (perms: number) =>
  (perms & 0x8) === 0x8 ||
  (perms & 0x10) === 0x10 ||
  (perms & 0x20) === 0x20