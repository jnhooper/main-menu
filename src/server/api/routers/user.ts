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
    if(ctx.session.user?.defaultMenuId){
      const menu = await ctx.db.query.menus.findFirst({
        where: eq(menus.id, ctx.session.user.defaultMenuId)
      })
      return menu
    } else{
      return null
    }
  })
})
