/**
 * Icon Symbol Component
 * Uses SF Symbols on iOS and Material Icons on Android
 */

import { StyleSheet } from 'react-native';
import { SymbolView } from 'expo-symbols';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const useIconLibrary = () => {
  // For iOS, use SF Symbols
  // For Android/Web, use Material Icons
  return process.env.EXPO_OS === 'ios' ? 'sf' : 'material';
};

export function IconSymbol({
  name,
  size = 24,
  color = 'black',
  style,
}) {
  const iconLibrary = useIconLibrary();

  if (iconLibrary === 'sf') {
    return (
      <SymbolView
        name={name}
        size={size}
        weight="semibold"
        color={color}
        style={[{ width: size, height: size }, style]}
      />
    );
  }

  // Material Icons mapping for Android/Web
  const materialIconMap = {
    'folder.fill': 'folder',
    'star.fill': 'star',
    'trash.fill': 'trash-can',
    'house': 'home-outline',
    'person.2': 'account-multiple-outline',
  };

  const materialIconName = materialIconMap[name] || name;

  return (
    <MaterialCommunityIcons
      name={materialIconName}
      size={size}
      color={color}
      style={style}
    />
  );
}

const styles = StyleSheet.create({
  icon: {
    resizeMode: 'contain',
  },
});
