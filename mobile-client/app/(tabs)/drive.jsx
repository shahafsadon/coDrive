/**
 * Drive Screen - Main file browser
 * Full implementation based on web-client DrivePage.jsx
 * Includes: browsing, navigation, CRUD operations, star, trash
 */

import { useState, useEffect, useCallback } from 'react';
import { 
    View, 
    FlatList, 
    StyleSheet, 
    RefreshControl, 
    Alert,
    ImageBackground,
    TouchableOpacity,
    Text,
    Image,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '@/context/AuthContext';
import { router, useFocusEffect } from 'expo-router';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';
import { useTheme } from '@/context/ThemeContext';
import { FileItem } from '@/components/FileItem';
import { FileItemGrid } from '@/components/FileItemGrid';
import { FileActionsModal } from '@/components/FileActionsModal';
import { FileViewer } from '@/components/FileViewer';
import { DriveHeader } from '@/components/DriveHeader';
import { SideDrawer } from '@/components/SideDrawer';
import { ProfileModal } from '@/components/ProfileModal';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { InputModal } from '@/components/InputModal';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { ShareModal } from '@/components/ShareModal';
import {
    getFiles,
    searchFiles,
    createFile,
    renameFile,
    moveFile,
    updateFile,
    deleteFilePermanent,
    uploadFile,
    uploadImageFile,
    toggleStar,
    restoreFile,
    copyShareableLink,
    downloadFile
} from '@/services/filesService';
import { logger } from '@/services/logger';

export default function DriveScreen({ mode = 'drive' }) {
    const { logout, user, isAuthenticated, loading: authLoading } = useAuth();
    const { isDarkMode, toggleTheme, colors } = useTheme();
    
    // State
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [currentFolderId, setCurrentFolderId] = useState(null);
    const [breadcrumbs, setBreadcrumbs] = useState([{ id: null, name: 'Home' }]);
    const [searchTerm, setSearchTerm] = useState('');
    const [shareFile, setShareFile] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null); // For actions modal
    const [actionsModalVisible, setActionsModalVisible] = useState(false);
    const [viewerFile, setViewerFile] = useState(null); // For file viewer
    const [drawerVisible, setDrawerVisible] = useState(false); // Side drawer
    const [profileVisible, setProfileVisible] = useState(false); // Profile modal
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
    
    // Modal state
    const [inputModal, setInputModal] = useState({
        visible: false,
        title: '',
        value: '',
        placeholder: '',
        action: null,
        showRootOption: false
    });

    // Load files data
    const loadData = useCallback(async (isRefreshing = false) => {
        if (authLoading || !isAuthenticated) {
            return;
        }
        if (isRefreshing) {
            setRefreshing(true);
        } else {
            setLoading(true);
        }
        
        try {
            let filesList = [];

            // Search mode
            if (searchTerm) {
                const data = await searchFiles(searchTerm);
                filesList = Array.isArray(data) ? data : [];
                setFiles(filesList);
                return;
            }

            // Normal mode - get files
            const data = await getFiles(currentFolderId);

            logger.info('DriveScreen', `Loaded ${Array.isArray(data) ? data.length : (data?.children?.length || 0)} files from server`);

            if (Array.isArray(data)) {
                filesList = data;
            } else if (data?.children) {
                filesList = data.children;
            }

            // Log shared files BEFORE filtering
            const sharedCount = filesList.filter(f => f.isSharedWithMe).length;
            const trashedCount = filesList.filter(f => f.isTrashed).length;
            logger.info('DriveScreen', `Found ${sharedCount} shared files, ${trashedCount} trashed files before filtering`);

            // Apply filters based on mode
            if (mode === 'trash') {
                filesList = filesList.filter(f => f.isTrashed);
            } else if (mode === 'starred') {
                // Starred: show only starred files that are NOT trashed
                const starredBeforeFilter = filesList.filter(f => f.isStarred).length;
                filesList = filesList.filter(f => f.isStarred && !f.isTrashed);
                logger.info('DriveScreen', `Starred mode: ${starredBeforeFilter} starred files, ${filesList.length} after removing trashed`);
            } else {
                // All other modes: filter out trashed files
                filesList = filesList.filter(f => !f.isTrashed);
            }

            // Home mode: show own files + shared files (no filter needed beyond !isTrashed)
            // Files (mydrive) mode: show only own files (filter out shared)
            // Shared mode: show only shared files
            if (mode === 'shared') {
                filesList = filesList.filter(f => f.isSharedWithMe);
                logger.info('DriveScreen', `Shared mode: ${filesList.length} files (isSharedWithMe=true)`);
            } else if (mode === 'mydrive') {
                filesList = filesList.filter(f => !f.isSharedWithMe);
                logger.info('DriveScreen', `MyDrive mode: ${filesList.length} files (isSharedWithMe=false)`);
            } else if (mode === 'drive') {
                logger.info('DriveScreen', `Home mode: ${filesList.length} total files`);
            }

            // Recent mode: sort by modified/updated date (newest first)
            if (mode === 'recent') {
                filesList.sort((a, b) => {
                    const dateA = a.modifiedAt || a.updatedAt || a.createdAt ? new Date(a.modifiedAt || a.updatedAt || a.createdAt) : 0;
                    const dateB = b.modifiedAt || b.updatedAt || b.createdAt ? new Date(b.modifiedAt || b.updatedAt || b.createdAt) : 0;
                    return dateB - dateA;
                });
            }

            setFiles(filesList);
        } catch (err) {
            logger.error('DriveScreen', 'Failed to load files', err);
            Alert.alert('Error', err.message || 'Failed to load files');
            setFiles([]);
        } finally {
            if (isRefreshing) {
                setRefreshing(false);
            } else {
                setLoading(false);
            }
        }
    }, [searchTerm, currentFolderId, mode]);

    // Load data on mount and when dependencies change
    useEffect(() => {
        if (authLoading || !isAuthenticated) return;
        loadData();
    }, [loadData, authLoading, isAuthenticated]);

    // Reload data when tab comes into focus (fixes sync issues between tabs)
    useFocusEffect(
        useCallback(() => {
            if (authLoading || !isAuthenticated) return;
            logger.info('DriveScreen', `Tab focused, reloading data for mode: ${mode}`);
            loadData();
        }, [loadData, mode, authLoading, isAuthenticated])
    );


    // Reset folder navigation when changing modes
    useEffect(() => {
        setCurrentFolderId(null);
    }, [mode]);

    // Update breadcrumbs
    useEffect(() => {
        // Don't reset breadcrumbs if we're navigating folders (currentFolderId is set)
        if (currentFolderId) return;
        
        if (searchTerm) {
            setBreadcrumbs([{ id: null, name: `Results for "${searchTerm}"` }]);
        } else if (mode === 'drive') {
            setBreadcrumbs([{ id: null, name: 'Home' }]);
        } else if (mode === 'mydrive') {
            setBreadcrumbs([{ id: null, name: 'Files' }]);
        } else if (mode === 'shared') {
            setBreadcrumbs([{ id: null, name: 'Shared' }]);
        } else if (mode === 'starred') {
            setBreadcrumbs([{ id: null, name: 'Starred' }]);
        } else if (mode === 'trash') {
            setBreadcrumbs([{ id: null, name: 'Trash' }]);
        }
    }, [searchTerm, mode, currentFolderId]);

    // Pull to refresh
    const onRefresh = () => {
        loadData(true);
    };

    // Handle file/folder press
    const handleFilePress = async (file) => {
        try {
            if (file.type === 'folder') {
                enterFolder(file);
                return;
            }

            // Load full file with content for text files
            if (file.mimeType === 'text/plain' && !file.content) {
                const { getFileById } = await import('@/services/filesService');
                const fullFile = await getFileById(file.id);
                setViewerFile(fullFile);
            } else {
                setViewerFile(file);
            }
        } catch (err) {
            logger.error('DriveScreen', 'Failed to open file', err);
            Alert.alert('Error', 'Cannot open file');
        }
    };

    // Enter folder
    const enterFolder = (folder) => {
        if (searchTerm) return;
        
        setCurrentFolderId(folder.id);
        setBreadcrumbs(prev => [...prev, { id: folder.id, name: folder.name }]);
    };

    // Navigate breadcrumb
    const handleBreadcrumbNavigate = (item, index) => {
        setCurrentFolderId(item.id);
        setBreadcrumbs(prev => prev.slice(0, index + 1));
    };

    // Open input modal
    const openInputModal = (title, placeholder, defaultValue, action, showRootOption = false) => {
        setInputModal({
            visible: true,
            title,
            placeholder,
            value: defaultValue || '',
            action,
            showRootOption
        });
    };

    // Handle input modal submit
    const handleInputSubmit = async () => {
        try {
            if (inputModal.action) {
                await inputModal.action(inputModal.value);
            }
            setInputModal({ ...inputModal, visible: false });
            loadData();
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    // Handle move to root
    const handleMoveToRoot = async () => {
        try {
            if (inputModal.action) {
                await inputModal.action('');
            }
            setInputModal({ ...inputModal, visible: false });
            loadData();
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    // Create folder
    const handleCreateFolder = () => {
        openInputModal(
            'New Folder',
            'Folder name',
            '',
            async (name) => {
                if (name) await createFile(name, 'folder', currentFolderId);
            }
        );
    };

    // Create text file
    const handleCreateTextFile = () => {
        openInputModal(
            'New File',
            'File name',
            '',
            async (name) => {
                if (name) await createFile(name, 'file', currentFolderId);
            }
        );
    };

    // Upload file
    const handleUploadFile = async () => {
        try {
            // Request permissions first
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Camera roll permission is required');
                return;
            }

            // Pick file
            const result = await DocumentPicker.getDocumentAsync({
                type: '*/*',
                copyToCacheDirectory: true
            });

            if (result.canceled) return;

            const file = result.assets[0];
            await uploadFile(file.name, currentFolderId, file);
            loadData();
            Alert.alert('Success', 'File uploaded');
        } catch (err) {
            logger.error('DriveScreen', 'Upload failed', err);
            Alert.alert('Error', 'Failed to upload file');
        }
    };

    // Rename file/folder
    const handleRename = (file) => {
        openInputModal(
            'Rename',
            'New name',
            file.name,
            async (newName) => {
                if (newName && newName !== file.name) {
                    await renameFile(file.id, newName);
                }
            }
        );
    };

    // Move file/folder
    const handleMove = (file) => {
        openInputModal(
            'Move to Folder',
            'Folder name (or leave empty for root)',
            '',
            async (targetName) => {
                await moveFile(file.id, targetName);
            },
            true
        );
    };

    // Delete file/folder
    const handleDelete = (fileId) => {
        const file = files.find(f => f.id === fileId);
        if (!file) return;
        
        const message = mode === 'trash' 
            ? 'This will permanently delete the item. Continue?' 
            : 'Move to trash?';
        
        Alert.alert(
            'Confirm',
            message,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: mode === 'trash' ? 'Delete Forever' : 'Move to Trash',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            if (mode === 'trash') {
                                logger.info('DriveScreen', `Deleting permanently: ${fileId}`);
                                await deleteFilePermanent(fileId);
                                Alert.alert('Success', 'File deleted permanently');
                            } else {
                                logger.info('DriveScreen', `Moving to trash: ${fileId}`);
                                await updateFile(fileId, { isTrashed: true });
                                logger.info('DriveScreen', 'Moved to trash successfully');
                                Alert.alert('Success', 'Moved to trash');
                            }
                            await loadData();
                        } catch (err) {
                            Alert.alert('Error', err.message);
                        }
                    }
                }
            ]
        );
    };

    // Toggle star
    const handleToggleStar = async (file) => {
        try {
            const newStarredValue = !file.isStarred;
            logger.info('DriveScreen', `Toggling star for ${file.name}: ${file.isStarred} -> ${newStarredValue}`);
            // Use updateFile to toggle the current value, like web-client
            await updateFile(file.id, { isStarred: newStarredValue });
            logger.info('DriveScreen', 'Star toggled successfully, reloading data');
            await loadData();
        } catch (err) {
            logger.error('DriveScreen', 'Failed to toggle star', err);
            Alert.alert('Error', err.message);
        }
    };

    // Upload image file (replaces take photo)
    const handleUploadImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Camera roll permission is required');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                allowsEditing: false,
                quality: 1,
            });

            if (result.canceled) return;

            const asset = result.assets[0];
            const fileName = asset.uri.split('/').pop() || 'image.jpg';
            
            await uploadImageFile(fileName, currentFolderId, asset.uri);
            loadData();
            Alert.alert('Success', 'Image uploaded');
        } catch (err) {
            logger.error('DriveScreen', 'Image upload failed', err);
            Alert.alert('Error', 'Failed to upload image');
        }
    };

    // Upload folder 
    const handleUploadFolder = async () => {
        Alert.alert(
            'Upload Folder',
            'Folder upload is not directly supported on mobile. You can:\n\n1. Create a folder first\n2. Then upload files into it one by one',
            [{ text: 'OK' }]
        );
    };

    // Share file
    const handleShare = (file) => {
        setShareFile(file);
    };

    const closeShareModal = () => {
        setShareFile(null);
        loadData(); // Refresh to show updated permissions
    };

    // Restore from trash
    const handleRestore = async (fileId) => {
        try {
            logger.info('DriveScreen', `Restoring from trash: ${fileId}`);
            // Use updateFile to set isTrashed: false, like web-client
            await updateFile(fileId, { isTrashed: false });
            logger.info('DriveScreen', 'Restored successfully, reloading data');
            await loadData();
            Alert.alert('Success', 'File restored');
        } catch (err) {
            Alert.alert('Error', err.message);
        }
    };

    // Handle menu button press (opens actions modal)
    const handleMenuPress = (file) => {
        setSelectedFile(file);
        setActionsModalVisible(true);
    };

    // Download file
    const handleDownload = async (file) => {
        try {
            // For now, just alert - full download requires FileSystem API
            Alert.alert('Download', `File: ${file.name}\nThis will download the file to your device`);
            // const url = await downloadFile(file.id, file.name);
            // Implement actual download with expo-file-system if needed
        } catch (err) {
            Alert.alert('Error', 'Failed to download file');
        }
    };

    // Copy link
    const handleCopyLink = async (file) => {
        try {
            const link = await copyShareableLink(file.id);
            Alert.alert(
                'Shareable Link',
                link,
                [
                    { text: 'OK', style: 'default' }
                ]
            );
        } catch (err) {
            Alert.alert('Error', 'Failed to generate link');
        }
    };

    // Handle hamburger menu press
    const handleHamburgerMenu = () => {
        setDrawerVisible(true);
    };

    // Handle profile press
    const handleProfilePress = () => {
        setProfileVisible(true);
    };

    // Handle theme toggle
    const handleThemeToggle = () => {
        toggleTheme(); // Call the theme context function
    };

    // Toggle view mode
    const handleToggleView = () => {
        setViewMode(prevMode => prevMode === 'list' ? 'grid' : 'list');
    };

    // Navigate to trash
    const handleGoToTrash = () => {
        router.push('/(tabs)/trash');
    };

    // Navigate to recent - show Home with recent sort
    const handleGoToRecent = () => {
        // Navigate to Home tab (which will show all files)
        router.push('/(tabs)');
        // Note: The Home tab will need to implement recent sorting
    };

    // Logout
    const handleLogout = async () => {
        await logout();
        router.replace('/(auth)/login');
    };

    // Render file item
    const renderFile = ({ item }) => {
        if (viewMode === 'grid') {
            return (
                <FileItemGrid
                    file={item}
                    onPress={() => handleFilePress(item)}
                    onMenuPress={handleMenuPress}
                />
            );
        }
        return (
            <FileItem
                file={item}
                onPress={() => handleFilePress(item)}
                onMenuPress={handleMenuPress}
            />
        );
    };

    // Empty state
    const renderEmpty = () => {
        let icon = '📂';
        let text = 'No files';
        let subtext = 'Tap + to create files and folders';

        if (mode === 'trash') {
            icon = '🗑️';
            text = 'Trash is empty';
            subtext = 'Items in trash will be deleted forever after 30 days';
        } else if (mode === 'starred') {
            icon = '⭐';
            text = 'No starred files';
            subtext = 'Add stars to items you want to easily find later';
        } else if (mode === 'shared') {
            icon = '👥';
            text = 'No shared files';
            subtext = 'Files shared with you will appear here';
        }

        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyIcon}>{icon}</Text>
                <Text style={styles.emptyText}>{text}</Text>
                <Text style={styles.emptySubtext}>{subtext}</Text>
            </View>
        );
    };

    return (
        <ImageBackground
            source={require('@/assets/images/background.jpg')}
            style={{ flex: 1 }}
            resizeMode="cover"
        >
            {/* Dark mode overlay */}
            {isDarkMode && (
                <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Dark overlay
                }} />
            )}
            <View style={[styles.container, { backgroundColor: isDarkMode ? 'transparent' : 'transparent' }]}>
                {/* Drive Header with search, menu, profile */}
                <DriveHeader
                    onMenuPress={handleHamburgerMenu}
                    onSearchChange={setSearchTerm}
                    searchValue={searchTerm}
                    onProfilePress={handleProfilePress}
                    onThemeToggle={handleThemeToggle}
                    userName={user?.username || 'User'}
                />

                {/* Breadcrumbs - show in drive and mydrive modes */}
                {(mode === 'drive' || mode === 'mydrive') && !searchTerm && breadcrumbs.length > 1 && (
                    <Breadcrumbs
                        items={breadcrumbs}
                        onNavigate={handleBreadcrumbNavigate}
                    />
                )}

                {/* Logo - show only in Home tab when at root */}
                {mode === 'mydrive' && !searchTerm && breadcrumbs.length === 1 && (
                    <View style={{
                        alignItems: 'center',
                        paddingVertical: 20,
                        paddingHorizontal: 20,
                    }}>
                        <Image
                            source={require('@/assets/images/logo.png')}
                            style={{
                                width: 250,
                                height: 70,
                                resizeMode: 'contain',
                                opacity: isDarkMode ? 0.9 : 1,
                            }}
                        />
                    </View>
                )}

                {/* View Toggle Button - only in home and files */}
                {(mode === 'drive' || mode === 'mydrive') && (
                    <View style={styles.viewToggleContainer}>
                        <TouchableOpacity
                            style={styles.viewToggleButton}
                            onPress={handleToggleView}
                        >
                            <Text style={styles.viewToggleIcon}>
                                {viewMode === 'list' ? '▦' : '☰'}
                            </Text>
                            <Text style={styles.viewToggleText}>
                                {viewMode === 'list' ? 'Grid View' : 'List View'}
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* File List */}
                <FlatList
                    key={viewMode}
                    data={files}
                    renderItem={renderFile}
                    keyExtractor={(item) => String(item.id || item._id || Math.random())}
                    contentContainerStyle={styles.listContent}
                    ListEmptyComponent={!loading ? renderEmpty : null}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            colors={[AppColors.primary]}
                            tintColor={AppColors.primary}
                        />
                    }
                />

                {/* FAB for create actions - show in all tabs except trash */}
                {mode !== 'trash' && !searchTerm && (
                    <FloatingActionButton
                        onUploadFile={handleUploadFile}
                        onUploadImage={handleUploadImage}
                        onCreateTextFile={handleCreateTextFile}
                        onCreateFolder={handleCreateFolder}
                    />
                )}

                {/* Input Modal */}
                <InputModal
                    visible={inputModal.visible}
                    title={inputModal.title}
                    placeholder={inputModal.placeholder}
                    value={inputModal.value}
                    onChangeText={(text) => setInputModal({...inputModal, value: text})}
                    onSubmit={handleInputSubmit}
                    onCancel={() => setInputModal({...inputModal, visible: false})}
                    showRootOption={inputModal.showRootOption}
                    onMoveToRoot={handleMoveToRoot}
                />

                {/* File Actions Modal */}
                <FileActionsModal
                    visible={actionsModalVisible}
                    file={selectedFile}
                    mode={mode}
                    onClose={() => {
                        setActionsModalVisible(false);
                        setSelectedFile(null);
                    }}
                    onStar={handleToggleStar}
                    onDownload={handleDownload}
                    onShare={handleShare}
                    onRename={handleRename}
                    onMoveToTrash={handleDelete}
                    onMoveToFolder={handleMove}
                    onCopyLink={handleCopyLink}
                    onRestore={handleRestore}
                />

                {/* Share Modal */}
                {shareFile && (
                    <ShareModal
                        file={shareFile}
                        onClose={closeShareModal}
                    />
                )}

                {/* File Viewer */}
                {viewerFile && (
                    <FileViewer
                        visible={true}
                        file={viewerFile}
                        onClose={() => {
                            setViewerFile(null);
                            loadData(); // Refresh after closing
                        }}
                        onRefresh={loadData}
                    />
                )}

                {/* Side Drawer */}
                <SideDrawer
                    visible={drawerVisible}
                    onClose={() => setDrawerVisible(false)}
                    onLogout={handleLogout}
                    onTrash={handleGoToTrash}
                    onRecents={handleGoToRecent}
                />

                {/* Profile Modal */}
                <ProfileModal
                    visible={profileVisible}
                    user={user}
                    onClose={() => setProfileVisible(false)}
                />
            </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        backgroundColor: AppColors.white,
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
    },
    backButton: {
        marginRight: Spacing.md,
    },
    backButtonText: {
        color: AppColors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    headerActions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.md,
    },
    headerButton: {
        padding: Spacing.xs,
    },
    headerButtonText: {
        fontSize: 24,
    },
    title: {
        ...Typography.h3,
    },
    logoutText: {
        color: AppColors.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    listContent: {
        padding: Spacing.md,
        flexGrow: 1,
    },
    gridRow: {
        justifyContent: 'space-between',
    },
    viewToggleContainer: {
        paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.sm,
    },
    viewToggleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-end',
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        borderRadius: 8,
    },
    viewToggleIcon: {
        fontSize: 18,
        marginRight: Spacing.xs,
        color: AppColors.textSecondary,
    },
    viewToggleText: {
        ...Typography.caption,
        fontSize: 13,
        color: AppColors.textSecondary,
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: Spacing.xxl,
    },
    emptyIcon: {
        fontSize: 64,
        marginBottom: Spacing.md,
    },
    emptyText: {
        ...Typography.h3,
        marginBottom: Spacing.sm,
    },
    emptySubtext: {
        ...Typography.bodySmall,
        color: AppColors.textSecondary,
        textAlign: 'center',
    },
});
