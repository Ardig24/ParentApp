import { View, StyleSheet, Pressable, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../Text';
import { Card } from '../Card';

interface SettingItem {
  id: string;
  label: string;
  icon: string;
}

interface SettingsSectionProps {
  title: string;
  items: SettingItem[];
  onItemPress: (id: string) => void;
  toggleValues?: {
    notifications: boolean;
    appearance: boolean;
  };
}

export function SettingsSection({ title, items, onItemPress, toggleValues }: SettingsSectionProps) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <Card style={styles.sectionCard}>
        {items.map((item, index) => {
          const isToggle = item.id === 'notifications' || item.id === 'appearance';
          const toggleValue = isToggle
            ? item.id === 'notifications'
              ? toggleValues?.notifications
              : toggleValues?.appearance
            : false;

          return (
            <Pressable
              key={item.id}
              style={[
                styles.settingItem,
                index < items.length - 1 && styles.settingItemBorder,
              ]}
              onPress={() => onItemPress(item.id)}>
              <View style={styles.settingIcon}>
                <Ionicons name={item.icon as any} size={20} color="#7c3aed" />
              </View>
              <Text style={styles.settingLabel}>{item.label}</Text>
              {isToggle ? (
                <Switch
                  value={toggleValue}
                  onValueChange={() => onItemPress(item.id)}
                  trackColor={{ false: '#e5e5e5', true: '#7c3aed' }}
                  thumbColor="#fff"
                />
              ) : (
                <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
              )}
            </Pressable>
          );
        })}
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 8,
  },
  sectionCard: {
    padding: 0,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  settingIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: '#7c3aed10',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingLabel: {
    flex: 1,
    fontSize: 16,
  },
});
