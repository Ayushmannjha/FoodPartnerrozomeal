// src/services/api.ts

import { httpClient } from './httpClient';
import { TokenManager } from '../utils/tokenManager';
import { JWTUtils } from './jwtUtils';
import { User, ProfileResponse } from '../types/user';

// Add missing FoodPartner type
export interface FoodPartner {
  name: string;
  email: string;
  phone: string;
  password: string;
  restaurantName?: string;
  address?: string;
  licenseNumber?: string;
  state?: string;
  city?: string;
  certifications?: string;
  id?: string;
}

export const API_BASE_URL = "https://api.rozomeal.com";

// ===== Generic Request Function =====
async function request<T>(
  endpoint: string,
  method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
  body: unknown = null,
  auth: boolean = true
): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };

  console.log("Request debug:", { endpoint, method, auth, body });
  console.log("Full URL will be:", `${API_BASE_URL}${endpoint}`);

  if (auth) {
    const token = TokenManager.getToken();
    console.log("Token check:", { auth, token: token ? "exists" : "none" });
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  console.log("Final headers:", headers);
  console.log("Request body:", body);

  const options: RequestInit = { method, headers };
  if (body) options.body = JSON.stringify(body);

  console.log("Full fetch options:", options);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    console.log("Response status:", response.status);
    console.log(
      "Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || `HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    } else {
      return await response.text() as T;
    }
  } catch (error) {
    console.error('Request completely failed:', error);
    throw error;
  }
}

// ===== Auth Helpers ===== (Only one logout function)
export function isLoggedIn(): boolean {
  return TokenManager.hasValidToken();
}

export function logout(): void {
  console.log('Logging out...');
  
  setTimeout(() => {
    TokenManager.removeToken();
    localStorage.clear();
    window.location.reload();
  }, 800);
}

