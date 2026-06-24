
import styles from './ErrorIndicator.module.css'

interface Props {
  error: string
}

const ErrorIndicator = ({ error }: Props) => (
  <div className={styles.errorBox}>
    <span>Error: {error}</span>
  </div>
);

export default ErrorIndicator;