import { useState, useCallback } from 'react';
import { getCurrentUserProfile, updateUserProfile, getFoodPartnerProfile } from '../services/auth';
import { User } from '../types/user';

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async (): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getCurrentUserProfile();
      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Failed to fetch profile');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData: Partial<User>): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await updateUserProfile(profileData);
      if (result.success && result.data) {
        return result.data;
      } else {
        setError(result.error || 'Failed to update profile');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchPartnerProfile = useCallback(async (id: string): Promise<User | null> => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getFoodPartnerProfile(id);
      
      // Console logging to check if data is null or has data
      console.log('=== getFoodPartnerProfile Result ===');
      console.log('Success:', result.success);
      console.log('Has data:', !!result.data);
      console.log('Data is null:', result.data === null);
      console.log('Data is undefined:', result.data === undefined);
      console.log('Full data:', result.data);
      console.log('Error:', result.error);
      console.log('=== End Result ===');
      
      if (result.success && result.data) {
        console.log('✅ getFoodPartnerProfile returned data:', result.data);
        return result.data;
      } else {
        console.log('❌ getFoodPartnerProfile returned null/undefined or failed');
        setError(result.error || 'Failed to fetch partner profile');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.log('❌ getFoodPartnerProfile threw error:', errorMessage);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchProfile,
    updateProfile,
    fetchPartnerProfile,
    clearError: () => setError(null)
  };
}