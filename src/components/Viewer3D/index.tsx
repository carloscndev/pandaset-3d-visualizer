import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber'
import { OrbitControls, PointMaterial } from '@react-three/drei';
import { BufferGeometry, Float32BufferAttribute, PointsMaterial, Points } from 'three';
interface Props {
  points: Float32Array
}

const Viewer3D = ({ points }: Props) => {
  


  return (
    <Canvas
      style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
      camera={{ position: [0, 0, 150], fov: 75 }}
    >
      <OrbitControls />
      <PointCloud points={points} />
    </Canvas>
  );
};

const PointCloud = ({ points}: Props) => {
    const POINT_SIZE = 0.1;
    const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(points, 3));
    return geo;
  }, [points])

  return(
    <points geometry={geometry}>
      <PointMaterial size={POINT_SIZE} color="white" sizeAttenuation />
    </points>
  )
}

export default Viewer3D;