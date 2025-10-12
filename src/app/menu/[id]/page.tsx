import ItemList from "~/app/_components/items/ItemList";
import {  HydrateClient, api } from "~/trpc/server";

export default async function Page({
  params,
}: {
    params: Promise<{ id: string }>
  }) {
  const { id } = await params
  const menu = await api.menu.getMenu({menuId: id});
  
  const items = await api.item.getVisibleMenuItems({
    menuId: id,
  })


  return (
    <HydrateClient>
      <h2 className="text-xl p-4">
        {menu?.name}
      </h2>
      <ItemList
        initialItems={items}
        menuId={id}
      />
    </HydrateClient>
  );
}
