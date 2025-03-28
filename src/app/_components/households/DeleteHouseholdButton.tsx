import { Button } from '~/components/ui/button'
import { api } from "~/trpc/react";
import { type api as serverApi } from "~/trpc/server";

interface DeleteHouseholdButtonProps {
  id: Awaited<ReturnType<
    (typeof serverApi)['households']['delete']
  >>['id']
}

export const DeleteHouseholdButton = (props: DeleteHouseholdButtonProps) => {
  const utils = api.useUtils();
  const deleteHousehold = api.households.delete.useMutation({
    onSuccess: async () => {
      await utils.households.getMyHouseholds.invalidate()
    },
  });
  const { id } = props
  return (
    <Button
      variant='destructive'
      onClick={() => deleteHousehold.mutate({ id })}
    >
      remove
    </Button>
  )

}
