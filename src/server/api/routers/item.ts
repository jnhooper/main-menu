import {eq} from 'drizzle-orm'

import {
  createTRPCRouter,
  isPrivateMenuProcedure,
  houseMemberProcedure
} from "~/server/api/trpc";
import { apiCreateItem, items } from "~/server/db/schema";

export const itemRouter = createTRPCRouter({
  getMenuItems: isPrivateMenuProcedure
  .query(async ({ ctx, input }) => {
    //todo create middleware like protected procedure that only lets
    //users from the household get info
    const menuItems = await ctx.db.query.items.findMany({
      where: eq(items.menuId, input.menuId)
    })

    //if(!ctx.menu.isPrivate){
    //  return menuItems.map(item => {
    //    const {updatedById, createdById, ...rest} = item
    //    return rest
    //  })
    //}
    return menuItems
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

  })
})

