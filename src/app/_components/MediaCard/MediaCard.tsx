import styles from './styles.module.css'
interface MediaCard {
  title: string
  description?: string | null
  href?: string
  imgUrl:string
}
export const MediaCard = (props: MediaCard) => {
  const {title, imgUrl} = props
  return (
    <div className={styles.cardWrapper}>
      <img
        src={imgUrl}
        alt={`Poster for ${title}`}
      />
      <h2>{title}</h2>
    </div>
  )
}
