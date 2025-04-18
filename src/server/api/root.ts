import { postRouter } from "~/server/api/routers/post";
import { householdsRouter } from "~/server/api/routers/household";
import { menusRouter } from "~/server/api/routers/menu";
import { itemRouter } from "~/server/api/routers/item";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  household: householdsRouter,
  menu: menusRouter,
  item: itemRouter,

});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
