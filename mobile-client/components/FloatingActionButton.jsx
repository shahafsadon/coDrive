/**
 * FloatingActionButton (FAB) Component
 * Shows create menu for files and folders
 * Simplified version matching Google Drive mobile
 */

import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';

export function FloatingActionButton({ 
    onUploadFile, 
    onUploadImage,
    onCreateTextFile,
    onCreateFolder
}) {
    const [menuVisible, setMenuVisible] = useState(false);

    const toggleMenu = () => {
        setMenuVisible(!menuVisible);
    };

    const handleAction = (action) => {
        setMenuVisible(false);
        action && action();
    };

    return (
        <View style={styles.container}>
            {/* Menu Modal */}
            {menuVisible && (
                <Modal
                    transparent
                    visible={menuVisible}
                    animationType="fade"
                    onRequestClose={() => setMenuVisible(false)}
                >
                    <TouchableOpacity
                        style={styles.backdrop}
                        activeOpacity={1}
                        onPress={() => setMenuVisible(false)}
                    >
                        <View style={styles.menu}>
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => handleAction(onUploadFile)}
                            >
                                <Text style={styles.menuIcon}>⬆️</Text>
                                <Text style={styles.menuText}>Upload file</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => handleAction(onUploadImage)}
                            >
                                <Text style={styles.menuIcon}>🖼️</Text>
                                <Text style={styles.menuText}>Upload image</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => handleAction(onCreateTextFile)}
                            >
                                <Text style={styles.menuIcon}>📄</Text>
                                <Text style={styles.menuText}>Create text file</Text>
                            </TouchableOpacity>
                            
                            <TouchableOpacity
                                style={styles.menuItem}
                                onPress={() => handleAction(onCreateFolder)}
                            >
                                <Text style={styles.menuIcon}>📁</Text>
                                <Text style={styles.menuText}>Create folder</Text>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}

            {/* Main FAB Button */}
            <TouchableOpacity
                style={[styles.fab, menuVisible && styles.fabActive]}
                onPress={toggleMenu}
                activeOpacity={0.9}
            >
                <Text style={styles.fabIcon}>{menuVisible ? '✕' : '+'}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: Spacing.xl,
        right: Spacing.lg,
        zIndex: 1000,
    },
    fab: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: AppColors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    fabActive: {
        backgroundColor: AppColors.primaryDark,
    },
    fabIcon: {
        fontSize: 28,
        color: AppColors.white,
        fontWeight: 'bold',
    },
    backdrop: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        backgroundColor: 'rgba(0,0,0,0.3)',
        paddingRight: Spacing.lg,
        paddingBottom: 100,
    },
    menu: {
        backgroundColor: AppColors.white,
        borderRadius: 12,
        paddingVertical: Spacing.sm,
        minWidth: 200,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 10,
        elevation: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
    },
    menuIcon: {
        fontSize: 24,
        marginRight: Spacing.md,
    },
    menuText: {
        ...Typography.body,
        fontWeight: '500',
    },
});
