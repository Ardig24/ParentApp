import { useState } from 'react';
import { View, StyleSheet, Modal, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Text } from '../Text';
import { Button } from '../Button';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';

interface Plan {
  id: string;
  name: string;
  price: string;
  interval: string;
  features: string[];
}

interface SubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
  currentPlan?: string;
}

const PLANS: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: '$0',
    interval: 'forever',
    features: [
      'Basic journal entries',
      'Up to 2 children',
      'Basic photo storage',
      'Community access',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: '$4.99',
    interval: 'month',
    features: [
      'Unlimited journal entries',
      'Up to 5 children',
      'Advanced photo storage',
      'Priority support',
      'Custom themes',
      'Export data',
    ],
  },
  {
    id: 'family',
    name: 'Family',
    price: '$9.99',
    interval: 'month',
    features: [
      'Everything in Pro',
      'Unlimited children',
      'Family sharing',
      'Cloud backup',
      'Premium themes',
      'API access',
    ],
  },
];

export function SubscriptionModal({ visible, onClose, currentPlan = 'free' }: SubscriptionModalProps): JSX.Element {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (planId: string) => {
    setLoading(true);
    try {
      // Here you would integrate with your payment provider (e.g., Stripe)
      // For now, we'll just simulate the process
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Open payment page in browser
      await Linking.openURL(`https://parentapp.com/subscribe/${planId}`);
      
      onClose();
    } catch (error) {
      console.error('Error upgrading plan:', error);
      Alert.alert('Error', 'Failed to process upgrade');
    } finally {
      setLoading(false);
    }
  };

  const handleManageSubscription = () => {
    Linking.openURL('https://parentapp.com/account/subscription');
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Subscription</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.currentPlan}>
              <Text style={styles.currentPlanLabel}>Current Plan</Text>
              <Text style={styles.currentPlanName}>
                {PLANS.find(p => p.id === currentPlan)?.name || 'Free'}
              </Text>
            </View>

            <View style={styles.plansContainer}>
              {PLANS.map((plan) => (
                <TouchableOpacity
                  key={plan.id}
                  style={[
                    styles.planCard,
                    selectedPlan === plan.id && styles.selectedPlan,
                  ]}
                  onPress={() => setSelectedPlan(plan.id)}
                >
                  <View style={styles.planHeader}>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <View style={styles.priceContainer}>
                      <Text style={styles.planPrice}>{plan.price}</Text>
                      <Text style={styles.planInterval}>/{plan.interval}</Text>
                    </View>
                  </View>

                  <View style={styles.featuresContainer}>
                    {plan.features.map((feature, index) => (
                      <View key={index} style={styles.featureItem}>
                        <Ionicons name="checkmark" size={20} color="#7c3aed" />
                        <Text style={styles.featureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>

                  {plan.id !== currentPlan && (
                    <Button
                      title={loading ? 'Processing...' : `Upgrade to ${plan.name}`}
                      onPress={() => handleUpgrade(plan.id)}
                      loading={loading}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity
              style={styles.manageButton}
              onPress={handleManageSubscription}
            >
              <Text style={styles.manageButtonText}>Manage Subscription</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  closeButton: {
    padding: 4,
  },
  content: {
    padding: 20,
  },
  currentPlan: {
    marginBottom: 24,
  },
  currentPlanLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  currentPlanName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedPlan: {
    borderColor: '#7c3aed',
    backgroundColor: '#7c3aed10',
  },
  planHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  planName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  planPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#7c3aed',
  },
  planInterval: {
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 2,
  },
  featuresContainer: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#374151',
  },
  manageButton: {
    marginTop: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
  },
  manageButtonText: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
});
