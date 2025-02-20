import { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { Text } from '../../../../components/Text';
import { Card } from '../../../../components/Card';
import { useStore } from '../../../../lib/store';

export default function MedicationScreen() {
  const { id } = useLocalSearchParams();
  const { medications, updateMedication, deleteMedication } = useStore();
  const medication = medications.find((m) => m.id === id);

  if (!medication) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Medication not found</Text>
      </View>
    );
  }

  const handleToggleActive = async () => {
    try {
      await updateMedication({
        ...medication,
        active: !medication.active,
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to update medication status');
    }
  };

  const handleDelete = async () => {
    Alert.alert(
      'Delete Medication',
      'Are you sure you want to delete this medication?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMedication(medication.id);
              router.back();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete medication');
            }
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.title}>{medication.name}</Text>
        <Pressable onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#ef4444" />
        </Pressable>
      </View>

      <Card style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconContainer}>
            <Ionicons
              name={medication.active ? 'medical' : 'checkmark-circle'}
              size={24}
              color={medication.active ? '#7c3aed' : '#10b981'}
            />
          </View>
          <View style={styles.details}>
            <Text style={styles.dosage}>{medication.dosage}</Text>
            <Text style={styles.frequency}>{medication.frequency}</Text>
          </View>
          {medication.reminders && (
            <Ionicons name="notifications" size={20} color="#7c3aed" />
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Duration</Text>
          <View style={styles.dates}>
            <View style={styles.dateItem}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <Text style={styles.dateValue}>
                {format(new Date(medication.startDate), 'MMMM d, yyyy')}
              </Text>
            </View>
            {medication.endDate && (
              <View style={styles.dateItem}>
                <Text style={styles.dateLabel}>End Date</Text>
                <Text style={styles.dateValue}>
                  {format(new Date(medication.endDate), 'MMMM d, yyyy')}
                </Text>
              </View>
            )}
          </View>
        </View>

        {medication.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notes}>{medication.notes}</Text>
          </View>
        )}

        <Pressable
          style={[
            styles.statusButton,
            medication.active ? styles.statusButtonActive : styles.statusButtonCompleted,
          ]}
          onPress={handleToggleActive}>
          <Text style={styles.statusButtonText}>
            {medication.active ? 'Mark as Completed' : 'Mark as Active'}
          </Text>
        </Pressable>
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
  dosage: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  frequency: {
    fontSize: 14,
    color: '#6b7280',
  },
  section: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 12,
  },
  dates: {
    flexDirection: 'row',
    gap: 24,
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    color: '#111827',
  },
  notes: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  statusButton: {
    marginTop: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  statusButtonActive: {
    backgroundColor: '#10b981',
  },
  statusButtonCompleted: {
    backgroundColor: '#7c3aed',
  },
  statusButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
  message: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 24,
  },
});
