import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { isLoggedIn, logout as logoutService, getCurrentUserProfile } from '../services/auth';
import { TokenManager } from '../utils/tokenManager';
import type { User } from '../types/user';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  foodPartnerId: string | null;
  login: (token: string, userData?: User) => Promise<void>;
  logout: () => void;
  loading: boolean;
  refreshProfile: () => Promise<User | null>;
  refreshAuth: () => Promise<void>;
  tokenInfo: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokenInfo, setTokenInfo] = useState<any>(null);

  // 🎯 Extract foodPartnerId from user object
  const foodPartnerId = user?.id || null;

  // 🎯 Helper function to decode JWT and create user object
  const createUserFromToken = (token: string): User | null => {
    try {
      // Decode JWT payload
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      
      const payload = JSON.parse(jsonPayload);
      console.log('🔓 Decoded JWT payload:', payload);
      
      // Create user object from JWT payload
      const userData: User = {
        id: payload.id || payload.sub || payload.userId,
        name: payload.name,
        email: payload.email,
        phone: payload.phone,
        role: payload.role,
        address: payload.address,
        city: payload.city,
        state: payload.state,
        licenseNumber: payload.licenseNumber,
        certifications: payload.certifications,
        pincode: payload.pincode,
        chatId: payload.chatId || null
      };
      
      console.log('👤 Created user object:', userData);
      return userData;
    } catch (error) {
      console.error('❌ Error decoding JWT:', error);
      return null;
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const loggedIn = isLoggedIn();
        console.log('🔍 Auth check - logged in:', loggedIn);
        
        if (loggedIn) {
          const token = TokenManager.getToken();
          console.log('🎫 Token available:', !!token);
          
          if (token) {
            // 🎯 Decode token and create user object
            const userData = createUserFromToken(token);
            
            if (userData && userData.id) {
              console.log('✅ User data extracted from token:', userData);
              setUser(userData);
              setIsAuthenticated(true);
            } else {
              console.error('❌ Failed to extract user data from token');
              setIsAuthenticated(false);
              setUser(null);
              TokenManager.removeToken();
            }
          }
        } else {
          setIsAuthenticated(false);
          setUser(null);
          setTokenInfo(null);
        }
      } catch (error) {
        console.error('❌ Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
        setTokenInfo(null);
        TokenManager.removeToken();
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (token: string, userData?: User) => {
    console.log('🚪 AuthContext login called');
    
    if (!token || token.trim() === '') {
      throw new Error('No token provided');
    }
    
    // Store token
    TokenManager.setToken(token);
    setIsAuthenticated(true);
    
    if (userData) {
      // Use provided user data
      console.log('👤 Using provided user data:', userData);
      setUser(userData);
    } else {
      // 🎯 Extract user data from token
      const extractedUser = createUserFromToken(token);
      if (extractedUser) {
        console.log('👤 User data extracted from token:', extractedUser);
        setUser(extractedUser);
      } else {
        console.error('❌ Failed to extract user from token');
        throw new Error('Invalid token format');
      }
    }
  };

  const logout = () => {
    console.log('🚪 Logout called');
    logoutService();
    setIsAuthenticated(false);
    setUser(null);
    setTokenInfo(null);
  };

  const refreshProfile = async (): Promise<User | null> => {
    if (isAuthenticated && TokenManager.hasValidToken()) {
      const profileResult = await getCurrentUserProfile();
      if (profileResult.success && profileResult.data) {
        setUser(profileResult.data);
        return profileResult.data;
      } else {
        if (profileResult.error?.includes('Authentication')) {
          logout();
        }
        return null;
      }
    }
    return null;
  };

  const refreshAuth = async () => {
    console.log('🔄 refreshAuth called - fetching updated profile from API');
    
    if (!isAuthenticated || !TokenManager.hasValidToken()) {
      console.warn('⚠️ Cannot refresh: not authenticated or no valid token');
      return;
    }

    try {
      // Fetch the updated profile from the API
      const profileResult = await getCurrentUserProfile();
      
      if (profileResult.success && profileResult.data) {
        console.log('✅ Profile refreshed successfully:', {
          id: profileResult.data.id,
          pincode: profileResult.data.pincode,
          name: profileResult.data.name
        });
        setUser(profileResult.data);
      } else {
        console.error('❌ Failed to refresh profile:', profileResult.error);
      }
    } catch (error) {
      console.error('❌ Error refreshing auth:', error);
    }
  };

  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        user, 
        foodPartnerId,
        login, 
        logout, 
        loading,
        refreshProfile,
        refreshAuth,
        tokenInfo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
