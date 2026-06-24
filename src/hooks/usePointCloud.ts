import { useEffect, useState } from "react";
import { DataCloudFrame } from "../types"

const usePointCloud = (url: string) => {
  const [data, setData] = useState<DataCloudFrame | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    
    const loadData = async() => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      } catch(error) {
        if (!cancelled) {
          const message = error instanceof Error ? error.message : String(error);
          setError(message);
          setLoading(false);
        }
      }
    }

    loadData();

    return () => { cancelled = true; };
  }, [url])

  return { data, loading, error };
}

export default usePointCloud;
