import * as SecureStore from 'expo-secure-store';
import { logger } from './logger';

// Update with your backend URL
const API_BASE_URL = 'http://192.168.1.100:3000/api'; // Change to your backend URL

/**
 * Generic fetch wrapper with auth token
 */
async function fetchWithAuth(endpoint, options = {}) {
    try {
        const headers = {
            ...options.headers,
        };

        // Add auth token if available
        try {
            const token = await SecureStore.getItemAsync('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (err) {
            logger.error('API', 'Failed to retrieve token from secure storage', err);
        }

        // Set content type for JSON if not FormData
        if (!(options.body instanceof FormData)) {
            headers['Content-Type'] = 'application/json';
        }

        const url = `${API_BASE_URL}${endpoint}`;
        logger.debug('API', `${options.method || 'GET'} ${endpoint}`);

        const response = await fetch(url, {
            ...options,
            headers,
        });

        // Handle response
        let data = null;
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
            try {
                data = await response.json();
            } catch (e) {
                logger.error('API', 'Failed to parse JSON response', e);
                data = {};
            }
        }

        // Check if response is OK
        if (!response.ok) {
            let errorMessage = data?.error || data?.message || `HTTP ${response.status}`;
            
            // User-friendly error messages
            if (errorMessage === 'Invalid credentials') {
                errorMessage = 'Incorrect username or password';
            }
            
            logger.error('API', `HTTP ${response.status}: ${errorMessage}`);
            throw new Error(errorMessage);
        }

        logger.debug('API', `${options.method || 'GET'} ${endpoint} - Success`);
        return data;
    } catch (error) {
        logger.error('API', `Request failed: ${error.message}`);
        throw error;
    }
}

/**
 * Public API methods
 */
export const api = {
    /**
     * Login user
     * @param {string} username
     * @param {string} password
     * @returns {Promise<{token, userId, id, ...}>}
     */
    login: async (username, password) => {
        try {
            const response = await fetchWithAuth('/tokens', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
            });

            return {
                data: response,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: err.message || 'Login failed',
            };
        }
    },

    /**
     * Register new user
     * @param {Object} userData - {username, password, fullName, email?, phoneNumber?, birthDate?}
     * @param {Object} imageFile - {uri, name} (optional)
     * @returns {Promise<{data, error}>}
     */
    register: async (userData, imageFile) => {
        try {
            const formData = new FormData();
            formData.append('username', userData.username);
            formData.append('password', userData.password);
            formData.append('fullName', userData.fullName);

            // Add optional fields
            if (userData.email) {
                formData.append('email', userData.email);
            }
            if (userData.phoneNumber) {
                formData.append('phoneNumber', userData.phoneNumber);
            }
            if (userData.birthDate) {
                formData.append('birthDate', userData.birthDate);
            }

            // Add image if provided
            if (imageFile && imageFile.uri) {
                const imageName = imageFile.name || `profile_${Date.now()}.jpg`;
                formData.append('image', {
                    uri: imageFile.uri,
                    type: 'image/jpeg',
                    name: imageName,
                });
            }

            const response = await fetchWithAuth('/users', {
                method: 'POST',
                body: formData,
                headers: {
                    'x-user-id': undefined,
                },
            });

            return {
                data: response,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: err.message || 'Registration failed',
            };
        }
    },

    /**
     * Get user profile
     * @param {string} userId
     * @returns {Promise<{data, error}>}
     */
    getUser: async (userId) => {
        try {
            const response = await fetchWithAuth(`/users/${userId}`, {
                method: 'GET',
            });

            return {
                data: response,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: err.message || 'Failed to get user',
            };
        }
    },

    /**
     * Upload file
     * @param {Object} fileData - {uri, name, type}
     * @returns {Promise<{data, error}>}
     */
    uploadFile: async (fileData) => {
        try {
            const formData = new FormData();
            formData.append('file', {
                uri: fileData.uri,
                type: fileData.type || 'application/octet-stream',
                name: fileData.name || 'file',
            });

            const response = await fetchWithAuth('/files', {
                method: 'POST',
                body: formData,
            });

            return {
                data: response,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: err.message || 'File upload failed',
            };
        }
    },

    /**
     * Get all files
     * @returns {Promise<{data, error}>}
     */
    getFiles: async () => {
        try {
            const response = await fetchWithAuth('/files', {
                method: 'GET',
            });

            return {
                data: response,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: err.message || 'Failed to get files',
            };
        }
    },

    /**
     * Search files
     * @param {string} query
     * @returns {Promise<{data, error}>}
     */
    searchFiles: async (query) => {
        try {
            const response = await fetchWithAuth(`/files/search?q=${encodeURIComponent(query)}`, {
                method: 'GET',
            });

            return {
                data: response,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: err.message || 'Search failed',
            };
        }
    },

    /**
     * Health check
     * @returns {Promise<{data, error}>}
     */
    health: async () => {
        try {
            const response = await fetchWithAuth('/health', {
                method: 'GET',
            });

            return {
                data: response,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: err.message || 'Health check failed',
            };
        }
    },
};
