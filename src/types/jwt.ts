// JWT payload interface - Updated to match your actual JWT structure
export interface JWTPayload {
  sub: string;          // Subject - "testing1234@gmail.com"
  email: string;        // Email - "testing1234@gmail.com"
  name: string;         // Name - "testing1234@gmail.com"
  role: string;         // Role - "FOOD-PARTNER"
  id: string;           // User ID - "f858012e-39ec-4528-ab6d-14099d010e26"
  phone?: string;       // Phone - "09504087951"
  iat?: number;         // Issued at - 1757587876
  exp?: number;         // Expiration time (optional - your tokens don't have this)
  iss?: string;         // Issuer
  aud?: string;         // Audience
}

// Token validation result
export interface TokenValidation {
  isValid: boolean;
  isExpired: boolean;
  payload: JWTPayload | null;
  error?: string;
}