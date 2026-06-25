
import { Cuboid } from '../../types';
import styles from './InfoCuboidLabel.module.css';

interface Props {
  selected: Cuboid;
}

const InfoCuboidLabel = ({ selected }: Props) => {
  const yawDegrees = (selected.yaw * (180 / Math.PI)).toFixed(0);

  return (
    <div className={styles.infoCuboidLabel}>
      <div className={styles.headerRow}>
        <span className={styles.labelName}>{selected.label}</span>
        <span className={`${styles.badge} ${selected.stationary ? styles.static : styles.moving}`}>
          {selected.stationary ? 'Stationary' : 'Dynamic'}
        </span>
      </div>
      <hr className={styles.divider} />
      <div className={styles.statsGrid}>
        <div>
          <strong>Position:</strong> 
          <span> [{selected['position.x'].toFixed(1)}, {selected['position.y'].toFixed(1)}, {selected['position.z'].toFixed(1)}] m</span>
        </div>
        <div>
          <strong>Size (L×W×H):</strong> 
          <span> {selected['dimensions.x'].toFixed(1)} × {selected['dimensions.y'].toFixed(1)} × {selected['dimensions.z'].toFixed(1)} m</span>
        </div>
        <div>
          <strong>Orientation (Yaw):</strong> 
          <span> {yawDegrees}°</span>
        </div>
      </div>
      <div className={styles.uuidRow}>
        <small>ID: {selected.uuid.substring(0, 8)}...</small>
      </div>
    </div>
  );
};

export default InfoCuboidLabel;