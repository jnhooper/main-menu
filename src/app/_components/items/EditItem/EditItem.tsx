"use client";

import {type SelectMenu, type SelectItem} from '~/server/db/schema'
import { api } from "~/trpc/react";
import {MovieForm} from '../MovieForm'



interface EditItemProps {
  menuId: SelectMenu['id']
  onSubmit?: (data?: SelectItem) => void
  initialItem: SelectItem
  onSuccess?: (name: string) => void
};

export function EditItem(props: EditItemProps) {
  const {
    menuId,
    initialItem,
    onSuccess
  } = props

  const item =  api.item.getEditItem.useSuspenseQuery(
    { itemId: initialItem.id, menuId },
    {initialData: initialItem}
  )

  const utils = api.useUtils();
  const updateMovie = api.item.updateItem.useMutation({
    onSuccess: async (data) => {
      await utils.item.getVisibleMenuItems.invalidate({menuId})
      await utils.item.getEditItem.invalidate({menuId, itemId: initialItem.id})
      await utils.item.getMenuItems.invalidate({menuId})
      if(onSuccess){
        onSuccess(data[0]?.name ?? '')
      }
    },
  });

  return (
    <MovieForm
      onSubmit={(data) => updateMovie.mutate({
        itemId: item[0].id,
        ...data,
      })}
      menuId={menuId}
      initialData={item[0]}
      mutationIsPending={updateMovie.isPending}
    />
  );
}
