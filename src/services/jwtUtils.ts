import { jwtDecode } from 'jwt-decode';
import { JWTPayload, TokenValidation } from '../types/jwt';

export class JWTUtils {
  /**
   * Decode JWT token and return payload
   */
  static decode(token: string): JWTPayload | null {
    try {
      if (!token || typeof token !== 'string') {
        console.warn('Invalid token provided to decode:', typeof token);
        return null;
      }
      
      return jwtDecode<JWTPayload>(token);
    } catch (error) {
      console.error('Failed to decode JWT token:', error);
      return null;
    }
  }

  /**
   * Extract user ID from token - Based on your JWT structure
   */
  static getUserId(token: string): string | null {
    try {
      const payload = this.decode(token);
      if (!payload) {
        console.error('Cannot decode token to extract user ID');
        return null;
      }

      // Based on your JWT payload: use 'id' field first, then 'sub' as fallback
      const userId = payload.id || payload.sub;
      
      console.log('Extracted user ID from token:', {
        id: payload.id,
        sub: payload.sub,
        finalUserId: userId
      });

      return userId || null;
    } catch (error) {
      console.error('Error extracting user ID from token:', error);
      return null;
    }
  }

  /**
   * Extract partner ID from token (same as user ID for food partners)
   */
  static getPartnerId(token: string): string | null {
    try {
      const payload = this.decode(token);
      if (!payload) return null;

      // For food partners, the partner ID is the same as user ID
      const partnerId = payload.id || payload.sub;
      console.log('Extracted partner ID from token:', partnerId);
      
      return partnerId || null;
    } catch (error) {
      console.error('Error extracting partner ID from token:', error);
      return null;
    }
  }

  /**
   * Check if user is a food partner
   */
  static isFoodPartner(token: string): boolean {
    try {
      const payload = this.decode(token);
      return payload?.role === 'FOOD-PARTNER';
    } catch {
      return false;
    }
  }

  /**
   * Check if token is expired - Handle tokens without expiration
   */
  static isExpired(token: string): boolean {
    try {
      const payload = this.decode(token);
      if (!payload) {
        return true; // Can't decode = expired
      }
      
      // If no exp field, consider token as non-expiring (valid)
      if (!payload.exp) {
        console.log('Token has no expiration field - treating as non-expiring');
        return false; // No expiration = not expired
      }
      
      const currentTime = Date.now() / 1000;
      const isExpired = payload.exp < currentTime;
      console.log('Token expiration check:', {
        exp: payload.exp,
        currentTime,
        expired: isExpired,
        expiresAt: new Date(payload.exp * 1000)
      });
      
      return isExpired;
    } catch (error) {
      console.error('Error checking token expiration:', error);
      return true;
    }
  }

  /**
   * Validate token completely - Handle tokens without expiration
   */
  static validate(token: string): TokenValidation {
    if (!token || typeof token !== 'string') {
      return {
        isValid: false,
        isExpired: true,
        payload: null,
        error: 'Token is missing or invalid type'
      };
    }

    // Check basic JWT format
    const parts = token.split('.');
    if (parts.length !== 3) {
      return {
        isValid: false,
        isExpired: true,
        payload: null,
        error: 'Invalid JWT format'
      };
    }

    try {
      const payload = this.decode(token);
      
      if (!payload) {
        return {
          isValid: false,
          isExpired: true,
          payload: null,
          error: 'Could not decode token payload'
        };
      }

      const isExpired = this.isExpired(token);
      
      return {
        isValid: !isExpired,
        isExpired,
        payload,
        error: isExpired ? 'Token has expired' : undefined
      };
    } catch (error) {
      return {
        isValid: false,
        isExpired: true,
        payload: null,
        error: error instanceof Error ? error.message : 'Unknown validation error'
      };
    }
  }

  /**
   * Get time until token expires (in seconds) - Handle tokens without expiration
   */
  static getTimeToExpiry(token: string): number | null {
    try {
      const payload = this.decode(token);
      if (!payload) {
        return null;
      }
      
      // If no exp field, return a large number (token doesn't expire)
      if (!payload.exp) {
        return Number.MAX_SAFE_INTEGER; // Effectively never expires
      }
      
      const currentTime = Date.now() / 1000;
      return Math.max(0, payload.exp - currentTime);
    } catch {
      return null;
    }
  }

  /**
   * Get user info from token (safe version) - Updated for your JWT structure
   */
  static getUserInfo(token: string): Partial<JWTPayload> | null {
    try {
      const payload = this.decode(token);
      if (!payload) return null;

      return {
        sub: payload.sub,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        id: payload.id,
        phone: payload.phone,
        iat: payload.iat
      };
    } catch (error) {
      console.warn('Could not extract user info from token:', error);
      return null;
    }
  }

  /**
   * Get complete user profile from token
   */
  static getUserProfile(token: string): {
    id: string;
    email: string;
    name: string;
    role: string;
    phone?: string;
  } | null {
    try {
      const payload = this.decode(token);
      if (!payload || !payload.id) return null;

      return {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        role: payload.role,
        phone: payload.phone
      };
    } catch (error) {
      console.error('Error getting user profile from token:', error);
      return null;
    }
  }
}