/**
 * SideDrawer Component
 * Side menu with navigation options: Logout, Trash, Recents
 */

import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';
import { useTheme } from '@/context/ThemeContext';

export function SideDrawer({ visible, onClose, onLogout, onTrash, onRecents }) {
    const { colors } = useTheme();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <TouchableOpacity 
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={[styles.drawer, { backgroundColor: colors.surface }]}>
                    <TouchableOpacity activeOpacity={1}>
                        {/* Header */}
                        <View style={[styles.header, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
                            <Text style={[styles.headerTitle, { color: colors.text }]}>Menu</Text>
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
                                <Text style={[styles.menuText, { color: colors.text }]}>Recent</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => {
                                    onClose();
                                    onTrash && onTrash();
                                }}
                            >
                                <Text style={styles.menuIcon}>🗑️</Text>
                                <Text style={[styles.menuText, { color: colors.text }]}>Trash</Text>
                            </TouchableOpacity>

                            <View style={[styles.separator, { backgroundColor: colors.border }]} />

                            <TouchableOpacity
                                style={[styles.menuItem, styles.logoutItem]}
                                onPress={() => {
                                    onClose();
                                    onLogout && onLogout();
                                }}
                            >
                                <Text style={styles.menuIcon}>🚪</Text>
                                <Text style={[styles.menuText, styles.logoutText]}>Logout</Text>
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
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-start',
    },
    drawer: {
        width: '80%',
        maxWidth: 320,
        height: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    header: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.xl,
        borderBottomWidth: 1,
    },
    headerTitle: {
        ...Typography.h3,
        fontSize: 24,
        fontWeight: '600',
    },
    menuItems: {
        paddingVertical: Spacing.md,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
    },
    menuIcon: {
        fontSize: 24,
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
        color: '#d93025',
        fontWeight: '600',
    },
});
