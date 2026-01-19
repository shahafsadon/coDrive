/**
 * Base Screen Wrapper - wrap all screens in this
 * Handles safe area, loading, error states consistently
 */

import { View, ScrollView, ActivityIndicator, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GlobalStyles, AppColors } from '@/constants/appStyles';

export function ScreenWrapper({
  children,
  scrollable = false,
  loading = false,
  backgroundColor,
  noPadding = false,
  contentContainerStyle,
}) {
  const containerStyle = noPadding
    ? GlobalStyles.screenContainerNoHPadding
    : GlobalStyles.screenContainer;

  const Component = scrollable ? ScrollView : View;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: backgroundColor || AppColors.background }}>
      <Component
        style={containerStyle}
        contentContainerStyle={scrollable ? contentContainerStyle : undefined}
      >
        {loading ? (
          <View style={[{ flex: 1 }, GlobalStyles.flexCenter]}>
            <ActivityIndicator size="large" color={AppColors.primary} />
          </View>
        ) : (
          children
        )}
      </Component>
    </SafeAreaView>
  );
}

// Mini-wrapper for form sections (for reusability)
export function FormSection({ label, children, style }) {
  return (
    <View style={[{ marginBottom: 24 }, style]}>
      {label && <Text style={GlobalStyles.label}>{label}</Text>}
      {children}
    </View>
  );
}
