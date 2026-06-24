import { useEffect, useState, useCallback, useRef } from 'react';
import { FrameCache } from '../utils/FrameCache';
import { DataCloudFrame } from "../types";

const baseUrl = 'https://static.scale.com/uploads/pandaset-challenge';
const totalFrames = 50;
const preFetchCount = 2;

const usePointCloud = () => {
  console.log('usePointCloud');
  const cacheRef = useRef(new FrameCache());
  const pendingRef = useRef<Set<number>>(new Set());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentFrame, setCurrentFrame] = useState<DataCloudFrame | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getFrameUrl = (index: number): string => {
    return `${baseUrl}/frame_${String(index).padStart(2, '0')}.json`;
  };

  const fetchFrame = useCallback(async (index: number): Promise<DataCloudFrame | null> => {
    if (pendingRef.current.has(index)) return null;
    pendingRef.current.add(index);

    try {
      const url = getFrameUrl(index);
      console.log(url);
      const response = await fetch(url);
      const data = await response.json();
      console.log(data);
      cacheRef.current.setFrame(data);
      return data;
    } catch (error) {
      console.log(error)
      const message = error instanceof Error ? error.message : String(error);
      setError(message);
      setLoading(false);
      return null;
    } finally {
      console.log('f')
      pendingRef.current.delete(index);
    }
  }, []);

  const preFetch = useCallback(async (index: number) => {
    if (index >= totalFrames) return;
    if (cacheRef.current.getFrame(index)) return;
    
    try { 
      await fetchFrame(index);
    } catch (error) {
      console.error(`Failed to prefetch frame ${index}:`, error);
    }
  }, [fetchFrame]);

  const loadFrame = useCallback(async (index: number) => {
    if (index < 0 || index >= totalFrames) return;
    setCurrentIndex(index);

    const cached = cacheRef.current.getFrame(index);
    if (cached) {
      setCurrentFrame(cached);
      setLoading(false);
      for (let i = 1; i <= preFetchCount; i++) {
        preFetch(index + i);
      }
      return;
    }

    setLoading(true);
    setError(null);

    const data = await fetchFrame(index);
    if (data) {
      setCurrentFrame(data);
      setLoading(false);
      for (let i = 1; i <= preFetchCount; i++) {
        preFetch(index + i);
      }
    } else {
      setError(`Failed to load frame ${index}`);
      setLoading(false);
    }
  }, [fetchFrame, preFetch]);

  useEffect(() => {
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
    totalFrames,
    loading,
    error,
    goNext,
    goPrev,
    loadFrame,
    cache: cacheRef.current
  };
};

export default usePointCloud;
