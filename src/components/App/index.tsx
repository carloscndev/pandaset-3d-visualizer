import { useEffect, useState, useMemo } from 'react'
import { parsePoints } from '../../utils';
import { DataCloudFrame } from '../../types';
import Viewer3D from '../Viewer3D'
import styles from './App.module.css'
import usePointCloud from '../../hooks/usePointCloud';

const App = () => {
  const {data, loading, error} = usePointCloud('https://static.scale.com/uploads/pandaset-challenge/frame_00.json');

  const positions = useMemo(() => {
    if(!data) return new Float32Array();
    return parsePoints(data.points);
  }, [data]);

  return (
   <div id="3d-viewer-container" className={styles.container}>
   {loading && <div>Loading</div>}
    {error && <div>Error</div>}
    <Viewer3D positions={positions} />
  </div>
)};

export default App;
