import Image from 'next/image'
import {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardFooter,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTriggerButton,
} from "~/components/ui/expandable"
import styles from './styles.module.css'

interface MediaCard {
  title: string
  description?: string | null
  href?: string
  imgUrl:string
}
export const MediaCard = (props: MediaCard) => {
  const {title, imgUrl} = props
  const cardWidth =320;
  return (
    <Expandable
      expandDirection="vertical"
      expandBehavior="replace"
      initialDelay={0.2}
      onExpandStart={() => console.log("Expanding meeting card...")}
      onExpandEnd={() => console.log("Meeting card expanded!")}
    >
      {({ isExpanded }) => (
        <ExpandableCard
          isFullWidth
          className="w-full relative"
          collapsedSize={{ width: cardWidth, height: 640 }}
          expandedSize={{ width: cardWidth, height: 880 }}
          hoverToExpand={false}
          expandDelay={200}
          collapseDelay={500}
        >
          <ExpandableCardHeader className={styles.expandableHeaderWrapper}>
            <div className={ styles.imageWrapper }>
              <Image
                src={imgUrl}
                width={270}
                height={400}
                className={styles.image}
                alt={`image for ${title}`}
              />
              <div className={styles.opacity}/>
              <h2 className={styles.title}>
                {title}
              </h2>
            </div>
          </ExpandableCardHeader>

          <ExpandableCardContent>
            <div className="flex flex-col items-start justify-between mb-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <span>1:30PM → 2:30PM</span>
              </div>
            </div>

            <ExpandableTriggerButton>
              {isExpanded ? 'less' : 'more'} details
            </ExpandableTriggerButton>
            <ExpandableContent preset="blur-md" stagger staggerChildren={0.2}>
              <p className="text-sm text-gray-700 dark:text-gray-200 mb-4">
                Weekly design sync to discuss ongoing projects, share updates,
                and address any design-related challenges.
              </p>
              <div className="mb-4">
                <h4 className="font-medium text-sm text-gray-800 dark:text-gray-100 mb-2 flex items-center">
                  Attendees:
                </h4>
                <div className="flex -space-x-2 overflow-hidden">
                  hey
                </div>
              </div>
            </ExpandableContent>
          </ExpandableCardContent>
          <ExpandableContent preset="slide-up">
            <ExpandableCardFooter>
              <div className="flex items-center justify-between w-full text-sm text-gray-600 dark:text-gray-300">
                <span>Weekly</span>
                <span>Next: Mon, 10:00 AM</span>
              </div>
            </ExpandableCardFooter>
          </ExpandableContent>
        </ExpandableCard>
      )}
    </Expandable>
  )
}
