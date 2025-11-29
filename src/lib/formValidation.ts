/**
 * Form Validation Utilities
 * Handles validation logic for contact form
 */

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  service?: string;
  email?: string;
  description?: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: FormErrors;
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validates the entire contact form
 */
export function validateContactForm(formData: {
  firstName: string;
  lastName: string;
  service: string;
  email: string;
  description: string;
}): ValidationResult {
  const errors: FormErrors = {};

  // Email validation (required)
  if (!formData.email || formData.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!isValidEmail(formData.email.trim())) {
    errors.email = "Please enter a valid email address";
  }

  // Description validation (required, minimum length)
  if (!formData.description || formData.description.trim() === "") {
    errors.description = "Project description is required";
  } else if (formData.description.trim().length < 10) {
    errors.description = "Description must be at least 10 characters";
  }

  // First Name validation (optional but recommended)
  if (formData.firstName.trim().length > 0 && formData.firstName.trim().length < 2) {
    errors.firstName = "First name must be at least 2 characters";
  }

  // Last Name validation (optional but recommended)
  if (formData.lastName.trim().length > 0 && formData.lastName.trim().length < 2) {
    errors.lastName = "Last name must be at least 2 characters";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Validates a single field
 */
export function validateField(
  name: string,
  value: string
): string | undefined {
  switch (name) {
    case "email":
      if (!value || value.trim() === "") {
        return "Email is required";
      }
      if (!isValidEmail(value.trim())) {
        return "Please enter a valid email address";
      }
      return undefined;

    case "description":
      if (!value || value.trim() === "") {
        return "Project description is required";
      }
      if (value.trim().length < 10) {
        return "Description must be at least 10 characters";
      }
      return undefined;

    case "firstName":
      if (value.trim().length > 0 && value.trim().length < 2) {
        return "First name must be at least 2 characters";
      }
      return undefined;

    case "lastName":
      if (value.trim().length > 0 && value.trim().length < 2) {
        return "Last name must be at least 2 characters";
      }
      return undefined;

    default:
      return undefined;
  }
}

