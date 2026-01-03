import { CreateMenu } from "~/app/_components/menus/CreateMenu/CreateMenu";
import { api, HydrateClient } from "~/trpc/server";
import { MenuList } from "~/app/_components/menus/MenuList";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const household = await api.household.getHousehold({ id });
  const menus = await api.menu.getHouseholdMenus({ householdId: id });
  return (
    <HydrateClient>
      <div>
        My household: {household?.name}
        <CreateMenu
          householdId={id}
          defaultPosition={menus.length + 1}
        />
        <MenuList
          householdId={id}
          initialMenus={menus}
          defaultMenuId={household?.defaultMenuId}
        />
      </div>
    </HydrateClient>
  );
}
