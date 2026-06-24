import { useMemo, useState } from 'react'
import { parsePoints } from '../../utils';
import { Cuboid } from '../../types'
import Viewer3D from '../Viewer3D'
import LoadingSpinner from '../LoadingSpinner';
import ErrorIndicator from '../ErrorIndicator';
import InfoCuboidLabel from '../InfoCuboidLabel';
import { Timeline } from '../Timeline';
import usePointCloud from '../../hooks/usePointCloud';
import styles from './App.module.css'

const App = () => {
  const [selected, setSelected] = useState<Cuboid | null>(null)
  const {data, loading, error} = usePointCloud('https://static.scale.com/uploads/pandaset-challenge/frame_00.json');
  const positions = useMemo(() => {
    if(!data) return new Float32Array();
    return parsePoints(data.points);
  }, [data]);

  return (
   <div id="3d-viewer-container" className={styles.container}>
    {loading && <LoadingSpinner />}
    {error && <ErrorIndicator error={error} />} 
    <Viewer3D 
      positions={positions} 
      cuboids={data?.cuboids ?? []}
      onCuboidHover={setSelected} 
    />
    <Timeline frameId={data?.frame_id ?? 0} />
     {selected && <InfoCuboidLabel selected={selected} />}
  </div>
)};

export default App;
