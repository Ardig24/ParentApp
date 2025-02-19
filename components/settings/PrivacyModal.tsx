import { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Text } from '../Text';
import { Card } from '../Card';
import { Ionicons } from '@expo/vector-icons';

interface PrivacySettings {
  shareData: boolean;
  analytics: boolean;
  personalization: boolean;
  thirdParty: boolean;
}

interface PrivacyModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (settings: PrivacySettings) => void;
  initialSettings: PrivacySettings;
}

export function PrivacyModal({ visible, onClose, onSave, initialSettings }: PrivacyModalProps) {
  const [settings, setSettings] = useState<PrivacySettings>(initialSettings);

  const handleSave = () => {
    onSave(settings);
    onClose();
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
            <Text style={styles.modalTitle}>Privacy Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Share Usage Data</Text>
                  <Text style={styles.settingDescription}>
                    Help us improve by sharing anonymous usage data
                  </Text>
                </View>
                <Switch
                  value={settings.shareData}
                  onValueChange={(value) => setSettings({ ...settings, shareData: value })}
                  trackColor={{ false: '#e5e5e5', true: '#7c3aed' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Analytics</Text>
                  <Text style={styles.settingDescription}>
                    Allow analytics to improve app performance
                  </Text>
                </View>
                <Switch
                  value={settings.analytics}
                  onValueChange={(value) => setSettings({ ...settings, analytics: value })}
                  trackColor={{ false: '#e5e5e5', true: '#7c3aed' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Personalization</Text>
                  <Text style={styles.settingDescription}>
                    Allow personalized content and recommendations
                  </Text>
                </View>
                <Switch
                  value={settings.personalization}
                  onValueChange={(value) => setSettings({ ...settings, personalization: value })}
                  trackColor={{ false: '#e5e5e5', true: '#7c3aed' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Third-Party Services</Text>
                  <Text style={styles.settingDescription}>
                    Allow integration with third-party services
                  </Text>
                </View>
                <Switch
                  value={settings.thirdParty}
                  onValueChange={(value) => setSettings({ ...settings, thirdParty: value })}
                  trackColor={{ false: '#e5e5e5', true: '#7c3aed' }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
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
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
  saveButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
