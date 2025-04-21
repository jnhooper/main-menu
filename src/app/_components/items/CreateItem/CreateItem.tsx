"use client";
import { useState } from "react";
import {type SelectMenu} from '~/server/db/schema'
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { api } from "~/trpc/react";
import {TimeDuration} from '../TimeDuration'



interface CreateitemProps {
  menuId: SelectMenu['id']
};
export function CreateItem(props: CreateitemProps) {
  const {menuId} = props

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImgUrl] = useState("");
  const [trailerHref, setTrailerHref] = useState("");
  const [runTime, setRunTime] = useState(0);
  const createMovie = api.item.createMovie.useMutation({
    onSuccess: async () => {
      await utils.item.getMenuItems.invalidate({menuId})
      setName("");
      setDescription("")
      setImgUrl("")
      setRunTime(0)
    },
  });

  return (
    <div className="w-full max-w-xs">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createMovie.mutate({
            name,
            description,
            imageUrl,
            menuId,
            metadata: {
              runTime,
              trailerHref
            }
          });
        }}
        className="flex flex-col gap-2"
      >
        <Label htmlFor="itemName">
          Movie Name
        </Label>
        <Input
          type="text"
          id="itemName"
          placeholder="Movie Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <Label htmlFor="movieDescription">
          Movie Descirption
        </Label>
        <Input
          type="textarea"
          id="movieDescription"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <Label htmlFor="movieImgUrl">
          Image Url
        </Label>
        <Input
          type="text"
          id="movieImgUrl"
          placeholder="image url"
          value={imageUrl}
          onChange={(e) => setImgUrl(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <Label htmlFor="movieTrailer">
          Trailer Url
        </Label>
        <Input
          type="text"
          id="movieTrailer"
          placeholder="Trailer Link"
          value={trailerHref}
          onChange={(e) => setTrailerHref(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <TimeDuration
          onChange={(e)=> {
            setRunTime(e.total)
          }}
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createMovie.isPending}
        >
          {createMovie.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
