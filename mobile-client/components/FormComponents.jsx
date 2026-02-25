/**
 * Reusable UI Components for Forms
 * Used across all screens (login, register, etc)
 */

import { View, TextInput, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { GlobalStyles, AppColors, Spacing } from '@/constants/appStyles';

// Input Field
export function FormInput({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  secureTextEntry,
  keyboardType = 'default',
  editable = true,
  ...props
}) {
  return (
    <View style={{ marginBottom: error ? Spacing.xs : Spacing.md }}>
      {label && <Text style={GlobalStyles.label}>{label}</Text>}
      <TextInput
        style={[
          GlobalStyles.inputBase,
          error && GlobalStyles.inputError,
          !editable && { opacity: 0.5 },
          { height: 44 }
        ]}
        placeholder={placeholder}
        placeholderTextColor={AppColors.textSecondary}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        editable={editable}
        {...props}
      />
      {error && <Text style={GlobalStyles.errorText}>{error}</Text>}
    </View>
  );
}

// Primary Button
export function PrimaryButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  style,
  ...props
}) {
  return (
    <Pressable
      style={[
        GlobalStyles.buttonPrimary,
        (disabled || loading) && { opacity: 0.6 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={AppColors.white} />
      ) : (
        <Text style={GlobalStyles.buttonText}>{title}</Text>
      )}
    </Pressable>
  );
}

// Secondary Button
export function SecondaryButton({
  title,
  onPress,
  disabled = false,
  style,
  ...props
}) {
  return (
    <Pressable
      style={[
        GlobalStyles.buttonSecondary,
        disabled && { opacity: 0.6 },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      <Text style={GlobalStyles.buttonSecondaryText}>{title}</Text>
    </Pressable>
  );
}

// Text Button (Link)
export function TextButton({ title, onPress, style, ...props }) {
  return (
    <Pressable onPress={onPress} {...props}>
      <Text style={[{ color: AppColors.primary, fontWeight: '600' }, style]}>
        {title}
      </Text>
    </Pressable>
  );
}

// Card
export function Card({ children, style, ...props }) {
  return (
    <View style={[GlobalStyles.card, style]} {...props}>
      {children}
    </View>
  );
}

// Divider
export function Divider({ style }) {
  return <View style={[GlobalStyles.divider, style]} />;
}

// Section with title
export function Section({ title, children, style }) {
  return (
    <View style={[{ marginBottom: Spacing.lg }, style]}>
      {title && (
        <Text style={[GlobalStyles.label, { fontSize: 18, marginBottom: Spacing.md }]}>
          {title}
        </Text>
      )}
      {children}
    </View>
  );
}

// Helper text
export function HelperText({ text, style }) {
  return <Text style={[GlobalStyles.helperText, style]}>{text}</Text>;
}
