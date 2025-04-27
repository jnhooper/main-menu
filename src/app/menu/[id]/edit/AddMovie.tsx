"use client";
import {useState} from 'react'
import {Button} from '~/components/ui/button'
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaDescription,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "~/components/ui/credenza"
import {type SelectMenu} from '~/server/db/schema'
import CreateItem from "~/app/_components/items/CreateItem";

interface AddMovieProps {
  menuId: SelectMenu['id']
  menuName: SelectMenu['name']
  /**
  * defaults to 'item'
  * */
  itemType?: string
}

export const AddMovie = (props: AddMovieProps) => {
  const {
    itemType = 'item',
    menuId,
    menuName,
  } = props
  const [open, setOpen] = useState<boolean>(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div className='sticky top-4 z-10 flex flex-row-reverse'>
      <Button
        onClick={handleOpen}
        size="lg"
      >{`Add ${itemType}`}</Button>
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
            <CreateItem
              menuId={menuId}
              onSubmit={handleClose}
            />
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <Button>Close</Button>
            </CredenzaClose>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </div>
  )
}
