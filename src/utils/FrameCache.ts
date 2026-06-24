import { DataCloudFrame } from '../types'

export class FrameCache {
  private store = new Map<number, DataCloudFrame>()

  get size(): number {
    return this.store.size
  }

  setFrame(frame: DataCloudFrame): void {
    this.store.set(frame.frame_id, frame)
  }

  getFrame(id: number): DataCloudFrame | undefined {
    return this.store.get(id)
  }
}
