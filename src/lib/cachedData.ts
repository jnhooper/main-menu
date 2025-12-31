import { cache } from 'react';
import {auth} from '~/server/auth'
import { api } from '~/trpc/server'; // Your server-side tRPC entrypoint
/**
 * A cached function to fetch the current user session.
 * This function will only run once per server request, even if called from multiple components.
 */
export const getCachedSession = cache(async () => {
  // Use your tRPC server-side caller or database logic here
  const session = await auth(); // Example tRPC call
  return session;
});
/**
 * Another cached function example for fetching posts by a specific ID.
 */
export const getCachedMenu = cache(async (menuId: string) => {
  const menu = await api.menu.getMenu({ menuId: menuId });
    return menu;
});
