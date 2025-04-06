"use client";

import { api } from "~/trpc/react";
import { type api as serverApi } from "~/trpc/server";
import type {SelectMenu} from '~/server/db/schema'

interface MenuListProps {
  initialItems?: Awaited<ReturnType<
    (typeof serverApi)['item']['getMenuItems']
  >>
  menuId: SelectMenu['id']
}

export function ItemList(props: MenuListProps) {
  const { menuId} = props
  const [myItems] = api.item.getMenuItems.useSuspenseQuery(
    {menuId},
    {
      initialData: props.initialItems
    }
  );


  return (
    <div className="w-full max-w-xs">
        <ul>
          {
            myItems.map(item=>(
              <li key={item.id}>
                {item.name}
              </li>
            ))
          }
        </ul>
    </div>
  );
}
