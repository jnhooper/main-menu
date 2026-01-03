import {eq, and, sql, asc} from 'drizzle-orm'
import {TRPCError } from "@trpc/server";
import {z} from 'zod'

import {
  createTRPCRouter,
  isPrivateMenuProcedure,
  canEditMenu
} from "~/server/api/trpc";
import {
  apiCreateItem,
  apiUpdateItem,
  apiCreateMovieItem,
  items,
} from "~/server/db/schema";
import { insertAndReorder, removeAndReorder, updateAndReorder } from "./reorder";

export const itemRouter = createTRPCRouter({
  getEditItem: canEditMenu
  .input(z.object({
    itemId: z.string(),
  }))
  .query(async ({ctx, input})=>{
    const item = await ctx.db.query.items.findFirst({
      where: eq(items.id, input.itemId),
    })
    if(item){
      return item
    } else{
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: 'item not found',
      });
    }
  }),

  updateItem: canEditMenu
  .input(apiUpdateItem)
  .input(z.object({itemId: z.string()}))
  .mutation(async({ctx, input}) => {
 const { itemId:id, ...data } = input;

      if (Object.keys(data).length === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No data provided to update.",
        });
      }

      // One call to our powerful, atomic utility function.
      const updatedList = await updateAndReorder(
        ctx.db,
        items,
        items.menuId,
        id,
        data
      ) as typeof items.$inferSelect[];

      return updatedList.pop();
  }),


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
      where: eq(items.menuId, input.menuId),
      orderBy: (items, { asc }) => [asc(items.createdAt)],
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
    const {  position, menuId, ...itemData } = input;
    const userId = ctx.session.user.id;
    const itemArr = await insertAndReorder(
      ctx.db,
      items,          // The table to insert into
      items.menuId,   // The parent ID column
      menuId,         // The specific parent ID
      position,    // The desired position
      {               // The data for the new item
        ...itemData,
        createdById: userId,
        menuId, // Ensure parent ID is in the data object
      }
    ) as typeof items.$inferSelect[];

   return itemArr.pop() 

  }),
  
  createMovie: isPrivateMenuProcedure.
  input(apiCreateMovieItem)
  .mutation(async ( {ctx, input} ) => {

    //TODO CHECK THAT MENU BELONGS TO HOUSEHOLD
    const {  position, menuId, ...itemData } = input;
    const userId = ctx.session.user.id;
    const itemArr = await insertAndReorder(
      ctx.db,
      items,          // The table to insert into
      items.menuId,   // The parent ID column
      menuId,         // The specific parent ID
      position,    // The desired position
      {               // The data for the new item
        ...itemData,
        createdById: userId,
        menuId, // Ensure parent ID is in the data object
      }
    ) as typeof items.$inferSelect[];


   return itemArr.pop() 

  })
})

