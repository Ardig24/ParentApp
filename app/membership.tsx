import { View, StyleSheet, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { Text } from '../components/Text';
import { Button } from '../components/Button';
import { useMembership } from '../lib/hooks/useMembership';

function FeatureItem({ title, description, included }: { 
  title: string; 
  description: string;
  included: boolean;
}) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureHeader}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={[styles.includedText, !included && styles.notIncluded]}>
          {included ? '✓' : '×'}
        </Text>
      </View>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  );
}

export default function MembershipScreen() {
  const { membership, loading } = useMembership();

  const handleUpgrade = async () => {
    // TODO: Implement Stripe integration
    console.log('Upgrade to premium');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Premium Membership',
        }}
      />

      <ScrollView style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Upgrade to Premium</Text>
          <Text style={styles.subtitle}>
            Get access to all features and unlock the full potential of ParentApp
          </Text>
        </View>

        <View style={styles.planContainer}>
          <View style={styles.plan}>
            <Text style={styles.planTitle}>Free</Text>
            <Text style={styles.planPrice}>$0</Text>
            <Text style={styles.planPeriod}>Forever</Text>
            <View style={styles.featureList}>
              <FeatureItem
                title="Basic Journal"
                description="Record daily moments and milestones"
                included={true}
              />
              <FeatureItem
                title="Basic Health Tracking"
                description="Track basic health metrics"
                included={true}
              />
              <FeatureItem
                title="Limited Storage"
                description="Store up to 100 photos"
                included={true}
              />
              <FeatureItem
                title="AI Features"
                description="Advanced AI insights and analysis"
                included={false}
              />
            </View>
          </View>

          <View style={[styles.plan, styles.premiumPlan]}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>RECOMMENDED</Text>
            </View>
            <Text style={[styles.planTitle, styles.premiumTitle]}>Premium</Text>
            <Text style={styles.planPrice}>$9.99</Text>
            <Text style={styles.planPeriod}>per month</Text>
            <View style={styles.featureList}>
              <FeatureItem
                title="Everything in Free"
                description="All features from the free plan"
                included={true}
              />
              <FeatureItem
                title="AI Insights"
                description="Get personalized insights and recommendations"
                included={true}
              />
              <FeatureItem
                title="Unlimited Storage"
                description="Store unlimited photos and videos"
                included={true}
              />
              <FeatureItem
                title="Advanced Features"
                description="Access all premium features and future updates"
                included={true}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button
          title={membership.type === 'premium' ? 'Manage Subscription' : 'Upgrade to Premium'}
          onPress={handleUpgrade}
          loading={loading}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
  },
  planContainer: {
    padding: 20,
  },
  plan: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  premiumPlan: {
    backgroundColor: '#7c3aed10',
    borderWidth: 2,
    borderColor: '#7c3aed',
  },
  badge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#7c3aed',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  planTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  premiumTitle: {
    color: '#7c3aed',
  },
  planPrice: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  planPeriod: {
    color: '#6b7280',
    marginBottom: 20,
  },
  featureList: {
    gap: 16,
  },
  featureItem: {
    marginBottom: 12,
  },
  featureHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  includedText: {
    color: '#22c55e',
    fontSize: 18,
    fontWeight: 'bold',
  },
  notIncluded: {
    color: '#ef4444',
  },
  featureDescription: {
    color: '#6b7280',
    fontSize: 14,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
});
