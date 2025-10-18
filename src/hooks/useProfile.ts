import { useState, useCallback } from 'react';
import { getCurrentUserProfile, updateUserProfile } from '../services/auth';
import { useAuth } from '../context/AuthContext';
import { TokenManager } from '../utils/tokenManager';
import type { User } from '../types/user';

export function useProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, login } = useAuth();

  const fetchProfile = useCallback(async () => {
    if (!user?.id) {
      setError('User ID not available');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('📥 Fetching user profile...');
      const result = await getCurrentUserProfile();
      
      if (result.success && result.data) {
        console.log('✅ Profile fetched successfully:', result.data);
        return result.data;
      } else {
        setError(result.error || 'Failed to fetch profile');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch profile';
      setError(errorMessage);
      console.error('❌ Error fetching profile:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const updateProfile = useCallback(async (profileData: Partial<User>): Promise<User | null> => {
    setLoading(true);
    setError(null);

    try {
      console.log('� ========== PROFILE UPDATE FLOW START ==========');
      console.log('   �📝 Updating profile with data:', profileData);
      console.log('   🔍 Has pincode change:', 'pincode' in profileData);
      if ('pincode' in profileData) {
        console.log('   📍 Old pincode from current user:', user?.pincode);
        console.log('   📍 New pincode in update:', profileData.pincode);
      }
      console.log('==================================================');
      
      // Step 1: Update profile on backend
      const updateResult = await updateUserProfile(profileData);
      
      if (!updateResult.success) {
        throw new Error(updateResult.error || 'Failed to update profile');
      }
      
      console.log('✅ Step 1: Profile updated on backend');

      // Step 2: Fetch NEW JWT token with updated data
      console.log('🔄 Step 2: Fetching new JWT token from profile API...');
      const profileResult = await getCurrentUserProfile();
      
      if (!profileResult.success || !profileResult.token) {
        throw new Error('Failed to get new token after profile update');
      }

      const newToken = profileResult.token;
      const userData = profileResult.data!;

      console.log('✅ Step 2: Received new JWT token');
      console.log('   📦 Token (first 20 chars):', newToken.substring(0, 20) + '...');

      // Step 3: Save new token to localStorage
      console.log('💾 Step 3: Saving new token to localStorage...');
      TokenManager.setToken(newToken);
      console.log('✅ Step 3: Token saved to localStorage');

      // Step 4: Update AuthContext with new token
      console.log('🔄 Step 4: Updating AuthContext with new token...');
      await login(newToken, userData);
      console.log('✅ Step 4: AuthContext updated');

      console.log('🎉 ========== PROFILE UPDATE COMPLETE ==========');
      console.log('   ✅ Backend updated');
      console.log('   ✅ New token received');
      console.log('   ✅ Token saved to localStorage');
      console.log('   ✅ AuthContext refreshed');
      console.log('   🎯 WebSocket should now reconnect with new pincode');
      console.log('==================================================');

      return userData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update profile';
      setError(errorMessage);
      console.error('❌ ========== PROFILE UPDATE FAILED ==========');
      console.error('   Error:', err);
      console.error('   Message:', errorMessage);
      console.error('==============================================');
      return null;
    } finally {
      setLoading(false);
    }
  }, [user?.pincode, login]);

  return {
    loading,
    error,
    fetchProfile,
    updateProfile,
    clearError: () => setError(null)
  };
}