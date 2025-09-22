import { useState, useEffect } from 'react';
import { thaliService } from '../services/thaliService';
import { Thali } from '../types/thali';

export const useThaliDetails = (thaliId: string | null) => {
  const [thali, setThali] = useState<Thali | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!thaliId) {
      setThali(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchThaliDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        const thaliData = await thaliService.getThaliDetail(thaliId);
        setThali(thaliData);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch thali details';
        setError(errorMessage);
        setThali(null);
      } finally {
        setLoading(false);
      }
    };

    fetchThaliDetails();
  }, [thaliId]);

  return { thali, loading, error };
};