import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../../components/Text';
import { Input } from '../../../components/Input';
import { Button } from '../../../components/Button';
import { useStore } from '../../../lib/store';

const RECORD_TYPES = [
  { id: 'checkup', label: 'Checkup', icon: 'medical' },
  { id: 'vaccination', label: 'Vaccination', icon: 'fitness' },
  { id: 'measurement', label: 'Growth Measurement', icon: 'analytics' },
  { id: 'symptom', label: 'Symptom', icon: 'warning' },
];

export default function NewHealthRecordScreen() {
  const { selectedChild, addHealthRecord } = useStore();
  const [type, setType] = useState('checkup');
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = async () => {
    if (!selectedChild) {
      Alert.alert('Error', 'Please select a child first');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    try {
      const record = {
        childId: selectedChild.id,
        type,
        title: title.trim(),
        notes: notes.trim(),
        data: type === 'measurement' ? {
          height: parseFloat(height) || 0,
          weight: parseFloat(weight) || 0,
        } : {},
        date: new Date().toISOString(),
      };

      await addHealthRecord(record);
      router.back();
    } catch (error) {
      console.error('Failed to create health record:', error);
      Alert.alert('Error', 'Failed to create health record. Please try again.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4b5563" />
        </Pressable>
        <Text style={styles.title}>New Health Record</Text>
      </View>

      <View style={styles.typeSelector}>
        {RECORD_TYPES.map((recordType) => (
          <Pressable
            key={recordType.id}
            style={[
              styles.typeButton,
              type === recordType.id && styles.typeButtonActive,
            ]}
            onPress={() => setType(recordType.id)}>
            <Ionicons
              name={recordType.icon as any}
              size={24}
              color={type === recordType.id ? '#ffffff' : '#4b5563'}
            />
            <Text
              style={[
                styles.typeLabel,
                type === recordType.id && styles.typeLabelActive,
              ]}>
              {recordType.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.form}>
        <Input
          label="Title"
          value={title}
          onChangeText={setTitle}
          placeholder="Enter record title"
        />

        {type === 'measurement' && (
          <View style={styles.measurements}>
            <View style={styles.measurementField}>
              <Input
                label="Height (cm)"
                value={height}
                onChangeText={setHeight}
                placeholder="Enter height"
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.measurementField}>
              <Input
                label="Weight (kg)"
                value={weight}
                onChangeText={setWeight}
                placeholder="Enter weight"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        )}

        <Input
          label="Notes"
          value={notes}
          onChangeText={setNotes}
          placeholder="Add any additional notes"
          multiline
          numberOfLines={4}
          style={styles.notesInput}
        />

        <Button
          title="Save Record"
          onPress={handleSubmit}
          style={styles.submitButton}
        />
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
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 24,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  typeSelector: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  typeButton: {
    flex: 1,
    minWidth: '48%',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  typeButtonActive: {
    backgroundColor: '#7c3aed',
    borderColor: '#7c3aed',
  },
  typeLabel: {
    marginLeft: 12,
    fontSize: 16,
    color: '#4b5563',
  },
  typeLabelActive: {
    color: '#ffffff',
  },
  form: {
    gap: 16,
  },
  measurements: {
    flexDirection: 'row',
    gap: 16,
  },
  measurementField: {
    flex: 1,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    marginTop: 24,
  },
});
