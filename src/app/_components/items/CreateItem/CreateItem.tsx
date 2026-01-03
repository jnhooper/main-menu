"use client";
import { useEffect, useState } from "react";
import { type SelectItem, type SelectMenu } from "~/server/db/schema";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { api } from "~/trpc/react";
import { TimeDuration } from "../TimeDuration";

interface CreateitemProps {
  menuId: SelectMenu["id"];
  itemId?: SelectItem["id"];
  onSubmit?: (data?: SelectItem | SelectMenu) => void;
  defaultPosition: number;
}
export function CreateItem(props: CreateitemProps) {
  const { menuId, onSubmit, defaultPosition } = props;
  const itemId = props.itemId!;

  const item = api.item.getEditItem.useQuery(
    { itemId, menuId },
    { enabled: !!itemId },
  );

  useEffect(() => {
    if (item.data && !item.isLoading) {
      const metadata = item.data.metadata as Record<string, string | number>;
      const trailer = metadata?.tailerHref as string;
      setName(item.data.name);
      setDescription(item.data?.description ?? "");
      setImgUrl(item.data.imageUrl);
      setTrailerHref(trailer ?? undefined);
      setRunTime(metadata?.runTime as number);
    }
  }, [item.isLoading, item.data]);

  const utils = api.useUtils();
  const [name, setName] = useState<string | undefined>("");
  const [description, setDescription] = useState<string | undefined>();
  const [imageUrl, setImgUrl] = useState<string | undefined>("");
  const [trailerHref, setTrailerHref] = useState<string | undefined>();
  const [isVisible, setisVisible] = useState<boolean>(true);
  const [runTime, setRunTime] = useState<number | undefined>();
  const updateMovie = api.item.updateItem.useMutation({
    onSuccess: async (data) => {
      await utils.item.getVisibleMenuItems.invalidate({ menuId });
      await utils.item.getMenuItems.invalidate({ menuId });
      //onSubmit(data);
      setName("");
      setDescription(undefined);
      setTrailerHref(undefined);
      setImgUrl("");
      setRunTime(undefined);
    },
  });
  const createMovie = api.item.createMovie.useMutation({
    onSuccess: async (data) => {
      await utils.item.getVisibleMenuItems.invalidate({ menuId });
      await utils.item.getMenuItems.invalidate({ menuId });
      //onSubmit(data);
      setName("");
      setDescription(undefined);
      setTrailerHref(undefined);
      setImgUrl("");
      setRunTime(undefined);
    },
  });

  return (
    <div className="w-full max-w-xs m-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (itemId) {
            updateMovie.mutate({
              itemId,
              menuId,
              name,
              description,
              imageUrl: imageUrl,
              isVisible,
              metadata: {
                runTime: runTime ?? undefined,
                trailerHref: trailerHref ?? undefined,
              },
            });
          } else {
            createMovie.mutate({
              name,
              description,
              imageUrl: imageUrl,
              position: defaultPosition,
              isVisible,
              menuId,
              metadata: {
                runTime: runTime ?? undefined,
                trailerHref: trailerHref ?? undefined,
              },
            });
          }
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
            setisVisible(!isVisible);
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
          onChange={(e) => {
            setRunTime(e.total);
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
