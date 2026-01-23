/**
 * FileViewer Component
 * Displays and allows editing of file content
 * Text files: editable textarea with Save button
 * Images: display image with Replace Image button
 * Other files: download link
 */

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
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';
import { updateFile, replaceImage } from '@/services/filesService';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function FileViewer({ visible, file, onClose, onRefresh }) {
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);
    const [imageUri, setImageUri] = useState(null);

    const canEdit = file?.accessLevel === 'write';
    const isImage = file?.mimeType?.startsWith('image/');
    const isTextFile = file?.mimeType === 'text/plain' || !file?.filePath;
    const insets = useSafeAreaInsets();

    useEffect(() => {
        if (file) {
            setContent(file.content || '');
            
            // Load image if file is an image
            if (isImage && file.filePath) {
                // In mobile, we'll use the API endpoint to load the image
                const token = localStorage.getItem('token');
                setImageUri(`http://localhost:3000/api/files/${file.id}/download?token=${token}`);
            }
        }
    }, [file, isImage]);

    const handleSave = async () => {
        if (!canEdit || !file) return;
        
        try {
            setLoading(true);
            await updateFile(file.id, { content });
            Alert.alert('Success', 'File saved successfully');
            if (onRefresh) onRefresh();
            onClose();
        } catch (error) {
            Alert.alert('Error', 'Failed to save file');
        } finally {
            setLoading(false);
        }
    };

    const handleReplaceImage = async () => {
        if (!canEdit || !file) return;

        try {
            // Request permission
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            
            if (!permissionResult.granted) {
                Alert.alert('Permission Required', 'Please allow access to your photo library');
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                setLoading(true);
                const imageAsset = result.assets[0];
                
                await replaceImage(file.id, imageAsset.uri);
                
                Alert.alert('Success', 'Image replaced successfully');
                if (onRefresh) onRefresh();
                onClose();
            }
        } catch (error) {
            console.error('Replace image error:', error);
            Alert.alert('Error', 'Failed to replace image');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = () => {
        // Download will be implemented separately
        Alert.alert('Download', 'Download functionality will open the file');
    };

    if (!file) return null;

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={onClose}
        >
            <View style={styles.container}>
                {/* Header */}
                <View
                    style={[
                        styles.header,
                        {
                            paddingTop: insets.top,
                        },
                    ]}
                >
                <View style={styles.headerContent}>
                        <Text style={styles.fileName} numberOfLines={1}>
                            {file.name}
                        </Text>
                        {!canEdit && (
                            <View style={styles.readOnlyBadge}>
                                <Text style={styles.readOnlyText}>Read Only</Text>
                            </View>
                        )}
                    </View>
                    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                        <Text style={styles.closeButtonText}>✕</Text>
                    </TouchableOpacity>
                </View>

                {/* Body */}
                <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
                    {isImage ? (
                        <View style={styles.imageContainer}>
                            {imageUri ? (
                                <Image
                                    source={{ uri: imageUri }}
                                    style={styles.image}
                                    resizeMode="contain"
                                />
                            ) : (
                                <Text style={styles.loadingText}>Loading image...</Text>
                            )}
                        </View>
                    ) : (
                        <>
                            {isTextFile ? (
                                <TextInput
                                    style={[
                                        styles.textArea,
                                        !canEdit && styles.textAreaReadOnly
                                    ]}
                                    value={content}
                                    onChangeText={setContent}
                                    multiline
                                    editable={canEdit}
                                    placeholder="Enter text content..."
                                    placeholderTextColor={AppColors.textSecondary}
                                />
                            ) : (
                                <View style={styles.downloadContainer}>
                                    <TouchableOpacity
                                        style={styles.downloadButton}
                                        onPress={handleDownload}
                                    >
                                        <Text style={styles.downloadIcon}>⬇️</Text>
                                        <Text style={styles.downloadText}>Download file</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>

                {/* Footer Actions */}
                <View style={styles.footer}>
                    {canEdit && (
                        <>
                            {isImage ? (
                                <TouchableOpacity
                                    style={styles.primaryButton}
                                    onPress={handleReplaceImage}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <ActivityIndicator color={AppColors.white} />
                                    ) : (
                                        <Text style={styles.primaryButtonText}>Replace Image</Text>
                                    )}
                                </TouchableOpacity>
                            ) : (
                                isTextFile && (
                                    <TouchableOpacity
                                        style={styles.primaryButton}
                                        onPress={handleSave}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <ActivityIndicator color={AppColors.white} />
                                        ) : (
                                            <Text style={styles.primaryButtonText}>Save</Text>
                                        )}
                                    </TouchableOpacity>
                                )
                            )}
                        </>
                    )}
                    <TouchableOpacity
                        style={styles.secondaryButton}
                        onPress={onClose}
                    >
                        <Text style={styles.secondaryButtonText}>Close</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: AppColors.white,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
        backgroundColor: AppColors.backgroundSecondary,
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
        color: AppColors.text,
        flex: 1,
    },
    readOnlyBadge: {
        backgroundColor: '#eee',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 4,
    },
    readOnlyText: {
        fontSize: 11,
        color: '#666',
    },
    closeButton: {
        padding: Spacing.sm,
        marginLeft: Spacing.sm,
    },
    closeButtonText: {
        fontSize: 24,
        color: AppColors.text,
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
        color: AppColors.textSecondary,
        padding: Spacing.xl,
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
    textAreaReadOnly: {
        backgroundColor: '#f9f9f9',
        color: '#555',
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
        color: '#1a73e8',
        fontSize: 16,
        fontWeight: '500',
    },
    footer: {
        flexDirection: 'row',
        gap: Spacing.md,
        padding: Spacing.lg,
        borderTopWidth: 1,
        borderTopColor: AppColors.border,
        backgroundColor: AppColors.backgroundSecondary,
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
        color: AppColors.text,
        fontSize: 16,
        fontWeight: '600',
    },
});
