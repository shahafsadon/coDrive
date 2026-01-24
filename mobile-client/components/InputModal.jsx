/**
 * InputModal Component
 * Reusable modal for text input (rename, create folder, etc.)
 */

import {
    Modal,
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';
import { useTheme } from '@/context/ThemeContext';

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
    const { colors } = useTheme();

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

                <View
                    style={[
                        styles.modal,
                        { backgroundColor: colors.backgroundSecondary },
                    ]}
                >
                    <Text style={[styles.title, { color: colors.text }]}>
                        {title}
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
                        placeholder={placeholder}
                        placeholderTextColor={colors.textSecondary}
                        value={value}
                        onChangeText={onChangeText}
                        autoFocus
                        selectTextOnFocus
                    />

                    <View style={styles.buttons}>
                        {showRootOption && (
                            <TouchableOpacity
                                style={[
                                    styles.button,
                                    styles.buttonSecondary,
                                    { backgroundColor: colors.background },
                                ]}
                                onPress={onMoveToRoot}
                            >
                                <Text
                                    style={[
                                        styles.buttonSecondaryText,
                                        { color: colors.text },
                                    ]}
                                >
                                    Move to Root
                                </Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[styles.button, styles.buttonCancel]}
                            onPress={onCancel}
                        >
                            <Text
                                style={[
                                    styles.buttonCancelText,
                                    { color: colors.textSecondary },
                                ]}
                            >
                                {cancelText}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.button, styles.buttonSubmit]}
                            onPress={onSubmit}
                        >
                            <Text style={styles.buttonSubmitText}>
                                {submitText}
                            </Text>
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
        marginRight: 'auto',
    },
    buttonSecondaryText: {
        fontSize: 14,
        fontWeight: '600',
    },
});
