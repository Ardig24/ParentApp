import { View, ViewProps, StyleSheet } from 'react-native';

export function Card(props: ViewProps) {
  return (
    <View
      {...props}
      style={[styles.card, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
});