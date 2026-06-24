import styles from './Timeline.module.css'

interface Props {
  frameId: number
}

export const Timeline = ({ frameId }: Props) => {
  return (
    <div className={styles.timeline}>
      Frame: {frameId}
    </div>
  )
}
