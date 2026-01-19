/**
 * Central Styles & Theme for entire app
 * All screens and components import from here
 */

import { StyleSheet, Platform } from 'react-native';
import { Colors } from './theme';

const theme = 'light'; // Can be 'light' or 'dark'

// 🎨 Core Colors
export const AppColors = {
  primary: Colors[theme].tint,
  background: Colors[theme].background,
  text: Colors[theme].text,
  textSecondary: '#666',
  error: '#ff6b6b',
  errorBackground: '#ffe0e0',
  success: '#51cf66',
  successBackground: '#e7f5ed',
  border: '#e0e0e0',
  disabled: '#ccc',
  white: '#ffffff',
  black: '#000000',
};

// 📏 Spacing System (8px base)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// 🔤 Typography
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

// 🎯 Reusable Component Styles
export const GlobalStyles = StyleSheet.create({
  // Containers
  screenContainer: {
    flex: 1,
    backgroundColor: AppColors.background,
    paddingHorizontal: Spacing.md,
  },
  screenContainerNoHPadding: {
    flex: 1,
    backgroundColor: AppColors.background,
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
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: Spacing.sm,
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

// 🖼️ Image Styles
export const ImageStyles = StyleSheet.create({
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: AppColors.border,
  },
  thumbnail: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: AppColors.border,
  },
});
