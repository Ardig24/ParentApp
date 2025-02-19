import { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format, addYears } from 'date-fns';
import { Text } from '../../../components/Text';
import { Card } from '../../../components/Card';
import { useStore } from '../../../lib/store';

const CAPSULE_TYPES = [
  { id: 'letter', label: 'Write a Letter', icon: 'mail' },
  { id: 'video', label: 'Record Video', icon: 'videocam' },
  { id: 'voice', label: 'Voice Message', icon: 'mic' },
  { id: 'photo', label: 'Photo Album', icon: 'images' },
];

const UNLOCK_AGES = [
  { age: 5, label: '5th Birthday' },
  { age: 10, label: '10th Birthday' },
  { age: 13, label: 'Teenage Years' },
  { age: 16, label: 'Sweet Sixteen' },
  { age: 18, label: 'Adulthood' },
  { age: 21, label: '21st Birthday' },
];

export default function TimeCapsuleScreen() {
  const { selectedChild, timeCapsules } = useStore();
  const [activeType, setActiveType] = useState('');
  const [selectedAge, setSelectedAge] = useState<number | null>(null);

  const getUnlockDate = (age: number) => {
    if (!selectedChild?.birthDate) return null;
    const birthDate = new Date(selectedChild.birthDate);
    return addYears(birthDate, age);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Time Capsule</Text>
        <Link href="/time-capsule/new" asChild>
          <Pressable style={styles.addButton}>
            <Ionicons name="add" size={24} color="#ffffff" />
          </Pressable>
        </Link>
      </View>

      {/* Create New Time Capsule */}
      <Card style={styles.creatorCard}>
        <Text style={styles.creatorTitle}>Create a Time Capsule</Text>
        <Text style={styles.creatorSubtitle}>
          Leave a message for {selectedChild?.name} to discover in the future
        </Text>

        <Text style={styles.label}>Choose Message Type</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.types}>
          {CAPSULE_TYPES.map((type) => (
            <Pressable
              key={type.id}
              style={[
                styles.typeButton,
                activeType === type.id && styles.typeButtonActive,
              ]}
              onPress={() => setActiveType(type.id)}>
              <Ionicons
                name={type.icon as any}
                size={24}
                color={activeType === type.id ? '#ffffff' : '#7c3aed'}
              />
              <Text
                style={[
                  styles.typeText,
                  activeType === type.id && styles.typeTextActive,
                ]}>
                {type.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.label}>When to Unlock</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.ages}>
          {UNLOCK_AGES.map((unlock) => (
            <Pressable
              key={unlock.age}
              style={[
                styles.ageButton,
                selectedAge === unlock.age && styles.ageButtonActive,
              ]}
              onPress={() => setSelectedAge(unlock.age)}>
              <Text
                style={[
                  styles.ageText,
                  selectedAge === unlock.age && styles.ageTextActive,
                ]}>
                {unlock.label}
              </Text>
              {selectedAge === unlock.age && getUnlockDate(unlock.age) && (
                <Text style={styles.unlockDate}>
                  {format(getUnlockDate(unlock.age)!, 'MMM d, yyyy')}
                </Text>
              )}
            </Pressable>
          ))}
        </ScrollView>

        <Pressable
          style={[
            styles.createButton,
            (!activeType || !selectedAge) && styles.createButtonDisabled,
          ]}
          disabled={!activeType || !selectedAge}>
          <Ionicons name="lock-closed" size={20} color="#ffffff" />
          <Text style={styles.createButtonText}>Create Time Capsule</Text>
        </Pressable>
      </Card>

      {/* Locked Time Capsules */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Locked Time Capsules</Text>
        {timeCapsules.map((capsule) => (
          <Card key={capsule.id} style={styles.capsuleCard}>
            <View style={styles.capsuleIcon}>
              <Ionicons
                name={
                  capsule.type === 'text'
                    ? 'mail'
                    : capsule.type === 'video'
                    ? 'videocam'
                    : capsule.type === 'voice'
                    ? 'mic'
                    : 'images'
                }
                size={24}
                color="#7c3aed"
              />
            </View>
            <View style={styles.capsuleInfo}>
              <Text style={styles.capsuleTitle}>{capsule.title}</Text>
              <Text style={styles.capsuleUnlock}>
                Opens on {format(new Date(capsule.unlockDate), 'MMM d, yyyy')}
              </Text>
            </View>
            <Ionicons name="lock-closed" size={20} color="#9ca3af" />
          </Card>
        ))}
      </View>
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
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  creatorCard: {
    padding: 20,
    marginBottom: 24,
  },
  creatorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  creatorSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  types: {
    marginBottom: 20,
  },
  typeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f5f3ff',
    marginRight: 12,
  },
  typeButtonActive: {
    backgroundColor: '#7c3aed',
  },
  typeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7c3aed',
    marginLeft: 8,
  },
  typeTextActive: {
    color: '#ffffff',
  },
  ages: {
    marginBottom: 20,
  },
  ageButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f5f3ff',
    marginRight: 12,
  },
  ageButtonActive: {
    backgroundColor: '#7c3aed',
  },
  ageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7c3aed',
  },
  ageTextActive: {
    color: '#ffffff',
  },
  unlockDate: {
    fontSize: 12,
    color: '#ffffff',
    marginTop: 4,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 12,
  },
  createButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  capsuleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  capsuleIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  capsuleInfo: {
    flex: 1,
  },
  capsuleTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  capsuleUnlock: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
});