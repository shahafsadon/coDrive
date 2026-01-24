import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Platform,
    ActionSheetIOS,
} from 'react-native';
import { useState } from 'react';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';

export function FloatingActionButton({
                                         onUploadFile,
                                         onUploadImage,
                                         onCreateTextFile,
                                         onCreateFolder,
                                     }) {
    const [menuVisible, setMenuVisible] = useState(false);

    const openMenu = () => {
        if (Platform.OS === 'ios') {
            ActionSheetIOS.showActionSheetWithOptions(
                {
                    options: [
                        'Cancel',
                        'Upload file',
                        'Upload image',
                        'Create text file',
                        'Create folder',
                    ],
                    cancelButtonIndex: 0,
                },
                (index) => {
                    switch (index) {
                        case 1:
                            onUploadFile && onUploadFile();
                            break;
                        case 2:
                            onUploadImage && onUploadImage();
                            break;
                        case 3:
                            onCreateTextFile && onCreateTextFile();
                            break;
                        case 4:
                            onCreateFolder && onCreateFolder();
                            break;
                    }
                }
            );
        } else {
            setMenuVisible(true);
        }
    };

    const handleAction = (action) => {
        setMenuVisible(false);
        action && action();
    };

    return (
        <View style={styles.container}>
            {/* Android menu */}
            {Platform.OS !== 'ios' && (
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
                    />
                    <View style={styles.menuContainer}>
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
                    </View>
                </Modal>
            )}

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={openMenu}>
                <Text style={styles.fabIcon}>+</Text>
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
        elevation: 8,
    },
    fabIcon: {
        fontSize: 28,
        color: '#fff',
        fontWeight: 'bold',
    },
    backdrop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
    menuContainer: {
        position: 'absolute',
        bottom: 100,
        right: Spacing.lg,
    },
    menu: {
        backgroundColor: AppColors.white,
        borderRadius: 12,
        paddingVertical: Spacing.sm,
        minWidth: 200,
        elevation: 10,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.md,
    },
    menuIcon: {
        fontSize: 22,
        marginRight: Spacing.md,
    },
    menuText: {
        ...Typography.body,
        fontWeight: '500',
    },
});
