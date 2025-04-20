"use client";

import { api } from "~/trpc/react";
import { type api as serverApi } from "~/trpc/server";
import type {SelectMenu} from '~/server/db/schema'
import {MediaCard} from '~/app/_components/MediaCard'
import styles from './styles.module.css'

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
    <div className={styles.wrapper}>
        <ul className={styles.ul}>
          {
            myItems.map((item)=>(
              <li
                key={item.id}
              className="mx-auto"
              >
              <MediaCard
                title={item.name}
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
