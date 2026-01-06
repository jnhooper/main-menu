import { api, HydrateClient } from "~/trpc/server";
import { AddItem } from "./AddItem";
import EditMenuItemsList from "~/app/_components/items/EditMenuItemsList";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const menu = await api.item.getMenuItems({
    menuId: id,
  });

  return (
    <HydrateClient>
      <div className="w-full flex flex-col gap-4 p-4 relative">
        <h2 className="text-3xl place-content-center w-full inline-flex">
          {menu.name}
        </h2>
        <AddItem
          menuId={id}
          menuName={menu.name}
          defaultPosition={menu.items.length + 1}
          itemType={menu.type}
        />
        <EditMenuItemsList
          initialData={menu}
        />
      </div>
    </HydrateClient>
  );
}
