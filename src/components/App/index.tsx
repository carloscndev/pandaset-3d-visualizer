import { useMemo } from 'react'
import { parsePoints } from '../../utils';
import Viewer3D from '../Viewer3D'
import LoadingSpinner from '../LoadingSpinner';
import ErrorIndicator from '../ErrorIndicator';
import usePointCloud from '../../hooks/usePointCloud';
import styles from './App.module.css'

const App = () => {
  const {data, loading, error} = usePointCloud('https://static.scale.com/uploads/pandaset-challenge/frame_00.json');

  const positions = useMemo(() => {
    if(!data) return new Float32Array();
    return parsePoints(data.points);
  }, [data]);

  return (
   <div id="3d-viewer-container" className={styles.container}>
    {loading && <LoadingSpinner />}
    {error && <ErrorIndicator error={error} />} 
    <Viewer3D positions={positions} cuboids={data?.cuboids ?? []} />
  </div>
)};

export default App;
