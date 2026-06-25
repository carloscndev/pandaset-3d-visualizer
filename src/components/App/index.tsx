import { useState, useMemo } from 'react'
import { parsePoints } from '../../utils';
import { Cuboid } from '../../types'
import Viewer3D from '../Viewer3D'
import LoadingSpinner from '../LoadingSpinner';
import ErrorIndicator from '../ErrorIndicator';
import InfoCuboidLabel from '../InfoCuboidLabel';
import Timeline  from '../Timeline';
import { CacheHUD } from '../CacheHUD';
import usePointCloud from '../../hooks/usePointCloud';
import styles from './App.module.css'

const App = () => {
  const {
    currentFrame,
    currentIndex, 
    totalFrames,
    loading, 
    error, 
    goNext, 
    goPrev, 
    cache,
  } = usePointCloud();
  const [selected, setSelected] = useState<Cuboid | null>(null);
  console.log('Current', currentFrame);
    
  const positions = useMemo(() => {
    if(!currentFrame) return new Float32Array();
    return parsePoints(currentFrame.points);
  }, [currentFrame]);


  return (
   <div id="3d-viewer-container" className={styles.container}>
    {loading && <LoadingSpinner />}
    {error && <ErrorIndicator error={error} />} 
    <CacheHUD cache={cache} />
    <Viewer3D 
      positions={positions} 
      cuboids={currentFrame?.cuboids ?? []}
      onCuboidHover={setSelected} 
    />
    <Timeline
      frameId={currentIndex}
      totalFrames={totalFrames}
      onPrev={goPrev}
      onNext={goNext}
    />
     {selected && <InfoCuboidLabel selected={selected} />}
  </div>
)};

export default App;
