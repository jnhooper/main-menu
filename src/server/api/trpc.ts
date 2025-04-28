/**
 * YOU PROBABLY DON'T NEED TO EDIT THIS FILE, UNLESS:
 * 1. You want to modify request context (see Part 1).
 * 2. You want to create a new middleware or type of procedure (see Part 3).
 *
 * TL;DR - This is where all the tRPC server stuff is created and plugged in. The pieces you will
 * need to use are documented accordingly near the end.
 */

import { initTRPC, TRPCError } from "@trpc/server";
import superjson from "superjson";
import { ZodError, z } from "zod";
import {eq, and} from 'drizzle-orm'
import { households, menus, usersToHouseholds } from "~/server/db/schema";

import { auth } from "~/server/auth";
import { db } from "~/server/db";

/**
 * 1. CONTEXT
 *
 * This section defines the "contexts" that are available in the backend API.
 *
 * These allow you to access things when processing a request, like the database, the session, etc.
 *
 * This helper generates the "internals" for a tRPC context. The API handler and RSC clients each
 * wrap this and provides the required context.
 *
 * @see https://trpc.io/docs/server/context
 */
export const createTRPCContext = async (opts: { headers: Headers }) => {
  const session = await auth();

  return {
    db,
    session,
    ...opts,
  };
};

/**
 * 2. INITIALIZATION
 *
 * This is where the tRPC API is initialized, connecting the context and transformer. We also parse
 * ZodErrors so that you get typesafety on the frontend if your procedure fails due to validation
 * errors on the backend.
 */
const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
        error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

/**
 * Create a server-side caller.
 *
 * @see https://trpc.io/docs/server/server-side-calls
 */
export const createCallerFactory = t.createCallerFactory;

/**
 * 3. ROUTER & PROCEDURE (THE IMPORTANT BIT)
 *
 * These are the pieces you use to build your tRPC API. You should import these a lot in the
 * "/src/server/api/routers" directory.
 */

/**
 * This is how you create new routers and sub-routers in your tRPC API.
 *
 * @see https://trpc.io/docs/router
 */
export const createTRPCRouter = t.router;

/**
 * Middleware for timing procedure execution and adding an artificial delay in development.
 *
 * You can remove this if you don't like it, but it can help catch unwanted waterfalls by simulating
 * network latency that would occur in production but not in local development.
 */
const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});


/**
 * Public (unauthenticated) procedure
 *
 * This is the base piece you use to build new queries and mutations on your tRPC API. It does not
 * guarantee that a user querying is authorized, but you can still access user session data if they
 * are logged in.
 */
export const publicProcedure = t.procedure.use(timingMiddleware);

/**
 * Protected (authenticated) procedure
 *
 * If you want a query or mutation to ONLY be accessible to logged in users, use this. It verifies
 * the session is valid and guarantees `ctx.session.user` is not null.
 *
 * @see https://trpc.io/docs/procedures
 */
export const protectedProcedure = t.procedure
.use(timingMiddleware)
.use(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const isPrivateMenuProcedure = t.procedure
.use(timingMiddleware)
.input(z.object({ menuId: z.string() }))
.use(async ({ctx, next, input})=>{
  const menuArray = await ctx.db.select().from(menus).where(
    eq(menus.id, input.menuId)
  )
  const menu = menuArray[0]
  if(menu?.isPrivate){
    if (!ctx.session || !ctx.session.user) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }
    else{
      const menuHouseholds = await ctx.db.select().from(usersToHouseholds)
        .where(
          and(
            eq(usersToHouseholds.userId, ctx.session.user.id),
            eq(usersToHouseholds.householdId, menu.householdId),
          )
        )
      if(menuHouseholds.length === 0){
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You must be a member of the household to view this menu"
        });
      }
      else {
        return next({
          ctx: {
            // infers the `session` as non-nullable
            session: { ...ctx.session, user: ctx.session.user },
            menu,
            menuHousehold: menuHouseholds[0]
          },
        })

      }
    }
  }else {
    return next({
      ctx:{
        menu
      }
    })
  }
})


export const houseMemberProcedure = protectedProcedure
.input(z.object({ householdId: z.string() }))
.use(timingMiddleware)
.use( async function  isHouseholdMember (opts){
  const myHouseholds = await opts.ctx.db.select().from(usersToHouseholds)
    .where(
      eq(usersToHouseholds.userId, opts.ctx.session.user.id),
    )
  const inHousehold = myHouseholds.filter(household =>{
    return household.householdId === opts.input.householdId
  });

  if(inHousehold.length === 0){
    throw new TRPCError({ code: "UNAUTHORIZED", message: 'You do not belong to this household' });
  }
  return opts.next({
    ctx: {
      session: {
        ...opts.ctx.session,
        householdIds: myHouseholds.map(hh=> hh.householdId)
      }
    }
  })
});

export const canEditMenu = protectedProcedure
.input(z.object({menuId: z.string()}))
.use(timingMiddleware)
.use(async (opts) => {
  const result = await opts.ctx.db
    .select().from(menus).leftJoin(
      usersToHouseholds,
      and(
        eq(menus.householdId, usersToHouseholds.householdId),
        eq(usersToHouseholds.userId, opts.ctx.session.user.id)
      )
    )

  const menu = result[0]?.menu
  if(!menu){
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: 'You must belong to the household to edit a menu',
    });
  }else {
    return opts.next({
      ctx: {
        menu 
      }
    })
  }
})


export const headOfHousehold = protectedProcedure
.input(z.object({ householdId: z.string() }))
.use(timingMiddleware)
.use( async function  isHeadOfHousehold (opts){
  const household = await opts.ctx.db.query.households.findFirst({
    where: eq(households.id, opts.input.householdId),
  })
  if(household?.headOfHouseholdId !== opts.ctx.session.user.id){
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: 'Only the head of household can perform this action',
    });
  }

  return opts.next({
    ctx: {
      session: {
        ...opts.ctx.session,
        headOfHousehold: true
      }
    }
  })
});

