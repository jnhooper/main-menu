import { auth } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";
import { CreateHousehold } from "../_components/households/CreateHousehold";
import { MyHouseholdList } from "./MyHouseholdList";
export default async function HouseholdPage() {
  const session = await auth();
  const myHouseholds = session?.user
    ? await api.household.getMyHouseholds()
    : [];

  return (
    <HydrateClient>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <h1 className="text-xl">
          Households
        </h1>
        <MyHouseholdList initialHouseholds={myHouseholds} />
        <CreateHousehold />
      </div>
    </HydrateClient>
  );
}
