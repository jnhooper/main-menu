
import { TRPCError } from "@trpc/server";
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

  getHousehold: protectedProcedure
  .input(z.object({id: z.string().min(1)}))
  .query(async ({ctx, input})=>{
   return await ctx.db.query.households.findFirst({
      where: eq(households.id, input.id)
    })
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

  delete: protectedProcedure.input(z.object({id: z.string()}))
  .mutation(async ({ctx, input})=> {
    if(ctx.session.user){
      const household = await ctx.db.query.households.findFirst({
        where:eq(households.id, input.id) 
      })
      if(household?.headOfHouseholdId !== ctx.session.user.id){
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
      else {
        //await ctx.db.delete(usersToHouseholds).where(eq(
        //  households.id,
        //  input.id
        //))
        await ctx.db.delete(households).where(
          eq(households.id, input.id)
        )
      }
      return household
    }

    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  )

});
