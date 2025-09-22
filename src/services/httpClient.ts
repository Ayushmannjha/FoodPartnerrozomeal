import { TokenManager } from '../utils/tokenManager';
import { JWTUtils } from './jwtUtils';

class HttpClient {
  private baseURL = '/api';

  private getHeaders(): HeadersInit {
    const token = TokenManager.getToken();
    
    console.log('Token check:', {
      hasToken: !!token,
      isValid: token ? JWTUtils.validate(token).isValid : false
    });

    if (token && JWTUtils.validate(token).isValid) {
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
    }

    // If token is invalid or expired, remove it
    if (token) {
      TokenManager.removeToken();
    }

    return {
      'Content-Type': 'application/json'
    };
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Check token before making request
    const token = TokenManager.getToken();
    // Fix: Provide default values for TokenValidation properties
    const tokenValidation = token ? JWTUtils.validate(token) : { 
      isValid: false, 
      isExpired: true, 
      payload: null 
    };
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.getHeaders(),
        ...options.headers
      }
    };

    console.log('HTTP Request:', {
      method: config.method || 'GET',
      url,
      hasToken: !!token,
      tokenValid: tokenValidation.isValid,
      tokenExpired: tokenValidation.isExpired,
      headers: config.headers
    });

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.log('Auth failed, removing token and redirecting');
          TokenManager.removeToken();
          window.location.href = '/login';
          throw new Error('Authentication required');
        }
        
        const errorText = await response.text();
        throw new Error(errorText || `HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text() as T;
      }
    } catch (error) {
      console.error('HTTP Request failed:', error);
      throw error;
    }
  }

  get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined
    });
  }

  delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const httpClient = new HttpClient();