import { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../../components/Text';
import { Card } from '../../../components/Card';
import { useStore } from '../../../lib/store';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'checkup', label: 'Checkups' },
  { id: 'vaccination', label: 'Vaccines' },
  { id: 'measurement', label: 'Growth' },
  { id: 'symptom', label: 'Symptoms' },
];

export default function HealthScreen() {
  const { selectedChild, healthRecords, medications } = useStore();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredRecords = healthRecords.filter((record) => {
    if (activeCategory === 'all') return true;
    return record.type === activeCategory;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Health</Text>
        <Pressable style={styles.addButton}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </Pressable>
      </View>

      {/* Child Summary Card */}
      <Card style={styles.summaryCard}>
        <View style={styles.childInfo}>
          <Image
            source={selectedChild?.avatarUrl}
            style={styles.avatar}
            contentFit="cover"
            transition={1000}
          />
          <View style={styles.childDetails}>
            <Text style={styles.childName}>{selectedChild?.name}</Text>
            <Text style={styles.childAge}>2 years, 3 months</Text>
          </View>
        </View>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>75.5 cm</Text>
            <Text style={styles.statLabel}>Height</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>9.2 kg</Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>50th</Text>
            <Text style={styles.statLabel}>Percentile</Text>
          </View>
        </View>
      </Card>

      {/* Active Medications */}
      {medications.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Medications</Text>
          {medications.map((medication) => (
            <Card key={medication.id} style={styles.medicationCard}>
              <View style={styles.medicationIcon}>
                <Ionicons name="medical" size={24} color="#7c3aed" />
              </View>
              <View style={styles.medicationInfo}>
                <Text style={styles.medicationName}>{medication.name}</Text>
                <Text style={styles.medicationDetails}>
                  {medication.dosage} • {medication.frequency}
                </Text>
                {medication.notes && (
                  <Text style={styles.medicationNotes}>{medication.notes}</Text>
                )}
              </View>
            </Card>
          ))}
        </View>
      )}

      {/* Categories Filter */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}>
        {CATEGORIES.map((category) => (
          <Pressable
            key={category.id}
            style={[
              styles.categoryButton,
              activeCategory === category.id && styles.categoryButtonActive,
            ]}
            onPress={() => setActiveCategory(category.id)}>
            <Text
              style={[
                styles.categoryText,
                activeCategory === category.id && styles.categoryTextActive,
              ]}>
              {category.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Health Records */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Health Records</Text>
        {filteredRecords.map((record) => (
          <Link href={`/health/${record.id}`} key={record.id} asChild>
            <Pressable>
              <Card style={styles.recordCard}>
                <View style={styles.recordHeader}>
                  <View style={styles.recordType}>
                    <Ionicons
                      name={
                        record.type === 'checkup'
                          ? 'medical'
                          : record.type === 'vaccination'
                          ? 'fitness'
                          : record.type === 'measurement'
                          ? 'analytics'
                          : 'warning'
                      }
                      size={20}
                      color="#7c3aed"
                    />
                    <Text style={styles.recordTypeText}>
                      {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
                    </Text>
                  </View>
                  <Text style={styles.recordDate}>Jan 15, 2024</Text>
                </View>
                <Text style={styles.recordTitle}>{record.title}</Text>
                {record.notes && (
                  <Text style={styles.recordNotes}>{record.notes}</Text>
                )}
                {(record.height || record.weight) && (
                  <View style={styles.measurements}>
                    {record.height && (
                      <Text style={styles.measurement}>
                        Height: {record.height} cm
                      </Text>
                    )}
                    {record.weight && (
                      <Text style={styles.measurement}>
                        Weight: {record.weight} kg
                      </Text>
                    )}
                  </View>
                )}
              </Card>
            </Pressable>
          </Link>
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
  summaryCard: {
    padding: 16,
    marginBottom: 24,
  },
  childInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  childDetails: {
    marginLeft: 12,
  },
  childName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  childAge: {
    fontSize: 14,
    color: '#6b7280',
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginTop: 4,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#e5e7eb',
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
  medicationCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
  },
  medicationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  medicationDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  medicationNotes: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  categories: {
    marginBottom: 24,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#7c3aed',
  },
  categoryText: {
    fontSize: 14,
    color: '#4b5563',
  },
  categoryTextActive: {
    color: '#ffffff',
  },
  recordCard: {
    padding: 16,
    marginBottom: 12,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordType: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recordTypeText: {
    fontSize: 14,
    color: '#7c3aed',
    marginLeft: 8,
  },
  recordDate: {
    fontSize: 14,
    color: '#6b7280',
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  recordNotes: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  measurements: {
    flexDirection: 'row',
    marginTop: 8,
  },
  measurement: {
    fontSize: 14,
    color: '#6b7280',
    marginRight: 16,
  },
});