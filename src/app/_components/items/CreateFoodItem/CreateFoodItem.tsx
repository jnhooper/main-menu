"use client";
import { useEffect, useState } from "react";
import type {
  ApiCreateFoodItem,
  SelectItem,
  SelectMenu,
} from "~/server/db/schema";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { api } from "~/trpc/react";
import { IngredientsInput } from "../IngredientsInput/IngredientsInput";

interface CreateFoodItemProps {
  menuId: SelectMenu["id"];
  itemId?: SelectItem["id"];
  onSubmit?: (data?: SelectItem | SelectMenu) => void;
  defaultPosition: number;
}
export function CreateFoodItem(props: CreateFoodItemProps) {
  const { menuId, onSubmit, defaultPosition } = props;

  const utils = api.useUtils();
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string | undefined>();
  const [imageUrl, setImgUrl] = useState<string>("");
  const [recipeLink, setRecipeLink] = useState<string>("");

  const [isVisible, setisVisible] = useState<boolean>(true);
  const createItem = api.item.createFoodItem.useMutation({
    onSuccess: async (data) => {
      await utils.item.getVisibleMenuItems.invalidate({ menuId });
      await utils.item.getMenuItems.invalidate({ menuId });
      //onSubmit(data);
      setName("");
      setDescription(undefined);
      setImgUrl("");
    },
  });

  const [ingredients, setIngredients] = useState<
    NonNullable<ApiCreateFoodItem["metadata"]>["ingredients"]
  >([]);

  // ingredients: z.array(
  //   z.object({
  //     amount: z.string().optional(),
  //     ingredient: z.string()
  //   })
  // ).optional(),
  // /**
  //  * link to the recipe
  //  **/
  // recipeLink: z.string().url().optional()
  return (
    <div className="w-full max-w-xs m-auto">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createItem.mutate({
            name,
            description,
            imageUrl: imageUrl,
            position: defaultPosition,
            isVisible,
            menuId,
            metadata: {
              ingredients: ingredients,
            },
          });
        }}
        className="flex flex-col gap-2"
      >
        <Label htmlFor="itemName">
          Name
        </Label>
        <Input
          type="text"
          id="itemName"
          placeholder="Movie Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <Label htmlFor="itemDescription">
          Descirption
        </Label>
        <Input
          type="textarea"
          id="itemDescription"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <Label htmlFor="itemImgUrl">
          Image Url
        </Label>
        <Input
          type="text"
          id="itemImgUrl"
          placeholder="image url"
          value={imageUrl}
          onChange={(e) => setImgUrl(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <Label htmlFor="recipeLink">
          Recipe Link
        </Label>
        <Input
          type="text"
          id="recipeLink"
          placeholder="recipe link"
          value={recipeLink}
          onChange={(e) => setRecipeLink(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />

        <IngredientsInput onChange={setIngredients} />

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
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createItem.isPending}
        >
          {createItem.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
