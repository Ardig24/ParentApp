import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HealthLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 1,
          borderTopColor: '#e5e5e5',
        },
        tabBarActiveTintColor: '#7c3aed',
        tabBarInactiveTintColor: '#6b7280',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Health',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="medkit" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tips"
        options={{
          title: 'Tips',
          tabBarIcon: ({ size, color }) => (
            <Ionicons name="bulb" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}