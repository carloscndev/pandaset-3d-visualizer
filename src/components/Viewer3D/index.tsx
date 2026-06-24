import { useRef } from 'react'
import { Canvas, useFrame, useThree  } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei';
import { Cuboid } from '../../types'
import PointCloud from '../PointCloud';
import Cuboids from '../Cuboids';
import { useControls } from '../../hooks/useControls';
interface Props {
  positions: Float32Array
  cuboids: Cuboid[]
  onCuboidHover?: (cuboid: Cuboid | null) => void
}

const SPEED = 50
const ROTATION_SPEED = 1.5

const CameraController = () => {
  const { camera } = useThree()
  const controls = useControls()
  const yaw = useRef(0)

  useFrame((_, delta) => {
    const c = controls.current

    if (c.rotateLeft) yaw.current += ROTATION_SPEED * delta
    if (c.rotateRight) yaw.current -= ROTATION_SPEED * delta

    const forward = [Math.sin(yaw.current), 0, Math.cos(yaw.current)] as const
    const right = [Math.cos(yaw.current), 0, -Math.sin(yaw.current)] as const

    let dx = 0, dy = 0, dz = 0

    if (c.forward) { dx += forward[0]; dz += forward[2] }
    if (c.backward) { dx -= forward[0]; dz -= forward[2] }
    if (c.right) { dx += right[0]; dz += right[2] }
    if (c.left) { dx -= right[0]; dz -= right[2] }
    if (c.up) dy += 1
    if (c.down) dy -= 1

    const len = Math.sqrt(dx * dx + dz * dz)
    if (len > 0) { dx /= len; dz /= len }

    camera.position.x += dx * SPEED * delta
    camera.position.y += dy * SPEED * delta
    camera.position.z += dz * SPEED * delta

    camera.lookAt(camera.position.x + forward[0], camera.position.y, camera.position.z + forward[2])
  })

  return null
}

const Viewer3D = ({ positions, cuboids, onCuboidHover }: Props) => (
  <Canvas
    style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
    camera={{ position: [0, 0, 150], fov: 75 }}
  >
    <OrbitControls />
    <CameraController />
    <PointCloud positions={positions} />
    <Cuboids cuboids={cuboids} onHover={onCuboidHover} />
  </Canvas>
);

export default Viewer3D;
