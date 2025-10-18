import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login as loginService } from '../../services/auth';
import { Alert, AlertDescription } from '../../components/ui/alert';
import { CheckCircle2 } from 'lucide-react';
import {PartnerForm  }from '../../components/contact/PartnerForm';

interface LoginFormData {
  email: string;
  password: string;
}

interface LocationState {
  from?: {
    pathname: string;
  };
  registrationSuccess?: boolean;
  email?: string;
}

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation() as { state?: LocationState };
  const { login } = useAuth();
  
  // Check if coming from registration
  const registrationSuccess = location.state?.registrationSuccess || false;
  const prefilledEmail = location.state?.email || '';
  
  const [formData, setFormData] = useState<LoginFormData>({
    email: prefilledEmail, // Pre-fill email if coming from registration
    password: ''
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(registrationSuccess);

  const from = location.state?.from?.pathname || '/dashboard';

  // Hide success message after 5 seconds
  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setShowSuccessMessage(false);

    try {
      console.log('🔄 Attempting login...');
      // Call the loginService function from auth.ts
      const token = await loginService(formData.email, formData.password);
      
      console.log('✅ Login successful!');
      // Update auth context with the token
      login(token);
      
      // Navigate to intended page or dashboard
      navigate(from, { replace: true });
    } catch (error) {
      console.error('❌ Login failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Login failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
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
          {/* Registration Success Alert */}
          {showSuccessMessage && (
            <Alert className="bg-green-50 border-green-200 animate-fade-in">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              <AlertDescription className="text-green-800 ml-2">
                <p className="font-semibold">Registration Successful! 🎉</p>
                <p className="text-sm mt-1">
                  Welcome to Rozomeal! Please login to complete your profile.
                </p>
              </AlertDescription>
            </Alert>
          )}

          {/* Error Alert */}
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
              autoFocus={!prefilledEmail} // Auto-focus email if not pre-filled
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
              autoFocus={!!prefilledEmail} // Auto-focus password if email is pre-filled
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-orange-600 hover:bg-orange-700 text-black py-3 rounded-md font-semibold disabled:opacity-50 transition-colors"
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
