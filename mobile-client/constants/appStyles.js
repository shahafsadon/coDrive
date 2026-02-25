/**
 * Central Styles & Theme for entire app
 * All screens and components import from here
 */

import { StyleSheet, Platform } from 'react-native';
import { Colors } from './theme';

// Core Colors - Light Mode
const LightColors = {
  primary: '#1a73e8',
  primaryDark: '#1557b0',
  primaryLight: '#4285f4',
  background: '#ffffff',
  backgroundSecondary: '#f0f2f5',
  text: '#202124',
  textSecondary: '#5f6368',
  error: '#d93025',
  errorBackground: '#fce8e6',
  success: '#1e8e3e',
  successBackground: '#e6f4ea',
  border: '#dadce0',
  disabled: '#ccc',
  white: '#ffffff',
  black: '#000000',
};

// Core Colors - Dark Mode
const DarkColors = {
  primary: '#8ab4f8',
  primaryDark: '#669df6',
  primaryLight: '#aecbfa',
  background: '#202124',
  backgroundSecondary: '#292a2d',
  text: '#e8eaed',
  textSecondary: '#9aa0a6',
  error: '#f28b82',
  errorBackground: '#5c2925',
  success: '#81c995',
  successBackground: '#1e4620',
  border: '#3c4043',
  disabled: '#5f6368',
  white: '#ffffff',
  black: '#000000',
};

// Default to light mode
export const AppColors = LightColors;

// Function to get colors based on theme
export const getColors = (isDark = false) => isDark ? DarkColors : LightColors;

// Spacing System (8px base)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Typography
export const Typography = StyleSheet.create({
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
    color: AppColors.text,
  },
  h2: {
    fontSize: 28,
    fontWeight: '600',
    lineHeight: 36,
    color: AppColors.text,
  },
  h3: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
    color: AppColors.text,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    color: AppColors.text,
  },
  bodySmall: {
    fontSize: 14,
    lineHeight: 20,
    color: AppColors.text,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: AppColors.text,
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    color: AppColors.textSecondary,
  },
});

// Reusable Component Styles
export const GlobalStyles = StyleSheet.create({
  // Containers
  screenContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    paddingHorizontal: Spacing.md,
  },
  screenContainerNoHPadding: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  flexBetween: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Forms
  inputBase: {
    borderWidth: 1,
    borderColor: AppColors.border,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    fontSize: 16,
    color: AppColors.text,
    backgroundColor: AppColors.white,
  },
  inputError: {
    borderColor: AppColors.error,
    borderWidth: 2,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: Spacing.sm,
    color: AppColors.text,
  },
  errorText: {
    fontSize: 12,
    color: AppColors.error,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  helperText: {
    fontSize: 12,
    color: AppColors.textSecondary,
    marginTop: Spacing.xs,
  },

  // Buttons
  buttonPrimary: {
    backgroundColor: AppColors.primary,
    paddingVertical: 12,
    paddingHorizontal: Spacing.md,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.sm,
    ...Platform.select({
      ios: {
        shadowColor: AppColors.primary,
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  buttonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: AppColors.primary,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.white,
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: '600',
    color: AppColors.primary,
  },

  // Cards
  card: {
    backgroundColor: AppColors.white,
    borderRadius: 12,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: AppColors.border,
    marginVertical: Spacing.md,
  },

  // Safe spacing patterns
  safeAreaPadding: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
  },
});

// Image Styles
export const ImageStyles = StyleSheet.create({
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: AppColors.backgroundSecondary,
  },
  profileImageSmall: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: AppColors.backgroundSecondary,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: AppColors.border,
  },
});
