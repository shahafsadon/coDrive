/**
 * FileViewer Component
 * Displays and allows editing of file content
 * Text files: editable textarea with Save button
 * Images: display image with Replace Image button
 * Other files: download link
 */
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { API_URL } from '@/services/api';
import { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image,
    ActivityIndicator,
    Alert,
    Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';
import { updateFile, replaceImage } from '@/services/filesService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';

export function FileViewer({ visible, file, onClose, onRefresh }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState(null);
    const [imageError, setImageError] = useState(false);

    const canEdit = file?.accessLevel === 'write';
    const isImage =
        file?.mimeType?.startsWith('image/') ||
        /\.(jpg|jpeg|png|gif|webp)$/i.test(file?.name || '');

    const isTextFile = file?.mimeType === 'text/plain';
    const insets = useSafeAreaInsets();
    const { colors } = useTheme();

    useEffect(() => {
        if (!file) return;

        setContent(file.content || '');

        if (isImage) {
            loadImage();
        }
    }, [file, isImage]);

    const loadImage = async () => {
        try {
            setLoading(true);
            setImageError(false);
            setImageUri(null);
            
            const token = await AsyncStorage.getItem('token');
            const downloadUrl = `${API_URL}/files/${file.id}/download`;

            // Download image to local storage with auth
            const fileUri = FileSystem.documentDirectory + `temp_${file.id}_${file.name}`;
            
            const downloadResumable = FileSystem.createDownloadResumable(
                downloadUrl,
                fileUri,
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                }
            );

            const result = await downloadResumable.downloadAsync();
            
            if (result && result.uri) {
                setImageUri(result.uri);
            } else {
                setImageError(true);
            }
        } catch (error) {
            console.error('Failed to load image:', error);
            setImageError(true);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!canEdit || !file) return;

        try {
            setLoading(true);
            await updateFile(file.id, { content });
            Alert.alert('Success', 'File saved successfully');
            onRefresh?.();
            onClose();
        } catch {
            Alert.alert('Error', 'Failed to save file');
        } finally {
            setLoading(false);
        }
    };

    const handleReplaceImage = async () => {
        if (!canEdit || !file) return;

        const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!granted) {
            Alert.alert('Permission Required', 'Please allow access to your photo library');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 1,
        });

        if (result.canceled) return;

        try {
            setLoading(true);
            await replaceImage(file.id, result.assets[0].uri);
            Alert.alert('Success', 'Image replaced successfully');
            onRefresh?.();
            onClose();
        } catch {
            Alert.alert('Error', 'Failed to replace image');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!file) return;

        try {
            setLoading(true);

            // Get auth token
            const token = await AsyncStorage.getItem('token');
            const downloadUrl = `${API_URL}/files/${file.id}/download`;
            const fileUri = FileSystem.documentDirectory + file.name;

            // Create download resumable
            const downloadResumable = FileSystem.createDownloadResumable(
                downloadUrl,
                fileUri,
                {
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                }
            );

            const downloadResult = await downloadResumable.downloadAsync();

            if (!downloadResult || !downloadResult.uri) {
                throw new Error('Download failed - no file received');
            }

            // Share/save the file using native share dialog
            if (await Sharing.isAvailableAsync()) {
                await Sharing.shareAsync(downloadResult.uri, {
                    mimeType: file.mimeType || 'application/octet-stream',
                    dialogTitle: `Save ${file.name}`,
                    UTI: file.mimeType || 'public.item',
                });
                Alert.alert('Success', isImage ? 'Image ready to save' : 'File ready to save');
            } else {
                Alert.alert('Error', 'Sharing is not available on this device');
            }
        } catch (error) {
            console.error('Download error:', error);
            Alert.alert('Error', `Failed to download file: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (!file) return null;

    return (
        <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
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
                    <View style={styles.headerContent}>
                        <Text
                            style={[styles.fileName, { color: colors.text }]}
                            numberOfLines={1}
                        >
                            {file.name}
                        </Text>

                        {!canEdit && (
                            <View
                                style={[
                                    styles.readOnlyBadge,
                                    { backgroundColor: colors.backgroundSecondary },
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.readOnlyText,
                                        { color: colors.textSecondary },
                                    ]}
                                >
                                    Read Only
                                </Text>
                            </View>
                        )}
                    </View>

                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={[styles.closeButtonText, { color: colors.text }]}>
                            ✕
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Body */}
                <ScrollView
                    style={styles.body}
                    contentContainerStyle={styles.bodyContent}
                >
                    {isImage ? (
                        <View style={styles.imageContainer}>
                            {loading && !imageUri ? (
                                <ActivityIndicator size="large" color={colors.tint} />
                            ) : imageError ? (
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={{ fontSize: 48, marginBottom: 12 }}>🖼️</Text>
                                    <Text
                                        style={[
                                            styles.loadingText,
                                            { color: colors.textSecondary },
                                        ]}
                                    >
                                        Failed to load image
                                    </Text>
                                    <TouchableOpacity
                                        style={[styles.retryButton, { marginTop: 16 }]}
                                        onPress={loadImage}
                                    >
                                        <Text style={{ color: colors.tint, fontSize: 16 }}>
                                            Retry
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            ) : imageUri ? (
                                <Image
                                    source={{ uri: imageUri }}
                                    style={styles.image}
                                    resizeMode="contain"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <Text
                                    style={[
                                        styles.loadingText,
                                        { color: colors.textSecondary },
                                    ]}
                                >
                                    Loading image...
                                </Text>
                            )}
                        </View>
                    ) : isTextFile ? (
                        <TextInput
                            style={[
                                styles.textArea,
                                {
                                    backgroundColor: canEdit
                                        ? colors.background
                                        : colors.backgroundSecondary,
                                    color: colors.text,
                                },
                            ]}
                            value={content}
                            onChangeText={setContent}
                            multiline
                            editable={canEdit}
                            placeholder="Enter text content..."
                            placeholderTextColor={colors.textSecondary}
                        />
                    ) : (
                        <View style={styles.downloadContainer}>
                            <Text style={{ fontSize: 48, marginBottom: 12 }}>📄</Text>

                            <Text
                                style={{
                                    fontSize: 16,
                                    fontWeight: '600',
                                    marginBottom: 16,
                                    textAlign: 'center',
                                    color: colors.text,
                                }}
                            >
                                {file.name}
                            </Text>

                            <TouchableOpacity
                                style={styles.downloadButton}
                                onPress={handleDownload}
                                disabled={loading}
                            >
                                {loading ? (
                                    <ActivityIndicator color={colors.tint} />
                                ) : (
                                    <>
                                        <Text style={styles.downloadIcon}>💾</Text>
                                        <Text
                                            style={[
                                                styles.downloadText,
                                                { color: colors.tint },
                                            ]}
                                        >
                                            Download file
                                        </Text>
                                    </>
                                )}
                            </TouchableOpacity>
                        </View>
                    )}
                </ScrollView>

                {/* Footer */}
                <View
                    style={[
                        styles.footer,
                        { backgroundColor: colors.backgroundSecondary },
                    ]}
                >
                    {canEdit && (
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={isImage ? handleReplaceImage : handleSave}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.primaryButtonText}>
                                    {isImage ? 'Replace Image' : 'Save'}
                                </Text>
                            )}
                        </TouchableOpacity>
                    )}

                    {isImage && (
                        <TouchableOpacity
                            style={styles.primaryButton}
                            onPress={handleDownload}
                            disabled={loading}
                        >
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.primaryButtonText}>
                                    Download Image
                                </Text>
                            )}
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity
                        style={styles.primaryButton}
                        onPress={onClose}
                    >
                        <Text style={styles.primaryButtonText}>Close</Text>
                    </TouchableOpacity>

                </View>
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
    headerContent: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    fileName: {
        ...Typography.title,
        fontSize: 18,
        fontWeight: '600',
        flex: 1,
    },
    readOnlyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    readOnlyText: {
        fontSize: 11,
    },
    closeButton: {
        padding: Spacing.sm,
        marginLeft: Spacing.sm,
    },
    closeButtonText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    body: {
        flex: 1,
    },
    bodyContent: {
        padding: Spacing.lg,
    },
    imageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
    },
    image: {
        width: '100%',
        height: 400,
    },
    loadingText: {
        ...Typography.body,
        padding: Spacing.xl,
    },
    retryButton: {
        padding: Spacing.sm,
    },
    textArea: {
        ...Typography.body,
        minHeight: 300,
        padding: Spacing.md,
        borderWidth: 1,
        borderColor: AppColors.border,
        borderRadius: 8,
        textAlignVertical: 'top',
    },
    downloadContainer: {
        alignItems: 'center',
        padding: Spacing.xl,
    },
    downloadButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    downloadIcon: {
        fontSize: 24,
    },
    downloadText: {
        ...Typography.body,
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        gap: Spacing.md,
        padding: Spacing.lg,
        borderTopWidth: 1,
        borderTopColor: AppColors.border,
    },
    primaryButton: {
        flex: 1,
        backgroundColor: '#1a73e8',
        paddingVertical: Spacing.md,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 44,
    },
    primaryButtonText: {
        ...Typography.body,
        color: AppColors.white,
        fontSize: 16,
        fontWeight: '600',
    },
    secondaryButton: {
        flex: 1,
        backgroundColor: AppColors.backgroundSecondary,
        paddingVertical: Spacing.md,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: AppColors.border,
        minHeight: 44,
    },
    secondaryButtonText: {
        ...Typography.body,
        fontSize: 16,
        fontWeight: '600',
    },
});
