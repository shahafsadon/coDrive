/**
 * KeyboardAvoidingWrapper Component
 * Handles keyboard-related UX issues on mobile devices:
 * - Pushes content up when keyboard opens
 * - Dismisses keyboard when tapping outside input fields
 * - Smooth scrolling to focused input
 * - Platform-specific behavior (iOS/Android)
 * 
 * Reusable across all forms: Login, Register, and future screens
 */

import { 
  KeyboardAvoidingView, 
  Platform, 
  TouchableWithoutFeedback, 
  Keyboard,
  ScrollView,
  View
} from 'react-native';

export function KeyboardAvoidingWrapper({ 
  children, 
  style,
  contentContainerStyle,
  scrollEnabled = true,
  dismissKeyboardOnTap = true,
}) {
  const dismissKeyboard = () => {
    if (dismissKeyboardOnTap) {
      Keyboard.dismiss();
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[{ flex: 1 }, style]}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView
          contentContainerStyle={[
            { flexGrow: 1 },
            contentContainerStyle
          ]}
          keyboardShouldPersistTaps="handled"
          scrollEnabled={scrollEnabled}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}
