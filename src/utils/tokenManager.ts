import { JWTUtils } from '../services/jwtUtils';
import { JWTPayload } from '../types/jwt';
import { User } from '../types/user';

export class TokenManager {
  private static readonly TOKEN_KEY = 'token';
  private static readonly REFRESH_TOKEN_KEY = 'refreshToken';

  /**
   * Store token in localStorage
   */
  static setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Get token from localStorage
   */
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Remove token from localStorage
   */
  static removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Check if user has valid token (used after login)
   */
  static hasValidToken(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // During login, we might have a token that hasn't been validated yet
    // So let's be more lenient here
    try {
      const validation = JWTUtils.validate(token);
      if (!validation.isValid) {
        console.log('Token validation failed:', validation.error);
        // Don't auto-remove during login process
        return false;
      }
      return true;
    } catch (error) {
      console.error('Token validation error:', error);
      return false;
    }
  }

  /**
   * Get user payload from stored token
   */
  static getUserPayload(): JWTPayload | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      return JWTUtils.decode(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  /**
   * Check if token will expire soon (within 5 minutes)
   */
  static willExpireSoon(): boolean {
    const token = this.getToken();
    if (!token) return true;

    const timeToExpiry = JWTUtils.getTimeToExpiry(token);
    return timeToExpiry !== null && timeToExpiry < 300; // 5 minutes
  }

  /**
   * Get user profile from stored token (handles missing fields gracefully)
   */
  static getUserProfileFromToken(): User | null {
    try {
      const token = this.getToken();
      if (!token || !this.hasValidToken()) {
        return null;
      }

      const payload = JWTUtils.decode(token);
      if (!payload || !payload.id) {
        return null;
      }

      console.log('TokenManager: Raw JWT payload:', payload);

      // Convert JWT payload to User object - handle missing fields
      const userProfile: User = {
        id: payload.id,
        name: payload.name || '',
        email: payload.email || '',
        role: payload.role || '',
        // Handle optional fields that might not exist in initial JWT
        phone: payload.phone || undefined,
        licenseNumber: payload.licenseNumber || undefined,
        address: payload.address || undefined,
        state: payload.state || undefined,
        city: payload.city || undefined,
        certifications: payload.certifications || undefined,
        isActive: true
      };

      console.log('TokenManager: Converted User profile:', userProfile);
      console.log('TokenManager: Has profile fields?', {
        hasPhone: !!payload.phone,
        hasLicense: !!payload.licenseNumber,
        hasAddress: !!payload.address,
        hasState: !!payload.state,
        hasCity: !!payload.city,
        hascertifications: !!payload.certifications
      });

      return userProfile;
    } catch (error) {
      console.error('Error getting user profile from token:', error);
      return null;
    }
  }

  /**
   * Check if stored token has profile data (basic info)
   */
  static hasProfileData(): boolean {
    const profile = this.getUserProfileFromToken();
    return profile !== null && !!profile.id;
  }

  /**
   * Check if stored token has complete profile data (including optional fields)
   */
  static hasCompleteProfileData(): boolean {
    const payload = this.getUserPayload();
    if (!payload) return false;

    return !!(payload.id && 
             payload.name && 
             payload.email && 
             payload.phone && 
             payload.licenseNumber && 
             payload.address);
  }

  /**
   * Update token after profile update (when backend returns new JWT)
   */
  static updateTokenAfterProfileUpdate(newToken: string): void {
    console.log('TokenManager: Updating token after profile update');
    this.setToken(newToken);
    
    // Log the new token's payload to verify updated fields
    const newPayload = this.getUserPayload();
    console.log('TokenManager: New token payload:', newPayload);
  }
}