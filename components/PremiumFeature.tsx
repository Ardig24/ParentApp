import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from './Text';
import { useMembership, FEATURE_ACCESS } from '../lib/hooks/useMembership';

interface PremiumFeatureProps {
  feature: keyof typeof FEATURE_ACCESS;
  children: React.ReactNode;
  message?: string;
}

export function PremiumFeature({ feature, children, message }: PremiumFeatureProps) {
  const { canAccess } = useMembership();
  const router = useRouter();

  if (canAccess(feature)) {
    return <>{children}</>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.overlay}>
        <Text style={styles.title}>Premium Feature</Text>
        <Text style={styles.message}>
          {message || 'This feature is only available for premium members'}
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/membership')}
        >
          <Text style={styles.buttonText}>Upgrade to Premium</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.blur}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  blur: {
    opacity: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#7c3aed',
    marginBottom: 8,
  },
  message: {
    textAlign: 'center',
    marginBottom: 16,
    color: '#4b5563',
  },
  button: {
    backgroundColor: '#7c3aed',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
