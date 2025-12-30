"use client";

import { useState } from "react";
import { api } from "~/trpc/react";
import Link from "next/link";
import { type api as serverApi } from "~/trpc/server";
import type { SelectHousehold } from "~/server/db/schema";

import DeleteMenuButton from "../DeleteMenuButton";
import { SetDefaultMenuButton } from "../SetDefaultMenuButton";

interface MenuListProps {
  initialMenus?: Awaited<
    ReturnType<
      (typeof serverApi)["menu"]["getHouseholdMenus"]
    >
  >;
  householdId: SelectHousehold["id"];
  defaultMenuId: string | null | undefined;
}

export function MenuList(props: MenuListProps) {
  const { householdId, defaultMenuId } = props;
  const [myMenus] = api.menu.getHouseholdMenus.useSuspenseQuery(
    { householdId },
    {
      initialData: props.initialMenus,
    },
  );

  const [currentDefaultMenuId, setCurrentDefaultMenuId] = useState<string>(
    defaultMenuId ?? "",
  );

  return (
    <div className="w-full max-w-xs">
      <ul>
        {myMenus.map((menu) => (
          <li className="flex flex-row gap-4" key={menu.id}>
            <Link href={`/menu/${menu.id}`}>
              {menu.name}
            </Link>
            <SetDefaultMenuButton
              disabled={menu.id === currentDefaultMenuId}
              onSuccess={setCurrentDefaultMenuId}
              householdId={householdId}
              menuId={menu.id}
            />
            <DeleteMenuButton
              id={menu.id}
              householdId={householdId}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
