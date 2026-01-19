/**
 * Custom Validation Functions for Mobile App
 * No external dependencies - pure TypeScript validators
 */

export interface ValidationError {
    field: string;
    message: string;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): ValidationError | null {
    if (!email) {
        return null; // Email is optional
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return {
            field: 'email',
            message: 'Invalid email format',
        };
    }

    return null;
}

/**
 * Validate username
 */
export function validateUsername(username: string): ValidationError | null {
    if (!username) {
        return {
            field: 'username',
            message: 'Username is required',
        };
    }

    if (username.length < 3) {
        return {
            field: 'username',
            message: 'Username must be at least 3 characters long',
        };
    }

    if (username.length > 30) {
        return {
            field: 'username',
            message: 'Username cannot exceed 30 characters',
        };
    }

    // Only alphanumeric and underscore
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return {
            field: 'username',
            message: 'Username can only contain letters, numbers, and underscores',
        };
    }

    return null;
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): ValidationError | null {
    if (!password) {
        return {
            field: 'password',
            message: 'Password is required',
        };
    }

    if (password.length < 8) {
        return {
            field: 'password',
            message: 'Password must be at least 8 characters long',
        };
    }

    if (!/[a-zA-Z]/.test(password)) {
        return {
            field: 'password',
            message: 'Password must contain at least one letter',
        };
    }

    if (!/[0-9]/.test(password)) {
        return {
            field: 'password',
            message: 'Password must contain at least one number',
        };
    }

    return null;
}

/**
 * Validate full name
 */
export function validateFullName(fullName: string): ValidationError | null {
    if (!fullName) {
        return {
            field: 'fullName',
            message: 'Full name is required',
        };
    }

    if (fullName.length < 2) {
        return {
            field: 'fullName',
            message: 'Full name must be at least 2 characters long',
        };
    }

    if (fullName.length > 100) {
        return {
            field: 'fullName',
            message: 'Full name cannot exceed 100 characters',
        };
    }

    // No special characters except space, hyphen, and apostrophe
    if (!/^[a-zA-Z\s'-]+$/.test(fullName)) {
        return {
            field: 'fullName',
            message: 'Full name can only contain letters, spaces, hyphens, and apostrophes',
        };
    }

    return null;
}

/**
 * Validate password confirmation
 */
export function validatePasswordConfirmation(
    password: string,
    confirmPassword: string
): ValidationError | null {
    if (!confirmPassword) {
        return {
            field: 'confirmPassword',
            message: 'Please confirm your password',
        };
    }

    if (password !== confirmPassword) {
        return {
            field: 'confirmPassword',
            message: 'Passwords do not match',
        };
    }

    return null;
}

/**
 * Validate phone number (optional, basic format)
 */
export function validatePhoneNumber(phoneNumber: string): ValidationError | null {
    if (!phoneNumber) {
        return null; // Phone is optional
    }

    // Remove spaces and dashes
    const cleaned = phoneNumber.replace(/[\s-]/g, '');

    if (!/^[0-9+]+$/.test(cleaned)) {
        return {
            field: 'phoneNumber',
            message: 'Phone number can only contain digits, spaces, dashes, and plus sign',
        };
    }

    if (cleaned.length < 10) {
        return {
            field: 'phoneNumber',
            message: 'Phone number must be at least 10 digits',
        };
    }

    if (cleaned.length > 15) {
        return {
            field: 'phoneNumber',
            message: 'Phone number cannot exceed 15 digits',
        };
    }

    return null;
}

/**
 * Validate birth date format (YYYY-MM-DD)
 */
export function validateBirthDate(birthDate: string): ValidationError | null {
    if (!birthDate) {
        return null; // Birth date is optional
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthDate)) {
        return {
            field: 'birthDate',
            message: 'Birth date must be in YYYY-MM-DD format',
        };
    }

    // Check if date is valid
    const date = new Date(birthDate);
    if (isNaN(date.getTime())) {
        return {
            field: 'birthDate',
            message: 'Invalid birth date',
        };
    }

    // Check if birth date is not in future
    if (date > new Date()) {
        return {
            field: 'birthDate',
            message: 'Birth date cannot be in the future',
        };
    }

    // Check if age is reasonable (at least 13 years old)
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    if (age < 13) {
        return {
            field: 'birthDate',
            message: 'You must be at least 13 years old',
        };
    }

    return null;
}

/**
 * Validate registration form
 */
export interface RegistrationFormData {
    username: string;
    password: string;
    confirmPassword: string;
    fullName: string;
    email?: string;
    phoneNumber?: string;
    birthDate?: string;
}

export function validateRegistrationForm(formData: RegistrationFormData): ValidationError[] {
    const errors: ValidationError[] = [];

    // Validate username
    const usernameError = validateUsername(formData.username);
    if (usernameError) errors.push(usernameError);

    // Validate password
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.push(passwordError);

    // Validate password confirmation
    const confirmPasswordError = validatePasswordConfirmation(
        formData.password,
        formData.confirmPassword
    );
    if (confirmPasswordError) errors.push(confirmPasswordError);

    // Validate full name
    const fullNameError = validateFullName(formData.fullName);
    if (fullNameError) errors.push(fullNameError);

    // Validate email (optional)
    if (formData.email) {
        const emailError = validateEmail(formData.email);
        if (emailError) errors.push(emailError);
    }

    // Validate phone number (optional)
    if (formData.phoneNumber) {
        const phoneError = validatePhoneNumber(formData.phoneNumber);
        if (phoneError) errors.push(phoneError);
    }

    // Validate birth date (optional)
    if (formData.birthDate) {
        const birthDateError = validateBirthDate(formData.birthDate);
        if (birthDateError) errors.push(birthDateError);
    }

    return errors;
}
