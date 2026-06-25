import { useRef, useEffect } from 'react'
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

const SPEED = 50;
const ROTATION_SPEED = 1.5;
const CLOUD_CENTER: [number, number, number] = [34, 61, 7.5];
const BG_COLOR = '#080d29';

const CameraController = () => {
  const { camera, controls: orbit } = useThree()
  const keys = useControls()
  const yaw = useRef(0)
  const pitch = useRef(0)

  useFrame((_, delta) => {
    const k = keys.current
    let moved = false
    let rotated = false

    if (k.rotateLeft) { yaw.current += ROTATION_SPEED * delta; rotated = true }
    if (k.rotateRight) { yaw.current -= ROTATION_SPEED * delta; rotated = true }
    if (k.rotateUp) { pitch.current = Math.min(Math.PI / 3, pitch.current + ROTATION_SPEED * delta); rotated = true }
    if (k.rotateDown) { pitch.current = Math.max(-Math.PI / 6, pitch.current - ROTATION_SPEED * delta); rotated = true }

    const cosY = Math.cos(yaw.current)
    const sinY = Math.sin(yaw.current)
    const cosP = Math.cos(pitch.current)
    const sinP = Math.sin(pitch.current)

    let dx = 0, dy = 0, dz = 0

    if (k.forward) { dx += sinY * cosP; dy += cosY * cosP; dz -= sinP }
    if (k.backward) { dx -= sinY * cosP; dy -= cosY * cosP; dz += sinP }
    if (k.right) { dx += cosY; dy -= sinY }
    if (k.left) { dx -= cosY; dy += sinY }
    if (k.up) dz += 1
    if (k.down) dz -= 1

    const len = Math.sqrt(dx * dx + dy * dy)
    if (len > 0) { dx /= len; dy /= len }
    if (len > 0 || dz !== 0) moved = true

    if (moved) {
      camera.position.x += dx * SPEED * delta
      camera.position.y += dy * SPEED * delta
      camera.position.z += dz * SPEED * delta
    }

    if (orbit) {
      if (moved) {
        orbit.target.x += dx * SPEED * delta
        orbit.target.y += dy * SPEED * delta
        orbit.target.z += dz * SPEED * delta
      } else if (rotated) {
        const dist = camera.position.distanceTo(orbit.target)
        orbit.target.x = camera.position.x + dist * sinY * cosP
        orbit.target.y = camera.position.y + dist * cosY * cosP
        orbit.target.z = camera.position.z + dist * sinP
      }
      orbit.update()
    }
  })

  return null
};

const CameraSetup = () => {
  const { camera } = useThree()
  useEffect(() => {
    camera.up.set(0, 0, 1)
    camera.lookAt(CLOUD_CENTER[0], CLOUD_CENTER[1], CLOUD_CENTER[2])
  }, [camera])
  return null
}

const Viewer3D = ({ positions, cuboids, onCuboidHover }: Props) => (
  <Canvas
    style={{ width: '100%', height: '100%' }}
    camera={{ position: [CLOUD_CENTER[0] - 280, CLOUD_CENTER[1] - 160, CLOUD_CENTER[2] + 140], fov: 70 }}
  >
    <color attach="background" args={[BG_COLOR]} />
    <OrbitControls makeDefault target={CLOUD_CENTER} />
    <CameraSetup />
    <CameraController />
    <PointCloud positions={positions} />
    <Cuboids cuboids={cuboids} onHover={onCuboidHover} />
  </Canvas>
);

export default Viewer3D;
