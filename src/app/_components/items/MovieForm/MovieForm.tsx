'use client';
import {useState} from 'react'

import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Label } from "~/components/ui/label"
import {Switch} from "~/components/ui/switch"
import {TimeDuration} from '../TimeDuration'
import {type SelectItem, type ApiCreateMovieItem} from '~/server/db/schema'

interface MovieFormProps {
  onSubmit: (data: ApiCreateMovieItem)=> void
  initialData?: SelectItem
  menuId: string
  mutationIsPending?: boolean
}
export const MovieForm = (props:MovieFormProps) => {
  const {
    onSubmit,
    initialData,
    menuId,
    mutationIsPending,
  } = props

  const [name, setName] = useState<ApiCreateMovieItem['name']>(
    initialData?.name ?? ''
  );

  const [
    description,
    setDescription,
  ] = useState<string | undefined>(initialData?.description ?? "");

  const [imageUrl, setImgUrl] = useState<
    ApiCreateMovieItem['imageUrl']
  >(initialData?.imageUrl ?? '');

  const [trailerHref, setTrailerHref] = useState<
    string | undefined
  >(initialData?.metadata?.trailerHref as string ?? '');

  const [
    isVisible,
    setisVisible,
  ] = useState<SelectItem['isVisible']>(initialData ? initialData.isVisible : true);

  const [runTime, setRunTime] = useState<number | undefined>(
    initialData?.metadata?.runTime as number
  );

  return (
    <div className="w-full max-w-xs m-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit({
            menuId,
            name,
            isVisible,
            imageUrl,
            description,
            metadata: {
              runTime,
              trailerHref
            }
          })
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
          initialValue={runTime} 
          onChange={(e)=> {
            console.log(e)
            setRunTime(e.total)
          }}
        />
        < Button
          type="submit"
          variant='default'
          disabled={mutationIsPending}
        >
          {mutationIsPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  )
}
