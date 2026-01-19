import React, { createContext, useContext, useEffect, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { logger } from '@/services/logger';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const loadToken = async () => {
            try {
                const token = await SecureStore.getItemAsync('token');
                const userId = await SecureStore.getItemAsync('userId');
                const username = await SecureStore.getItemAsync('username');

                if (mounted) {
                    if (token) {
                        setIsAuthenticated(true);
                        setUser({ token, userId, username });
                        logger.debug('Auth', 'Token loaded from secure store');
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
            await SecureStore.setItemAsync('token', token);
            if (userId) {
                await SecureStore.setItemAsync('userId', userId.toString());
            }
            if (username) {
                await SecureStore.setItemAsync('username', username);
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
            await SecureStore.deleteItemAsync('token');
            await SecureStore.deleteItemAsync('userId');
            await SecureStore.deleteItemAsync('username');
            
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
