/**
 * InputModal Component
 * Reusable modal for text input (rename, create folder, etc.)
 */

import { Modal, View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';

export function InputModal({ 
    visible, 
    title, 
    placeholder, 
    value, 
    onChangeText,
    onSubmit, 
    onCancel,
    submitText = 'OK',
    cancelText = 'Cancel',
    showRootOption = false,
    onMoveToRoot
}) {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.overlay}
            >
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={onCancel}
                />
                
                <View style={styles.modal}>
                    <Text style={styles.title}>{title}</Text>
                    
                    <TextInput
                        style={styles.input}
                        placeholder={placeholder}
                        value={value}
                        onChangeText={onChangeText}
                        autoFocus
                        selectTextOnFocus
                    />
                    
                    <View style={styles.buttons}>
                        {showRootOption && (
                            <TouchableOpacity
                                style={[styles.button, styles.buttonSecondary]}
                                onPress={onMoveToRoot}
                            >
                                <Text style={styles.buttonSecondaryText}>Move to Root</Text>
                            </TouchableOpacity>
                        )}
                        
                        <TouchableOpacity
                            style={[styles.button, styles.buttonCancel]}
                            onPress={onCancel}
                        >
                            <Text style={styles.buttonCancelText}>{cancelText}</Text>
                        </TouchableOpacity>
                        
                        <TouchableOpacity
                            style={[styles.button, styles.buttonSubmit]}
                            onPress={onSubmit}
                        >
                            <Text style={styles.buttonSubmitText}>{submitText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modal: {
        width: '85%',
        backgroundColor: AppColors.white,
        borderRadius: 16,
        padding: Spacing.lg,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 10,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    title: {
        ...Typography.h3,
        marginBottom: Spacing.md,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: AppColors.border,
        borderRadius: 8,
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
        fontSize: 16,
        marginBottom: Spacing.lg,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    button: {
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.sm,
        borderRadius: 8,
        minWidth: 80,
        alignItems: 'center',
    },
    buttonCancel: {
        backgroundColor: 'transparent',
    },
    buttonCancelText: {
        color: AppColors.textSecondary,
        fontSize: 16,
        fontWeight: '600',
    },
    buttonSubmit: {
        backgroundColor: AppColors.primary,
    },
    buttonSubmitText: {
        color: AppColors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    buttonSecondary: {
        backgroundColor: AppColors.backgroundSecondary,
        marginRight: 'auto',
    },
    buttonSecondaryText: {
        color: AppColors.text,
        fontSize: 14,
        fontWeight: '600',
    },
});
