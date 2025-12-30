
import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {eq} from 'drizzle-orm'

import {
  createTRPCRouter,
  houseMemberProcedure,
  protectedProcedure,
  headOfHousehold,
} from "~/server/api/trpc";
import { households, usersToHouseholds, users } from "~/server/db/schema";


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
      return myHouseholds.map(hh => {
         return { 
          ...hh,
          isDefaultHoushold: hh.householdId === ctx.session.user.defaultHouseholdId
        }
      })
    } else{
      return []
    }
  }),


  markAsDefault: houseMemberProcedure
  .mutation(async({ctx, input})=> {
    return await ctx.db.update(users).set({
      defaultHouseholdId: input.householdId,
    }).where(eq(
      users.id,
      ctx.session.user.id
    )).returning()
  }),

  setDefaultMenu: houseMemberProcedure
  // TODO:how do i get the menu id type here from schema
  .input(z.object({ menuId: z.string() }))
  .mutation(async ({ctx, input})=>{
    return await ctx.db.update(households).set({
      defaultMenuId: input.menuId,
    }).where(eq(
      households.id,
      input.householdId
    )).returning()
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
      
      //check if they are in other households if not
      //it's the default one
      const myHouseholds = await ctx.db.query.usersToHouseholds
        .findMany({
          where: eq(usersToHouseholds.userId, ctx.session.user.id)
        })

      if (myHouseholds.length === 1){
        await ctx.db.update(users).set({
          defaultHouseholdId: household.id,
        }).where(eq(
          users.id,
          ctx.session.user.id
        )).returning()
      }


      return household
    }
    //how to hande error?
    else return []

  }),

  delete: headOfHousehold
  .mutation(async ({ctx, input})=> {
    const household = await ctx.db.delete(households).where(
      eq(households.id, input.householdId)
    ).returning()
    return household
  })

});
