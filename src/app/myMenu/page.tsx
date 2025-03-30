import {  HydrateClient, api } from "~/trpc/server";

export default async function Page() {
  const menus = await api.menu.getDefaultMenus()
  return (
    <HydrateClient>
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
    </HydrateClient>
  );
}
