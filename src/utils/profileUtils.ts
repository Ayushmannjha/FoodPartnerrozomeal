import type { User } from '../types/user';
import { JWTUtils } from '../services/jwtUtils';

export const profileUtils = {
  /**
   * Parse profile data from various sources (JWT token or User object)
   */
  parseProfileData: (profile: any): User | null => {
    // Check if we received a JWT token instead of User object
    if (typeof profile === 'string' && profile.includes('.')) {
      try {
        const decodedProfile = JWTUtils.decode(profile);
        
        if (decodedProfile && decodedProfile.id) {
          // Type assertion for extended JWT payload
          const extendedPayload = decodedProfile as any;
          return {
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
        }
      } catch (error) {
        console.error('Failed to decode JWT:', error);
        return null;
      }
    } else if (profile && typeof profile === 'object') {
      return profile;
    }
    
    return null;
  },

  /**
   * Calculate profile completion percentage
   */
  calculateCompletion: (user: User | null): number => {
    if (!user) return 0;
    
    const fields = ['name', 'email', 'phone', 'licenseNumber', 'state', 'city', 'address'];
    const filledFields = fields.filter(field => user[field as keyof User]);
    
    return Math.round((filledFields.length / fields.length) * 100);
  },

  /**
   * Get user's initials for avatar display
   */
  getUserInitials: (user: User | null): string => {
    if (!user?.name) return 'U';
    
    return user.name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  },

  /**
   * Validate required fields
   */
  validateRequiredFields: (formData: Partial<User>): string[] => {
    const requiredFields = ['name', 'email'];
    const missingFields: string[] = [];
    
    requiredFields.forEach(field => {
      if (!formData[field as keyof User]) {
        missingFields.push(field);
      }
    });
    
    return missingFields;
  }
};
