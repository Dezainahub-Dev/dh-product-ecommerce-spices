export interface ValidationError {
  field: string;
  message: string;
}

export const validators = {
  email: (value: string): string | null => {
    if (!value) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return null;
  },

  password: (value: string): string | null => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return null;
  },

  firstName: (value: string): string | null => {
    if (!value) return "First name is required";
    if (value.length < 2) return "First name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(value)) return "First name can only contain letters";
    return null;
  },

  lastName: (value: string): string | null => {
    if (!value) return "Last name is required";
    if (value.length < 2) return "Last name must be at least 2 characters";
    if (!/^[a-zA-Z\s]+$/.test(value)) return "Last name can only contain letters";
    return null;
  },

  phone: (value: string): string | null => {
    if (!value) return null; // Phone is optional
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(value.replace(/[\s-]/g, ''))) {
      return "Please enter a valid phone number in E.164 format (e.g., +1234567890)";
    }
    return null;
  },

  required: (value: string, fieldName: string): string | null => {
    if (!value || value.trim() === "") return `${fieldName} is required`;
    return null;
  },
};

export function validateForm(
  fields: Record<string, string>,
  rules: Record<string, (value: string) => string | null>
): Record<string, string> {
  const errors: Record<string, string> = {};

  Object.keys(rules).forEach((field) => {
    const error = rules[field](fields[field] || "");
    if (error) {
      errors[field] = error;
    }
  });

  return errors;
}
