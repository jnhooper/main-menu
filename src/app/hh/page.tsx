import { auth } from "~/server/auth";
import {  HydrateClient, api } from "~/trpc/server";
import { CreateHousehold } from "../_components/households/CreateHousehold";
import { MyHouseholdList } from "./MyHouseholdList";
export default async function HouseholdPage(){

  const session = await auth();
  const myHouseholds = session?.user ? 
    await api.household.getMyHouseholds(): []


  return (
    <HydrateClient>
      <div className="w-full max-w-xs">
        <h1>Households</h1>
        <MyHouseholdList initialHouseholds={myHouseholds}/>
        <CreateHousehold />
      </div>
    </HydrateClient>
  )
}
