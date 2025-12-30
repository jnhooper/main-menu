import { api } from "~/trpc/server";
import { TopNavigation } from "../_components/TopNavigation/TopNavigation.tsx";

export default async function MyMenuLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { householdId } = await api.menu.getDefaultMenus();
  return (
    <div>
      <TopNavigation householdId={householdId} />
      {children}
    </div>
  );
}
