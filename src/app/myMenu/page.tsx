import { HydrateClient } from "~/trpc/server";
import { auth } from "~/server/auth";
import { CreateMenu } from "~/app/_components/menus/CreateMenu/CreateMenu";
import { MenuList } from "~/app/_components/menus/MenuList";
import { redirect } from "next/navigation";

export default async function Page() {
  // const { menus, householdId } = await api.menu.getDefaultMenus();
  // const menu = await api.user.getDefaultMenu();
  const session = await auth();
  //TODO: redirect to the default menu
  // TODO invalidate this query on success
  if (session) {
    redirect(`menu/${session.user.defaultMenuId}`);
  }
  return (
    <HydrateClient>
      {menus.length === 0
        ? (
          <div>
            <CreateMenu householdId={householdId} />
            <MenuList householdId={householdId} initialMenus={menus} />
          </div>
        )
        : <h1>hey</h1>}
    </HydrateClient>
  );
}
