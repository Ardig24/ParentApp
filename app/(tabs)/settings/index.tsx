import { View, StyleSheet, ScrollView, Pressable, Switch } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../../components/Text';
import { Card } from '../../../components/Card';
import { useStore } from '../../../lib/store';

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
  const { user, children } = useStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
      </View>

      {/* User Profile Card */}
      <Card style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Image
            source="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=100&auto=format&fit=crop"
            style={styles.avatar}
            contentFit="cover"
            transition={1000}
          />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>Sarah Johnson</Text>
            <Text style={styles.profileEmail}>sarah.j@example.com</Text>
          </View>
          <Pressable style={styles.editButton}>
            <Ionicons name="pencil" size={20} color="#7c3aed" />
          </Pressable>
        </View>

        <View style={styles.children}>
          <Text style={styles.childrenTitle}>Children</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.childrenList}>
            {children.map((child) => (
              <View key={child.id} style={styles.childCard}>
                <Image
                  source={child.avatarUrl}
                  style={styles.childAvatar}
                  contentFit="cover"
                  transition={1000}
                />
                <Text style={styles.childName}>{child.name}</Text>
              </View>
            ))}
            <Pressable style={styles.addChildCard}>
              <Ionicons name="add" size={24} color="#7c3aed" />
              <Text style={styles.addChildText}>Add Child</Text>
            </Pressable>
          </ScrollView>
        </View>
      </Card>

      {/* Settings Sections */}
      {SECTIONS.map((section) => (
        <View key={section.title} style={styles.section}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Card style={styles.sectionCard}>
            {section.items.map((item, index) => (
              <Pressable
                key={item.id}
                style={[
                  styles.settingItem,
                  index < section.items.length - 1 && styles.settingItemBorder,
                ]}>
                <View style={styles.settingIcon}>
                  <Ionicons name={item.icon as any} size={20} color="#7c3aed" />
                </View>
                <Text style={styles.settingLabel}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              </Pressable>
            ))}
          </Card>
        </View>
      ))}

      {/* Sign Out Button */}
      <Pressable style={styles.signOutButton}>
        <Ionicons name="log-out" size={20} color="#ef4444" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </ScrollView>
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