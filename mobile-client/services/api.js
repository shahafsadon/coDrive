import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';
import { Platform } from 'react-native';

/**
 * Get API base URL based on environment and platform
 */
const getAPIBaseURL = () => {
    // 1. ENV always wins
    if (process.env.EXPO_PUBLIC_API_URL) {
        logger.debug(
            'API',
            `Using API URL from env: ${process.env.EXPO_PUBLIC_API_URL}`
        );
        return process.env.EXPO_PUBLIC_API_URL;
    }

    // 2. Web fallback
    if (Platform.OS === 'web') {
        return 'http://localhost:3000/api';
    }

    // 3. Emulator fallback (Android)
    return 'http://10.0.2.2:3000/api';
};



const API_BASE_URL = getAPIBaseURL();

/**
 * Create storage wrapper with unified async interface
 */
const createStorageWrapper = () => {
    // Use AsyncStorage for web and as fallback for native
    if (Platform.OS === 'web') {
        return {
            getItemAsync: AsyncStorage.getItem,
            setItemAsync: AsyncStorage.setItem,
            deleteItemAsync: AsyncStorage.removeItem,
        };
    }
    
    // Try SecureStore for native platforms, fallback to AsyncStorage
    return {
        getItemAsync: async (key) => {
            try {
                return await SecureStore.getItemAsync(key);
            } catch (err) {
                logger.warn('API', 'SecureStore unavailable, falling back to AsyncStorage', err);
                return await AsyncStorage.getItem(key);
            }
        },
        setItemAsync: async (key, value) => {
            try {
                return await SecureStore.setItemAsync(key, value);
            } catch (err) {
                logger.warn('API', 'SecureStore unavailable, falling back to AsyncStorage', err);
                return await AsyncStorage.setItem(key, value);
            }
        },
        deleteItemAsync: async (key) => {
            try {
                return await SecureStore.deleteItemAsync(key);
            } catch (err) {
                logger.warn('API', 'SecureStore unavailable, falling back to AsyncStorage', err);
                return await AsyncStorage.removeItem(key);
            }
        },
    };
};

const storage = createStorageWrapper();

/**
 * Generic fetch wrapper with auth token
 */
async function fetchWithAuth(endpoint, options = {}) {
    try {
        const headers = {
            ...(options.body instanceof FormData
                ? {}
                : { 'Content-Type': 'application/json' }),
            ...options.headers,
        };

        // Add auth token if available
        try {
            const token = await storage.getItemAsync('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        } catch (err) {
            logger.error('API', 'Failed to retrieve token from storage', err);
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

            // Token expired / Unauthorized → clear stored auth
            if (response.status === 401) {
                await storage.deleteItemAsync('token');
                await storage.deleteItemAsync('userId');
                await storage.deleteItemAsync('username');
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
     * Generic GET request
     * @param {string} endpoint
     * @returns {Promise<{data, error}>}
     */
    get: async (endpoint) => {
        try {
            const response = await fetchWithAuth(endpoint, {
                method: 'GET',
            });

            return {
                data: response,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: err.message || 'GET request failed',
            };
        }
    },

    /**
     * Generic POST request
     * @param {string} endpoint
     * @param {Object} body
     * @returns {Promise<{data, error}>}
     */
    post: async (endpoint, body) => {
        try {
            const response = await fetchWithAuth(endpoint, {
                method: 'POST',
                body: JSON.stringify(body),
            });

            return {
                data: response,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: err.message || 'POST request failed',
            };
        }
    },

    /**
     * Generic POST request with FormData
     * @param {string} endpoint
     * @param {FormData} formData
     * @returns {Promise<{data, error}>}
     */
    postFormData: async (endpoint, formData) => {
        try {
            const response = await fetchWithAuth(endpoint, {
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
                error: err.message || 'POST request failed',
            };
        }
    },

    /**
     * Generic PATCH request
     * @param {string} endpoint
     * @param {Object} body
     * @returns {Promise<{data, error}>}
     */
    patch: async (endpoint, body) => {
        try {
            const response = await fetchWithAuth(endpoint, {
                method: 'PATCH',
                body: JSON.stringify(body),
            });

            return {
                data: response,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: err.message || 'PATCH request failed',
            };
        }
    },

    /**
     * Generic DELETE request
     * @param {string} endpoint
     * @returns {Promise<{data, error}>}
     */
    delete: async (endpoint) => {
        try {
            const response = await fetchWithAuth(endpoint, {
                method: 'DELETE',
            });

            return {
                data: response,
                error: null,
            };
        } catch (err) {
            return {
                data: null,
                error: err.message || 'DELETE request failed',
            };
        }
    },

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

/**
 * Token storage utilities
 */
export const tokenStorage = {
    /**
     * Save token to storage
     * @param {string} token
     */
    saveToken: async (token) => {
        try {
            await storage.setItemAsync('token', token);
            logger.debug('API', 'Token saved successfully');
        } catch (err) {
            logger.error('API', 'Failed to save token', err);
            throw err;
        }
    },

    /**
     * Get token from storage
     * @returns {Promise<string|null>}
     */
    getToken: async () => {
        try {
            return await storage.getItemAsync('token');
        } catch (err) {
            logger.error('API', 'Failed to get token', err);
            return null;
        }
    },

    /**
     * Clear token from storage
     */
    clearToken: async () => {
        try {
            await storage.deleteItemAsync('token');
            logger.debug('API', 'Token cleared successfully');
        } catch (err) {
            logger.error('API', 'Failed to clear token', err);
            throw err;
        }
    },
};

export const apiBaseUrl = API_BASE_URL;
