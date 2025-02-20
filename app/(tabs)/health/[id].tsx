import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useState, useEffect } from 'react';
import { useLocalSearchParams, router } from 'expo-router';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../../components/Text';
import { Card } from '../../../components/Card';
import { useStore } from '../../../lib/store';

export default function HealthRecordScreen() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : Array.isArray(params.id) ? params.id[0] : null;
  const { healthRecords, deleteHealthRecord, selectedChild, fetchHealthRecords } = useStore();

  useEffect(() => {
    if (selectedChild) {
      fetchHealthRecords(selectedChild.id);
    }
  }, [selectedChild]);

  console.log('Debug - params:', params);
  console.log('Debug - id:', id);
  console.log('Debug - healthRecords:', healthRecords);
  console.log('Debug - selectedChild:', selectedChild);
  const record = healthRecords.find(r => r.id === id);

  if (!record) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Record not found</Text>
      </View>
    );
  }

  const handleDelete = async () => {
    try {
      if (confirm('Are you sure you want to delete this record?')) {
        await deleteHealthRecord(record.id);
        router.back();
      }
    } catch (error) {
      console.error('Failed to delete record:', error);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.title}>{record.title}</Text>
        <Pressable onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#ef4444" />
        </Pressable>
      </View>

      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
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
              size={24}
              color="#7c3aed"
            />
          </View>
          <View style={styles.details}>
            <Text style={styles.type}>
              {record.type.charAt(0).toUpperCase() + record.type.slice(1)}
            </Text>
            <Text style={styles.date}>
              {format(new Date(record.createdAt), 'MMMM d, yyyy')}
            </Text>
          </View>
        </View>

        {record.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notes}>{record.notes}</Text>
          </View>
        )}

        {record.type === 'measurement' && record.data && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Measurements</Text>
            <View style={styles.measurements}>
              {record.data.height && (
                <View style={styles.measurement}>
                  <Text style={styles.measurementValue}>
                    {record.data.height} cm
                  </Text>
                  <Text style={styles.measurementLabel}>Height</Text>
                </View>
              )}
              {record.data.weight && (
                <View style={styles.measurement}>
                  <Text style={styles.measurementValue}>
                    {record.data.weight} kg
                  </Text>
                  <Text style={styles.measurementLabel}>Weight</Text>
                </View>
              )}
            </View>
          </View>
        )}
      </Card>
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
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  deleteButton: {
    padding: 8,
    marginLeft: 'auto',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  card: {
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  details: {
    flex: 1,
  },
  type: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
  },
  notes: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  measurements: {
    flexDirection: 'row',
    gap: 24,
  },
  measurement: {
    alignItems: 'center',
  },
  measurementValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  measurementLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  message: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 24,
  },
});
