/**
 * ShareModal Component
 * Modal for sharing files with other users
 * Adapted from web-client ShareModal
 */

import { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';
import {
    shareFile,
    getFilePermissions,
    updatePermission,
    removePermission,
} from '@/services/filesService';
import { useTheme } from '@/context/ThemeContext';

export function ShareModal({ file, onClose }) {
    const [username, setUsername] = useState('');
    const [permission, setPermission] = useState('view');
    const [permissions, setPermissions] = useState([]);
    const [loading, setLoading] = useState(false);

    const { colors } = useTheme();

    useEffect(() => {
        loadPermissions();
    }, []);

    const loadPermissions = async () => {
        try {
            const data = await getFilePermissions(file.id);
            setPermissions(data || []);
        } catch (err) {
            console.error('Failed to load permissions:', err);
        }
    };

    const handleShare = async () => {
        if (!username.trim()) {
            Alert.alert('Error', 'Please enter a username');
            return;
        }

        setLoading(true);
        try {
            await shareFile(file.id, username.trim(), permission);
            Alert.alert('Success', `File shared with ${username}`);
            setUsername('');
            loadPermissions();
        } catch (err) {
            Alert.alert('Error', err.message || 'Failed to share file');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePermission = async (permId, newPermission) => {
        try {
            await updatePermission(file.id, permId, newPermission);
            loadPermissions();
        } catch (err) {
            Alert.alert('Error', 'Failed to update permission');
        }
    };

    const handleRemovePermission = async (permId) => {
        try {
            await removePermission(file.id, permId);
            loadPermissions();
        } catch (err) {
            Alert.alert('Error', 'Failed to remove permission');
        }
    };

    return (
        <Modal
            visible
            transparent
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View
                    style={[
                        styles.modal,
                        { backgroundColor: colors.backgroundSecondary },
                    ]}
                >
                    <Text style={[styles.title, { color: colors.text }]}>
                        Share "{file.name}"
                    </Text>

                    {/* Add new user */}
                    <View
                        style={[
                            styles.addSection,
                            { borderBottomColor: colors.border },
                        ]}
                    >
                        <Text style={[styles.label, { color: colors.text }]}>
                            Share with:
                        </Text>

                        <TextInput
                            style={[
                                styles.input,
                                {
                                    backgroundColor: colors.background,
                                    color: colors.text,
                                    borderColor: colors.border,
                                },
                            ]}
                            placeholder="Enter username"
                            placeholderTextColor={colors.textSecondary}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />

                        <View style={styles.permissionRow}>
                            <TouchableOpacity
                                style={[
                                    styles.permissionButton,
                                    {
                                        backgroundColor:
                                            permission === 'view'
                                                ? colors.primary
                                                : colors.backgroundSecondary,
                                        borderColor:
                                            permission === 'view'
                                                ? colors.primary
                                                : colors.border,
                                    },
                                ]}
                                onPress={() => setPermission('view')}
                            >
                                <Text
                                    style={[
                                        styles.permissionText,
                                        {
                                            color:
                                                permission === 'view'
                                                    ? colors.white
                                                    : colors.text,
                                        },
                                    ]}
                                >
                                    👁️ View
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.permissionButton,
                                    {
                                        backgroundColor:
                                            permission === 'edit'
                                                ? colors.primary
                                                : colors.backgroundSecondary,
                                        borderColor:
                                            permission === 'edit'
                                                ? colors.primary
                                                : colors.border,
                                    },
                                ]}
                                onPress={() => setPermission('edit')}
                            >
                                <Text
                                    style={[
                                        styles.permissionText,
                                        {
                                            color:
                                                permission === 'edit'
                                                    ? colors.white
                                                    : colors.text,
                                        },
                                    ]}
                                >
                                    ✏️ Edit
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            style={[
                                styles.shareButton,
                                loading && styles.shareButtonDisabled,
                            ]}
                            onPress={handleShare}
                            disabled={loading}
                        >
                            <Text style={styles.shareButtonText}>
                                {loading ? 'Sharing...' : 'Share'}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Existing permissions */}
                    {permissions.length > 0 && (
                        <View style={styles.permissionsSection}>
                            <Text
                                style={[
                                    styles.sectionTitle,
                                    { color: colors.text },
                                ]}
                            >
                                Shared with:
                            </Text>

                            <ScrollView style={styles.permissionsList}>
                                {permissions.map((perm) => (
                                    <View
                                        key={perm.id}
                                        style={[
                                            styles.permissionItem,
                                            { borderBottomColor: colors.border },
                                        ]}
                                    >
                                        <View style={styles.permissionInfo}>
                                            <Text
                                                style={[
                                                    styles.permissionEmail,
                                                    { color: colors.text },
                                                ]}
                                            >
                                                {perm.username ||
                                                    perm.user?.username ||
                                                    'Unknown'}
                                            </Text>
                                            <Text
                                                style={[
                                                    styles.permissionType,
                                                    { color: colors.textSecondary },
                                                ]}
                                            >
                                                {(perm.access === 'write' ||
                                                    perm.permission === 'edit')
                                                    ? '✏️ Can edit'
                                                    : '👁️ Can view'}
                                            </Text>
                                        </View>

                                        <View style={styles.permissionActions}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    handleRemovePermission(perm.id)
                                                }
                                                style={styles.iconButton}
                                            >
                                                <Text
                                                    style={[
                                                        styles.iconButtonText,
                                                        styles.deleteIconButton,
                                                    ]}
                                                >
                                                    🗑️
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Close button */}
                    <TouchableOpacity
                        style={[
                            styles.closeButton,
                            { backgroundColor: colors.background },
                        ]}
                        onPress={onClose}
                    >
                        <Text
                            style={[
                                styles.closeButtonText,
                                { color: colors.text },
                            ]}
                        >
                            Close
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    modal: {
        borderRadius: 16,
        padding: Spacing.lg,
        width: '100%',
        maxWidth: 500,
        maxHeight: '80%',
    },
    title: {
        ...Typography.h3,
        marginBottom: Spacing.lg,
        textAlign: 'center',
    },
    addSection: {
        marginBottom: Spacing.lg,
        paddingBottom: Spacing.lg,
        borderBottomWidth: 1,
    },
    label: {
        ...Typography.body,
        fontWeight: '600',
        marginBottom: Spacing.sm,
    },
    input: {
        borderWidth: 1,
        borderRadius: 8,
        padding: Spacing.md,
        marginBottom: Spacing.md,
        ...Typography.body,
    },
    permissionRow: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginBottom: Spacing.md,
    },
    permissionButton: {
        flex: 1,
        padding: Spacing.md,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: 'center',
    },
    permissionText: {
        ...Typography.body,
    },
    shareButton: {
        backgroundColor: AppColors.primary,
        padding: Spacing.md,
        borderRadius: 8,
        alignItems: 'center',
    },
    shareButtonDisabled: {
        opacity: 0.5,
    },
    shareButtonText: {
        ...Typography.body,
        color: AppColors.white,
        fontWeight: '600',
    },
    permissionsSection: {
        marginBottom: Spacing.lg,
    },
    sectionTitle: {
        ...Typography.body,
        fontWeight: '600',
        marginBottom: Spacing.sm,
    },
    permissionsList: {
        maxHeight: 200,
    },
    permissionItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        borderBottomWidth: 1,
    },
    permissionInfo: {
        flex: 1,
    },
    permissionEmail: {
        ...Typography.body,
        fontWeight: '600',
        marginBottom: 2,
    },
    permissionType: {
        ...Typography.caption,
    },
    permissionActions: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    iconButton: {
        padding: Spacing.sm,
    },
    iconButtonText: {
        fontSize: 18,
    },
    deleteIconButton: {
        color: '#d93025',
    },
    closeButton: {
        padding: Spacing.md,
        borderRadius: 8,
        alignItems: 'center',
    },
    closeButtonText: {
        ...Typography.body,
        fontWeight: '600',
    },
});
