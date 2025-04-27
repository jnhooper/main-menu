"use client"

import { api } from "~/trpc/react";
import { type api as serverApi } from "~/trpc/server";
import {MediaCard} from '~/app/_components/MediaCard'
import styles from './styles.module.css'


interface EditMenuItemsListProps {
  initialData:  Awaited<ReturnType<
    (typeof serverApi)['item']['getMenuItems']
  >>
}

export function EditMenuItemsList(props: EditMenuItemsListProps) {
  const { initialData} = props
  const menuId = initialData.id
  const [menu] = api.item.getMenuItems.useSuspenseQuery(
    {menuId},
    {initialData}
  );

  return (
    <div className={styles.wrapper}>
        <ul className={styles.ul}>
          {
            menu.items.map((item)=>(
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
