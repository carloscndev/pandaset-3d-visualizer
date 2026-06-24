import { useEffect, useState, useMemo } from 'react'
import Viewer3D from '../Viewer3D'
import styles from './App.module.css'
import { parsePoints } from '../../utils';
import { DataCloudFrame } from '../../types';


const App = () => {
  const [data, setData] = useState<DataCloudFrame | null>();
  useEffect(() => {
    const loadData = async() => {
      try {
        const response = await fetch('https://static.scale.com/uploads/pandaset-challenge/frame_00.json');
        const json = await response.json();
        console.log(json);
        setData(json);
      } catch(e) {
        console.log(e)
      }
    }

    loadData();
  }, []);

  const positions = useMemo(() => {
    if(!data) return new Float32Array();
    return parsePoints(data.points);
  }, [data]);

  return (
   <div id="3d-viewer-container" className={styles.container}>
    <Viewer3D positions={positions} />
  </div>
)};

export default App;
