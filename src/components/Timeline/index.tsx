import styles from './Timeline.module.css'

interface Props {
  frameId: number
  totalFrames?: number
  onPrev: () => void
  onNext: () => void
}

const Timeline = ({ frameId,  totalFrames = 1, onPrev, onNext }: Props) => {
  const pct = totalFrames > 0 ? ((frameId + 1) / totalFrames) * 100 : 0
  
  return (
    <div className={styles.timeline}>
      <span> Frame: {frameId}</span>
      <div className={styles.progressBarButtonsContainer}>
        <button className={styles.progressBarButton} onClick={onPrev} disabled={frameId <= 0}>&lt;</button>
        <span>Frame {frameId + 1} / {totalFrames}</span>
        <button className={styles.progressBarButton} onClick={onNext} disabled={frameId >= totalFrames - 1}>&gt;</button>
      </div>
      <div className={styles.progressBarContainer}>
        <div className={styles.progressBar} style={{ width: `${pct}%` }}/>
      </div>
    </div>
  )
}

export default Timeline;
