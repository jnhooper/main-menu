import {eq, and} from 'drizzle-orm'
import {z} from 'zod'

import {
  createTRPCRouter,
  isPrivateMenuProcedure,
  houseMemberProcedure,
  canEditMenu
} from "~/server/api/trpc";
import {
  apiCreateItem,
  apiCreateMovieItem,
  items,
} from "~/server/db/schema";

export const itemRouter = createTRPCRouter({
  getVisibleMenuItems: isPrivateMenuProcedure
  .query(async ({ ctx, input }) => {

    //const menuItems = await ctx.db.query.items.findMany({
    //  where: eq(items.menuId, input.menuId)
    //})
    const menuItems = await ctx.db.select().from(items).where(
    and(
     eq(items.menuId, input.menuId) ,
     eq(items.isVisible, true) 
    ));

    return menuItems
  }),

  getMenuItems: canEditMenu
  .query(async ({ ctx, input }) => {
    //todo create middleware like protected procedure that only lets
    //users from the household get info
    const menuItems = await ctx.db.query.items.findMany({
      where: eq(items.menuId, input.menuId)
    })
    return {
      ...ctx.menu,
      items:menuItems,
    }
  }),


  create: isPrivateMenuProcedure.
  input(apiCreateItem)
  .mutation(async ( {ctx, input} ) => {

    //TODO CHECK THAT MENU BELONGS TO HOUSEHOLD
    const itemArr = await ctx.db.insert(items).values({
      name: input.name,
      description:input.description,
      menuId: input.menuId,
      link: input.link,
      isVisible: input.isVisible,
      imageUrl: input.imageUrl,
      createdById: ctx.session.user.id
    }).returning()
   return itemArr.pop() 

  }),
  
  createMovie: isPrivateMenuProcedure.
  input(apiCreateMovieItem)
  .mutation(async ( {ctx, input} ) => {

    //TODO CHECK THAT MENU BELONGS TO HOUSEHOLD
    const itemArr = await ctx.db.insert(items).values({
      name: input.name,
      description:input.description,
      menuId: input.menuId,
      link: input.link,
      isVisible: input.isVisible,
      imageUrl: input.imageUrl,
      createdById: ctx.session.user.id,
      metadata: input.metadata
    }).returning()
   return itemArr.pop() 

  })
})

