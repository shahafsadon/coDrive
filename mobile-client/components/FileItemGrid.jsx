/**
 * FileItemGrid Component
 * Displays a single file or folder in grid/card layout
 * Tall card with icon, name, and three-dots menu
 */

import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';
import { useTheme } from '@/context/ThemeContext';

export function FileItemGrid({ file, onPress, onMenuPress }) {
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
            style={[styles.container, { backgroundColor: colors.surface + 'D9', borderColor: colors.border + '14' }]}
            onPress={onPress}
            activeOpacity={0.7}
        >
            {/* Three-dots menu button in top-right */}
            <TouchableOpacity
                style={styles.menuButton}
                onPress={handleMenuPress}
            >
                <Text style={[styles.menuIcon, { color: colors.textSecondary }]}>⋮</Text>
            </TouchableOpacity>

            {/* File type icon */}
            <View style={styles.iconContainer}>
                <Text style={styles.icon}>{getFileIcon()}</Text>
            </View>
            
            {/* File name and date */}
            <View style={styles.info}>
                <Text style={[styles.name, { color: colors.text }]} numberOfLines={2}>
                    {file.name}
                </Text>
                <Text style={[styles.date, { color: colors.textSecondary }]}>{formatDate(file.createdAt)}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        padding: Spacing.md,
        borderRadius: 12,
        marginBottom: Spacing.md,
        borderWidth: 1,
        minHeight: 160,
        position: 'relative',
    },
    menuButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: Spacing.sm,
        zIndex: 10,
    },
    menuIcon: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    iconContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
    },
    icon: {
        fontSize: 64,
    },
    info: {
        alignItems: 'center',
    },
    name: {
        ...Typography.body,
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 4,
    },
    date: {
        ...Typography.caption,
        fontSize: 11,
    },
});
