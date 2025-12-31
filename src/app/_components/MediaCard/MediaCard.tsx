"use client";

import Image from "next/image";
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
import { type SelectMovieItem } from "~/server/db/schema";
import { displayTime } from "../items/TimeDuration";

type MediaCardProps = Partial<SelectMovieItem>;

export const MediaCard = (props: MediaCardProps) => {
  const { name, imageUrl, metadata, description } = props;
  const cardWidth = 320;
  const hasExpandableContent = !!description;
  // TODO: WHAT DO WE PUT IN THE FOOTER?
  const hasExpandableFooter = false;
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
              {metadata?.runTime
                ? (
                  <div className="flex flex-col items-start justify-between">
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                      <span>{displayTime(metadata.runTime)}</span>
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
          {hasExpandableFooter
            ? (
              <ExpandableContent preset="slide-up">
                <ExpandableCardFooter>
                  <div className="flex items-center justify-between w-full text-sm text-gray-600 dark:text-gray-300">
                    <span>Weekly</span>
                    <span>Next: Mon, 10:00 AM</span>
                  </div>
                </ExpandableCardFooter>
              </ExpandableContent>
            )
            : null}
        </ExpandableCard>
      )}
    </Expandable>
  );
};
