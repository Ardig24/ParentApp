import { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Alert, Platform } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '../Text';
import { Input } from '../Input';
import { Button } from '../Button';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useImageUpload } from '../../hooks/useImageUpload';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { Child } from './ChildrenSection';

interface ChildModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (child: Omit<Child, 'id' | 'parent_id'>) => Promise<void>;
  child?: Child;
}

export function ChildModal({ visible, onClose, onSave, child }: ChildModalProps) {
  const [name, setName] = useState(child?.name || '');
  const [birthDate, setBirthDate] = useState(child?.birth_date ? new Date(child.birth_date) : new Date());
  const [avatarUrl, setAvatarUrl] = useState(child?.avatar_url || '');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter a name');
      return;
    }

    setSaving(true);
    try {
      await onSave({
        name: name.trim(),
        birth_date: birthDate.toISOString(),
        avatar_url: avatarUrl,
      });
      onClose();
    } catch (error) {
      console.error('Error saving child:', error);
      Alert.alert('Error', 'Failed to save child');
    } finally {
      setSaving(false);
    }
  };

  const { pickImage: pickAndUploadImage, loading: uploadingImage } = useImageUpload({
    bucketName: 'avatars',
    folderPath: 'children',
  });

  const handleImagePick = async () => {
    const url = await pickAndUploadImage();
    if (url) {
      setAvatarUrl(url);
    }
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
            <Text style={styles.modalTitle}>{child ? 'Edit Child' : 'Add Child'}</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.avatarContainer} onPress={handleImagePick}>
            <Image
              source={avatarUrl || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
              style={styles.avatar}
              contentFit="cover"
              transition={1000}
            />
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={14} color="#fff" />
            </View>
          </TouchableOpacity>

          <Input
            label="Name"
            value={name}
            onChangeText={setName}
            placeholder="Enter child's name"
          />

          <TouchableOpacity 
            style={styles.dateButton}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateLabel}>Birth Date</Text>
            <Text style={styles.dateValue}>
              {birthDate.toLocaleDateString()}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={birthDate}
              mode="date"
              display="default"
              onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                setShowDatePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setBirthDate(selectedDate);
                }
              }}
            />
          )}

          <View style={styles.buttons}>
            <Button
              title={child ? 'Save Changes' : 'Add Child'}
              onPress={handleSave}
              loading={saving || uploadingImage}
            />
          </View>
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
    padding: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  closeButton: {
    padding: 4,
  },
  avatarContainer: {
    alignSelf: 'center',
    marginBottom: 20,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    backgroundColor: '#7c3aed',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  dateButton: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    color: '#111827',
    padding: 12,
    backgroundColor: '#f3f4f6',
    borderRadius: 8,
  },
  buttons: {
    marginTop: 20,
  },
});
