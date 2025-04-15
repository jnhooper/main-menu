"use client";

import { api } from "~/trpc/react";
import { type api as serverApi } from "~/trpc/server";
import type {SelectMenu} from '~/server/db/schema'
import {MediaCard} from '~/app/_components/MediaCard'

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


  const superlong = 'lskjfsdl fjsdlkfj lksjdf sl sldkfj lskjd fsldfkj sdlfkj sdlfsdkj flsdkjfsdlkfj '
  return (
    <div className="w-full max-w-xs">
      <h2 className='text-3xl'>
        Sosi
      </h2>
      <h2 className='text-3xl'>
        Adrian
      </h2>
        <ul>
          {
            myItems.map((item, index)=>(
              <li key={item.id}>
              <MediaCard
                title={index === 0 ?  superlong: item.name}
                imgUrl={item.imageUrl}
                description={item.description}
              />
              </li>
            ))
          }
        </ul>
    </div>
  );
}
