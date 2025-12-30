import Link from "next/link";
import { api } from "~/trpc/server";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";

interface TopNavigationProps {
  householdId: string;
}
export const TopNavigation = async (props: TopNavigationProps) => {
  const myMenus = await api.menu.getHouseholdMenus({
    householdId: props.householdId,
  });

  return (
    myMenus.length > 1
      ? (
        <NavigationMenu>
          <NavigationMenuList>
            {myMenus.map((link, index: number) => (
              <NavigationMenuItem key={`link_${index}`}>
                <NavigationMenuLink
                  asChild
                  className={navigationMenuTriggerStyle()}
                >
                  <Link href={`menu/${link.id}`}>{link.name}</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      )
      : null
  );
};
