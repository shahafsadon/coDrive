import { View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export function ThemedView({ style, ...rest }) {
  const { colors } = useTheme();

  return <View style={[{ backgroundColor: colors.background }, style]} {...rest} />;
}
