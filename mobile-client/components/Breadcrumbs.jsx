/**
 * Breadcrumbs Component
 * Shows navigation path and allows quick navigation
 */

import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';

export function Breadcrumbs({ items, onNavigate }) {
    if (!items || items.length === 0) return null;

    return (
        <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.container}
            contentContainerStyle={styles.content}
        >
            {items.map((item, index) => (
                <View key={item.id || index} style={styles.item}>
                    <TouchableOpacity
                        onPress={() => onNavigate && onNavigate(item, index)}
                        disabled={index === items.length - 1}
                    >
                        <Text
                            style={[
                                styles.text,
                                index === items.length - 1 && styles.textActive
                            ]}
                        >
                            {item.name}
                        </Text>
                    </TouchableOpacity>
                    
                    {index < items.length - 1 && (
                        <Text style={styles.separator}>›</Text>
                    )}
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        maxHeight: 44,
        backgroundColor: AppColors.backgroundSecondary,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
    },
    content: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        alignItems: 'center',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        ...Typography.body,
        color: AppColors.primary,
        fontWeight: '500',
    },
    textActive: {
        color: AppColors.text,
        fontWeight: '600',
    },
    separator: {
        ...Typography.body,
        color: AppColors.textSecondary,
        marginHorizontal: Spacing.sm,
    },
});
