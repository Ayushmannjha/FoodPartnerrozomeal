import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import type { User } from '../../types/user';
import { JWTUtils } from '../../services/jwtUtils';

export  function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const { loading, error, updateProfile, fetchProfile, clearError } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [profileData, setProfileData] = useState<User | null>(null);

  // Fetch profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      console.log('🔄 Loading profile data...');
      const profile = await fetchProfile();
      console.log('📋 Profile data received:', profile);
      console.log('📋 Profile data type:', typeof profile);
      
      // Check if we received a JWT token instead of User object
      if (typeof profile === 'string' && (profile as string).includes('.')) {
        console.log('🔧 Received JWT token, decoding...');
        try {
          const decodedProfile = JWTUtils.decode(profile);
          console.log('🔓 Decoded JWT:', decodedProfile);
          
          if (decodedProfile && decodedProfile.id) {
            // Type assertion for extended JWT payload
            const extendedPayload = decodedProfile as any;
            const userProfile: User = {
              id: decodedProfile.id,
              name: decodedProfile.name || '',
              email: decodedProfile.email || '',
              role: decodedProfile.role || '',
              phone: decodedProfile.phone || '',
              licenseNumber: extendedPayload.licenseNumber || '',
              address: extendedPayload.address || '',
              state: extendedPayload.state || '',
              city: extendedPayload.city || '',
              certifications: extendedPayload.certifications || '',
              pincode: extendedPayload.pincode || 0,
              isActive: true
            };
            console.log('✅ Converted to User object:', userProfile);
            setProfileData(userProfile);
          }
        } catch (error) {
          console.error('❌ Failed to decode JWT:', error);
          setProfileData(null);
        }
      } else if (profile && typeof profile === 'object') {
        // Already a User object
        console.log('✅ Received User object directly');
        setProfileData(profile);
      } else {
        console.log('❌ Invalid profile data received');
        setProfileData(null);
      }
    };

    loadProfile();
  }, [fetchProfile]);

  // Pre-fill form data whenever profile data changes
  useEffect(() => {
    const currentUser = profileData || user;
    if (currentUser) {
      console.log('📝 Pre-filling form with User object:', currentUser);
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        licenseNumber: currentUser.licenseNumber || '',
        state: currentUser.state || '',
        city: currentUser.city || '',
        certifications: currentUser.certifications || '',
        address: currentUser.address || '',
        pincode: currentUser.pincode || 0
      });
    }
  }, [profileData, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    console.log('💾 Updating profile with:', formData);
    const updatedUser = await updateProfile(formData);
    if (updatedUser) {
      console.log('✅ Profile updated successfully:', updatedUser);
      
      // Handle if update returns JWT token
      if (typeof updatedUser === 'string' && (updatedUser as string).includes('.')) {
        console.log('🔧 Update returned JWT token, decoding...');
        try {
          const decodedUpdated = JWTUtils.decode(updatedUser as string);
          if (decodedUpdated && decodedUpdated.id) {
            // Type assertion for extended JWT payload
            const extendedPayload = decodedUpdated as any;
            const userProfile: User = {
              id: decodedUpdated.id,
              name: decodedUpdated.name || '',
              email: decodedUpdated.email || '',
              role: decodedUpdated.role || '',
              phone: decodedUpdated.phone || '',
              licenseNumber: extendedPayload.licenseNumber || '',
              address: extendedPayload.address || '',
              state: extendedPayload.state || '',
              city: extendedPayload.city || '',
              certifications: extendedPayload.certifications || '',
              pincode: extendedPayload.pincode || 0,
              isActive: true
            };
            setProfileData(userProfile);
          }
        } catch (error) {
          console.error('❌ Failed to decode updated JWT:', error);
        }
      } else {
        setProfileData(updatedUser);
      }
      
      await refreshProfile();
      setIsEditing(false);
      console.log('✅ Profile update complete!');
    } else {
      console.error('❌ Profile update failed');
    }
  };

  const handleCancelEdit = () => {
    const currentUser = profileData || user;
    if (currentUser) {
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        licenseNumber: currentUser.licenseNumber || '',
        state: currentUser.state || '',
        city: currentUser.city || '',
        certifications: currentUser.certifications || '',
        address: currentUser.address || '',
        pincode: currentUser.pincode || 0
      });
    }
    setIsEditing(false);
    clearError();
  };

  const displayUser = profileData || user;

  if (!displayUser) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-lg">Loading profile...</div>
          {loading && <div className="text-sm text-gray-500 mt-2">Fetching profile data...</div>}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800">{error}</p>
              <button 
                onClick={clearError}
                className="mt-2 text-sm text-red-600 hover:text-red-800"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Debug info */}
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-xs">
            <p><strong>Debug Info:</strong></p>
            <p>Profile Data: {profileData ? '✅ Loaded' : '❌ Not loaded'}</p>
            <p>Auth User: {user ? '✅ Available' : '❌ Not available'}</p>
            <p>Display User: {displayUser ? `✅ ${displayUser.name}` : '❌ None'}</p>
            <p>Display User ID: {displayUser?.id || 'No ID'}</p>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    placeholder="Enter phone number"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">License Number</label>
                  <input
                    type="text"
                    name="licenseNumber"
                    value={formData.licenseNumber || ''}
                    onChange={handleInputChange}
                    placeholder="Enter license number"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">State</label>
                  <input
                    type="text"
                    name="state"
                    value={formData.state || ''}
                    onChange={handleInputChange}
                    placeholder="Enter state"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city || ''}
                    onChange={handleInputChange}
                    placeholder="Enter city"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">certifications</label>
                  <input
                    type="text"
                    name="certifications"
                    value={formData.certifications || ''}
                    onChange={handleInputChange}
                    placeholder="Enter certifications details"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="address"
                    value={formData.address || ''}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Enter full address"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                  <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">PINCODE</label>
                  <textarea
                    name="pincode"
                    value={formData.pincode || 0}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Enter pincode"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                </div>
              </div>
              

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-4 py-2 bg-blue-600 text-black rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{displayUser.name || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900">{displayUser.email || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <p className="mt-1 text-sm text-gray-900">{displayUser.role || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <p className="mt-1 text-sm text-gray-900">{displayUser.phone || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">License Number</label>
                <p className="mt-1 text-sm text-gray-900">{displayUser.licenseNumber || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">State</label>
                <p className="mt-1 text-sm text-gray-900">{displayUser.state || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">City</label>
                <p className="mt-1 text-sm text-gray-900">{displayUser.city || 'Not provided'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">certifications</label>
                <p className="mt-1 text-sm text-gray-900">{displayUser.certifications || 'Not provided'}</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <p className="mt-1 text-sm text-gray-900">{displayUser.address || 'Not provided'}</p>
              </div>
          
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">PINCODE</label>
                <p className="mt-1 text-sm text-gray-900">{displayUser.pincode || 0}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
