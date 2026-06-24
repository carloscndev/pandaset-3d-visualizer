import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';
import PointCloud from '../PointCloud';

interface Props {
  positions: Float32Array
}

const Viewer3D = ({ positions }: Props) => (
  <Canvas
    style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
    camera={{ position: [0, 0, 150], fov: 75 }}
  >
    <OrbitControls />
    <PointCloud positions={positions} />
  </Canvas>
);

export default Viewer3D;
