import { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, Switch, ScrollView, Alert } from 'react-native';
import { Text } from '../Text';
import { Button } from '../Button';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';

interface SecuritySettings {
  biometricEnabled: boolean;
  twoFactorEnabled: boolean;
  appLockEnabled: boolean;
  screenCaptureEnabled: boolean;
}

interface SecurityModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (settings: SecuritySettings) => void;
  initialSettings: SecuritySettings;
}

export function SecurityModal({ visible, onClose, onSave, initialSettings }: SecurityModalProps) {
  const [settings, setSettings] = useState<SecuritySettings>(initialSettings);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    Alert.prompt(
      'Change Password',
      'Enter your new password',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Update',
          onPress: async (password) => {
            if (!password || password.length < 6) {
              Alert.alert('Error', 'Password must be at least 6 characters long');
              return;
            }
            setLoading(true);
            try {
              const { error } = await supabase.auth.updateUser({
                password: password
              });
              if (error) throw error;
              Alert.alert('Success', 'Password updated successfully');
            } catch (error) {
              console.error('Error updating password:', error);
              Alert.alert('Error', 'Failed to update password');
            } finally {
              setLoading(false);
            }
          },
        },
      ],
      'secure-text'
    );
  };

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
            <Text style={styles.modalTitle}>Security Settings</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Authentication</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Biometric Login</Text>
                  <Text style={styles.settingDescription}>
                    Use Face ID or Touch ID to log in
                  </Text>
                </View>
                <Switch
                  value={settings.biometricEnabled}
                  onValueChange={(value) => setSettings({ ...settings, biometricEnabled: value })}
                  trackColor={{ false: '#e5e5e5', true: '#7c3aed' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Two-Factor Authentication</Text>
                  <Text style={styles.settingDescription}>
                    Add an extra layer of security
                  </Text>
                </View>
                <Switch
                  value={settings.twoFactorEnabled}
                  onValueChange={(value) => setSettings({ ...settings, twoFactorEnabled: value })}
                  trackColor={{ false: '#e5e5e5', true: '#7c3aed' }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>App Security</Text>
              
              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>App Lock</Text>
                  <Text style={styles.settingDescription}>
                    Require authentication when opening the app
                  </Text>
                </View>
                <Switch
                  value={settings.appLockEnabled}
                  onValueChange={(value) => setSettings({ ...settings, appLockEnabled: value })}
                  trackColor={{ false: '#e5e5e5', true: '#7c3aed' }}
                  thumbColor="#fff"
                />
              </View>

              <View style={styles.settingItem}>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Allow Screenshots</Text>
                  <Text style={styles.settingDescription}>
                    Enable screen capture within the app
                  </Text>
                </View>
                <Switch
                  value={settings.screenCaptureEnabled}
                  onValueChange={(value) => setSettings({ ...settings, screenCaptureEnabled: value })}
                  trackColor={{ false: '#e5e5e5', true: '#7c3aed' }}
                  thumbColor="#fff"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Password</Text>
              <TouchableOpacity 
                style={styles.passwordButton}
                onPress={handleChangePassword}
                disabled={loading}
              >
                <Text style={styles.passwordButtonText}>Change Password</Text>
                <Ionicons name="chevron-forward" size={20} color="#6b7280" />
              </TouchableOpacity>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
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
  passwordButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    padding: 16,
    borderRadius: 8,
  },
  passwordButtonText: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
});
