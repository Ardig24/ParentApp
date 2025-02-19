import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Linking } from 'react-native';
import { Text } from '../Text';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import Constants from 'expo-constants';

interface AboutModalProps {
  visible: boolean;
  onClose: () => void;
}

const LINKS = [
  {
    id: 'website',
    label: 'Visit Website',
    icon: 'globe-outline' as const,
    url: 'https://parentapp.com',
  },
  {
    id: 'privacy',
    label: 'Privacy Policy',
    icon: 'shield-outline' as const,
    url: 'https://parentapp.com/privacy',
  },
  {
    id: 'terms',
    label: 'Terms of Service',
    icon: 'document-text-outline' as const,
    url: 'https://parentapp.com/terms',
  },
  {
    id: 'instagram',
    label: 'Follow on Instagram',
    icon: 'logo-instagram' as const,
    url: 'https://instagram.com/parentapp',
  },
  {
    id: 'twitter',
    label: 'Follow on Twitter',
    icon: 'logo-twitter' as const,
    url: 'https://twitter.com/parentapp',
  },
];

export function AboutModal({ visible, onClose }: AboutModalProps) {
  console.log('AboutModal render - visible:', visible);
  const version = Constants.expoConfig?.version || '1.0.0';
  const buildNumber = Constants.expoConfig?.ios?.buildNumber || '1';

  const handleOpenLink = (url: string) => {
    Linking.openURL(url);
  };

  console.log('AboutModal - attempting to render with icon from:', require('../../assets/images/icon.png'));

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
            <Text style={styles.modalTitle}>About</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.appInfo}>
              <Image
                source={{ uri: 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y' }}
                style={styles.appIcon}
                contentFit="contain"
              />
              <Text style={styles.appName}>Parent App</Text>
              <Text style={styles.version}>Version {version} ({buildNumber})</Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>About</Text>
              <Text style={styles.description}>
                Parent App helps you capture and cherish every precious moment of your child's growth. From milestones to memories, we're here to support your parenting journey.
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Links</Text>
              {LINKS.map((link) => (
                <TouchableOpacity
                  key={link.id}
                  style={styles.linkItem}
                  onPress={() => handleOpenLink(link.url)}
                >
                  <View style={styles.linkContent}>
                    <Ionicons name={link.icon} size={20} color="#7c3aed" />
                    <Text style={styles.linkText}>{link.label}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Credits</Text>
              <Text style={styles.description}>
                Made with ❤️ by the Parent App team
              </Text>
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
    minHeight: '50%',  // Added minimum height
    width: '100%',     // Ensure full width
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
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
    flex: 1,
  },
  appInfo: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#7c3aed10',
  },
  appIcon: {
    width: 80,
    height: 80,
    marginBottom: 12,
  },
  appName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  version: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    lineHeight: 20,
    color: '#4b5563',
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  linkContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    marginLeft: 12,
    fontSize: 16,
    color: '#111827',
  },
});
