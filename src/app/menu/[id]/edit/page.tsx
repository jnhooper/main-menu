import {  HydrateClient, api } from "~/trpc/server";
import { AddMovie } from "./AddMovie";
import EditMenuItemsList from "~/app/_components/items/EditMenuItemsList";

export default async function Page({
  params,
}: {
    params: Promise<{ id: string }>
  }) {
  const { id } = await params
  const menu = await api.item.getMenuItems({
    menuId: id,
  })

  return (
    <HydrateClient>
      <div
        className='w-full flex flex-col gap-4 p-4 relative'
      >
        <h2 className='text-3xl place-content-center w-full inline-flex'>
        {menu.name}
        </h2>
        <AddMovie
          menuId={id}
          menuName={menu.name}
        />
        <EditMenuItemsList
          initialData={menu} 
        />
      </div>
    </HydrateClient>
  );
}
