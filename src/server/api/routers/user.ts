import { TRPCError } from "@trpc/server";

import {eq} from 'drizzle-orm'

import {
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import {  menus, households, users, usersToHouseholds } from "~/server/db/schema";

export const usersRouter = createTRPCRouter({
  getDefaultMenu: protectedProcedure
  .query(async ({ ctx }) => {
    if(ctx.session.user){
      const defaultId = ctx.session.user.defaultHouseholdId
      if (defaultId){
        const hh = await ctx.db.query.households.findFirst({
          where: eq(households.id, defaultId)
        })     
        if( hh?.defaultMenuId){
          const menu = await ctx.db.query.menus.findFirst({
            where: eq(menus.id, hh.defaultMenuId)
          })
          return menu
        }
        return null
      } else{
        return null
      }
    }
  }) 
})
