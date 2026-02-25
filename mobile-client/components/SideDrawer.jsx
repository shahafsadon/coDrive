/**
 * SideDrawer Component
 * Side menu with navigation options: Logout, Trash, Recents
 */

import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';
import { useTheme } from '@/context/ThemeContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function SideDrawer({ visible, onClose, onLogout, onTrash, onRecents }) {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View
                    style={[
                        styles.drawer,
                        { backgroundColor: colors.background },
                    ]}
                >
                <TouchableOpacity activeOpacity={1}>
                        {/* Header Card */}
                        <View
                            style={[
                                styles.headerCard,
                                {
                                    backgroundColor: colors.background,
                                    borderColor: colors.border,
                                    marginTop: insets.top + 8,
                                },
                            ]}
                        >
                            <Text style={[styles.headerTitle, { color: colors.text }]}>
                                coDrive
                            </Text>
                        </View>

                        {/* Menu Items */}
                        <View style={styles.menuItems}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    onClose();
                                    onRecents && onRecents();
                                }}
                            >
                                <Text style={styles.menuIcon}>🕐</Text>
                                <Text style={[styles.menuText, { color: colors.text }]}>
                                    Recent
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    onClose();
                                    onTrash && onTrash();
                                }}
                            >
                                <Text style={styles.menuIcon}>🗑️</Text>
                                <Text style={[styles.menuText, { color: colors.text }]}>
                                    Trash
                                </Text>
                            </TouchableOpacity>

                            <View
                                style={[
                                    styles.separator,
                                    { backgroundColor: colors.border },
                                ]}
                            />

                            <TouchableOpacity
                                style={[styles.menuItem, styles.logoutItem]}
                                onPress={() => {
                                    onClose();
                                    onLogout && onLogout();
                                }}
                            >
                                <Text style={styles.menuIcon}>🚪</Text>
                                <Text
                                    style={[
                                        styles.menuText,
                                        styles.logoutText,
                                    ]}
                                >
                                    Logout
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.45)',
        justifyContent: 'flex-start',
    },
    drawer: {
        width: '70%',
        maxWidth: 280,
        height: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },

    headerCard: {
        marginLeft: Spacing.md,
        marginBottom: Spacing.md,
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        width: '60%',
        maxWidth: 220,
        borderRadius: 12,
        borderWidth: 1,
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600',
        letterSpacing: 0.4,
    },

    menuItems: {
        paddingVertical: Spacing.sm,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
    },
    menuIcon: {
        fontSize: 22,
        marginRight: Spacing.md,
        width: 32,
    },
    menuText: {
        ...Typography.body,
        fontSize: 16,
    },
    separator: {
        height: 1,
        marginVertical: Spacing.md,
        marginHorizontal: Spacing.lg,
    },
    logoutItem: {
        marginTop: Spacing.sm,
    },
    logoutText: {
        color: AppColors.error || '#d93025',
        fontWeight: '500',
    },
});
