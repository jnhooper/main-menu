"use client";
import { api } from "~/trpc/react";
import { type api as serverApi } from "~/trpc/server";
import type { SelectMenu } from "~/server/db/schema";
import { MediaCard } from "~/app/_components/MediaCard";
import { FoodCard } from "~/app/_components/FoodCard";
import styles from "./styles.module.css";

interface MenuListProps {
  initialItems: Awaited<
    ReturnType<
      (typeof serverApi)["item"]["getVisibleMenuItems"]
    >
  >;
  menuId: SelectMenu["id"];
  menuType: SelectMenu["type"];
}

export function ItemList(props: MenuListProps) {
  const { menuId, menuType } = props;
  const [myItems] = api.item.getVisibleMenuItems.useSuspenseQuery(
    { menuId },
    {
      initialData: props.initialItems,
    },
  );

  return (
    <div className={styles.wrapper}>
      <ul className={styles.ul}>
        {myItems.map((item) => (
          <li
            key={item.id}
            className="mx-auto"
          >
            {menuType === "food"
              ? (
                <FoodCard
                  name={item.name}
                  imageUrl={item.imageUrl}
                  description={item.description}
                  metadata={item.metadata ?? undefined}
                />
              )
              : (
                <MediaCard
                  name={item.name}
                  imageUrl={item.imageUrl}
                  description={item.description}
                  metadata={item.metadata ?? undefined}
                />
              )}
          </li>
        ))}
      </ul>
    </div>
  );
}
