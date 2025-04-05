"use client";
import { useState } from "react";
import {type SelectMenu} from '~/server/db/schema'

import { api } from "~/trpc/react";



interface CreateitemProps {
  menuId: SelectMenu['id']
};
export function CreateItem(props: CreateitemProps) {
  const {menuId} = props

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImgUrl] = useState("");
  const createItem = api.item.create.useMutation({
    onSuccess: async () => {
      await utils.item.getMenuItems.invalidate({menuId})
      setName("");
      setDescription("")
      setImgUrl("")
    },
  });

  return (
    <div className="w-full max-w-xs">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createItem.mutate({
            name,
            description,
            imageUrl,
            menuId,
          });
        }}
        className="flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <input
          type="text"
          placeholder="Item Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <input
          type="text"
          placeholder="image url"
          value={imageUrl}
          onChange={(e) => setImgUrl(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createItem.isPending}
        >
          {createItem.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
