
import styles from './ErrorIndicator.module.css'

interface Props {
  error: string
  currentIndex: number
  loadFrame: (currentIndex: number) => void
}

const ErrorIndicator = ({ error, currentIndex, loadFrame }: Props) => (
  <div className={styles.errorBox}>
    <span>Error: {error}</span>
    <button onClick={() => loadFrame(currentIndex)} className={styles.loadFrameButton}>
      Retry
    </button>
  </div>
);

export default ErrorIndicator;