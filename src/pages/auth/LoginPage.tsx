import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as loginService } from '@/services/auth';

interface LoginFormData {
  email: string;
  password: string;
}

interface LocationState {
  from?: {
    pathname: string;
  };
}

export function LoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState };
  const { login } = useAuth();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Call the loginService function from auth.ts
      const token = await loginService(formData.email, formData.password);
      
      // Update auth context with the token
      login(token);
      
      // Navigate to intended page or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add this to your LoginPage.tsx for testing
  const debugLogin = async () => {
    console.log('=== DEBUG LOGIN START ===');
    
    // Check what the server actually returns
    try {
      const response = await fetch('/api/auth/login?email=test@example.com&password=password123', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      console.log('Raw response status:', response.status);
      console.log('Raw response headers:', Object.fromEntries(response.headers.entries()));
      
      const rawToken = await response.text();
      console.log('Raw token received:', rawToken);
      console.log('Token length:', rawToken.length);
      console.log('Token parts:', rawToken.split('.').length);
      
    } catch (error) {
      console.error('Debug login failed:', error);
    }
    
    console.log('=== DEBUG LOGIN END ===');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>
          <p className="text-gray-600 mt-2">
            Sign in to your Rozomeal account
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
              disabled={isLoading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-700 text-black py-3 rounded-md font-semibold disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link 
              to="/"
              className="text-orange-600 hover:text-orange-700 font-medium"
            >
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
