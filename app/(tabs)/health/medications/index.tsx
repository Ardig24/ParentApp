import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../../../components/Text';
import { Card } from '../../../../components/Card';
import { useStore, type Medication } from '../../../../lib/store';

export default function MedicationsScreen() {
  const { selectedChild, medications, isLoading, error } = useStore((state) => ({
    selectedChild: state.selectedChild,
    medications: state.medications,
    isLoading: state.isLoading,
    error: state.error,
  }));
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  const filteredMedications = medications.filter((medication: Medication) => {
    if (filter === 'active') return medication.active;
    if (filter === 'completed') return !medication.active;
    return true;
  });

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Medications</Text>
        <Pressable 
          style={styles.addButton}
          onPress={() => router.push('/health/medications/new')}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </Pressable>
      </View>

      {!selectedChild ? (
        <Text style={styles.message}>Please select a child first</Text>
      ) : isLoading ? (
        <Text style={styles.message}>Loading medications...</Text>
      ) : error ? (
        <Text style={styles.message}>{error.toString()}</Text>
      ) : (
        <>
          {/* Filter Buttons */}
          <View style={styles.filters}>
            <Pressable
              style={[
                styles.filterButton,
                filter === 'all' && styles.filterButtonActive,
              ]}
              onPress={() => setFilter('all')}>
              <Text
                style={[
                  styles.filterText,
                  filter === 'all' && styles.filterTextActive,
                ]}>
                <Text>All</Text>
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterButton,
                filter === 'active' && styles.filterButtonActive,
              ]}
              onPress={() => setFilter('active')}>
              <Text
                style={[
                  styles.filterText,
                  filter === 'active' && styles.filterTextActive,
                ]}>
                <Text>Active</Text>
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filterButton,
                filter === 'completed' && styles.filterButtonActive,
              ]}
              onPress={() => setFilter('completed')}>
              <Text
                style={[
                  styles.filterText,
                  filter === 'completed' && styles.filterTextActive,
                ]}>
                <Text>Completed</Text>
              </Text>
            </Pressable>
          </View>

          {/* Medications List */}
          <View style={styles.list}>
            {filteredMedications.length === 0 ? (
              <Text style={styles.message}>No medications found</Text>
            ) : (
              filteredMedications.map((medication: Medication) => (
                <Pressable
                  key={medication.id}
                  onPress={() =>
                    router.push({
                      pathname: '/health/medications/[id]',
                      params: { id: medication.id },
                    })
                  }>
                  <Card style={styles.medicationCard}>
                    <View style={styles.medicationHeader}>
                      <View style={styles.medicationIcon}>
                        <Ionicons
                          name={medication.active ? 'medical-outline' : 'checkmark-circle-outline'}
                          size={24}
                          color={medication.active ? '#7c3aed' : '#10b981'}
                        />
                      </View>
                      <View style={styles.medicationInfo}>
                        <Text style={styles.medicationName}>
                          {medication.name}
                        </Text>
                        <Text style={styles.medicationDetails}>
                          <Text>{medication.dosage}</Text>
                          <Text> • </Text>
                          <Text>{medication.frequency}</Text>
                        </Text>
                      </View>
                      {medication.reminders && (
                        <Ionicons
                          name="alarm-outline"
                          size={20}
                          color="#7c3aed"
                        />
                      )}
                    </View>
                    {medication.notes && (
                      <Text style={styles.medicationNotes}>
                        {medication.notes}
                      </Text>
                    )}
                  </Card>
                </Pressable>
              ))
            )}
          </View>
        </>
      )}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  filters: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
  },
  filterButtonActive: {
    backgroundColor: '#7c3aed',
  },
  filterText: {
    fontSize: 14,
    color: '#4b5563',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  list: {
    gap: 12,
  },
  medicationCard: {
    padding: 16,
  },
  medicationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  medicationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3e8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  medicationInfo: {
    flex: 1,
  },
  medicationName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  medicationDetails: {
    fontSize: 14,
    color: '#6b7280',
  },
  medicationNotes: {
    fontSize: 14,
    color: '#4b5563',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  message: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 24,
  },
});
