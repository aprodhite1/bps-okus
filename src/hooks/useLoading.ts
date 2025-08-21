import { useState, useCallback } from 'react';

export function useLoading(initialState = false) {
  const [loading, setLoading] = useState(initialState);
  const [progress, setProgress] = useState(0);

  const startLoading = useCallback(() => {
    setLoading(true);
    setProgress(0);
  }, []);

  const stopLoading = useCallback(() => {
    setLoading(false);
    setProgress(100);
    // Reset progress after a delay
    setTimeout(() => setProgress(0), 300);
  }, []);

  const setProgressValue = useCallback((value: number) => {
    setProgress(Math.min(100, Math.max(0, value)));
  }, []);

  return {
    loading,
    progress,
    startLoading,
    stopLoading,
    setProgressValue
  };
}