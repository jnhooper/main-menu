import ItemList from "~/app/_components/items/ItemList";
import { getCachedMenu } from "../../../lib/cachedData.ts";
import { api } from "~/trpc/server";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const menu = await getCachedMenu(id);

  const items = await api.item.getVisibleMenuItems({
    menuId: id,
  });

  return (
    <div>
      <h2 className="text-4xl p-4 pl-10 font-extrabold">
        {menu?.name}
      </h2>
      <ItemList
        initialItems={items}
        menuId={id}
        menuType={menu.type}
      />
    </div>
  );
}
