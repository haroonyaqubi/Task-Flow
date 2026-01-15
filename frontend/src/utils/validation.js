/**
 * Shared validation functions for forms
 * Helps avoid repeating the same validation logic in multiple places
 */


// Validate email format
export const validateEmail = (email) => {
  if (!email) return "email est requis.";
  if (!/\S+@\S+\.\S+/.test(email)) return "Veuillez entrer une adresse e-mail valide.";
  return "";
};

// Validate required field
export const validateRequired = (value, fieldName) => {
  if (!value?.trim()) return `${fieldName} est requis.`;
  return "";
};


// Validate password length
export const validatePassword = (password) => {
  if (!password) return "Le mot de passe est requis.";
  if (password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères.";
  return "";
};

