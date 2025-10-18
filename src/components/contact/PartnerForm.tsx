import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Send, AlertTriangle, CheckCircle, Info, Eye, EyeOff } from "lucide-react";
import { registerFoodPartner, type FoodPartner } from "../../services/auth";

// Password validation requirements
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

interface PartnerFormProps {
  onSuccess?: () => void; // Optional callback for modal usage
}

export function PartnerForm({ onSuccess }: PartnerFormProps = {}) {
  const navigate = useNavigate(); // Add navigation hook
  const [formData, setFormData] = useState<FoodPartner>({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  // Check password validity
  const validatePassword = (password: string): string[] => {
    const errors = [];
    
    if (password.length < PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }
    
    if (!/\d/.test(password)) {
      errors.push("Password must contain at least one number");
    }
    
    if (!/[@$!%*?&]/.test(password)) {
      errors.push("Password must contain at least one special character (@$!%*?&)");
    }
    
    return errors;
  };

  const handleInputChange = (field: keyof FoodPartner, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (field === "password") {
      setPasswordErrors(validatePassword(value));
    }
    
    setError(''); // Clear error when user starts typing
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setError('');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(prev => !prev);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(prev => !prev);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate passwords match
    if (formData.password !== confirmPassword) {
      setError("❌ Passwords don't match");
      return;
    }
    
    // Validate password strength
    const errors = validatePassword(formData.password);
    if (errors.length > 0) {
      setPasswordErrors(errors);
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('🔄 Starting registration...');
      await registerFoodPartner(formData);
      
      console.log('✅ Registration successful!');
      setSuccess("✅ Registration successful! Redirecting to login page...");
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: ""
      });
      setConfirmPassword("");
      setPasswordErrors([]);
      setShowPassword(false);
      setShowConfirmPassword(false);
      
      // Wait 2 seconds to show success message, then navigate
      setTimeout(() => {
        console.log('🔄 Navigating to login page...');
        
        // If used in a modal with onSuccess callback, call it
        if (onSuccess) {
          onSuccess();
        } else {
          // Otherwise, navigate to login page directly
          navigate('/login', { 
            state: { 
              registrationSuccess: true,
              email: formData.email // Pre-fill email on login page
            } 
          });
        }
      }, 2000);
      
    } catch (error) {
      console.error('❌ Registration failed:', error);
      const errorMessage = error instanceof Error ? error.message : 'Registration failed. Please try again.';
      setError(`❌ ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-xl max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Food Partner Registration</CardTitle>
        <p className="text-gray-600">Register your account to get started.</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start">
              <AlertTriangle className="text-red-600 mr-2 h-5 w-5 mt-0.5" />
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-start">
              <CheckCircle className="text-green-600 mr-2 h-5 w-5 mt-0.5" />
              <div>
                <p className="text-green-600 text-sm font-medium">{success}</p>
                <p className="text-green-600 text-xs mt-1">
                  Please login to complete your profile with address and pincode.
                </p>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter your full name"
            />
          </div>
          <div>
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter your email address"
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              required
              disabled={isLoading}
              placeholder="Enter your phone number"
              pattern="[0-9]{10}"
              title="Please enter a valid 10-digit phone number"
            />
            <p className="text-xs text-gray-500 mt-1">Enter 10-digit phone number without country code</p>
          </div>
          <div>
            <Label htmlFor="password">Password *</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
                disabled={isLoading}
                placeholder="Create a secure password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
              >
                {showPassword ? 
                  <EyeOff className="h-5 w-5" aria-label="Hide password" /> : 
                  <Eye className="h-5 w-5" aria-label="Show password" />
                }
              </button>
            </div>
            {passwordErrors.length > 0 && (
              <div className="mt-2 text-xs space-y-1">
                {passwordErrors.map((error, index) => (
                  <p key={index} className="text-amber-600 flex items-center">
                    <Info className="h-3 w-3 mr-1" />
                    {error}
                  </p>
                ))}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="confirmPassword">Confirm Password *</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Re-enter your password"
                className="pr-10"
              />
              <button
                type="button"
                onClick={toggleConfirmPasswordVisibility}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                tabIndex={-1}
              >
                {showConfirmPassword ? 
                  <EyeOff className="h-5 w-5" aria-label="Hide password" /> : 
                  <Eye className="h-5 w-5" aria-label="Show password" />
                }
              </button>
            </div>
            {formData.password && confirmPassword && formData.password !== confirmPassword && (
              <p className="text-red-500 text-xs mt-1">Passwords don't match</p>
            )}
          </div>

          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 disabled:opacity-50"
              disabled={isLoading || (formData.password !== confirmPassword && confirmPassword !== "")}
            >
              {isLoading ? 'Registering...' : 'Register'}
              {!isLoading && <Send className="ml-2 h-5 w-5" />}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
