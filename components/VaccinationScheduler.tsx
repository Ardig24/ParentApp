import { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Ionicons } from '@expo/vector-icons';
import { Text } from './Text';
import { TextInput } from './TextInput';
import { useStore } from '../lib/store';
import * as Notifications from 'expo-notifications';

interface VaccinationSchedulerProps {
  vaccineId: string;
  doseNumber: number;
  isVisible: boolean;
  onClose: () => void;
}

export function VaccinationScheduler({
  vaccineId,
  doseNumber,
  isVisible,
  onClose,
}: VaccinationSchedulerProps) {
  const { selectedChild, addHealthRecord } = useStore();
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');
  const [reminder, setReminder] = useState(true);

  const handleSchedule = async () => {
    if (!selectedChild) return;

    try {
      // Add health record
      await addHealthRecord({
        childId: selectedChild.id,
        type: 'vaccination',
        title: `Vaccination Appointment`,
        notes: `Location: ${location}\nNotes: ${notes}`,
        data: {
          vaccineId,
          doseNumber,
          appointmentDate: date.toISOString(),
          location,
        },
      });

      // Schedule reminder notification
      if (reminder) {
        const notificationDate = new Date(date.getTime() - 24 * 60 * 60 * 1000); // 1 day before
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Vaccination Appointment Tomorrow',
            body: `Reminder: Vaccination appointment at ${location}`,
          },
          trigger: {
            date: notificationDate,
          },
        });
      }

      Alert.alert(
        'Success',
        'Vaccination appointment scheduled successfully',
        [{ text: 'OK', onPress: onClose }]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to schedule vaccination appointment');
    }
  };

  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Schedule Vaccination</Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </Pressable>
          </View>

          <View style={styles.form}>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Appointment Date</Text>
              <Pressable
                onPress={() => setShowDatePicker(true)}
                style={styles.dateButton}>
                <Text style={styles.dateButtonText}>
                  {format(date, 'MMMM d, yyyy')}
                </Text>
                <Ionicons name="calendar" size={20} color="#6b7280" />
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  onChange={(event, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setDate(selectedDate);
                  }}
                  minimumDate={new Date()}
                />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Location</Text>
              <TextInput
                value={location}
                onChangeText={setLocation}
                placeholder="Enter clinic or hospital name"
                style={styles.input}
              />
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
              <Text style={styles.switchLabel}>Set Reminder</Text>
              <Pressable
                onPress={() => setReminder(!reminder)}
                style={[
                  styles.switch,
                  reminder ? styles.switchActive : styles.switchInactive,
                ]}>
                <View
                  style={[
                    styles.switchThumb,
                    reminder ? styles.switchThumbActive : styles.switchThumbInactive,
                  ]}
                />
              </Pressable>
            </View>

            <Pressable
              onPress={handleSchedule}
              style={[
                styles.scheduleButton,
                (!location || !date) && styles.scheduleButtonDisabled,
              ]}
              disabled={!location || !date}>
              <Text style={styles.scheduleButtonText}>Schedule Appointment</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  closeButton: {
    padding: 8,
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
  },
  switchLabel: {
    fontSize: 16,
    color: '#111827',
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    padding: 2,
  },
  switchActive: {
    backgroundColor: '#7c3aed',
  },
  switchInactive: {
    backgroundColor: '#d1d5db',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ffffff',
  },
  switchThumbActive: {
    transform: [{ translateX: 20 }],
  },
  switchThumbInactive: {
    transform: [{ translateX: 0 }],
  },
  scheduleButton: {
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  scheduleButtonDisabled: {
    backgroundColor: '#d1d5db',
  },
  scheduleButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '500',
  },
});
