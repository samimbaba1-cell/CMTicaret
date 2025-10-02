import { useState, useEffect, useRef } from 'react';

export default function useRateLimit(maxRequests = 5, timeWindow = 60000) {
  const [isLimited, setIsLimited] = useState(false);
  const [remainingRequests, setRemainingRequests] = useState(maxRequests);
  const requestCount = useRef(0);
  const resetTimeout = useRef(null);

  const makeRequest = async (requestFn) => {
    if (isLimited) {
      throw new Error('Çok fazla istek gönderdiniz. Lütfen bekleyin.');
    }

    if (requestCount.current >= maxRequests) {
      setIsLimited(true);
      setRemainingRequests(0);
      
      // Reset after time window
      resetTimeout.current = setTimeout(() => {
        requestCount.current = 0;
        setIsLimited(false);
        setRemainingRequests(maxRequests);
      }, timeWindow);
      
      throw new Error('Çok fazla istek gönderdiniz. Lütfen bekleyin.');
    }

    requestCount.current += 1;
    setRemainingRequests(maxRequests - requestCount.current);

    try {
      const result = await requestFn();
      return result;
    } catch (error) {
      throw error;
    }
  };

  useEffect(() => {
    return () => {
      if (resetTimeout.current) {
        clearTimeout(resetTimeout.current);
      }
    };
  }, []);

  return {
    makeRequest,
    isLimited,
    remainingRequests,
    maxRequests
  };
}
