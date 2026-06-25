import { DataCloudFrame } from '../types';
import { getMaxFrameMB } from '../utils'
import { CONFIG } from '../config';

export type CacheStatus = 'loading' | 'ready' | 'evicted';

export interface FrameEntry {
  frame: DataCloudFrame;
  byteSize: number;
  lastAccess: number;
  status: CacheStatus;
  buffers: { type: 'geometry' | 'typedarray'; byteSize: number; }[];
}

export class FrameCache {
  private store = new Map<number, FrameEntry>();
  private disposables = new Map<number, (() => void)[]>();
  private maxBytes: number;
  private warningPct = CONFIG.WARNING_THRESHOLD;
  onWarning?: (usedMB: number, maxMB: number) => void;

  constructor(maxMB: number = getMaxFrameMB) {
    this.maxBytes = maxMB * 1024 * 1024;
  }

  get size(): number {
    return this.store.size;
  }

  setFrame(frame: DataCloudFrame, extraBuffers?: { type: 'geometry' | 'typedarray'; byteSize: number; }[]): void {
    const baseBytes = this.estimateFrameBytes(frame);
    const buffers = extraBuffers ?? [];
    const extraBytes = buffers.reduce((s, b) => s + b.byteSize, 0);
    
    const entry: FrameEntry = {
      frame,
      byteSize: baseBytes + extraBytes,
      lastAccess: Date.now(),
      status: 'ready',
      buffers,
    };
    
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

  getEntry(id: number): FrameEntry | undefined {
    const entry = this.store.get(id);
    if (entry) {
      entry.lastAccess = Date.now();
    }
    return entry;
  }

  getEntries(): FrameEntry[] {
    return Array.from(this.store.values())
      .map(e => ({ ...e }))
      .sort((a, b) => a.frame.frame_id - b.frame.frame_id);
  }

  get totalBytes(): number {
    let sum = 0;
    for (const entry of this.store.values()) {
      sum += entry.byteSize;
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
