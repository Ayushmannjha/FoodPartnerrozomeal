import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Send } from "lucide-react";
import { registerFoodPartner, type FoodPartner } from "@/services/auth";

export function PartnerForm() {
  const [formData, setFormData] = useState<FoodPartner>({
    name: "",
    email: "",
    phone: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleInputChange = (field: keyof FoodPartner, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(''); // Clear error when user starts typing
    setSuccess(''); // Clear success message
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await registerFoodPartner(formData);
      setSuccess("✅ Registration successful! Your account has been created.");
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        phone: "",
        password: ""
      });
    } catch (error) {
      console.error('Registration failed:', error);
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
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3">
              <p className="text-green-600 text-sm">{success}</p>
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
            />
          </div>
          <div>
            <Label htmlFor="password">Password *</Label>
            <Input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              required
              disabled={isLoading}
              placeholder="Create a secure password"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
            {!isLoading && <Send className="ml-2 h-5 w-5" />}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
