"use client";

import { api } from "~/trpc/react";
import Link from 'next/link'
import { type api as serverApi } from "~/trpc/server";
import { DeleteHouseholdButton } from "../_components/households/DeleteHouseholdButton";

interface MyHouseholdListProps {
  initialHouseholds?: Awaited<ReturnType<
    (typeof serverApi)['households']['getMyHouseholds']
  >>
}

export function MyHouseholdList(props: MyHouseholdListProps) {
  //const { initialHouseholds } = props
  const utils = api.useUtils();
  const [myHouseholds] = api.households.getMyHouseholds.useSuspenseQuery(
    undefined,
    {
      initialData: props.initialHouseholds
    }
  );

  const setAsDefault = api.households.markAsDefault.useMutation({
    onSuccess: async () => {
      await utils.households.getMyHouseholds.invalidate()
    },
  });


  return (
    <div className="w-full max-w-xs">
        <ul>
          {
            myHouseholds.map(hh=>(
              <li key={hh.householdId}>
              <Link href={`/hh/${hh.householdId}`}>
                {hh.household.name}
              </Link>
              <label>
                change default household
                <input
                  type='checkbox' 
                  checked={hh.isDefaultHoushold}
                  disabled={setAsDefault.isPending}
                  onChange={async () => {
                    setAsDefault.mutate({householdId: hh.householdId})
                  }}/>
              </label>
              <DeleteHouseholdButton id={hh.householdId}/>
              </li>
            ))
          }
        </ul>
    </div>
  );
}
