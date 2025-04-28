"use client"

import { api } from "~/trpc/react";
import { type api as serverApi } from "~/trpc/server";
import {EditMediaCard} from '~/app/_components/EditMediaCard'
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
              >
              <EditMediaCard
                title={item.name}
                imgUrl={item.imageUrl}
                itemId={item.id}
                menuId={menuId}
              />
              </li>
            ))
          }
        </ul>
    </div>
  );
}
