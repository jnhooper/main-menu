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
  currentMenuId: string;
}
export const TopNavigation = async (props: TopNavigationProps) => {
  const { householdId, currentMenuId } = props;
  const myMenus = await api.menu.getHouseholdMenus({
    householdId: householdId,
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
                  <Link
                    className={currentMenuId === link.id
                      ? "underline underline-offset-2 font-bold"
                      : ""}
                    href={`/menu/${link.id}`}
                  >
                    {link.name}
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>
      )
      : null
  );
};
