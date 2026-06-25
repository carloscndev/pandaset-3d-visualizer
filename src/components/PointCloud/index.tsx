import { useMemo } from 'react';
import { BufferGeometry, Float32BufferAttribute } from 'three';
import { heightColor, getZRange } from '../../utils/color';
interface Props {
  positions: Float32Array
}

const PointCloud = ({ positions}: Props) => {
    const POINT_SIZE = 0.1;
  
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    const count = positions.length / 3;
    
    geo.setAttribute('position', new Float32BufferAttribute(positions, 3));

    const { minZ, maxZ } = getZRange();
    const colors = new Float32Array(count * 3);
    const zRange = maxZ - minZ;

    for (let i = 0; i < count; i++) {
      const stride = i * 3;
      const z = positions[stride + 2];
      const normalizedZ = (z - minZ) / zRange;
      const [r, g, b] = heightColor(normalizedZ);

      colors[stride] = r;
      colors[stride + 1] = g;
      colors[stride + 2] = b;
    }
    
    geo.setAttribute('color', new Float32BufferAttribute(colors, 3));

    return geo;
  }, [positions]);

  return (
    <points geometry={geometry}>
      <pointsMaterial size={POINT_SIZE} vertexColors sizeAttenuation />
    </points>
  )
};

export default PointCloud;