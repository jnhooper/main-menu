import { TRPCError } from "@trpc/server";
import { z } from "zod";

import {eq} from 'drizzle-orm'

import {
  createTRPCRouter,
  houseMemberProcedure,
  protectedProcedure,
isPrivateMenuProcedure,
} from "~/server/api/trpc";
import {  menus, households, menuTypeEnumValues } from "~/server/db/schema";
import { insertAndReorder, removeAndReorder, updateAndReorder } from "./reorder";

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
    position: z.number().int().min(1),
    type: z.enum(menuTypeEnumValues)
  }))
  .mutation(async ({ ctx, input }) => {
    const {  position, householdId, ...itemData } = input;
    const userId = ctx.session.user.id;

    const menuArr = await insertAndReorder(
      ctx.db,
      menus,          // The table to insert into
      menus.householdId,   // The parent ID column
      householdId,         // The specific parent ID
      position,    // The desired position
      {               // The data for the new item
        ...itemData,
        createdById: userId,
        householdId, // Ensure parent ID is in the data object
      }
    );

    const menu = menuArr.pop() as typeof menus.$inferSelect
    if(menu){
      const household = await ctx.db.query.households.findFirst({
        where: eq(households.id, input.householdId)
      })                 
      if(household && !household?.defaultMenuId === null){
        await ctx.db.update(households)
        .set({ defaultMenuId: menu.id })
        .where(
          eq(households.id, menu.householdId)
        )
      }
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
