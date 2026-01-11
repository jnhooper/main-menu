"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardFooter,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTriggerButton,
} from "~/components/ui/expandable";
import styles from "./styles.module.css";
import { type SelectFoodItem } from "~/server/db/schema";
import { displayTime } from "../items/TimeDuration";

type FoodCardProps = Partial<SelectFoodItem>;

export const FoodCard = (props: FoodCardProps) => {
  const { name, imageUrl, metadata, description } = props;
  const cardWidth = 320;
  const hasExpandableContent = !!description || !!metadata?.ingredients ||
    !!metadata?.recipeLink;
  // TODO: WHAT DO WE PUT IN THE FOOTER?
  const hasExpandableFooter = true;
  return (
    <Expandable
      expandDirection="both"
      expandBehavior="replace"
      initialDelay={0.2}
      onExpandStart={() => console.log("Expanding meeting card...")}
      onExpandEnd={() => console.log("Meeting card expanded!")}
    >
      {({ isExpanded }) => (
        <ExpandableCard
          isFullWidth
          className="w-full relative"
          collapsedSize={{ width: cardWidth }}
          expandedSize={{ width: (cardWidth * 1.1) }}
          hoverToExpand={false}
          expandDelay={100}
          collapseDelay={500}
        >
          <ExpandableCardHeader className={styles.expandableHeaderWrapper}>
            <div className={styles.imageWrapper}>
              <Image
                src={imageUrl!}
                width={270}
                height={400}
                className={styles.image}
                alt={`image for ${name}`}
              />
              <div className={styles.opacity} />
              <h2 className={styles.title}>
                {name}
              </h2>
            </div>
          </ExpandableCardHeader>

          <ExpandableCardContent>
            <div className="flex flex-col gap-4 mt-4">
              {metadata?.ingredients
                ? (
                  <div className="flex flex-col items-start justify-between">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span>
                        {metadata.ingredients.length} ingredients
                      </span>
                    </div>
                  </div>
                )
                : null}
              {hasExpandableContent
                ? (
                  <div>
                    <ExpandableTriggerButton>
                      {isExpanded ? "less" : "more"} details
                    </ExpandableTriggerButton>
                    <ExpandableContent
                      preset="slide-down"
                      stagger
                      staggerChildren={0.2}
                    >
                      {description
                        ? (
                          <p className="text-sm text-gray-700 dark:text-gray-200 pt-4">
                            {description}
                          </p>
                        )
                        : null}
                    </ExpandableContent>
                  </div>
                )
                : null}
            </div>
          </ExpandableCardContent>
          <ExpandableContent preset="slide-up">
            <ExpandableCardFooter>
              <div className="flex flex-col gap-2 text-gray-600 dark:text-gray-300">
                {metadata?.recipeLink
                  ? (
                    <Link
                      href={metadata.recipeLink}
                      target="_blank"
                      rel="oopener"
                    >
                      View Recipe
                    </Link>
                  )
                  : null}
                {metadata?.ingredients && metadata?.ingredients.length > 0
                  ? (
                    <ul>
                      {metadata?.ingredients.map((ingredient, index) => (
                        <li
                          key={`${index}_ingredient`}
                          className="grid grid-cols-2 gap-2"
                        >
                          <div>
                            {ingredient.ingredient}
                          </div>
                          <div>
                            {ingredient.amount}
                          </div>
                        </li>
                      ))}
                    </ul>
                  )
                  : null}
              </div>
            </ExpandableCardFooter>
          </ExpandableContent>
        </ExpandableCard>
      )}
    </Expandable>
  );
};
