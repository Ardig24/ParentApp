import { useState, useEffect } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text } from '../Text';
import { Button } from '../Button';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';

interface StorageInfo {
  totalSize: string;
  cacheSize: string;
  mediaSize: string;
}

interface DataStorageModalProps {
  visible: boolean;
  onClose: () => void;
}

export function DataStorageModal({ visible, onClose }: DataStorageModalProps) {
  const [loading, setLoading] = useState(false);
  const [storageInfo, setStorageInfo] = useState<StorageInfo>({
    totalSize: '0 MB',
    cacheSize: '0 MB',
    mediaSize: '0 MB',
  });

  useEffect(() => {
    if (visible) {
      calculateStorage();
    }
  }, [visible]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateStorage = async () => {
    try {
      setLoading(true);
      const cacheDir = FileSystem.cacheDirectory;
      const mediaDir = FileSystem.documentDirectory;

      if (cacheDir && mediaDir) {
        const [cacheInfo, mediaInfo] = await Promise.all([
          FileSystem.getInfoAsync(cacheDir, { size: true }),
          FileSystem.getInfoAsync(mediaDir, { size: true }),
        ]);

        const totalSize = (cacheInfo.size || 0) + (mediaInfo.size || 0);
        
        setStorageInfo({
          totalSize: formatSize(totalSize),
          cacheSize: formatSize(cacheInfo.size || 0),
          mediaSize: formatSize(mediaInfo.size || 0),
        });
      }
    } catch (error) {
      console.error('Error calculating storage:', error);
      Alert.alert('Error', 'Failed to calculate storage usage');
    } finally {
      setLoading(false);
    }
  };

  const clearCache = async () => {
    try {
      setLoading(true);
      const cacheDir = FileSystem.cacheDirectory;
      if (cacheDir) {
        await FileSystem.deleteAsync(cacheDir, { idempotent: true });
        await calculateStorage();
        Alert.alert('Success', 'Cache cleared successfully');
      }
    } catch (error) {
      console.error('Error clearing cache:', error);
      Alert.alert('Error', 'Failed to clear cache');
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'Are you sure you want to clear the app cache? This will free up space but may affect app performance temporarily.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: clearCache,
        },
      ]
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Data & Storage</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Storage Usage</Text>
              
              <View style={styles.storageItem}>
                <View style={styles.storageInfo}>
                  <Text style={styles.storageTitle}>Total Storage</Text>
                  <Text style={styles.storageValue}>{storageInfo.totalSize}</Text>
                </View>
                <View style={styles.storageBar}>
                  <View style={[styles.storageBarFill, { width: '100%' }]} />
                </View>
              </View>

              <View style={styles.storageItem}>
                <View style={styles.storageInfo}>
                  <Text style={styles.storageTitle}>Cache</Text>
                  <Text style={styles.storageValue}>{storageInfo.cacheSize}</Text>
                </View>
                <TouchableOpacity
                  style={styles.clearButton}
                  onPress={handleClearCache}
                  disabled={loading}
                >
                  <Text style={styles.clearButtonText}>Clear</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.storageItem}>
                <View style={styles.storageInfo}>
                  <Text style={styles.storageTitle}>Media</Text>
                  <Text style={styles.storageValue}>{storageInfo.mediaSize}</Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Auto-Delete Settings</Text>
              
              <TouchableOpacity style={styles.settingButton}>
                <View>
                  <Text style={styles.settingTitle}>Clear Old Media</Text>
                  <Text style={styles.settingDescription}>
                    Automatically delete media files older than 30 days
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.settingButton}>
                <View>
                  <Text style={styles.settingTitle}>Storage Limit</Text>
                  <Text style={styles.settingDescription}>
                    Set maximum storage limit for the app
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
  },
  storageItem: {
    marginBottom: 20,
  },
  storageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  storageTitle: {
    fontSize: 16,
    color: '#111827',
  },
  storageValue: {
    fontSize: 16,
    color: '#6b7280',
  },
  storageBar: {
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
  },
  storageBarFill: {
    height: '100%',
    backgroundColor: '#7c3aed',
    borderRadius: 2,
  },
  clearButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
});
