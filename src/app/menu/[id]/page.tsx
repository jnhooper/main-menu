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
        My menu: {menu?.name}
        <ItemList initialItems={items}/>
    </HydrateClient>
  );
}
