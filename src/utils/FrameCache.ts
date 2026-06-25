import { DataCloudFrame } from '../types';
import { CONFIG } from '../config';

interface FrameEntry {
  frame: DataCloudFrame;
  bytes: number;
  lastAccess: number;
}

export class FrameCache {
  private store = new Map<number, FrameEntry>();
  private disposables = new Map<number, (() => void)[]>();
  private maxBytes: number;
  private warningPct = 0.9;
  onWarning?: (usedMB: number, maxMB: number) => void;

  constructor(maxMB: number = CONFIG.MAX_FRAME_CACHE_MB) {
    this.maxBytes = maxMB * 1024 * 1024;
  }

  get size(): number {
    return this.store.size;
  }

  setFrame(frame: DataCloudFrame): void {
    const bytes = this.estimateFrameBytes(frame);
    const entry: FrameEntry = { frame, bytes, lastAccess: Date.now() };
    const existing = this.store.get(frame.frame_id);
    this.store.set(frame.frame_id, entry);

    if (!existing) {
      this.evictIfNeeded();
    }

    this.checkWarning();
  }

  getFrame(id: number): DataCloudFrame | undefined {
    const entry = this.store.get(id);
    if (entry) {
      entry.lastAccess = Date.now();
      return entry.frame;
    }
    return undefined;
  }

  get totalBytes(): number {
    let sum = 0;
    for (const entry of this.store.values()) {
      sum += entry.bytes;
    }
    return sum;
  }

  get totalMB(): number {
    return Math.round((this.totalBytes / (1024 * 1024)) * 100) / 100;
  }

  get maxMB(): number {
    return Math.round(this.maxBytes / (1024 * 1024));
  }

  private estimateFrameBytes(frame: DataCloudFrame): number {
    let bytes = 0;

    // LiDAR points memory: total points * 3 coordinates (X,Y,Z) * 4 bytes (Float32)
    if (frame.points?.length) {
      bytes += frame.points.length * 3 * 4;
    }

    // 3D Bounding Boxes: average overhead estimation (~200 bytes per cuboid object)
    if (frame.cuboids?.length) {
      bytes += frame.cuboids.length * 200;
    }

    return bytes;
  }

  registerDisposable(frameId: number, dispose: () => void): void {
    const list = this.disposables.get(frameId) || [];
    list.push(dispose);
    this.disposables.set(frameId, list);
  }

  disposeFrame(id: number): void {
    const disposers = this.disposables.get(id);
    if (disposers) {
      for (const dispose of disposers) {
        dispose();
      }
      this.disposables.delete(id);
    }
    this.store.delete(id);
  }

  clear(): void {
    for (const id of [...this.store.keys()]) {
      this.disposeFrame(id);
    }
  }

  private evictIfNeeded(): void {
    while (this.totalBytes > this.maxBytes && this.store.size > 0) {
      let oldestId: number | undefined;
      let oldestTime = Infinity;
      for (const [id, entry] of this.store) {
        if (entry.lastAccess < oldestTime) {
          oldestTime = entry.lastAccess;
          oldestId = id;
        }
      }
      if (oldestId !== undefined) {
        this.disposeFrame(oldestId);
      }
    }
  }

  private checkWarning(): void {
    const usedMB = this.totalMB;
    const maxMB = this.maxMB;
    if (usedMB > maxMB * this.warningPct && this.onWarning) {
      this.onWarning(usedMB, maxMB);
    }
  }
}
