/**
 * FileActionsModal Component
 * Modal displaying file/folder actions (opened from three-dots menu)
 * Options: Add to starred, Download, Share, Rename, Move to trash, Move to folder, Copy link
 */

import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';

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

    const handleAction = (action) => {
        onClose();
        if (action) action();
    };

    // Don't show certain actions in trash mode
    const isTrashMode = mode === 'trash';
    // Only show edit actions if user has write access
    const canEdit = file.accessLevel === 'write';

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity 
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.modalContainer}>
                    <TouchableOpacity activeOpacity={1}>
                        {/* Header with file info */}
                        <View style={styles.header}>
                            <Text style={styles.fileName} numberOfLines={1}>
                                {file.name}
                            </Text>
                        </View>

                        {/* Action buttons */}
                        <View style={styles.actionsList}>
                            {!isTrashMode && (
                                <>
                                    <TouchableOpacity
                                        style={styles.actionItem}
                                        onPress={() => handleAction(() => onStar && onStar(file))}
                                    >
                                        <Text style={styles.actionIcon}>
                                            {file.isStarred ? '⭐' : '☆'}
                                        </Text>
                                        <Text style={styles.actionText}>
                                            {file.isStarred ? 'Remove from starred' : 'Add to starred'}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.actionItem}
                                        onPress={() => handleAction(() => onDownload && onDownload(file))}
                                    >
                                        <Text style={styles.actionIcon}>⬇️</Text>
                                        <Text style={styles.actionText}>Download</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={styles.actionItem}
                                        onPress={() => handleAction(() => onShare && onShare(file))}
                                    >
                                        <Text style={styles.actionIcon}>🔗</Text>
                                        <Text style={styles.actionText}>Share</Text>
                                    </TouchableOpacity>

                                    {canEdit && (
                                        <TouchableOpacity
                                            style={styles.actionItem}
                                            onPress={() => handleAction(() => onRename && onRename(file))}
                                        >
                                            <Text style={styles.actionIcon}>✏️</Text>
                                            <Text style={styles.actionText}>Rename</Text>
                                        </TouchableOpacity>
                                    )}

                                    {canEdit && (
                                        <TouchableOpacity
                                            style={styles.actionItem}
                                            onPress={() => handleAction(() => onMoveToFolder && onMoveToFolder(file))}
                                        >
                                            <Text style={styles.actionIcon}>➡️</Text>
                                            <Text style={styles.actionText}>Move to folder</Text>
                                        </TouchableOpacity>
                                    )}

                                    <TouchableOpacity
                                        style={styles.actionItem}
                                        onPress={() => handleAction(() => onCopyLink && onCopyLink(file))}
                                    >
                                        <Text style={styles.actionIcon}>📋</Text>
                                        <Text style={styles.actionText}>Copy link</Text>
                                    </TouchableOpacity>

                                    {canEdit && (
                                        <TouchableOpacity
                                            style={[styles.actionItem, styles.dangerAction]}
                                            onPress={() => handleAction(() => onMoveToTrash && onMoveToTrash(file.id))}
                                        >
                                            <Text style={styles.actionIcon}>🗑️</Text>
                                            <Text style={[styles.actionText, styles.dangerText]}>
                                                Move to trash
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                </>
                            )}

                            {isTrashMode && (
                                <>
                                    <TouchableOpacity
                                        style={styles.actionItem}
                                        onPress={() => handleAction(() => onRestore && onRestore(file.id))}
                                    >
                                        <Text style={styles.actionIcon}>♻️</Text>
                                        <Text style={styles.actionText}>Restore</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.actionItem, styles.dangerAction]}
                                        onPress={() => handleAction(() => onMoveToTrash && onMoveToTrash(file.id))}
                                    >
                                        <Text style={styles.actionIcon}>❌</Text>
                                        <Text style={[styles.actionText, styles.dangerText]}>
                                            Delete permanently
                                        </Text>
                                    </TouchableOpacity>
                                </>
                            )}
                        </View>

                        {/* Cancel button */}
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={onClose}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
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
        justifyContent: 'flex-end',
    },
    modalContainer: {
        backgroundColor: AppColors.white,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        paddingBottom: 30,
    },
    header: {
        padding: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
    },
    fileName: {
        ...Typography.title,
        fontSize: 18,
        fontWeight: '600',
        color: AppColors.text,
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
        color: AppColors.text,
    },
    dangerAction: {
        // Style for destructive actions
    },
    dangerText: {
        color: '#d93025',
    },
    cancelButton: {
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.sm,
        paddingVertical: Spacing.md,
        backgroundColor: AppColors.backgroundSecondary,
        borderRadius: 12,
        alignItems: 'center',
    },
    cancelText: {
        ...Typography.body,
        fontSize: 16,
        fontWeight: '600',
        color: AppColors.text,
    },
});
