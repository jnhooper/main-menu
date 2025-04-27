"use client";
import { useState } from "react";
import {type SelectMenu, type SelectItem} from '~/server/db/schema'
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import {Switch} from "~/components/ui/switch"
import { api } from "~/trpc/react";
import {TimeDuration} from '../TimeDuration'



interface CreateitemProps {
  menuId: SelectMenu['id']
  onSubmit: (data?: SelectItem) => void
};
export function CreateItem(props: CreateitemProps) {
  const {menuId, onSubmit} = props

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const [description, setDescription] = useState();
  const [imageUrl, setImgUrl] = useState("");
  const [trailerHref, setTrailerHref] = useState();
  const [isVisible, setisVisible] = useState(true);
  const [runTime, setRunTime] = useState();
  const createMovie = api.item.createMovie.useMutation({
    onSuccess: async (data) => {
      await utils.item.getVisibleMenuItems.invalidate({menuId})
      await utils.item.getMenuItems.invalidate({menuId})
      onSubmit(data);
      setName("");
      setDescription(undefined)
      setTrailerHref(undefined)
      setImgUrl("")
      setRunTime(undefined)
    },
  });

  return (
    <div className="w-full max-w-xs m-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createMovie.mutate({
            name,
            description,
            imageUrl: imageUrl,
            isVisible,
            menuId,
            metadata: {
              runTime: runTime ?? undefined,
              trailerHref: trailerHref ?? undefined
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
        <Label htmlFor="visibleSwitch">
          is item visible
        </Label>
        <Switch
          id="visibleSwitch"
          checked={isVisible}
          onCheckedChange={() => {
            setisVisible(!isVisible)
          }}
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
