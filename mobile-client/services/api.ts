import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

// API Response type
export interface ApiResponse<T> {
    data?: T;
    error?: string;
}

// API Error class
export class ApiError extends Error {
    status: number;
    data?: any;

    constructor(message: string, status: number, data?: any) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

// Fetch interceptor
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers as Record<string, string>,
    };

    // Get token from AsyncStorage
    const token = await AsyncStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        ...options,
        headers,
    });

    return response;
}

// Generic API caller with error handling
async function apiCall<T = any>(
    method: string,
    endpoint: string,
    body?: any
): Promise<ApiResponse<T>> {
    try {
        const url = `${API_BASE_URL}${endpoint}`;

        const response = await fetchWithAuth(url, {
            method,
            body: body ? JSON.stringify(body) : undefined,
        });

        // Parse response
        let data: any = {};
        try {
            data = await response.json();
        } catch (e) {
            // Response is not JSON
            data = {};
        }

        // Handle non-200 responses
        if (!response.ok) {
            throw new ApiError(
                data.error || `HTTP ${response.status}`,
                response.status,
                data
            );
        }

        return { data };
    } catch (err) {
        if (err instanceof ApiError) {
            return { error: err.message };
        }
        return { error: err instanceof Error ? err.message : 'Unknown error' };
    }
}

// Public API methods
export const api = {
    // Authentication
    login: (username: string, password: string) =>
        apiCall('POST', '/tokens', { username, password }),

    // User registration
    register: (userData: {
        username: string;
        password: string;
        fullName: string;
        email?: string;
        phoneNumber?: string;
        birthDate?: string;
        image?: any;
    }) =>
        apiCall('POST', '/users', userData),

    // Get user by ID
    getUser: (userId: string) =>
        apiCall('GET', `/users/${userId}`),

    // Health check
    health: () =>
        apiCall('GET', '/health'),
};
