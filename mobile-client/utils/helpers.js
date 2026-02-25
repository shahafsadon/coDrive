/**
 * General Utility Functions
 * Used across the app for common operations
 */

// Alert helper - wrap Alert for consistency
export function showAlert(title, message, buttons = [{ text: 'OK', onPress: () => {} }]) {
  // This will be replaced with native Alert import in components
  console.log(`[ALERT] ${title}: ${message}`);
}

// Format date
export function formatDate(date) {
  if (!date) return '';
  if (typeof date === 'string') date = new Date(date);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// Format time
export function formatTime(date) {
  if (!date) return '';
  if (typeof date === 'string') date = new Date(date);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Validate email
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate phone number (simple)
export function isValidPhone(phone) {
  return phone.replace(/\D/g, '').length >= 7;
}

// Debounce helper
export function debounce(func, wait) {
  let timeout;
  return (...args) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Throttle helper
export function throttle(func, limit) {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Deep copy object
export function deepCopy(obj) {
  if (typeof obj !== 'object' || obj === null) return obj;
  if (Array.isArray(obj)) return obj.map(item => deepCopy(item));
  return Object.keys(obj).reduce((acc, key) => {
    acc[key] = deepCopy(obj[key]);
    return acc;
  }, {});
}

// Get error message from API response
export function getErrorMessage(error) {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.data?.error) return error.data.error;
  return 'An unexpected error occurred';
}

// Handle image URI for FormData
export function getImageFormDataValue(imageUri) {
  return {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  };
}
