import { useEffect, useRef } from 'react'

export interface Controls {
  forward: boolean
  backward: boolean
  left: boolean
  right: boolean
  up: boolean
  down: boolean
  rotateLeft: boolean
  rotateRight: boolean
  rotateUp: boolean
  rotateDown: boolean
}

const mapKey = (key: string): keyof Controls | null => {
  const k = key.toLowerCase()
  if (k === 'w') return 'forward'
  if (k === 's') return 'backward'
  if (k === 'a') return 'left'
  if (k === 'd') return 'right'
  if (k === 'q') return 'up'
  if (k === 'e') return 'down'
  if (k === 'arrowleft') return 'rotateLeft'
  if (k === 'arrowright') return 'rotateRight'
  if (k === 'arrowup') return 'rotateUp'
  if (k === 'arrowdown') return 'rotateDown'
  return null
}

export const useControls = () => {
  const state = useRef<Controls>({
    forward: false, backward: false, left: false, right: false,
    up: false, down: false, rotateLeft: false, rotateRight: false,
    rotateUp: false, rotateDown: false,
  })

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const ctrl = mapKey(e.key)
      if (ctrl) state.current[ctrl] = true
    }
    const up = (e: KeyboardEvent) => {
      const ctrl = mapKey(e.key)
      if (ctrl) state.current[ctrl] = false
    }

    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
    }
  }, [])

  return state
}
