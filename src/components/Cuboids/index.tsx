import * as THREE from 'three'
import { Cuboid as CuboidType } from '../../types'

interface Props {
  cuboids: CuboidType[]
}

const Cuboids = ({ cuboids }: Props) => {
  return (
    <>
      {cuboids.map((cuboid) => (
        <CuboidBox key={cuboid.uuid} cuboid={cuboid} />
      ))}
    </>
  )
}

export default Cuboids;

const CuboidBox = ({ cuboid }: { cuboid: CuboidType }) => {
  const w = cuboid['dimension.y'];
  const h = cuboid['dimension.z'];
  const d = cuboid['dimension.x'];

  const posX = cuboid['position.x'];
  const posY = cuboid['position.y'];
  const posZ = cuboid['position.z'];

  return (
    <group
      position={[posX, posY, posZ]}
      rotation={[0, -cuboid.yaw, 0]}
    >
      <mesh>
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color='red' transparent opacity={0.3} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
        <lineBasicMaterial color='red' />
      </lineSegments>
    </group>
  )
}
