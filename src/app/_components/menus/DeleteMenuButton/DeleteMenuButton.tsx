'use client'

import { Button } from '~/components/ui/button'
import { api } from "~/trpc/react";
import { type api as serverApi } from "~/trpc/server";
import type {SelectHousehold} from '~/server/db/schema'

interface DeleteMenuButtonProps {
  id: Awaited<ReturnType<
    (typeof serverApi)['menu']['delete']
  >>['id']
  householdId: SelectHousehold['id']
}

export const DeleteMenuButton = (props: DeleteMenuButtonProps) => {
  const utils = api.useUtils();
  const { id, householdId } = props
  const deleteMenu = api.menu.delete.useMutation({
    onSuccess: async () => {
      await utils.menu.getHouseholdMenus.invalidate({householdId})
    },
  });
  return (
    <Button
      variant='destructive'
      onClick={() => deleteMenu.mutate({ id, householdId })}
    >
      remove
    </Button>
  )

}
