import { api, HydrateClient } from "~/trpc/server";
import { CreateMenu } from "~/app/_components/menus/CreateMenu/CreateMenu";
import { MenuList } from "~/app/_components/menus/MenuList";
import { redirect } from "next/navigation";
import { TopNavigation } from "../_components/TopNavigation/TopNavigation.tsx";

export default async function Page() {
  const { menus, householdId } = await api.menu.getDefaultMenus();
  //TODO: redirect to the default menu
  // TODO invalidate this query on success
  redirect(`menu/${household}`);
  return (
    <HydrateClient>
      {menus.length === 0
        ? (
          <div>
            <CreateMenu householdId={householdId} />
            // <MenuList householdId={householdId} initialMenus={menus} />
          </div>
        )
        : <h1>hey</h1>}
    </HydrateClient>
  );
}
