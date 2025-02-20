import React from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../Text';
import { Modal } from '../Modal';
import { useStore } from '../../lib/store';
import type { Child, StoreState } from '../../lib/store';

interface ChildSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

const PLACEHOLDER_AVATAR = 'https://images.unsplash.com/photo-1602030028438-4cf153cbae66?q=80&w=300&auto=format&fit=crop';

export function ChildSelectorModal({ visible, onClose }: ChildSelectorModalProps) {
  const { children, selectedChild, selectChild } = useStore() as StoreState;

  const handleSelectChild = (child: Child) => {
    selectChild(child);
    onClose();
  };

  return (
    <Modal visible={visible} onClose={onClose} title="Select Child">
      <ScrollView style={styles.container}>
        {children.map((child) => (
          <Pressable
            key={child.id}
            style={[
              styles.childItem,
              child.id === selectedChild?.id && styles.selectedChild,
            ]}
            onPress={() => handleSelectChild(child)}
          >
            <Image
              source={child.avatarUrl || PLACEHOLDER_AVATAR}
              style={styles.avatar}
              contentFit="cover"
              transition={1000}
            />
            <View style={styles.childInfo}>
              <Text style={styles.childName}>{child.name}</Text>
              <Text style={styles.childAge}>
                {calculateAge(child.birthDate)}
              </Text>
            </View>
            {child.id === selectedChild?.id && (
              <Ionicons name="checkmark-circle" size={24} color="#7c3aed" />
            )}
          </Pressable>
        ))}
      </ScrollView>
    </Modal>
  );
}

const calculateAge = (birthDate: string) => {
  const birth = new Date(birthDate);
  const now = new Date();
  const years = now.getFullYear() - birth.getFullYear();
  const months = now.getMonth() - birth.getMonth();
  
  if (months < 0) {
    return `${years - 1} years, ${months + 12} months`;
  }
  return `${years} years, ${months} months`;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  childItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  selectedChild: {
    backgroundColor: '#f5f3ff',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  childAge: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
});
