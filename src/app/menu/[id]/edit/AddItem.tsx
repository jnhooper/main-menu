"use client";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "~/components/ui/credenza";
import type { MenuType, SelectMenu } from "~/server/db/schema";
import CreateMedia from "~/app/_components/items/CreateMedia";
import CreateFoodItem from "~/app/_components/items/CreateFoodItem";

interface AddItemProps {
  menuId: SelectMenu["id"];
  menuName: SelectMenu["name"];
  /**
   * defaults to 'item'
   */
  itemType?: MenuType;
  defaultPosition: number;
}

export const AddItem = (props: AddItemProps) => {
  const {
    itemType = "item",
    menuId,
    menuName,
    defaultPosition,
  } = props;
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className="sticky top-4 flex flex-row-reverse">
      <Button
        onClick={handleOpen}
        size="lg"
      >
        {`Add ${itemType}`}
      </Button>
      <Credenza
        open={open}
        onOpenChange={setOpen}
      >
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>New Item</CredenzaTitle>
            <CredenzaDescription>
              Add a new item to {menuName}
            </CredenzaDescription>
          </CredenzaHeader>
          <CredenzaBody>
            {itemType === "media"
              ? (
                <CreateMedia
                  menuId={menuId}
                  onSubmit={handleClose}
                  defaultPosition={defaultPosition}
                />
              )
              : (
                <CreateFoodItem
                  menuId={menuId}
                  onSubmit={handleClose}
                  defaultPosition={defaultPosition}
                />
              )}
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <Button>Close</Button>
            </CredenzaClose>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </div>
  );
};