// ===== Fixed Login Function =====
export async function login(email: string, password: string): Promise<string> {
  console.log('Attempting login for:', email);
  
  try {
    const response = await fetch(
      `${API_BASE_URL}/auth/login?email=${encodeURIComponent(
        email
      )}&password=${encodeURIComponent(password)}`,
      { 
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    console.log('Login response status:', response.status);

    if (!response.ok) {
      const errorMessage = await response.text();
      console.error('Login failed with status:', response.status, 'Message:', errorMessage);
      throw new Error(errorMessage || 'Login failed');
    }

    const token = await response.text();
    console.log('Received token from server:', token ? 'Token received' : 'No token');
    
    // Basic validation - just check if token exists and looks like JWT
    if (!token || token.trim() === '') {
      throw new Error('No token received from server');
    }
    
    // Basic JWT format check (should have 3 parts separated by dots)
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) {
      console.error('Invalid token format - not a proper JWT:', token);
      throw new Error('Invalid token format received from server');
    }

    // Optional: Try to decode the token to see its contents (for debugging)
    try {
      const decoded = JWTUtils.decode(token);
      console.log('Token decoded successfully:', {
        user: decoded?.name || 'Unknown',
        email: decoded?.email || 'Unknown',
        exp: decoded?.exp ? new Date(decoded.exp * 1000) : 'No expiry'
      });
    } catch (decodeError) {
      console.warn('Could not decode token for debugging:', decodeError);
      // Don't throw error here - maybe the token format is different
    }

    console.log('Login successful, storing token');
    TokenManager.setToken(token);
    
    return token;
  } catch (error) {
    console.error('Login process failed:', error);
    throw error;
  }
}

// ===== Updated Profile Functions with Query Parameters =====

/**
 * GET Current User Profile - Uses /food-partner/profile?id={userId}
 */
export async function getCurrentUserProfile(): Promise<ProfileResponse> {
  try {
    const token = TokenManager.getToken();
    console.log('Profile fetch - token exists:', !!token);
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Extract user ID from token
    const userId = JWTUtils.getUserId(token);
    console.log('Extracted user ID for profile:', userId);

    if (!userId) {
      throw new Error('Could not extract user ID from token');
    }
    
    if (!TokenManager.hasValidToken()) {
      throw new Error('No valid authentication token found');
    }

    // GET profile endpoint with query parameter
    console.log('Making profile request to:', `/food-partner/profile?id=${userId}`);
    const profileData = await httpClient.get<User>(`/food-partner/profile?id=${userId}`);
    
    return {
      success: true,
      data: profileData
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * UPDATE User Profile - Handles backend returning "Updated" string
 */
export async function updateUserProfile(profileData: Partial<User>): Promise<ProfileResponse> {
  try {
    const token = TokenManager.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    const userId = JWTUtils.getUserId(token);
    if (!userId) {
      throw new Error('Could not extract user ID from token');
    }

    console.log('Updating profile for user ID:', userId);
    console.log('Update data:', profileData);
    
    const responseData = await httpClient.put<string>(`/food-partner/update?id=${userId}`, profileData);
    
    console.log('=== UPDATE RESPONSE DEBUG ===');
    console.log('Raw response:', responseData);
    console.log('Response type:', typeof responseData);
    console.log('=== END DEBUG ===');
    
    // Handle backend response
    if (typeof responseData === 'string') {
      if (responseData === 'Updated') {
        console.log('✅ Backend confirmed update successful');
        
        // Since backend only returns "Updated", we need to fetch the updated profile
        const updatedProfile = await getCurrentUserProfile();
        
        if (updatedProfile.success && updatedProfile.data) {
          console.log('✅ Got updated profile after successful update:', updatedProfile.data);
          return updatedProfile;
        } else {
          // Fallback: return current profile from token
          const tokenProfile = TokenManager.getUserProfileFromToken();
          if (tokenProfile) {
            console.log('✅ Using profile from token as fallback:', tokenProfile);
            return {
              success: true,
              data: tokenProfile
            };
          } else {
            throw new Error('Profile updated but could not retrieve updated data');
          }
        }
      } else if (responseData === 'Some went wrong') {
        throw new Error('Backend reported: Something went wrong');
      } else if (responseData.includes('.')) {
        // Handle JWT token response (in case backend changes to return JWT)
        console.log('Backend returned JWT token, decoding...');
        
        const decodedProfile = JWTUtils.decode(responseData);
        if (decodedProfile && decodedProfile.id) {
          const userProfile: User = {
            id: decodedProfile.id,
            name: decodedProfile.name || '',
            email: decodedProfile.email || '',
            role: decodedProfile.role || '',
            phone: decodedProfile.phone || undefined,
            licenseNumber: decodedProfile.licenseNumber || undefined,
            address: decodedProfile.address || undefined,
            state: decodedProfile.state || undefined,
            city: decodedProfile.city || undefined,
            certifications: decodedProfile.certifications || undefined,
            isActive: true
          };
          
          return {
            success: true,
            data: userProfile
          };
        } else {
          throw new Error('Invalid JWT in update response');
        }
      } else {
        throw new Error(`Unexpected response: ${responseData}`);
      }
    } else {
      throw new Error(`Invalid response format: ${typeof responseData}`);
    }
    
  } catch (error) {
    console.error('❌ Error updating profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * GET Food Partner Profile by ID - Uses /food-partner/profile?id={partnerId}
 */
export async function getFoodPartnerProfile(partnerId?: string): Promise<ProfileResponse> {
  try {
    const token = TokenManager.getToken();
    
    if (!token) {
      throw new Error('No authentication token found');
    }

    // If no partnerId provided, extract from token
    let targetPartnerId = partnerId;
    if (!targetPartnerId) {
      targetPartnerId = JWTUtils.getPartnerId(token) ?? JWTUtils.getUserId(token) ?? undefined;
    }

    console.log('Getting food partner profile for ID:', targetPartnerId);

    if (!targetPartnerId) {
      throw new Error('Could not determine partner ID');
    }
    
    if (!TokenManager.hasValidToken()) {
      throw new Error('No valid authentication token found');
    }

    // GET profile endpoint with query parameter
    const profileData = await httpClient.get<User>(`/food-partner/profile?id=${targetPartnerId}`);
    
    return {
      success: true,
      data: profileData
    };
  } catch (error) {
    console.error('Error fetching food partner profile:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

// Register Food Partner
export function registerFoodPartner(user: FoodPartner) {
  return request<{ message: string }>("/auth/register-food-partner", "POST", user, false);
}

// Test function that mimics Postman exactly
export async function registerFoodPartnerDirect(
  user: FoodPartner
): Promise<{ success: boolean; message: string }> {
  console.log("Testing direct registration like Postman:", user);

  try {
    const response = await fetch(`${API_BASE_URL}/auth/register-food-partner`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      throw new Error(errorMessage || 'Registration failed');
    }

    const result = await response.text();
    return {
      success: true,
      message: result
    };
  } catch (error) {
    console.error('Registration failed:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}
