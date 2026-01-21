/**
 * FileItem Component
 * Displays a single file or folder in horizontal layout
 * Left: file type icon, Center: name, Right: three-dots menu
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';
import { useTheme } from '@/context/ThemeContext';

export function FileItem({ file, onPress, onMenuPress }) {
    const { colors } = useTheme();
    const getFileIcon = () => {
        if (file.type === 'folder') return '📁';
        if (file.mimeType?.startsWith('image/')) return '🖼️';
        if (file.mimeType === 'text/plain') return '📄';
        return '📎';
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const handleMenuPress = (e) => {
        if (e) {
            e.stopPropagation();
        }
        if (onMenuPress) onMenuPress(file);
    };

    return (
        <TouchableOpacity 
            style={[styles.container, { backgroundColor: colors.surface + 'D9', borderBottomColor: colors.border + '14' }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Left: File type icon */}
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>{getFileIcon()}</Text>
            </View>
            
            {/* Center: File name and date */}
            <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={1}>
                    {file.name}
                </Text>
                <Text style={[styles.date, { color: colors.textSecondary }]}>{formatDate(file.createdAt)}</Text>
            </View>

            {/* Right: Three-dots menu button */}
            <TouchableOpacity
                style={styles.menuButton}
                onPress={handleMenuPress}
            >
                <Text style={[styles.menuIcon, { color: colors.text }]}>⋮</Text>
            </TouchableOpacity>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
        borderBottomWidth: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: Spacing.md,
    },
    icon: {
        fontSize: 32,
    },
    info: {
        flex: 1,
        justifyContent: 'center',
    },
    name: {
        ...Typography.body,
        fontWeight: '500',
        marginBottom: 2,
    },
    date: {
        ...Typography.caption,
        fontSize: 12,
    },
    menuButton: {
        padding: Spacing.sm,
        marginLeft: Spacing.sm,
    },
    menuIcon: {
        fontSize: 24,
        color: AppColors.textSecondary,
        fontWeight: 'bold',
    },
});
