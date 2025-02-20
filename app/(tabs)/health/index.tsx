import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Link, router } from 'expo-router';
import { differenceInMonths } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../../components/Text';
import { Card } from '../../../components/Card';
import { HealthRecordList } from '../../../components/HealthRecordList';
import { useStore } from '../../../lib/store';
import { GrowthChart } from '../../../components/GrowthChart';
import { exportHealthData } from '../../../utils/export';

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'checkup', label: 'Checkups' },
  { id: 'vaccination', label: 'Vaccines' },
  { id: 'measurement', label: 'Growth' },
  { id: 'symptom', label: 'Symptoms' },
] as const;

import type { HealthRecord } from '../../../lib/store';

export default function HealthScreen() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { selectedChild, healthRecords, medications, fetchHealthRecords, isLoading, error } = useStore();

  useEffect(() => {
    if (selectedChild) {
      fetchHealthRecords(selectedChild.id);
    }
  }, [selectedChild]);

  const handleExport = async () => {
    try {
      await exportHealthData({
        healthRecords,
        medications,
        childName: selectedChild?.name || '',
        exportDate: new Date().toISOString(),
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to export health data');
    }
  };

  if (!selectedChild) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please select a child first</Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>{error}</Text>
      </View>
    );
  }

  const filteredRecords = healthRecords.filter(
    (record) => selectedCategory === 'all' || record.type === selectedCategory
  );

  const latestMeasurement = healthRecords.find(r => r.type === 'measurement') as HealthRecord | undefined;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.charts}>
        <GrowthChart type="height" />
        <GrowthChart type="weight" />
      </View>

      <View style={styles.header}>
        <Pressable onPress={handleExport} style={styles.exportButton}>
          <Ionicons name="cloud-download-outline" size={24} color="#7c3aed" />
        </Pressable>
        <Text style={styles.title}>Health</Text>
        <Pressable 
          style={styles.addButton}
          onPress={() => router.push('/health/new')}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </Pressable>
      </View>

      <Card>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {(latestMeasurement as any)?.data?.height ?? '-- '} cm
            </Text>
            <Text style={styles.statLabel}>Height</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {(latestMeasurement as any)?.data?.weight ?? '-- '} kg
            </Text>
            <Text style={styles.statLabel}>Weight</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Text style={styles.statValue}>{healthRecords.length}</Text>
            <Text style={styles.statLabel}>Records</Text>
          </View>
        </View>
      </Card>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categories}>
        {CATEGORIES.map((category) => (
          <Pressable
            key={category.id}
            style={[
              styles.category,
              selectedCategory === category.id && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(category.id)}>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.selectedCategoryText,
              ]}>
              {category.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={styles.section}>
        <HealthRecordList records={filteredRecords} category={selectedCategory} />
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
    paddingBottom: 24,
  },
  charts: {
    padding: 16,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
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
  exportButton: {
    padding: 8,
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
  categories: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  category: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: '#7c3aed',
  },
  categoryText: {
    fontSize: 14,
    color: '#6b7280',
  },
  selectedCategoryText: {
    color: '#ffffff',
  },
  section: {
    paddingHorizontal: 16,
  },
  message: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 24,
  },
});
