export interface Point {
  x: number
  y: number
  z: number
}

export interface Cuboid {
  uuid: string
  label: string
  yaw: number
  stationary: boolean
  camera_used: number
  'position.x': number
  'position.y': number
  'position.z': number
  'dimension.x': number
  'dimension.y': number
  'dimension.z': number
  'cuboids.sibling_id'?: string
  'cuboids.sensor_id'?: string
}

export interface DataCloudFrame {
  frame_id: number
  points: number[][]
  cuboids: Cuboid[]
}