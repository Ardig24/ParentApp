import { ActivityIndicator, StyleSheet, View } from 'react-native';

type LoadingSpinnerProps = {
  size?: 'small' | 'large';
  color?: string;
  fullScreen?: boolean;
};

export function LoadingSpinner({ 
  size = 'large', 
  color = '#7c3aed',
  fullScreen = false 
}: LoadingSpinnerProps) {
  if (fullScreen) {
    return (
      <View style={styles.fullScreenContainer}>
        <ActivityIndicator size={size} color={color} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
