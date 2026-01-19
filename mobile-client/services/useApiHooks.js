/**
 * API Utility Hooks
 * Use these to make API calls with loading/error handling
 */

import { useState } from 'react';
import { api } from './api';

/**
 * useApi - Hook for making API calls
 * Returns: { data, loading, error, execute }
 */
export function useApi() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const execute = async (apiMethod, ...args) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await apiMethod(...args);
      
      if (result.error) {
        setError(result.error);
        return { data: null, error: result.error };
      }

      setData(result.data);
      return { data: result.data, error: null };
    } catch (err) {
      const errorMsg = err.message || 'Unknown error occurred';
      setError(errorMsg);
      return { data: null, error: errorMsg };
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, execute };
}

/**
 * useLogin - Specialized hook for login
 */
export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const login = async (username, password) => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.login(username, password);
      
      if (result.error) {
        setError(result.error);
        return null;
      }

      return result.data;
    } catch (err) {
      const errorMsg = err.message || 'Login failed';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { login, loading, error };
}

/**
 * useRegister - Specialized hook for registration
 */
export function useRegister() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (userData, image) => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.register(userData, image);
      
      if (result.error) {
        setError(result.error);
        return null;
      }

      return result.data;
    } catch (err) {
      const errorMsg = err.message || 'Registration failed';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
}

/**
 * useUser - Fetch user data
 */
export function useUser(userId) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchUser = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await api.getUser(userId);
      
      if (result.error) {
        setError(result.error);
        return null;
      }

      setUser(result.data);
      return result.data;
    } catch (err) {
      const errorMsg = err.message || 'Failed to fetch user';
      setError(errorMsg);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, fetchUser };
}
