/**
 * Validate an email address format.
 *
 * @param {string} email
 * @returns {string|null} Error message or null if valid.
 */
export function validateEmail(email) {
  if (!email || !email.trim()) return "Email is required.";
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!pattern.test(email)) return "Please enter a valid email address.";
  return null;
}

/**
 * Validate a password.
 *
 * @param {string} password
 * @param {number} minLength - Minimum length (default 6).
 * @returns {string|null} Error message or null if valid.
 */
export function validatePassword(password, minLength = 6) {
  if (!password) return "Password is required.";
  if (password.length < minLength)
    return `Password must be at least ${minLength} characters.`;
  return null;
}

/**
 * Validate a required text field.
 *
 * @param {string} value
 * @param {string} fieldName - Human-readable field name for error messages.
 * @returns {string|null} Error message or null if valid.
 */
export function validateRequired(value, fieldName = "This field") {
  if (!value || !value.trim()) return `${fieldName} is required.`;
  return null;
}

/**
 * Validate a URL format.
 *
 * @param {string} url
 * @returns {string|null} Error message or null if valid.
 */
export function validateUrl(url) {
  if (!url) return null; // URLs are usually optional
  try {
    new URL(url.startsWith("http") ? url : `https://${url}`);
    return null;
  } catch {
    return "Please enter a valid URL.";
  }
}

/**
 * Validate max length of a string.
 *
 * @param {string} value
 * @param {number} max
 * @param {string} fieldName
 * @returns {string|null}
 */
export function validateMaxLength(value, max, fieldName = "This field") {
  if (value && value.length > max)
    return `${fieldName} must be ${max} characters or less.`;
  return null;
}
