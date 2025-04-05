"use client";
import { useState } from "react";

import { api } from "~/trpc/react";

export function CreateHousehold() {

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createHousehold = api.household.create.useMutation({
    onSuccess: async () => {
      //await utils.post.invalidate();
      await utils.household.getMyHouseholds.invalidate()
      setName("");
    },
  });

  return (
    <div className="w-full max-w-xs">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createHousehold.mutate({ name });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="New Household"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createHousehold.isPending}
        >
          {createHousehold.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
