import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';

const Viewer3D = () => {
  return (
    <Canvas
      style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
      camera={{ position: [0, 0, 5], fov: 75 }}
    >
      <OrbitControls />
      <mesh>
        <boxGeometry />
        <meshBasicMaterial color="white" />
      </mesh>
    </Canvas>
  );
};

export default Viewer3D;