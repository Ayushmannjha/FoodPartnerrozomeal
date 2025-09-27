import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useProfile } from '../../hooks/useProfile';
import type { User } from '../../types/user';
import { JWTUtils } from '../../services/jwtUtils';

// Icons (you can replace these with actual icon components from your UI library)
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LicenseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const CertificationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

interface ProfileCardProps {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  isEditing?: boolean;
}

const ProfileCard = ({ title, icon, children, isEditing }: ProfileCardProps) => (
  <div className={`bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-200 ${isEditing ? 'ring-2 ring-blue-500 ring-opacity-20' : 'hover:shadow-md'}`}>
    <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
      <div className="flex items-center space-x-3">
        <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
          {icon}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
    </div>
    <div className="p-6">
      {children}
    </div>
  </div>
);

interface InputFieldProps {
  label: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  icon?: React.ReactNode;
  isTextarea?: boolean;
  rows?: number;
}

const InputField = ({ 
  label, 
  name, 
  value, 
  onChange, 
  type = "text", 
  placeholder, 
  required, 
  icon,
  isTextarea = false,
  rows = 3
}: InputFieldProps) => (
  <div className="space-y-2">
    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
      {icon && <span className="text-gray-400">{icon}</span>}
      <span>{label} {required && <span className="text-red-500">*</span>}</span>
    </label>
    {isTextarea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
      />
    ) : (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      />
    )}
  </div>
);

interface DisplayFieldProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  verified?: boolean;
}

const DisplayField = ({ label, value, icon, verified }: DisplayFieldProps) => (
  <div className="space-y-2">
    <label className="flex items-center space-x-2 text-sm font-medium text-gray-500">
      {icon && <span className="text-gray-400">{icon}</span>}
      <span>{label}</span>
      {verified && (
        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          <CheckIcon />
          <span className="ml-1">Verified</span>
        </span>
      )}
    </label>
    <p className="text-gray-900 font-medium">{value || 'Not provided'}</p>
  </div>
);

