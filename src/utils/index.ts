import { CONFIG } from "../config"
/**
 * Transforms an array of 3D coordinate arrays into a single flat Float32Array.
 * Converts data layout from [ [x1,y1,z1], [x2,y2,z2], ... ] to [ x1,y1,z1, x2,y2,z2, ... ].
 *
 * @param {number[][]} points - Two-dimensional array containing [x, y, z] coordinate vectors.
 * @returns {Float32Array} A continuous, single-precision float array suitable for WebGL/Three.js buffer attributes.
 */
export const parsePoints = (points: number[][]): Float32Array => {
  const flat = new Float32Array(points.length * 3)
  for (let i = 0; i < points.length; i++) {
    flat[i * 3] = points[i][0]
    flat[i * 3 + 1] = points[i][1]
    flat[i * 3 + 2] = points[i][2]
  }
  return flat
}

/**
 * Generates the absolute remote URL for a given frame index.
 * @param index - The frame sequence number.
 * @returns The structured JSON source URL padded with leading zeros.
 */
export const getFrameUrl = (index: number): string => {
  return `${CONFIG.BASE_URL}/frame_${String(index).padStart(2, '0')}.json`;
};