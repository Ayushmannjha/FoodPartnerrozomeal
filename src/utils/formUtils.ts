/**
 * Form utilities for tracking changes and validation
 */

/**
 * Get only the fields that have changed
 */
export function getChangedFields<T extends Record<string, any>>(
  original: T,
  current: T
): Partial<T> {
  const changes: Partial<T> = {};
  
  for (const key in current) {
    if (current[key] !== original[key]) {
      // Only include if value actually changed and is not empty
      if (current[key] !== '' && current[key] !== null && current[key] !== undefined) {
        changes[key] = current[key];
      }
    }
  }
  
  return changes;
}

/**
 * Validate pincode format
 */
export function validatePincode(pincode: string | null): { valid: boolean; error?: string } {
  if (!pincode) return { valid: true }; // Optional field
  
  const pincodeStr = String(pincode).trim();
  
  if (pincodeStr.length !== 6) {
    return { valid: false, error: 'Pincode must be 6 digits' };
  }
  
  if (!/^\d+$/.test(pincodeStr)) {
    return { valid: false, error: 'Pincode must contain only numbers' };
  }
  
  return { valid: true };
}

/**
 * Validate email format
 */
export function validateEmail(email: string): { valid: boolean; error?: string } {
  if (!email) return { valid: false, error: 'Email is required' };
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  
  return { valid: true };
}

/**
 * Validate phone format
 */
export function validatePhone(phone: string): { valid: boolean; error?: string } {
  if (!phone) return { valid: true }; // Optional field
  
  const phoneStr = String(phone).trim();
  
  if (phoneStr.length < 10) {
    return { valid: false, error: 'Phone must be at least 10 digits' };
  }
  
  if (!/^\d+$/.test(phoneStr)) {
    return { valid: false, error: 'Phone must contain only numbers' };
  }
  
  return { valid: true };
}

/**
 * Validate profile data before submission
 */
export function validateProfileData(data: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (data.email) {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.valid) errors.push(emailValidation.error!);
  }
  
  if (data.phone) {
    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.valid) errors.push(phoneValidation.error!);
  }
  
  if (data.pincode) {
    const pincodeValidation = validatePincode(data.pincode);
    if (!pincodeValidation.valid) errors.push(pincodeValidation.error!);
  }
  
  return { valid: errors.length === 0, errors };
}
