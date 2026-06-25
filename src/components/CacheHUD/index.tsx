import { useEffect, useState } from 'react';
import { FrameCache } from '../../utils/FrameCache';
import styles from './CacheHUD.module.css';

interface Props {
  cache: FrameCache;
  failedFrames: Set<number>
}

export const CacheHUD = ({ cache, failedFrames }: Props) => {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setTick((t) => t + 1);
    }, 500);
    return () => {
      clearInterval(id);
    };
  }, []);

  const entries = cache.getEntries();
  const used = cache.totalMB;
  const limit = cache.maxMB;
  const pct = limit > 0 ? Math.round((used / limit) * 100) : 0;
  const nearLimit = pct > 90;

  return (
    <div className={styles.hudContainer}>
      <div className={styles.mainInfo}>
        Cache: {used.toFixed(1)} MB / {limit} MB
        <span className={nearLimit ? styles.percentageWarning : styles.percentageNormal}>
          ({pct}%)
        </span>
      </div>
      
      {nearLimit && (
        <div className={styles.warningMessage}>
          ⚠ Near capacity limit
        </div>
      )}
      
      <div className={styles.framesList}>
        Frames cached: {entries.length}
          { entries.length > 0 && (<span> [</span>)}
          {
            entries.map((entry, idx) => {
              const isFail = failedFrames.has(entry.frame.frame_id)
              return (
                <span key={entry.frame.frame_id}>
                  { idx > 0 && <span>, </span> }
                  <span className={isFail ? styles.frameIdFail : styles.frameId}>
                    {entry.frame.frame_id}
                  </span>
                </span>
              )
            })
          }
         { entries.length > 0 && <span>]</span> }
      </div>
    </div>
  );
};