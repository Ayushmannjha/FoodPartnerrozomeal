import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import type { User } from '../../types/user';
import { profileUtils } from '../../utils/profileUtils';
import { getChangedFields } from '../../utils/formUtils';

// Components
import { ProfileHeader } from '../../components/profile/ProfileHeader';
import { ProfileNavigation } from '../../components/profile/ProfileNavigation';
import { ProfileActionButtons } from '../../components/profile/ProfileActionButtons';
import { ErrorMessage } from '../../components/ui/feedback/ErrorMessage';

// Section Components
import { PersonalInfoSection } from '../../components/profile/sections/PersonalInfoSection';
import { ProfessionalSection } from '../../components/profile/sections/ProfessionalSection';
import { LocationSection } from '../../components/profile/sections/LocationSection';

// Form Components
import { PersonalInfoForm } from '../../components/profile/forms/PersonalInfoForm';
import { ProfessionalForm } from '../../components/profile/forms/ProfessionalForm';
import { LocationForm } from '../../components/profile/forms/LocationForm';

export function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const { loading, error, updateProfile, fetchProfile, clearError } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [profileData, setProfileData] = useState<User | null>(null);
  const [originalData, setOriginalData] = useState<Partial<User>>({});

  // Fetch profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      const profile = await fetchProfile();
      const parsedProfile = profileUtils.parseProfileData(profile);
      setProfileData(parsedProfile);
    };

    loadProfile();
  }, [fetchProfile]);

  // Pre-fill form data whenever profile data changes
  useEffect(() => {
    const currentUser = profileData || user;
    if (currentUser) {
      const userData = {
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone || '',
        licenseNumber: currentUser.licenseNumber || '',
        state: currentUser.state || '',
        city: currentUser.city || '',
        certifications: currentUser.certifications || '',
        address: currentUser.address || '',
        pincode: currentUser.pincode || '',
        chatId: currentUser.chatId || ''
      };
      setFormData(userData);
      setOriginalData(userData); // Store original data for comparison
    }
  }, [profileData, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    // Get only the changed fields
    const changedFields = getChangedFields(originalData, formData);
    
    // If no changes, don't make API call
    if (Object.keys(changedFields).length === 0) {
      console.log('⚠️ No changes detected');
      setIsEditing(false);
      return;
    }

    console.log('📝 Sending only changed fields:', changedFields);

    // Warn if pincode is being changed
    if ('pincode' in changedFields && originalData.pincode) {
      const confirmed = window.confirm(
        '⚠️ Changing pincode will reconnect WebSocket to the new area. Continue?'
      );
      if (!confirmed) return;
    }

    const updatedUser = await updateProfile(changedFields);
    if (updatedUser) {
      const parsedUpdatedUser = profileUtils.parseProfileData(updatedUser);
      setProfileData(parsedUpdatedUser);
      await refreshProfile();
      setIsEditing(false);
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
        pincode: currentUser.pincode || '',
        chatId: currentUser.chatId || ''
      });
    }
    setIsEditing(false);
    clearError();
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleCancelEdit();
    } else {
      setIsEditing(true);
    }
  };

  const displayUser = profileData || user;

  if (!displayUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm p-8 text-center max-w-md w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <div className="text-lg font-medium text-gray-900 mb-2">Loading profile...</div>
          {loading && <div className="text-sm text-gray-500">Fetching profile data...</div>}
        </div>
      </div>
    );
  }

  const profileCompletion = profileUtils.calculateCompletion(displayUser);

  return (
    <div className="min-h-screen bg-gray-50">
      <ProfileNavigation isEditing={isEditing} onEditToggle={handleEditToggle} />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ProfileHeader user={displayUser} profileCompletion={profileCompletion} />

        {error && <ErrorMessage message={error} onDismiss={clearError} />}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <PersonalInfoForm formData={formData} onChange={handleInputChange} />
            <ProfessionalForm formData={formData} onChange={handleInputChange} />
            <LocationForm formData={formData} onChange={handleInputChange} />
            <ProfileActionButtons 
              loading={loading} 
              onCancel={handleCancelEdit} 
              onSubmit={handleSubmit} 
            />
          </form>
        ) : (
          <div className="space-y-6">
            <PersonalInfoSection user={displayUser} />
            <ProfessionalSection user={displayUser} />
            <LocationSection user={displayUser} />
          </div>
        )}
      </div>
    </div>
  );
}
