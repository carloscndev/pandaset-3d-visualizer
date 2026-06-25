import { useEffect, useState, useCallback, useRef } from 'react';
import { FrameCache } from '../utils/FrameCache';
import { DataCloudFrame } from "../types";
import { CONFIG } from '../config';
import { getFrameUrl } from '../utils/index'

const usePointCloud = () => {
  const cacheRef = useRef(new FrameCache());
  const inflightRef = useRef<Map<number, Promise<DataCloudFrame | null>>>(new Map())
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFrame, setCurrentFrame] = useState<DataCloudFrame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

 const fetchFrame = useCallback(async (index: number): Promise<DataCloudFrame | null> => {
    const inflight = inflightRef.current.get(index)
    if (inflight) return inflight

    const promise = (async () => {
      const url = getFrameUrl(index)
      const res = await fetch(url, { signal: AbortSignal.timeout(CONFIG.FETCH_TIMEOUT_MS) })
      if (!res.ok) throw new Error(`Frame ${index}: HTTP ${res.status}`)
      const data = await res.json() as DataCloudFrame
      cacheRef.current.setFrame(data)
      return data
    })().finally(() => {
      inflightRef.current.delete(index)
    })

    inflightRef.current.set(index, promise)
    return promise
  }, [])

  const preFetch = useCallback(async (index: number) => {
    if (index >= CONFIG.TOTAL_FRAMES) return;
    if (cacheRef.current.getFrame(index)) return;
    
    try { 
      await fetchFrame(index);
    } catch (error) {
      console.error(`Failed to prefetch frame ${index}:`, error);
    }
  }, [fetchFrame]);

  const loadFrame = useCallback(async (index: number) => {
    if (index < 0 || index >= CONFIG.TOTAL_FRAMES) return;
    setCurrentIndex(index);
     setError(null);

    const cached = cacheRef.current.getFrame(index);
    if (cached) {
      setCurrentFrame(cached);
      setLoading(false);
      for (let i = 1; i <= CONFIG.PRE_FETCH_COUNT; i++) {
        preFetch(index + i);
      }
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await fetchFrame(index);
      if (data) {
        setCurrentFrame(data);
        setLoading(false);
        for (let i = 1; i <= CONFIG.PRE_FETCH_COUNT; i++) {
          preFetch(index + i);
        }
      } else {
        setError(`Failed to load frame ${index}`);
        setLoading(false);
      }
    } catch(error) {
      const msg = error instanceof Error ? error.message : `Failed to load frame ${index}`
      setError(msg)
      setLoading(false)
    }
  }, [fetchFrame, preFetch]);

  useEffect(() => {
    cacheRef.current.onWarning = (used, max) => console.warn(`[FrameCache] ${used}MB / ${max}MB used`)
    loadFrame(0)
  }, [loadFrame])

  const goNext = useCallback(() => {
    loadFrame(currentIndex + 1);
  }, [currentIndex, loadFrame]);

  const goPrev = useCallback(() => {
    loadFrame(currentIndex - 1);
  }, [currentIndex, loadFrame]);

  return { 
    currentFrame,
    currentIndex,
    totalFrames: CONFIG.TOTAL_FRAMES,
    loading,
    error,
    goNext,
    goPrev,
    loadFrame,
    cache: cacheRef.current
  };
};

export default usePointCloud;
