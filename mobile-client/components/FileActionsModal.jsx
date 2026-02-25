/**
 * FileActionsModal Component
 * Modal displaying file/folder actions (opened from three-dots menu)
 */

import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';
import { useTheme } from '@/context/ThemeContext';

export function FileActionsModal({
                                     visible,
                                     file,
                                     onClose,
                                     onStar,
                                     onDownload,
                                     onShare,
                                     onRename,
                                     onMoveToTrash,
                                     onMoveToFolder,
                                     onCopyLink,
                                     onRestore,
                                     mode
                                 }) {
    if (!file) return null;

    const { colors } = useTheme();

    const handleAction = (action) => {
        onClose();
        if (action) action();
    };

    const isTrashMode = mode === 'trash';
    const canEdit = file.accessLevel === 'write';

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View
                    style={[
                        styles.modalContainer,
                        { backgroundColor: colors.backgroundSecondary },
                    ]}
                >
                    <TouchableOpacity activeOpacity={1}>
                        {/* Header */}
                        <View
                            style={[
                                styles.header,
                                { borderBottomColor: colors.border },
                            ]}
                        >
                            <Text
                                style={[
                                    styles.fileName,
                                    { color: colors.text },
                                ]}
                                numberOfLines={1}
                            >
                                {file.name}
                            </Text>
                        </View>

                        {/* Actions */}
                        <View style={styles.actionsList}>
                            {!isTrashMode && (
                                <>
                                    <Action
                                        icon={file.isStarred ? '⭐' : '☆'}
                                        text={file.isStarred ? 'Remove from starred' : 'Add to starred'}
                                        onPress={() => handleAction(() => onStar?.(file))}
                                        colors={colors}
                                    />

                                    <Action
                                        icon="⬇️"
                                        text="Download"
                                        onPress={() => handleAction(() => onDownload?.(file))}
                                        colors={colors}
                                    />

                                    <Action
                                        icon="🔗"
                                        text="Share"
                                        onPress={() => handleAction(() => onShare?.(file))}
                                        colors={colors}
                                    />

                                    {canEdit && (
                                        <Action
                                            icon="✏️"
                                            text="Rename"
                                            onPress={() => handleAction(() => onRename?.(file))}
                                            colors={colors}
                                        />
                                    )}

                                    {canEdit && (
                                        <Action
                                            icon="➡️"
                                            text="Move to folder"
                                            onPress={() => handleAction(() => onMoveToFolder?.(file))}
                                            colors={colors}
                                        />
                                    )}

                                    <Action
                                        icon="📋"
                                        text="Copy link"
                                        onPress={() => handleAction(() => onCopyLink?.(file))}
                                        colors={colors}
                                    />

                                    {canEdit && (
                                        <Action
                                            icon="🗑️"
                                            text="Move to trash"
                                            danger
                                            onPress={() => handleAction(() => onMoveToTrash?.(file.id))}
                                            colors={colors}
                                        />
                                    )}
                                </>
                            )}

                            {isTrashMode && (
                                <>
                                    <Action
                                        icon="♻️"
                                        text="Restore"
                                        onPress={() => handleAction(() => onRestore?.(file.id))}
                                        colors={colors}
                                    />

                                    <Action
                                        icon="❌"
                                        text="Delete permanently"
                                        danger
                                        onPress={() => handleAction(() => onMoveToTrash?.(file.id))}
                                        colors={colors}
                                    />
                                </>
                            )}
                        </View>

                        {/* Cancel */}
                        <TouchableOpacity
                            style={[
                                styles.cancelButton,
                                { backgroundColor: colors.background },
                            ]}
                            onPress={onClose}
                        >
                            <Text
                                style={[
                                    styles.cancelText,
                                    { color: colors.text },
                                ]}
                            >
                                Cancel
                            </Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

/** Small helper component to avoid repetition */
function Action({ icon, text, onPress, danger, colors }) {
    return (
        <TouchableOpacity
            style={styles.actionItem}
            onPress={onPress}
        >
            <Text style={styles.actionIcon}>{icon}</Text>
            <Text
                style={[
                    styles.actionText,
                    { color: danger ? '#d93025' : colors.text },
                ]}
            >
                {text}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalContainer: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 30,
    },
    header: {
        padding: Spacing.lg,
        borderBottomWidth: 1,
    },
    fileName: {
        ...Typography.title,
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    actionsList: {
        paddingVertical: Spacing.sm,
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
    },
    actionIcon: {
        fontSize: 24,
        marginRight: Spacing.md,
        width: 32,
    },
    actionText: {
        ...Typography.body,
        fontSize: 16,
    },
    cancelButton: {
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.sm,
        paddingVertical: Spacing.md,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelText: {
        ...Typography.body,
        fontSize: 16,
        fontWeight: '600',
    },
});
