import { View, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Text } from './Text';
import { Card } from './Card';
import type { HealthRecord } from '../lib/store';
import { format, parseISO } from 'date-fns';

interface HealthRecordListProps {
  records: HealthRecord[];
  category: string;
}

export function HealthRecordList({ records, category }: HealthRecordListProps) {
  const filteredRecords = records.filter((record) => {
    if (category === 'all') return true;
    return record.type === category;
  });

  if (filteredRecords.length === 0) {
    return (
      <Text style={styles.emptyMessage}>
        No health records found
      </Text>
    );
  }

  return (
    <View style={styles.container}>
      {filteredRecords.map((record) => (
        <Pressable
          key={record.id}
          onPress={() => router.push({ pathname: '/health/[id]', params: { id: record.id } })}>
          <Card style={styles.recordCard}>
            <View style={styles.recordHeader}>
              <Text style={styles.recordTitle}>{record.title}</Text>
              <Text style={styles.recordDate}>
                {record.createdAt ? format(parseISO(record.createdAt), 'MMM d, yyyy') : ''}
              </Text>
            </View>
            {record.notes && (
              <Text style={styles.recordNotes} numberOfLines={2}>
                {record.notes}
              </Text>
            )}
            {record.type === 'measurement' && record.data && (
              <View style={styles.measurements}>
                {record.data?.height && (
                  <Text style={styles.measurement}>
                    Height: {record.data.height} cm
                  </Text>
                )}
                {record.data?.weight && (
                  <Text style={styles.measurement}>
                    Weight: {record.data.weight} kg
                  </Text>
                )}
              </View>
            )}
          </Card>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 24,
  },
  recordCard: {
    padding: 16,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  recordTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  recordDate: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 8,
  },
  recordNotes: {
    fontSize: 14,
    color: '#4b5563',
    lineHeight: 20,
  },
  measurements: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  measurement: {
    fontSize: 14,
    color: '#4b5563',
  },
});
