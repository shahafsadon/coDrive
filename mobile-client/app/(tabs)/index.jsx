import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, ImageBackground } from 'react-native';
import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { router } from 'expo-router';
import { api } from '@/services/api';
import { AppColors, Typography, Spacing } from '@/constants/appStyles';

export default function DriveScreen() {
  const { logout } = useAuth();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load files
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      setLoading(true);
      const response = await api.getFiles();
      
      if (response.error) {
        Alert.alert('Error', response.error);
        setFiles([]);
      } else {
        // Filter out trashed files
        const filesList = Array.isArray(response.data) 
          ? response.data.filter(f => !f.isTrashed)
          : [];
        setFiles(filesList);
      }
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to load files');
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/(auth)/login');
  };

  const handleFilePress = (file) => {
    if (file.type === 'folder') {
      Alert.alert('Folder', `Folder: ${file.name}`);
    } else {
      Alert.alert('File', `File: ${file.name}\nType: ${file.mimeType || 'unknown'}`);
    }
  };

  const getFileIcon = (file) => {
    if (file.type === 'folder') return '📁';
    if (file.mimeType?.startsWith('image/')) return '🖼️';
    if (file.mimeType === 'text/plain') return '📄';
    return '📎';
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const renderFile = ({ item }) => (
    <TouchableOpacity 
      style={styles.fileItem}
      onPress={() => handleFilePress(item)}
    >
      <View style={styles.fileIcon}>
        <Text style={styles.fileIconText}>{getFileIcon(item)}</Text>
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.fileDate}>{formatDate(item.createdAt)}</Text>
      </View>
      {item.isStarred && (
        <Text style={styles.starIcon}>⭐</Text>
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <ImageBackground
        source={require('@/assets/images/background.jpg')}
        style={{ flex: 1 }}
        resizeMode="cover"
      >
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={AppColors.primary} />
          <Text style={styles.loadingText}>Loading files...</Text>
        </View>
      </ImageBackground>
    );
  }

  return (
    <ImageBackground
      source={require('@/assets/images/background.jpg')}
      style={{ flex: 1 }}
      resizeMode="cover"
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Drive</Text>
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>

        {/* Files List */}
        {files.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📂</Text>
            <Text style={styles.emptyText}>No files yet</Text>
            <Text style={styles.emptySubtext}>Your files and folders will appear here</Text>
          </View>
        ) : (
          <FlatList
            data={files}
            renderItem={renderFile}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  loadingText: {
    marginTop: Spacing.md,
    ...Typography.bodySmall,
    color: AppColors.textSecondary,
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
  title: {
    ...Typography.h3,
    color: AppColors.text,
  },
  logoutButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
  },
  logoutText: {
    color: AppColors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  listContent: {
    padding: Spacing.md,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AppColors.white,
    padding: Spacing.md,
    borderRadius: 12,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: AppColors.border,
  },
  fileIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: AppColors.backgroundSecondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  fileIconText: {
    fontSize: 24,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    ...Typography.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  fileDate: {
    ...Typography.caption,
    color: AppColors.textSecondary,
  },
  starIcon: {
    fontSize: 18,
    marginLeft: Spacing.sm,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: Spacing.md,
  },
  emptyText: {
    ...Typography.h3,
    color: AppColors.text,
    marginBottom: Spacing.sm,
  },
  emptySubtext: {
    ...Typography.bodySmall,
    color: AppColors.textSecondary,
    textAlign: 'center',
  },
});
