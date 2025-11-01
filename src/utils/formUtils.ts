/**
 * Form Utilities for Profile Updates
 * Handles validation and change tracking for profile form data
 */

/**
 * Get only the fields that have changed between original and current data
 * @param original - Original data object
 * @param current - Current/modified data object
 * @returns Object containing only the changed fields
 */
export function getChangedFields<T extends Record<string, any>>(
  original: T,
  current: T
): Partial<T> {
  const changes: Partial<T> = {};

  for (const key in current) {
    // Skip if values are the same
    if (original[key] === current[key]) {
      continue;
    }

    // Handle empty strings vs undefined/null
    const originalValue = original[key] || '';
    const currentValue = current[key] || '';

    if (originalValue !== currentValue) {
      changes[key] = current[key];
    }
  }

  return changes;
}

/**
 * Validate pincode format (6 digits)
 * @param pincode - Pincode to validate
 * @returns true if valid, false otherwise
 */
export function validatePincode(pincode: string): boolean {
  if (!pincode) return true; // Optional field
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode);
}

/**
 * Validate email format
 * @param email - Email to validate
 * @returns true if valid, false otherwise
 */
export function validateEmail(email: string): boolean {
  if (!email) return true; // Optional field
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number format (10+ digits)
 * @param phone - Phone number to validate
 * @returns true if valid, false otherwise
 */
export function validatePhone(phone: string): boolean {
  if (!phone) return true; // Optional field
  const phoneRegex = /^\d{10,}$/;
  return phoneRegex.test(phone.replace(/\D/g, '')); // Remove non-digits before validation
}

/**
 * Validate all profile data fields
 * @param data - Profile data to validate
 * @returns Validation result with errors if any
 */
export function validateProfileData(data: Record<string, any>): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Validate pincode
  if (data.pincode && !validatePincode(data.pincode)) {
    errors.push('Pincode must be 6 digits');
  }

  // Validate email
  if (data.email && !validateEmail(data.email)) {
    errors.push('Invalid email format');
  }

  // Validate phone
  if (data.phone && !validatePhone(data.phone)) {
    errors.push('Phone number must be at least 10 digits');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}
