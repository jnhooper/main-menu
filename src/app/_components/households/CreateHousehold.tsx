"use client";
import { useState } from "react";

import { api } from "~/trpc/react";
import { type api as serverApi } from "~/trpc/server";

interface CreateHouseholdProps {
  initialHouseholds: Awaited<ReturnType<
    (typeof serverApi)['households']['getMyHouseholds']
  >>
}

export function CreateHousehold(props: CreateHouseholdProps) {
  const { initialHouseholds } = props
  const [myHouseholds] = api.households.getMyHouseholds.useSuspenseQuery(
    undefined,
    {
      initialData: initialHouseholds
    }
  );

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createHousehold = api.households.create.useMutation({
    onSuccess: async () => {
      //await utils.post.invalidate();
      await utils.households.getMyHouseholds.invalidate()
      setName("");
    },
  });

  return (
    <div className="w-full max-w-xs">
      {myHouseholds.length > 0 ? (
        <div>
          households:
          <ul>
            {myHouseholds.map(hh => (
              <li key={hh.household.id}>{hh.household.name}</li>
            ))}
          </ul>
        </div>
      ) : (
        <p>You have no households yet.</p>
      )}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createHousehold.mutate({ name });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Title"
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
