"use client";

import { useEffect, useState } from "react";
import { type SelectFoodItem } from "~/server/db/schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

type IngredientArray = SelectFoodItem["metadata"]["ingredients"];
interface IngredientsInputProps {
  initialIngredients?: IngredientArray;
  onChange: (ingredients: IngredientArray) => void;
}
export const IngredientsInput = (props: IngredientsInputProps) => {
  const {
    initialIngredients = [],
    onChange,
  } = props;
  const [ingredients, setIngredients] = useState<NonNullable<IngredientArray>>(
    initialIngredients,
  );
  const [newIngredientName, setNewIngredientName] = useState<
    string | undefined
  >();
  const [newIngredientAmount, setNewIngredientAmount] = useState<
    string | undefined
  >();
  const [showNewIngredientError, setShowNewIngredientError] = useState<boolean>(
    false,
  );
  const [ingredientErros, setIngredientErrors] = useState<
    Record<number, boolean>
  >({});

  return (
    <FieldSet>
      <FieldLegend>Ingredients</FieldLegend>
      <FieldSet>
        <FieldLegend>New Ingredient</FieldLegend>
        <FieldGroup className="flex flex-row gap-2">
          <Field className="flex-[5]">
            <FieldLabel>Name</FieldLabel>
            <Input
              value={newIngredientName ?? ""}
              onChange={(e) => {
                setNewIngredientName(e.target.value);
                if (e.target.value.trim().length > 0) {
                  setShowNewIngredientError(false);
                }
              }}
            />
            {showNewIngredientError
              ? <FieldError>Name Required</FieldError>
              : null}
          </Field>
          <Field className="flex-[2]">
            <FieldLabel>Amount</FieldLabel>
            <Input
              value={newIngredientAmount ?? ""}
              onChange={(e) => setNewIngredientAmount(e.target.value)}
            />
          </Field>
        </FieldGroup>
        <Button
          type="button"
          onClick={() => {
            if (newIngredientName) {
              const newArray = [...ingredients, {
                ingredient: newIngredientName,
                amount: newIngredientAmount,
              }];
              setIngredients(newArray);
              onChange(newArray);
              setNewIngredientName("");
              setNewIngredientAmount("");
              if (showNewIngredientError) {
                setShowNewIngredientError(false);
              }
            } else {
              setShowNewIngredientError(true);
            }
          }}
        >
          + Add Ingredient
        </Button>
      </FieldSet>
      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={`ingredient_${index}`}>
            <FieldGroup className="flex flex-row gap-2">
              <Field className="flex-[5]">
                <FieldLabel>Name</FieldLabel>
                <Input
                  value={ingredient.ingredient}
                  onChange={(e) => {
                    const newIngredients = ingredients.map((i, ind) => {
                      if (index === ind) {
                        return {
                          ...i,
                          ingredient: e.target.value,
                        };
                      }
                      return i;
                    });
                    setIngredients(newIngredients);
                    onChange(newIngredients);
                    if (
                      ingredientErros[index] &&
                      e.target.value.trim().length !== 0
                    ) {
                      setIngredientErrors({
                        ...ingredientErros,
                        [index]: false,
                      });
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value.trim().length === 0) {
                      setIngredientErrors({
                        ...ingredientErros,
                        [index]: true,
                      });
                    }
                  }}
                />
                {ingredientErros[index]
                  ? <FieldError>Name Required</FieldError>
                  : null}
              </Field>
              <Field className="flex-[2]">
                <FieldLabel>Amount</FieldLabel>
                <Input
                  defaultValue={ingredient.amount}
                />
              </Field>
            </FieldGroup>
          </li>
        ))}
      </ul>
    </FieldSet>
  );
};
