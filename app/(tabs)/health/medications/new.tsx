import { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Text } from '../../../../components/Text';
import { TextInput } from '../../../../components/TextInput';
import { useStore } from '../../../../lib/store';

export default function NewMedicationScreen() {
  const { selectedChild, addMedication } = useStore();
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('');
  const [notes, setNotes] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showStartDate, setShowStartDate] = useState(false);
  const [showEndDate, setShowEndDate] = useState(false);
  const [reminders, setReminders] = useState(false);

  const handleSubmit = async () => {
    if (!selectedChild) {
      Alert.alert('Error', 'Please select a child first');
      return;
    }

    if (!name || !dosage || !frequency) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      await addMedication({
        childId: selectedChild.id,
        name,
        dosage,
        frequency,
        notes,
        startDate: startDate.toISOString(),
        endDate: endDate?.toISOString(),
      });
      router.back();
    } catch (error) {
      Alert.alert('Error', 'Failed to add medication');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#111827" />
        </Pressable>
        <Text style={styles.title}>New Medication</Text>
        <Pressable onPress={handleSubmit} style={styles.saveButton}>
          <Text style={styles.saveButtonText}>Save</Text>
        </Pressable>
      </View>

      <View style={styles.form}>
        <View style={styles.formGroup}>
          <Text style={styles.label}>Medication Name *</Text>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Enter medication name"
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Dosage *</Text>
          <TextInput
            value={dosage}
            onChangeText={setDosage}
            placeholder="e.g., 5ml or 1 tablet"
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Frequency *</Text>
          <TextInput
            value={frequency}
            onChangeText={setFrequency}
            placeholder="e.g., Twice daily or Every 8 hours"
            style={styles.input}
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Start Date</Text>
          <Pressable
            onPress={() => setShowStartDate(true)}
            style={styles.dateButton}>
            <Text style={styles.dateButtonText}>
              {startDate.toLocaleDateString()}
            </Text>
            <Ionicons name="calendar" size={20} color="#6b7280" />
          </Pressable>
          {showStartDate && (
            <DateTimePicker
              value={startDate}
              mode="date"
              onChange={(event, date) => {
                setShowStartDate(false);
                if (date) setStartDate(date);
              }}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>End Date (Optional)</Text>
          <Pressable
            onPress={() => setShowEndDate(true)}
            style={styles.dateButton}>
            <Text style={styles.dateButtonText}>
              {endDate ? endDate.toLocaleDateString() : 'Not set'}
            </Text>
            <Ionicons name="calendar" size={20} color="#6b7280" />
          </Pressable>
          {showEndDate && (
            <DateTimePicker
              value={endDate || new Date()}
              mode="date"
              onChange={(event, date) => {
                setShowEndDate(false);
                if (date) setEndDate(date);
              }}
            />
          )}
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Notes (Optional)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any additional notes"
            multiline
            numberOfLines={4}
            style={[styles.input, styles.textArea]}
          />
        </View>

        <View style={styles.switchContainer}>
          <Text style={styles.switchLabel}>Enable Reminders</Text>
          <Switch
            value={reminders}
            onValueChange={setReminders}
            trackColor={{ false: '#d1d5db', true: '#7c3aed' }}
            thumbColor="#ffffff"
          />
        </View>
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
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#7c3aed',
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  form: {
    gap: 20,
  },
  formGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#111827',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: '#111827',
  },
});
