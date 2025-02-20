import { View, StyleSheet, Pressable } from 'react-native';
import { format } from 'date-fns';
import { Text } from './Text';
import { Card } from './Card';
import { getVaccinationSchedule } from '../utils/vaccinations';
import { useStore } from '../lib/store';

interface VaccinationScheduleProps {
  onScheduleVaccine?: (vaccineId: string, doseNumber: number) => void;
}

export function VaccinationSchedule({
  onScheduleVaccine,
}: VaccinationScheduleProps) {
  const { selectedChild, healthRecords } = useStore();

  if (!selectedChild) {
    return null;
  }

  // Get completed vaccinations from health records
  const completedVaccinations = healthRecords
    .filter((record) => record.type === 'vaccination')
    .map((record) => ({
      vaccineId: record.data?.vaccineId || '',
      doseNumber: record.data?.doseNumber || 0,
      date: record.createdAt,
    }));

  const schedule = getVaccinationSchedule(
    selectedChild.birthDate,
    completedVaccinations
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vaccination Schedule</Text>
      {schedule.length === 0 ? (
        <Text style={styles.message}>All vaccinations are up to date!</Text>
      ) : (
        schedule.map((item) => (
          <Card key={`${item.vaccine.id}-${item.doseNumber}`} style={styles.card}>
            <View style={styles.header}>
              <View>
                <Text style={styles.vaccineName}>{item.vaccine.name}</Text>
                <Text style={styles.disease}>{item.vaccine.disease}</Text>
              </View>
              <View
                style={[
                  styles.status,
                  item.status === 'overdue'
                    ? styles.statusOverdue
                    : item.status === 'due'
                    ? styles.statusDue
                    : styles.statusUpcoming,
                ]}>
                <Text
                  style={[
                    styles.statusText,
                    item.status === 'overdue'
                      ? styles.statusTextOverdue
                      : item.status === 'due'
                      ? styles.statusTextDue
                      : styles.statusTextUpcoming,
                  ]}>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Text>
              </View>
            </View>

            <View style={styles.details}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Dose</Text>
                <Text style={styles.detailValue}>
                  {item.doseNumber} of {item.vaccine.doses}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>Due Date</Text>
                <Text style={styles.detailValue}>
                  {format(item.dueDate, 'MMM d, yyyy')}
                </Text>
              </View>
            </View>

            {onScheduleVaccine && (
              <Pressable
                style={styles.scheduleButton}
                onPress={() =>
                  onScheduleVaccine(item.vaccine.id, item.doseNumber)
                }>
                <Text style={styles.scheduleButtonText}>Schedule</Text>
              </Pressable>
            )}
          </Card>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  card: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  vaccineName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  disease: {
    fontSize: 14,
    color: '#6b7280',
  },
  status: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOverdue: {
    backgroundColor: '#fee2e2',
  },
  statusDue: {
    backgroundColor: '#f3e8ff',
  },
  statusUpcoming: {
    backgroundColor: '#f3f4f6',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  statusTextOverdue: {
    color: '#ef4444',
  },
  statusTextDue: {
    color: '#7c3aed',
  },
  statusTextUpcoming: {
    color: '#6b7280',
  },
  details: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 24,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    color: '#111827',
  },
  scheduleButton: {
    marginTop: 16,
    backgroundColor: '#7c3aed',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  scheduleButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  message: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 12,
  },
});
