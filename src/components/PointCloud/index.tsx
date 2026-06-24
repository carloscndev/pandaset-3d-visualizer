import { useMemo } from 'react';
import { BufferGeometry, Float32BufferAttribute } from 'three';

interface Props {
  positions: Float32Array
}

const PointCloud = ({ positions}: Props) => {
    const POINT_SIZE = 0.1;
  
    const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));
    return geo;
  }, [positions])

  return (
    <points geometry={geometry}>
      <pointsMaterial size={POINT_SIZE} color="white" sizeAttenuation />
    </points>
  )
};

export default PointCloud;