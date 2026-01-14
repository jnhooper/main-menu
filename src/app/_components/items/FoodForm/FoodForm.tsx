"use client";
import { useState } from "react";

import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { TimeDuration } from "../TimeDuration";
import {
  type ApiCreateFoodItem,
  type SelectFoodItem,
} from "~/server/db/schema";
import { IngredientsInput } from "../IngredientsInput/IngredientsInput";

interface FoodFormProps {
  onSubmit: (data: ApiCreateFoodItem) => void;
  initialData?: SelectFoodItem;
  menuId: string;
  mutationIsPending?: boolean;
}
export const FoodForm = (props: FoodFormProps) => {
  const {
    onSubmit,
    initialData,
    menuId,
    mutationIsPending,
  } = props;

  const [name, setName] = useState<ApiCreateFoodItem["name"]>(
    initialData?.name ?? "",
  );

  const [
    description,
    setDescription,
  ] = useState<string | undefined>(initialData?.description ?? "");

  const [imageUrl, setImgUrl] = useState<
    ApiCreateFoodItem["imageUrl"]
  >(initialData?.imageUrl ?? "");

  const [ingredients, setIngredients] = useState<
    SelectFoodItem["metadata"]["ingredients"]
  >(initialData?.metadata.ingredients ?? []);

  const [
    isVisible,
    setisVisible,
  ] = useState<SelectFoodItem["isVisible"]>(
    initialData ? initialData.isVisible : true,
  );

  const [recipeLink, setRecipeLink] = useState<string | undefined>(
    initialData?.metadata?.recipeLink,
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
            position: initialData?.position ?? 1,
            metadata: {
              recipeLink,
              ingredients,
            },
          });
        }}
        className="flex flex-col gap-2"
      >
        <Label htmlFor="itemName">
          Dish Name
        </Label>
        <Input
          type="text"
          id="itemName"
          placeholder="Dish Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <Label htmlFor="movieDescription">
          Dish Descirption
        </Label>
        <Input
          type="textarea"
          id="movieDescription"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <Label htmlFor="foodImgUrl">
          Image Url
        </Label>
        <Input
          type="text"
          id="foodImgUrl"
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
        <Label htmlFor="recipieLink">
          Trailer Url
        </Label>
        <Input
          type="text"
          id="recipieLink"
          placeholder="Recipe Link"
          value={recipeLink}
          onChange={(e) => setRecipeLink(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <IngredientsInput
          onChange={setIngredients}
          initialIngredients={ingredients}
        />
        <Button
          type="submit"
          variant="default"
          disabled={mutationIsPending}
        >
          {mutationIsPending ? "Submitting..." : "Submit"}
        </Button>
      </form>
    </div>
  );
};
