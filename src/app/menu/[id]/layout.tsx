import { api, HydrateClient } from "~/trpc/server";
import { getCachedMenu } from "../../../lib/cachedData.ts";
import { auth } from "~/server/auth";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";
import { TopNavigation } from "../../_components/TopNavigation/TopNavigation.tsx";
import { GlobalSidebar } from "../../_components/GlobalSidebar/GlobalSidebar.tsx";

export default async function MyMenuLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { id: string };
}>) {
  const session = await auth();
  const menu = await getCachedMenu(params.id);
  const households = await api.household.getMyHouseholds();

  return (
    <HydrateClient>
      {session?.user
        ? (
          <SidebarProvider
            defaultOpen={false}
          >
            <GlobalSidebar
              initialHouseholds={households}
              currentHousehold={menu.householdId}
            />
            <div className="w-full mt-4 ml-2 mr-2">
              <div className="flex flex-row place-items-center">
                <SidebarTrigger />
                <TopNavigation
                  householdId={menu.householdId}
                  currentMenuId={params.id}
                />
              </div>
              <main>
                {children}
              </main>
            </div>
          </SidebarProvider>
        )
        : <TopNavigation householdId={menu.householdId} />}
    </HydrateClient>
  );
}
