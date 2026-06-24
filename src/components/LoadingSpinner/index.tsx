import styles from './LoadingSpinner.module.css'

const LoadingSpinner = () => (
  <div className={styles.overlay}>
    <div className={styles.circle} />
    <div className={styles.label}>Fetching Data...</div>
  </div>
)

export default LoadingSpinner;
