import {  HydrateClient, api } from "~/trpc/server";
import { CreateMenu } from "~/app/_components/menus/CreateMenu/CreateMenu";
import { MenuList } from '~/app/_components/menus/MenuList'

export default async function Page() {
  const { menus, householdId } = await api.menu.getDefaultMenus()
  // TODO invalidate this query on success
  return (
    <HydrateClient>
      {menus.length === 0 ? (
        <div>
          <CreateMenu householdId={householdId}/>
          <MenuList householdId={householdId} initialMenus={menus} />
        </div>
      ) :
        <nav>
          <ul>
            {
              menus.map(menu => (
                <li
                  key={`menu_${menu.id}`}
                >
                  {menu.name}
                </li>
              ))
            }
          </ul>
        </nav>
      }
    </HydrateClient>
  );
}
