/**
 * DriveHeader Component
 * Header for drive screens with:
 * - Left: Hamburger menu button
 * - Center: Search bar
 * - Right: Profile picture + dark/light mode toggle
 */

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function DriveHeader({ 
    onMenuPress, 
    onSearchChange, 
    searchValue, 
    onProfilePress,
    onThemeToggle,
    userName 
}) {
    const { isDarkMode, colors } = useTheme();
    const insets = useSafeAreaInsets();
    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={8}
        >
        <View
            style={[
                styles.container,
                {
                    backgroundColor: colors.surface,
                    borderBottomColor: colors.border,
                    paddingTop: insets.top,
                },
            ]}
        >
        {/* Left: Hamburger Menu */}
            <TouchableOpacity 
                style={styles.iconButton}
                onPress={onMenuPress}
            >
                <Text style={[styles.menuIcon, { color: colors.text }]}>☰</Text>
            </TouchableOpacity>

            {/* Center: Search Bar */}
            <View style={[styles.searchContainer, { backgroundColor: colors.background }]}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={[styles.searchInput, { color: colors.text }]}
                    placeholder="Search in drive"
                    placeholderTextColor={colors.textSecondary}
                    value={searchValue}
                    onChangeText={onSearchChange}
                />
            </View>

            {/* Right: Theme Toggle + Profile */}
            <TouchableOpacity
                style={styles.iconButton}
                onPress={onThemeToggle}
            >
                <Text style={styles.themeIcon}>
                    {isDarkMode ? '☀️' : '🌙'}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.profileButton}
                onPress={onProfilePress}
            >
                <View style={styles.profileCircle}>
                    <Text style={styles.profileInitial}>
                        {userName ? userName[0].toUpperCase() : 'U'}
                    </Text>
                </View>
            </TouchableOpacity>
        </View>
        </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
        gap: Spacing.sm,
    },
    iconButton: {
        padding: Spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuIcon: {
        fontSize: 24,
    },
    searchContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 24,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: Spacing.xs,
    },
    searchInput: {
        flex: 1,
        ...Typography.body,
        fontSize: 15,
        padding: 0,
    },
    themeIcon: {
        fontSize: 20,
    },
    profileButton: {
        padding: 2,
    },
    profileCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#1a73e8',
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileInitial: {
        ...Typography.body,
        fontSize: 16,
        fontWeight: '600',
        color: AppColors.white,
    },
});
