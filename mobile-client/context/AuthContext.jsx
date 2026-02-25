import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { logger } from '@/services/logger';

const AuthContext = createContext(undefined);

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
                logger.warn('Auth', 'SecureStore unavailable, falling back to AsyncStorage', err);
                return await AsyncStorage.getItem(key);
            }
        },
        setItemAsync: async (key, value) => {
            try {
                return await SecureStore.setItemAsync(key, value);
            } catch (err) {
                logger.warn('Auth', 'SecureStore unavailable, falling back to AsyncStorage', err);
                return await AsyncStorage.setItem(key, value);
            }
        },
        deleteItemAsync: async (key) => {
            try {
                return await SecureStore.deleteItemAsync(key);
            } catch (err) {
                logger.warn('Auth', 'SecureStore unavailable, falling back to AsyncStorage', err);
                return await AsyncStorage.removeItem(key);
            }
        },
    };
};

const storage = createStorageWrapper();

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const loadToken = async () => {
            try {
                const token = await storage.getItemAsync('token');
                const userId = await storage.getItemAsync('userId');
                const username = await storage.getItemAsync('username');

                if (mounted) {
                    if (token) {
                        setIsAuthenticated(true);
                        setUser({ token, userId, username });
                        logger.debug('Auth', 'Token loaded from storage');
                    } else {
                        setIsAuthenticated(false);
                        setUser(null);
                    }
                }
            } catch (e) {
                logger.error('Auth', 'Failed to load token', e);
                if (mounted) {
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        loadToken();

        return () => {
            mounted = false;
        };
    }, []);

    const login = async (token, userId = null, username = null) => {
        try {
            await storage.setItemAsync('token', token);
            if (userId) {
                await storage.setItemAsync('userId', userId.toString());
            }
            if (username) {
                await storage.setItemAsync('username', username);
            }
            
            setIsAuthenticated(true);
            setUser({ token, userId, username });
            logger.info('Auth', 'User logged in');
        } catch (err) {
            logger.error('Auth', 'Failed to save token', err);
            throw err;
        }
    };

    const logout = async () => {
        try {
            await storage.deleteItemAsync('token');
            await storage.deleteItemAsync('userId');
            await storage.deleteItemAsync('username');
            
            setIsAuthenticated(false);
            setUser(null);
            logger.info('Auth', 'User logged out');
        } catch (err) {
            logger.error('Auth', 'Failed to logout', err);
            throw err;
        }
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error('useAuth must be used inside AuthProvider');
    }
    return ctx;
}
