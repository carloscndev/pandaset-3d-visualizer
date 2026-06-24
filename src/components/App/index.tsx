import { useEffect, useState } from 'react'
import Viewer3D from '../Viewer3D'
import styles from './App.module.css'


const App = () => {
  const [data, setData] = useState<any>();

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

  return (
   <div id="3d-viewer-container" className={styles.container}>
    <Viewer3D />
  </div>
)};

export default App;
