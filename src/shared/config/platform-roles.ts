/**
 * Firestore `userRoles/{id}` belgesinin document ID'si — Admin rolü.
 *
 * Kullanıcının `users/{uid}` belgesindeki `roles[].id` veya `roleIds`
 * dizisinde bu değer olmalıdır. Kullanıcı uid'si ile karıştırılmamalıdır.
 *
 * Firebase Console → userRoles → Admin belgesinin ID'si.
 */
export const PLATFORM_ADMIN_ROLE_ID = 'ac65be64-5c72-44a2-91b5-5573fb814060' as const
