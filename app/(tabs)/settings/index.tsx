import { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import * as Linking from 'expo-linking';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../../components/Text';
import { Card } from '../../../components/Card';
import { SettingsSection } from '../../../components/settings/SettingsSection';
import { useStore } from '../../../lib/store';
import { ChildrenSection, Child } from '../../../components/settings/ChildrenSection';
import { ChildModal } from '../../../components/settings/ChildModal';
import { supabase } from '../../../lib/supabase';
import { LanguageModal } from '../../../components/settings/LanguageModal';
import { PrivacyModal } from '../../../components/settings/PrivacyModal';
import { SecurityModal } from '../../../components/settings/SecurityModal';
import { DataStorageModal } from '../../../components/settings/DataStorageModal';
import { SubscriptionModal } from '../../../components/settings/SubscriptionModal';
import { AboutModal } from '../../../components/settings/AboutModal';
import { ProfileModal } from '../../../components/settings/ProfileModal';


const SECTIONS = [
  {
    title: 'Account',
    items: [
      { id: 'profile', label: 'Edit Profile', icon: 'person' },
      { id: 'children', label: 'Manage Children', icon: 'people' },
      { id: 'subscription', label: 'Subscription', icon: 'star' },
    ],
  },
  {
    title: 'Preferences',
    items: [
      { id: 'notifications', label: 'Notifications', icon: 'notifications' },
      { id: 'appearance', label: 'Appearance', icon: 'color-palette' },
      { id: 'language', label: 'Language', icon: 'language' },
    ],
  },
  {
    title: 'Privacy & Security',
    items: [
      { id: 'privacy', label: 'Privacy Settings', icon: 'shield' },
      { id: 'security', label: 'Security', icon: 'lock-closed' },
      { id: 'data', label: 'Data & Storage', icon: 'cloud' },
    ],
  },
  {
    title: 'Support',
    items: [
      { id: 'help', label: 'Help Center', icon: 'help-circle' },
      { id: 'feedback', label: 'Send Feedback', icon: 'chatbox' },
      { id: 'about', label: 'About', icon: 'information-circle' },
    ],
  },
];

export default function SettingsScreen() {
  const router = useRouter();
  const { user, signOut } = useStore();
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | undefined>();
  const [showChildModal, setShowChildModal] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showSecurityModal, setShowSecurityModal] = useState(false);
  const [showDataStorageModal, setShowDataStorageModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showAboutModal, setShowAboutModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  
  const [securitySettings, setSecuritySettings] = useState({
    biometricEnabled: false,
    twoFactorEnabled: false,
    appLockEnabled: false,
    screenCaptureEnabled: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    shareData: true,
    analytics: true,
    personalization: true,
    thirdParty: false,
  });

  // Fetch children on mount
  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  const fetchChildren = async () => {
    try {
      const { data, error } = await supabase
        .from('children')
        .select('*')
        .eq('parent_id', user?.id)
        .order('name');

      if (error) throw error;
      setChildren(data || []);
    } catch (error) {
      console.error('Error fetching children:', error);
      Alert.alert('Error', 'Failed to fetch children');
    }
  };

  const handleAddChild = useCallback(() => {
    setSelectedChild(undefined);
    setShowChildModal(true);
  }, []);

  const handleEditChild = useCallback((child: Child) => {
    setSelectedChild(child);
    setShowChildModal(true);
  }, []);

  const handleSaveChild = async (childData: Omit<Child, 'id' | 'parent_id'>) => {
    if (!user) return;

    try {
      if (selectedChild) {
        // Update existing child
        const { error } = await supabase
          .from('children')
          .update(childData)
          .eq('id', selectedChild.id);

        if (error) throw error;
      } else {
        // Add new child
        const { error } = await supabase
          .from('children')
          .insert([{ ...childData, parent_id: user.id }]);

        if (error) throw error;
      }

      await fetchChildren();
    } catch (error) {
      console.error('Error saving child:', error);
      throw error;
    }
  };
  
  const handleSettingPress = async (id: string) => {
    switch (id) {
      case 'profile':
        console.log('Opening profile modal...');
        setShowProfileModal(true);
        break;
      case 'children':
        handleAddChild();
        break;
      case 'subscription':
        setShowSubscriptionModal(true);
        break;
      case 'notifications':
        setNotificationsEnabled(!notificationsEnabled);
        break;
      case 'appearance':
        setDarkMode(!darkMode);
        break;
      case 'language':
        setShowLanguageModal(true);
        break;
      case 'privacy':
        setShowPrivacyModal(true);
        break;
      case 'security':
        setShowSecurityModal(true);
        break;
      case 'data':
        setShowDataStorageModal(true);
        break;
      case 'help':
        Alert.alert('Help Center', 'Contact us at support@parentapp.com');
        break;
      case 'feedback':
        Alert.alert('Feedback', 'Send your feedback to feedback@parentapp.com');
        break;
      case 'about':
        console.log('Opening about modal...');
        setShowAboutModal(true);
        break;
      default:
        break;
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  console.log('Current modal states:', {
    profile: showProfileModal,
    about: showAboutModal
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

      {/* User Profile Card */}
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Image
            source={user?.user_metadata?.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
            style={styles.avatar}
            contentFit="cover"
            transition={1000}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.user_metadata?.full_name || 'User'}</Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
          </View>
          <Pressable 
            style={styles.editButton}
            onPress={() => handleSettingPress('profile')}>
            <Ionicons name="pencil" size={20} color="#7c3aed" />
          </Pressable>
        </View>

        <ChildrenSection
          children={children}
          onAddChild={handleAddChild}
          onEditChild={handleEditChild}
        />
      </Card>

      {/* Settings Sections */}
      {SECTIONS.map((section) => (
        <SettingsSection
          key={section.title}
          title={section.title}
          items={section.items}
          onItemPress={handleSettingPress}
          toggleValues={{
            notifications: notificationsEnabled,
            appearance: darkMode,
          }}
        />
      ))}

      {/* Sign Out Button */}
      <Pressable style={styles.signOutButton} onPress={signOut}>
        <Ionicons name="log-out" size={20} color="#ef4444" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>

      {/* Child Management Modal */}
      <ChildModal
        visible={showChildModal}
        onClose={() => setShowChildModal(false)}
        onSave={handleSaveChild}
        child={selectedChild}
      />

      {/* Language Selection Modal */}
      <LanguageModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        onSelect={setLanguage}
        selectedLanguage={language}
      />

      {/* Privacy Settings Modal */}
      <PrivacyModal
        visible={showPrivacyModal}
        onClose={() => setShowPrivacyModal(false)}
        onSave={setPrivacySettings}
        initialSettings={privacySettings}
      />
      <ChildModal
        visible={showChildModal}
        onClose={() => setShowChildModal(false)}
        onSave={handleSaveChild}
        child={selectedChild}
      />

      {/* Security Modal */}
      <SecurityModal
        visible={showSecurityModal}
        onClose={() => setShowSecurityModal(false)}
        onSave={setSecuritySettings}
        initialSettings={securitySettings}
      />

      {/* Data & Storage Modal */}
      <DataStorageModal
        visible={showDataStorageModal}
        onClose={() => setShowDataStorageModal(false)}
      />

      {/* Subscription Modal */}
      <SubscriptionModal
        visible={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        currentPlan="free"
      />
      </ScrollView>
      
      {/* Modals */}
      <AboutModal
        visible={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      />
      <ProfileModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  profileCard: {
    padding: 16,
    marginBottom: 24,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileInfo: {
    flex: 1,
    marginLeft: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f3ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  children: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  childrenTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 12,
  },
  childrenList: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  childCard: {
    alignItems: 'center',
    marginRight: 16,
  },
  childAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginBottom: 4,
  },
  childName: {
    fontSize: 12,
    color: '#4b5563',
  },
  addChildCard: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f5f3ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addChildText: {
    fontSize: 10,
    color: '#7c3aed',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    marginBottom: 32,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ef4444',
    marginLeft: 8,
  },
});