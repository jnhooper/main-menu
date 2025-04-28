"use client";

import Image from 'next/image'
import {useRef, useState, useEffect} from 'react'
import {
  Expandable,
  ExpandableCard,
  ExpandableCardContent,
  ExpandableCardFooter,
  ExpandableCardHeader,
  ExpandableContent,
  ExpandableTriggerButton,
} from "~/components/ui/expandable"
import { CreateItem } from '~/app/_components/items/CreateItem'
import { Button } from '~/components/ui/button'
import styles from './styles.module.css'

interface EditMediaCardProps {
  title: string
  imgUrl:string
  itemId: string
  menuId: string
}
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

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return size;
};
export const EditMediaCard = (props: EditMediaCardProps) => {
  const {title, imgUrl, itemId, menuId} = props
  const windowSize = useWindowSize()
  const [ cardWidth, setCardWidth ] = useState(150);
  useEffect(()=>{
    if(windowSize.width > 768){
      setCardWidth(windowSize.width / 3 )
    }
  },[ windowSize.width]);

  const cardRef = useRef(null)
  const expandedDelay = 100;
  return (
    <Expandable
      expandDirection="both"
      expandBehavior="replace"
      initialDelay={0.2}
      className={styles.editMediaWrapper}
    >
      {({ isExpanded }) => { 
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
              <div className={ styles.imageWrapper }>
                <Image
                  src={imgUrl}
                  width={200}
                  height={20}
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
              <ExpandableTriggerButton
                variant={'secondary'}
              >
                {isExpanded ?  'Close': 'Edit Item'}
              </ExpandableTriggerButton>
              <ExpandableContent
                preset="blur-md"
                stagger
                staggerChildren={0.2}
              >
                <CreateItem
                  itemId={itemId}
                  menuId={menuId}
                />
              </ExpandableContent>
            </ExpandableCardContent>
            <ExpandableContent preset="slide-up">
              <ExpandableCardFooter>
                <div
                  className={styles.footer}
                >
                  <Button
                    variant='default'
                  >
                    save 
                  </Button>
                </div>
              </ExpandableCardFooter>
            </ExpandableContent>
          </ExpandableCard>
        ) }}
    </Expandable>
  )
}
