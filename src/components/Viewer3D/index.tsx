import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';
import { Cuboid } from '../../types'
import PointCloud from '../PointCloud';
import Cuboids from '../Cuboids';
interface Props {
  positions: Float32Array
  cuboids: Cuboid[]
  onCuboidHover?: (cuboid: Cuboid | null) => void
}

const Viewer3D = ({ positions, cuboids, onCuboidHover }: Props) => (
  <Canvas
    style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
    camera={{ position: [0, 0, 150], fov: 75 }}
  >
    <OrbitControls />
    <PointCloud positions={positions} />
    <Cuboids cuboids={cuboids} onHover={onCuboidHover} />
  </Canvas>
);

export default Viewer3D;
