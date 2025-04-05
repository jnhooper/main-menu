import CreateItem from "~/app/_components/items/CreateItem";
import {  HydrateClient, api } from "~/trpc/server";

export default async function Page({
  params,
}: {
    params: Promise<{ id: string }>
  }) {
  const { id } = await params
  const menu = await api.menu.getMenu({menuId: id});
  
  const items = await api.item.getMenuItems({menuId: id})


  return (
    <HydrateClient>
      <div>
        My menu: {menu?.name}
        {menu?.householdId ? 
        <CreateItem menuId={menu.id} /> :
          null
        }
      </div>
    </HydrateClient>
  );
}
