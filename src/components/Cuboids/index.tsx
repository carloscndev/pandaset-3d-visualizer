import { useState } from 'react'
import * as THREE from 'three'
import { Cuboid as CuboidType } from '../../types'

const FACE_COLOR = '#ff2a85'
const FACE_OPACITY = 0.2
const FACE_HOVER_OPACITY = 0.35
const EDGE_COLOR = '#ff2a85'
const EDGE_OPACITY = 0.8
const EDGE_HOVER_OPACITY = 1
const HOVER_EDGE_COLOR = '#ff73b3'
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
      rotation={[0, 0, -cuboid.yaw]}
    >
      <mesh
        onPointerOver={(e) => { e.stopPropagation(); setHovered(true); onHover?.(cuboid) }}
        onPointerOut={() => { setHovered(false); onHover?.(null) }}
      >
        <boxGeometry args={[w, h, d]} />
        <meshStandardMaterial
          color={FACE_COLOR}
          transparent
          opacity={hovered ? FACE_HOVER_OPACITY : FACE_OPACITY}
          depthWrite={false}
        />
      </mesh>
      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(w, h, d)]} />
        <lineBasicMaterial
          color={hovered ? HOVER_EDGE_COLOR : EDGE_COLOR}
          opacity={hovered ? EDGE_HOVER_OPACITY : EDGE_OPACITY}
          transparent
        />
      </lineSegments>
    </group>
  )
}
