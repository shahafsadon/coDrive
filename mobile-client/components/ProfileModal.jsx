/**
 * ProfileModal Component
 * Displays user profile information
 * Shows: Email (if exists), profile picture, Hi name, user details
 */

import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
export function ProfileModal({ visible, user, onClose }) {
    if (!user) return null;

    const insets = useSafeAreaInsets();
    const { colors } = useTheme();

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={[styles.container, { backgroundColor: colors.background }]}>
                {/* Header */}
                <View
                    style={[
                        styles.header,
                        {
                            paddingTop: insets.top,
                            backgroundColor: colors.backgroundSecondary,
                        },
                    ]}
                >
                    <Text style={[styles.headerTitle, { color: colors.text }]}>
                        Profile
                    </Text>

                    <TouchableOpacity onPress={onClose} style={styles.doneButton}>
                        <Text style={[styles.doneText, { color: colors.text }]}>
                            Done
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView contentContainerStyle={styles.content}>
                    {/* Email */}
                    {user.email && (
                        <Text style={[styles.email, { color: colors.textSecondary }]}>
                            {user.email}
                        </Text>
                    )}

                    {/* Profile Picture */}
                    <View style={styles.profileCircle}>
                        <Text style={styles.profileInitial}>
                            {user.username ? user.username[0].toUpperCase() : 'U'}
                        </Text>
                    </View>

                    {/* Greeting */}
                    <Text style={[styles.greeting, { color: colors.text }]}>
                        Hi, {user.username || 'User'}!
                    </Text>

                    {/* Details */}
                    <View
                        style={[
                            styles.detailsContainer,
                            { backgroundColor: colors.backgroundSecondary },
                        ]}
                    >
                        <View style={styles.detailRow}>
                            <Text
                                style={[
                                    styles.detailLabel,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                Username
                            </Text>
                            <Text
                                style={[
                                    styles.detailValue,
                                    { color: colors.text },
                                ]}
                            >
                                {user.username || 'N/A'}
                            </Text>
                        </View>

                        {user.email && (
                            <View style={styles.detailRow}>
                                <Text
                                    style={[
                                        styles.detailLabel,
                                        { color: colors.textSecondary },
                                    ]}
                                >
                                    Email
                                </Text>
                                <Text
                                    style={[
                                        styles.detailValue,
                                        { color: colors.text },
                                    ]}
                                >
                                    {user.email}
                                </Text>
                            </View>
                        )}

                        {user.createdAt && (
                            <View style={styles.detailRow}>
                                <Text
                                    style={[
                                        styles.detailLabel,
                                        { color: colors.textSecondary },
                                    ]}
                                >
                                    Member since
                                </Text>
                                <Text
                                    style={[
                                        styles.detailValue,
                                        { color: colors.text },
                                    ]}
                                >
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
    },
    headerTitle: {
        ...Typography.h3,
        fontSize: 20,
        fontWeight: '600',
    },
    doneButton: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
    },
    doneText: {
        ...Typography.body,
        fontSize: 16,
        fontWeight: '600',
    },
    content: {
        alignItems: 'center',
        paddingVertical: Spacing.xl,
        paddingHorizontal: Spacing.lg,
    },
    email: {
        ...Typography.body,
        fontSize: 14,
        marginBottom: Spacing.lg,
    },
    profileCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#1a73e8',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Spacing.lg,
    },
    profileInitial: {
        fontSize: 48,
        fontWeight: '600',
        color: AppColors.white,
    },
    greeting: {
        ...Typography.h2,
        fontSize: 28,
        fontWeight: '600',
        marginBottom: Spacing.xl,
    },
    detailsContainer: {
        width: '100%',
        borderRadius: 12,
        padding: Spacing.lg,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
    },
    detailLabel: {
        ...Typography.body,
        fontSize: 14,
        fontWeight: '600',
    },
    detailValue: {
        ...Typography.body,
        fontSize: 14,
    },
});
