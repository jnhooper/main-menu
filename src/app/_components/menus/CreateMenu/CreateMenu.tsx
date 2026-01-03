"use client";
import { useState } from "react";

import { api } from "~/trpc/react";
import type { SelectHousehold } from "~/server/db/schema";

interface CreateMenuProps {
  householdId: SelectHousehold["id"];
  defaultPosition: number;
}

export function CreateMenu(props: CreateMenuProps) {
  const { householdId, defaultPosition } = props;
  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createMenu = api.menu.create.useMutation({
    onSuccess: async () => {
      await utils.menu.getHouseholdMenus.invalidate({ householdId });
      setName("");
    },
  });

  return (
    <div className="w-full max-w-xs">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createMenu.mutate({
            name,
            householdId,
            position: defaultPosition,
          });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="New Menu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createMenu.isPending}
        >
          {createMenu.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
