/**
 * Theme Context
 * Manages dark/light mode across the app
 * Based on web-client implementation
 */

import { createContext, useContext, useState, useEffect } from 'react';
import { getColors } from '@/constants/appStyles';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [isDarkMode, setIsDarkMode] = useState(false);
    
    // Load theme from storage on mount
    useEffect(() => {
        loadTheme();
    }, []);
    
    const loadTheme = async () => {
        try {
            const savedTheme = await AsyncStorage.getItem('theme');
            if (savedTheme === 'dark') {
                setIsDarkMode(true);
            }
        } catch (error) {
            console.error('Failed to load theme:', error);
        }
    };
    
    const toggleTheme = async () => {
        const newMode = !isDarkMode;
        setIsDarkMode(newMode);
        
        // Save to storage
        try {
            await AsyncStorage.setItem('theme', newMode ? 'dark' : 'light');
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    };
    
    const colors = getColors(isDarkMode);
    
    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme, colors }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
