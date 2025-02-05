
import { z } from "zod";

import {eq} from 'drizzle-orm'

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { households, usersToHouseholds } from "~/server/db/schema";

export const householdsRouter = createTRPCRouter({
  getMyHouseholds: protectedProcedure
  .query(async ({ ctx }) => {
    if(ctx.session.user){
      const myHouseholds = await ctx.db.query.usersToHouseholds.findMany({
        with: {
          household: {
            columns: {
              name: true,
              id: true
            }
          }
        },
        where:eq(usersToHouseholds.userId, ctx.session?.user.id) 
      })
      return myHouseholds
    } else{
      return []
    }
  }),

  create: protectedProcedure
  .input(z.object({ name: z.string().min(1) }))
  .mutation(async ({ ctx, input }) => {
    const householdArr = await ctx.db.insert(households).values({
      name: input.name,
      headOfHouseholdId: ctx.session.user.id,
    }).returning();
    const household = householdArr.pop()
    if(household){
      await ctx.db.insert(usersToHouseholds).values({
        userId: ctx.session.user.id,
        householdId: household.id
      })
      return household
    }
    //how to hande error?
    else return []

  }),

  getLatest: protectedProcedure.query(async ({ ctx }) => {
    const post = await ctx.db.query.posts.findFirst({
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    return post ?? null;
  }),

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),
});
