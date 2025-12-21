// Email validation
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

// Phone validation - accepts various formats, requires at least 10 digits
export function isValidPhone(phone: string): boolean {
  if (!phone || phone.trim() === "") return true; // Phone is optional
  const digitsOnly = phone.replace(/\D/g, "");
  return digitsOnly.length >= 10 && digitsOnly.length <= 15;
}

// Format phone for display - converts to (XXX) XXX-XXXX format
export function formatPhone(phone: string): string {
  const digitsOnly = phone.replace(/\D/g, "");
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }
  if (digitsOnly.length === 11 && digitsOnly[0] === "1") {
    return `(${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }
  return phone; // Return as-is if can't format
}

// Validation result type
export interface ValidationErrors {
  email?: string;
  phone?: string;
}

// Validate contact form fields
export function validateContactForm(data: {
  email: string;
  phone?: string;
}): ValidationErrors {
  const errors: ValidationErrors = {};

  if (!isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  if (data.phone && !isValidPhone(data.phone)) {
    errors.phone = "Please enter a valid phone number";
  }

  return errors;
}
