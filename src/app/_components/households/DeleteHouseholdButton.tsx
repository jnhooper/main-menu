import { Button } from '~/components/ui/button'
import { api } from "~/trpc/react";
import type {SelectHousehold} from '~/server/db/schema'

interface DeleteHouseholdButtonProps {
  id: SelectHousehold['id']
}

export const DeleteHouseholdButton = (props: DeleteHouseholdButtonProps) => {
  const utils = api.useUtils();
  const deleteHousehold = api.household.delete.useMutation({
    onSuccess: async () => {
      await utils.household.getMyHouseholds.invalidate()
    },
  });
  const { id } = props
  return (
    <Button
      variant='destructive'
      onClick={() => deleteHousehold.mutate({ householdId: id })}
    >
      remove
    </Button>
  )

}
