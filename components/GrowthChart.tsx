import { useRef, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { format } from 'date-fns';
import { Text } from './Text';
import { useStore } from '../lib/store';
import { calculateGrowthPercentile } from '../utils/growth';

interface GrowthChartProps {
  type: 'height' | 'weight';
}

export function GrowthChart({ type }: GrowthChartProps) {
  const { selectedChild, healthRecords } = useStore();

  if (!selectedChild) {
    return null;
  }

  // Filter records for height/weight measurements
  const measurements = healthRecords
    .filter((record) => record.type === 'measurement' && record.data?.[type])
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .map((record) => ({
      value: record.data?.[type] || 0,
      date: new Date(record.createdAt),
      percentile: calculateGrowthPercentile(
        selectedChild.birthDate,
        type,
        record.data?.[type] || 0,
        new Date(record.createdAt)
      ),
    }));

  const data = {
    labels: measurements.map((m) => format(m.date, 'MMM d')),
    datasets: [
      {
        data: measurements.map((m) => m.value),
        color: () => '#7c3aed',
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#ffffff',
    backgroundGradientFrom: '#ffffff',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(124, 58, 237, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(55, 65, 81, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: '#7c3aed',
    },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {type === 'height' ? 'Height Growth' : 'Weight Growth'}
      </Text>
      {measurements.length > 0 ? (
        <>
          <LineChart
            data={data}
            width={Dimensions.get('window').width - 32}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#7c3aed' }]} />
              <Text style={styles.legendText}>
                {type === 'height' ? 'Height (cm)' : 'Weight (kg)'}
              </Text>
            </View>
          </View>
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Latest</Text>
              <Text style={styles.statValue}>
                {measurements[measurements.length - 1].value}
                {type === 'height' ? ' cm' : ' kg'}
              </Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>Percentile</Text>
              <Text style={styles.statValue}>
                {measurements[measurements.length - 1].percentile}%
              </Text>
            </View>
          </View>
        </>
      ) : (
        <Text style={styles.empty}>No measurements recorded yet</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 8,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#6b7280',
  },
  stats: {
    flexDirection: 'row',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  empty: {
    textAlign: 'center',
    color: '#6b7280',
    marginVertical: 32,
  },
});
