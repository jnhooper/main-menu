"use client";

import { Button } from "~/components/ui/button";
import { api, type RouterInputs } from "~/trpc/react";

type SetDefaultMenuButtonProps = RouterInputs["household"]["setDefaultMenu"] & {
  disabled?: boolean;
  onSuccess?: (defaultMenuId: string) => void;
};

export const SetDefaultMenuButton = (
  props: SetDefaultMenuButtonProps,
) => {
  const {
    menuId,
    householdId,
    disabled = false,
    onSuccess = () => null,
  } = props;
  const utils = api.useUtils();
  const setDefaultMenu = api.household.setDefaultMenu.useMutation({
    onSuccess: async () => {
      //TODO: this doesn't work... i think it's due to the fact that hh id is set at on the server
      //query
      await utils.household.getHousehold.invalidate({ id: householdId });
      await utils.menu.getHouseholdMenus.invalidate({
        householdId: householdId,
      });
      onSuccess(menuId);
    },
  });
  return (
    <Button
      disabled={disabled}
      variant="secondary"
      onClick={() => setDefaultMenu.mutate({ menuId, householdId })}
    >
      Set as Default
    </Button>
  );
};