export function ProfilePage() {
  const { user, refreshProfile } = useAuth();
  const { loading, error, updateProfile, fetchProfile, clearError } = useProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({});
  const [profileData, setProfileData] = useState<User | null>(null);

  // Fetch profile data when component mounts
  useEffect(() => {
    const loadProfile = async () => {
      const profile = await fetchProfile();
      
      // Check if we received a JWT token instead of User object
      if (typeof profile === 'string' && (profile as string).includes('.')) {
        try {
          const decodedProfile = JWTUtils.decode(profile);
          
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
            setProfileData(userProfile);
          }
        } catch (error) {
          console.error('Failed to decode JWT:', error);
          setProfileData(null);
        }
      } else if (profile && typeof profile === 'object') {
        setProfileData(profile);
      } else {
        setProfileData(null);
      }
    };

    loadProfile();
  }, [fetchProfile]);

  // Pre-fill form data whenever profile data changes
  useEffect(() => {
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
  }, [profileData, user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    const updatedUser = await updateProfile(formData);
    if (updatedUser) {
      // Handle if update returns JWT token
      if (typeof updatedUser === 'string' && (updatedUser as string).includes('.')) {
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
          console.error('Failed to decode updated JWT:', error);
        }
      } else {
        setProfileData(updatedUser);
      }
      
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
        pincode: currentUser.pincode || 0
      });
    }
    setIsEditing(false);
    clearError();
  };

  const displayUser = profileData || user;

  // Calculate profile completion
  const getProfileCompletion = () => {
    if (!displayUser) return 0;
    const fields = ['name', 'email', 'phone', 'licenseNumber', 'state', 'city', 'address'];
    const filledFields = fields.filter(field => displayUser[field as keyof User]);
    return Math.round((filledFields.length / fields.length) * 100);
  };

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

  const profileCompletion = getProfileCompletion();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile-friendly header */}
      <div className="bg-transparent shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-gray-900">Profile</h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`inline-flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                isEditing 
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200' 
                  : 'bg-blue-600 text-black hover:bg-blue-700 shadow-sm'
              }`}
            >
              <EditIcon />
              <span className="ml-2">{isEditing ? 'Cancel' : 'Edit'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl text-black p-6 mb-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-10"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-4">
              <div className="h-20 w-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-2xl font-bold">
                {displayUser.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold">{displayUser.name || 'User Name'}</h2>
                <p className="text-blue-100 text-lg">{displayUser.role || 'Food Partner'}</p>
                <div className="flex items-center mt-2">
                  <div className="flex-1 bg-white bg-opacity-20 rounded-full h-2 mr-3">
                    <div 
                      className="bg-white h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${profileCompletion}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium">{profileCompletion}% Complete</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-red-800">{error}</p>
              </div>
              <div className="ml-auto">
                <button 
                  onClick={clearError}
                  className="text-red-600 hover:text-red-800 transition-colors"
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information Card */}
            <ProfileCard title="Personal Information" icon={<UserIcon />} isEditing={isEditing}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="Full Name"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  required
                  icon={<UserIcon />}
                />
                <InputField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your email"
                  required
                  icon={<EmailIcon />}
                />
                <InputField
                  label="Phone"
                  name="phone"
                  type="tel"
                  value={formData.phone || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your phone number"
                  icon={<PhoneIcon />}
                />
              </div>
            </ProfileCard>

            {/* Professional Details Card */}
            <ProfileCard title="Professional Details" icon={<LicenseIcon />} isEditing={isEditing}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputField
                  label="License Number"
                  name="licenseNumber"
                  value={formData.licenseNumber || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your license number"
                  icon={<LicenseIcon />}
                />
                <InputField
                  label="Certifications"
                  name="certifications"
                  value={formData.certifications || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your certifications"
                  icon={<CertificationIcon />}
                />
              </div>
            </ProfileCard>

            {/* Location Information Card */}
            <ProfileCard title="Location Information" icon={<LocationIcon />} isEditing={isEditing}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <InputField
                  label="State"
                  name="state"
                  value={formData.state || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your state"
                  icon={<LocationIcon />}
                />
                <InputField
                  label="City"
                  name="city"
                  value={formData.city || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your city"
                  icon={<LocationIcon />}
                />
                <InputField
                  label="Pincode"
                  name="pincode"
                  type="number"
                  value={formData.pincode || ''}
                  onChange={handleInputChange}
                  placeholder="Enter your pincode"
                />
              </div>
              <InputField
                label="Address"
                name="address"
                value={formData.address || ''}
                onChange={handleInputChange}
                placeholder="Enter your full address"
                isTextarea
                rows={3}
              />
            </ProfileCard>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 pt-6">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="w-full sm:w-auto px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-black rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
            {/* Personal Information Card */}
            <ProfileCard title="Personal Information" icon={<UserIcon />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DisplayField
                  label="Full Name"
                  value={displayUser.name || 'Not provided'}
                  icon={<UserIcon />}
                  verified={!!displayUser.name}
                />
                <DisplayField
                  label="Email"
                  value={displayUser.email || 'Not provided'}
                  icon={<EmailIcon />}
                  verified={!!displayUser.email}
                />
                <DisplayField
                  label="Role"
                  value={displayUser.role || 'Food Partner'}
                  icon={<UserIcon />}
                />
                <DisplayField
                  label="Phone"
                  value={displayUser.phone || 'Not provided'}
                  icon={<PhoneIcon />}
                  verified={!!displayUser.phone}
                />
              </div>
            </ProfileCard>

            {/* Professional Details Card */}
            <ProfileCard title="Professional Details" icon={<LicenseIcon />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DisplayField
                  label="License Number"
                  value={displayUser.licenseNumber || 'Not provided'}
                  icon={<LicenseIcon />}
                  verified={!!displayUser.licenseNumber}
                />
                <DisplayField
                  label="Certifications"
                  value={displayUser.certifications || 'Not provided'}
                  icon={<CertificationIcon />}
                />
              </div>
            </ProfileCard>

            {/* Location Information Card */}
            <ProfileCard title="Location Information" icon={<LocationIcon />}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <DisplayField
                  label="State"
                  value={displayUser.state || 'Not provided'}
                  icon={<LocationIcon />}
                />
                <DisplayField
                  label="City"
                  value={displayUser.city || 'Not provided'}
                  icon={<LocationIcon />}
                />
                <DisplayField
                  label="Pincode"
                  value={displayUser.pincode || 'Not provided'}
                />
              </div>
              <DisplayField
                label="Address"
                value={displayUser.address || 'Not provided'}
              />
            </ProfileCard>
          </div>
        )}
      </div>
    </div>
  );
}
