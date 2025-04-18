import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {eq} from 'drizzle-orm'

import {
  createTRPCRouter,
  houseMemberProcedure,
  protectedProcedure,
isPrivateMenuProcedure,
} from "~/server/api/trpc";
import {  menus, households } from "~/server/db/schema";

export const menusRouter = createTRPCRouter({

  getHouseholdMenus: houseMemberProcedure
  .query(async ({ ctx, input }) => {
    //todo create middleware like protected procedure that only lets
    //users from the household get info
    const householdMenus = await ctx.db.query.menus.findMany({
      where: eq(menus.householdId, input.householdId)
    })
    return householdMenus
  }),

  getMenu: isPrivateMenuProcedure
  .query(async({ctx}) => {
    //const {
    //  householdId,
    //  createdById,
    //  lastUpdatedById,
    //  ...rest
    //} = ctx.menu
    // if it's private then based on the procedure we are logged in and able
    // to view the menu, so we can return everything.
    // for seom reason we need the spread to get types flowing
    return ctx.menu
  }),


  getDefaultMenus: protectedProcedure
  .query(async({ctx}) => {
    if(!ctx.session.user.defaultHouseholdId){
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'No default household selected',
      })
    }
    const defaultMenus = await ctx.db.query.menus.findMany({
      where: eq(menus.householdId, ctx.session.user.defaultHouseholdId)
    })
    //if(defaultMenus.length ===0){
    //  throw new TRPCError({
    //    code: 'NOT_FOUND',
    //    message: 'No menus found',
    //  })
    //}
    return {
      menus: defaultMenus,
      householdId: ctx.session.user.defaultHouseholdId,
    }
  }),


  create: houseMemberProcedure
  .input(z.object({
    name: z.string().min(1),
  }))
  .mutation(async ({ ctx, input }) => {
    const menuArr = await ctx.db.insert(menus).values({
      name: input.name,
      householdId: input.householdId,
      createdById: ctx.session.user.id,
      lastUpdatedById: ctx.session.user.id
    }).returning();
    const menu = menuArr.pop()
    if(menu){
      return menu
    }
    else return []

  }),


  delete: houseMemberProcedure.input(z.object({id: z.string()}))
  .mutation(async ({ctx, input})=> {
    if(ctx.session.user){
      const menu = await ctx.db.query.menus.findFirst({
        where:eq(households.id, input.id) 
      })
      if(menu){
        const household = await ctx.db.query.households.findFirst({
          where:eq(households.id, menu?.householdId) 
        })

        if(household?.headOfHouseholdId !== ctx.session.user.id){
          throw new TRPCError({ code: "UNAUTHORIZED" });
        }
        else {
          await ctx.db.delete(menus).where(
            eq(menus.id, input.id)
          )
        }
      } else {
        throw new TRPCError({ code: "NOT_FOUND" });
      }
      // we'll want to have roles instead
      return menu
    }
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  )

});
