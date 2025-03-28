"use client";

import { api } from "~/trpc/react";
import Link from 'next/link'
import { type api as serverApi } from "~/trpc/server";
import type {SelectHousehold} from '~/server/db/schema'
import DeleteMenuButton from "../DeleteMenuButton";

interface MenuListProps {
  initialMenus?: Awaited<ReturnType<
    (typeof serverApi)['menu']['getHouseholdMenus']
  >>
  householdId: SelectHousehold['id']
}

export function MenuList(props: MenuListProps) {
  const {householdId} = props
  const [myMenus] = api.menu.getHouseholdMenus.useSuspenseQuery(
    {householdId},
    {
      initialData: props.initialMenus
    }
  );


  return (
    <div className="w-full max-w-xs">
        <ul>
          {
            myMenus.map(menu=>(
              <li key={menu.id}>
              <Link href={`/hh/${menu.id}`}>
                {menu.name}
                </Link>
              <DeleteMenuButton
                id={menu.id}
                householdId={householdId}
              />
              </li>
            ))
          }
        </ul>
    </div>
  );
}
