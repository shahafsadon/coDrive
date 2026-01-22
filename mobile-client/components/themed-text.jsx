import { Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export function ThemedText({ style, type, ...rest }) {
  const { colors } = useTheme();

  const textStyles = {
    default: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.text,
    },
    title: {
      fontSize: 32,
      fontWeight: 'bold',
      lineHeight: 40,
      color: colors.text,
    },
    subtitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
    },
    link: {
      fontSize: 16,
      lineHeight: 24,
      color: colors.primary,
    },
    defaultSemiBold: {
      fontSize: 16,
      lineHeight: 24,
      fontWeight: '600',
      color: colors.text,
    },
  };

  const selectedStyle = textStyles[type] || textStyles.default;

  return <Text style={[selectedStyle, style]} {...rest} />;
}
