"use client";
import { api, RouterOutputs } from "~/trpc/react";
import { SignInButton } from "~/app/_components/SignInButton";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/components/ui/sidebar";

interface GlobalSidebarProps {
  initialHouseholds: RouterOutputs["household"]["getMyHouseholds"];
  currentHousehold: string;
}
export function GlobalSidebar(props: GlobalSidebarProps) {
  const [myHouseholds] = api.household.getMyHouseholds.useSuspenseQuery(
    undefined,
    {
      initialData: props.initialHouseholds,
    },
  );
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Households</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {myHouseholds.map((hh) => (
                <SidebarMenuItem key={hh.household.name}>
                  <SidebarMenuButton asChild>
                    <a href={`/hh/${hh.household.id}`}>
                      <span>{hh.household.name}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroupLabel>User</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <SignInButton signedIn />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
