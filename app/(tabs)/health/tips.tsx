import { View, StyleSheet, ScrollView, Pressable, ActivityIndicator, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../../components/Text';
import { Card } from '../../../components/Card';
import { useStore } from '../../../lib/store';
import { differenceInMonths } from 'date-fns';
import { useAIHealth } from '../../../hooks/useAIHealth';
import { useEffect, useState } from 'react';

export default function ParentingTipsScreen() {
  const { selectedChild, healthRecords } = useStore();
  const { generateHealthTips, isLoading, error } = useAIHealth();
  const [aiResponse, setAiResponse] = useState<any>(null);

  const getAgeRange = (birthDate: string) => {
    const months = differenceInMonths(new Date(), new Date(birthDate));
    if (months <= 6) return '0-6 months';
    if (months <= 12) return '6-12 months';
    return '1-2 years';
  };

  const currentAgeRange = selectedChild ? getAgeRange(selectedChild.birthDate) : '0-6 months';

  useEffect(() => {
    const fetchAITips = async () => {
      if (selectedChild) {
        try {
          const childRecords = healthRecords.filter(r => r.childId === selectedChild.id);
          const response = await generateHealthTips(selectedChild, childRecords);
          setAiResponse(response);
        } catch (err) {
          console.error('Failed to fetch AI tips:', err);
        }
      }
    };

    fetchAITips();
  }, [selectedChild, healthRecords]);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Parenting Tips</Text>
      </View>

      {/* Age-specific Tips */}
      <Card style={styles.ageCard}>
        <Text style={styles.ageTitle}>Tips for {currentAgeRange}</Text>
        <Text style={styles.ageSubtitle}>
          Personalized guidance for {selectedChild?.name}'s current stage
        </Text>
      </Card>

      {/* Daily Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Tips</Text>
        {isLoading ? (
          <Card style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#7c3aed" />
            <Text style={styles.loadingText}>Generating personalized tips...</Text>
          </Card>
        ) : error ? (
          <Card style={styles.errorCard}>
            <Text style={styles.errorText}>{error}</Text>
          </Card>
        ) : (
          aiResponse?.tips.map((tip: any, index: number) => (
            <Card key={index} style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Ionicons name={tip.icon as any} size={24} color="#7c3aed" />
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>{tip.title}</Text>
                <Text style={styles.tipText}>{tip.content}</Text>
              </View>
            </Card>
          ))
        )}
      </View>

      {/* Growth Milestones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Expected Milestones</Text>
        <Card style={styles.milestonesCard}>
          {!isLoading && !error && aiResponse?.milestones.map((milestone: string, index: number) => (
            <View
              key={index}
              style={[
                styles.milestone,
                index < (aiResponse?.milestones.length || 0) - 1 && styles.milestoneBorder,
              ]}>
              <Ionicons name="checkmark-circle" size={20} color="#7c3aed" />
              <Text style={styles.milestoneText}>{milestone}</Text>
            </View>
          ))}
        </Card>
      </View>

      {/* Resources */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Helpful Resources</Text>
        <Card style={styles.resourcesCard}>
          {!isLoading && !error && aiResponse?.resources.map((resource: any, index: number) => (
            <Pressable 
              key={index}
              style={[styles.resource, index < (aiResponse?.resources.length || 0) - 1 && styles.resourceBorder]}
              onPress={() => Linking.openURL(resource.url)}
            >
              <Ionicons name="book" size={20} color="#7c3aed" />
              <View style={styles.resourceContent}>
                <Text style={styles.resourceTitle}>{resource.title}</Text>
                <Text style={styles.resourceDescription}>{resource.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </Pressable>
          ))}
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loadingCard: {
    padding: 20,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#6b7280',
    fontSize: 16,
  },
  errorCard: {
    padding: 20,
    backgroundColor: '#fee2e2',
  },
  errorText: {
    color: '#dc2626',
    fontSize: 16,
  },
  resourceContent: {
    flex: 1,
    gap: 4,
  },
  resourceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
  },
  resourceDescription: {
    fontSize: 14,
    color: '#6b7280',
  },
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
  ageCard: {
    padding: 20,
    marginBottom: 24,
    backgroundColor: '#7c3aed',
  },
  ageTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 4,
  },
  ageSubtitle: {
    fontSize: 14,
    color: '#e5e7eb',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  tipCard: {
    flexDirection: 'row',
    padding: 16,
    marginBottom: 12,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  tipText: {
    fontSize: 14,
    color: '#6b7280',
  },
  milestonesCard: {
    padding: 16,
  },
  milestone: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  milestoneBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  milestoneText: {
    fontSize: 14,
    color: '#4b5563',
    marginLeft: 12,
    flex: 1,
  },
  resourcesCard: {
    overflow: 'hidden',
  },
  resource: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  resourceBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  resourceText: {
    fontSize: 16,
    color: '#111827',
    marginLeft: 12,
    flex: 1,
  },
});