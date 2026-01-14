"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardFooter,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTriggerButton,
} from "~/components/ui/expandable";
import { FoodForm } from "../items/FoodForm";
import { api } from "~/trpc/react";
import styles from "./styles.module.css";
import type { SelectFoodItem } from "~/server/db/schema";

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
};
export const EditFoodCard = (props: SelectFoodItem) => {
  const {
    name,
    imageUrl,
    menuId,
  } = props;
  const windowSize = useWindowSize();
  const [cardWidth, setCardWidth] = useState(150);
  useEffect(() => {
    if (windowSize.width > 768) {
      setCardWidth(windowSize.width / 3);
    }
  }, [windowSize.width]);

  /**
   * form related logic
   * **/
  const item = api.item.getEditItem.useSuspenseQuery(
    { itemId: props.id, menuId },
    { initialData: props },
  );

  const utils = api.useUtils();

  const cardRef = useRef(null);
  const expandedDelay = 100;
  return (
    <Expandable
      expandDirection="both"
      expandBehavior="replace"
      initialDelay={0.2}
      className={styles.editMediaWrapper}
    >
      {({ isExpanded, toggleExpand }) => {
        const updateFood = api.item.updateItem.useMutation({
          onSuccess: async (data) => {
            await utils.item.getVisibleMenuItems.invalidate({ menuId });
            await utils.item.getEditItem.invalidate({
              menuId,
              itemId: props.id,
            });
            await utils.item.getMenuItems.invalidate({ menuId });
            toggleExpand();
          },
        });
        return (
          <ExpandableCard
            isFullWidth
            className="w-full relative"
            collapsedSize={{
              width: cardWidth,
            }}
            expandedSize={{
              width: windowSize.width,
            }}
            ref={cardRef}
            hoverToExpand={false}
            expandDelay={expandedDelay}
            collapseDelay={500}
          >
            <ExpandableCardHeader className={styles.expandableHeaderWrapper}>
              <div className={styles.imageWrapper}>
                <Image
                  src={imageUrl}
                  width={200}
                  height={20}
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
              <ExpandableTriggerButton
                variant={"secondary"}
              >
                {isExpanded ? "Close" : "Edit Item"}
              </ExpandableTriggerButton>
              <ExpandableContent
                preset="blur-md"
                stagger
                staggerChildren={0.2}
              >
                <FoodForm
                  onSubmit={(data) =>
                    updateFood.mutate({
                      itemId: item[0].id,
                      ...data,
                    })}
                  menuId={menuId}
                  initialData={item[0]}
                  mutationIsPending={updateFood.isPending}
                />
              </ExpandableContent>
            </ExpandableCardContent>
          </ExpandableCard>
        );
      }}
    </Expandable>
  );
};
