/**
 * Pincode Validation Utilities
 * 
 * Provides consistent validation for Indian pincodes across the application.
 * Indian pincode format: 6 digits, first digit must be 1-9
 */

/**
 * Validates if a pincode is valid for Indian postal codes
 * @param pincode - The pincode (string or number) to validate
 * @returns boolean - True if valid, false otherwise
 * 
 * @example
 * isValidPincode("800020") // true
 * isValidPincode(800020) // true
 * isValidPincode("0") // false
 * isValidPincode(0) // false
 * isValidPincode("000000") // false
 * isValidPincode("  ") // false
 */
export function isValidPincode(pincode: string | number | undefined | null): boolean {
  if (pincode === undefined || pincode === null) return false;
  
  // Convert to string if it's a number
  const pincodeStr = typeof pincode === 'number' ? String(pincode) : pincode;
  
  // Remove any whitespace
  const trimmed = pincodeStr.trim();
  
  // Check if empty or whitespace only
  if (trimmed === '') return false;
  
  // Check if it's zero or all zeros
  if (trimmed === '0' || /^0+$/.test(trimmed)) return false;
  
  // Indian pincode regex: starts with 1-9, followed by 5 digits (0-9)
  // Total: exactly 6 digits
  const pincodeRegex = /^[1-9][0-9]{5}$/;
  
  return pincodeRegex.test(trimmed);
}

/**
 * Checks if a pincode is invalid or missing (inverse of isValidPincode)
 * @param pincode - The pincode (string or number) to check
 * @returns boolean - True if invalid/missing, false if valid
 * 
 * @example
 * needsPincodeSetup("800020") // false
 * needsPincodeSetup(800020) // false
 * needsPincodeSetup("0") // true
 * needsPincodeSetup(0) // true
 * needsPincodeSetup(null) // true
 */
export function needsPincodeSetup(pincode: string | number | undefined | null): boolean {
  return !isValidPincode(pincode);
}

/**
 * Formats a pincode for display
 * @param pincode - The pincode string to format
 * @returns string - Formatted pincode or 'Not Set'
 * 
 * @example
 * formatPincode("800020") // "800020"
 * formatPincode("0") // "Not Set"
 * formatPincode(null) // "Not Set"
 */
export function formatPincode(pincode: string | undefined | null): string {
  if (needsPincodeSetup(pincode)) {
    return 'Not Set';
  }
  return pincode!.trim();
}

/**
 * Sanitizes pincode input (removes non-digits, limits to 6 characters)
 * Use this in onChange handlers for pincode input fields
 * @param input - The raw input string
 * @returns string - Sanitized pincode (digits only, max 6)
 * 
 * @example
 * sanitizePincodeInput("800-020") // "800020"
 * sanitizePincodeInput("abc123") // "123"
 * sanitizePincodeInput("1234567890") // "123456"
 */
export function sanitizePincodeInput(input: string): string {
  // Remove all non-digit characters
  const digitsOnly = input.replace(/\D/g, '');
  
  // Limit to 6 digits
  return digitsOnly.slice(0, 6);
}

/**
 * Gets a user-friendly error message for invalid pincode
 * @param pincode - The pincode string to validate
 * @returns string - Error message, or empty string if valid
 * 
 * @example
 * getPincodeError("0") // "Pincode cannot be 0 or all zeros"
 * getPincodeError("12345") // "Pincode must be exactly 6 digits"
 * getPincodeError("800020") // ""
 */
export function getPincodeError(pincode: string | undefined | null): string {
  if (!pincode) {
    return 'Pincode is required';
  }
  
  const trimmed = pincode.trim();
  
  if (trimmed === '') {
    return 'Pincode cannot be empty';
  }
  
  if (trimmed === '0' || /^0+$/.test(trimmed)) {
    return 'Pincode cannot be 0 or all zeros';
  }
  
  if (trimmed.length !== 6) {
    return 'Pincode must be exactly 6 digits';
  }
  
  if (!/^\d+$/.test(trimmed)) {
    return 'Pincode must contain only digits';
  }
  
  if (!/^[1-9]/.test(trimmed)) {
    return 'Pincode cannot start with 0';
  }
  
  return ''; // Valid
}
