export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  licenseNumber?: string;
  address?: string;
  state?: string;
  isActive?: boolean;
  city?: string;
  certifications?: string;
  pincode:number;
}

export interface ProfileResponse {
  success: boolean;
  data?: User;
  error?: string;
}