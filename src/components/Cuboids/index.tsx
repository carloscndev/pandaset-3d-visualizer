import { useState } from 'react'
import * as THREE from 'three'
import { Cuboid as CuboidType } from '../../types'

interface Props {
  cuboids: CuboidType[]
  onHover?: (cuboid: CuboidType | null) => void
}

const Cuboids = ({ cuboids, onHover }: Props) => {
  return (
    <>
      {cuboids.map((cuboid) => (
        <CuboidBox key={cuboid.uuid} cuboid={cuboid} onHover={onHover} />
      ))}
    </>
  )
}

export default Cuboids;

const CuboidBox = ({ cuboid, onHover }: { cuboid: CuboidType, onHover?: (cuboid: CuboidType | null) => void }) => {
    const [hovered, setHovered] = useState<boolean>(false)
  const w = cuboid['dimensions.y'];
  const h = cuboid['dimensions.z'];
  const d = cuboid['dimensions.x'];

  const posX = cuboid['position.x'];
  const posY = cuboid['position.y'];
  const posZ = cuboid['position.z'];

  return (
    <group
      position={[posX, posY, posZ]}
      rotation={[0, -cuboid.yaw, 0]}
    >
      <mesh
         onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover?.(cuboid) }}
        onPointerOut={() => { setHovered(false); onHover?.(null) }}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial color='red' transparent opacity={0.3} opacity={hovered ? 0.7 : 0.25} />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
        <lineBasicMaterial color='red' opacity={hovered ? 1 : 0.5} />
      </lineSegments>
    </group>
  )
}
