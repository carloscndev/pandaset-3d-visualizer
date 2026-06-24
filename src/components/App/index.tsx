import React from 'react'
import Viewer3D from '../Viewer3D'
import styles from './App.module.css'


const App = () => (
  <div id="3d-viewer-container" className={styles.container}>
    <Viewer3D />
  </div>
);

export default App;
