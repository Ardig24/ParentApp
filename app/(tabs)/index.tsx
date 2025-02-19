import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../components/Text';
import { Card } from '../../components/Card';
import { QuickActionButton } from '../../components/QuickActionButton';
import { useStore } from '../../lib/store';

const PLACEHOLDER_AVATAR = 'https://images.unsplash.com/photo-1602030028438-4cf153cbae66?q=80&w=300&auto=format&fit=crop';

export default function HomeScreen() {
  const { selectedChild, memories, upcomingEvents } = useStore();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning, Sarah</Text>
        <Pressable style={styles.notificationButton}>
          <Ionicons name="notifications" size={24} color="#4b5563" />
        </Pressable>
      </View>

      <Card style={styles.childProfile}>
        <Image
          source={selectedChild?.avatarUrl || PLACEHOLDER_AVATAR}
          style={styles.avatar}
          contentFit="cover"
          transition={1000}
        />
        <View style={styles.childInfo}>
          <Text style={styles.childName}>{selectedChild?.name}</Text>
          <Text style={styles.childAge}>2 years, 3 months</Text>
        </View>
      </Card>

      <View style={styles.quickActions}>
        <QuickActionButton
          icon="camera"
          label="New Memory"
          onPress={() => {}}
        />
        <QuickActionButton
          icon="medical"
          label="Health Log"
          onPress={() => {}}
        />
        <QuickActionButton
          icon="book"
          label="Create Story"
          onPress={() => {}}
        />
        <QuickActionButton
          icon="time"
          label="Time Capsule"
          onPress={() => {}}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Today's Memories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.memoriesScroll}>
          {memories.slice(0, 3).map((memory) => (
            <Link href="/memories" key={memory.id} asChild>
              <Pressable style={styles.memoryCard}>
                <Image
                  source={memory.mediaUrl || PLACEHOLDER_AVATAR}
                  style={styles.memoryImage}
                  contentFit="cover"
                  transition={1000}
                />
                <Text style={styles.memoryCaption}>{memory.title}</Text>
              </Pressable>
            </Link>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Upcoming</Text>
        {upcomingEvents.map((event) => (
          <Card key={event.id} style={styles.upcomingCard}>
            <Ionicons name="calendar" size={24} color="#7c3aed" />
            <View style={styles.upcomingInfo}>
              <Text style={styles.upcomingTitle}>{event.title}</Text>
              <Text style={styles.upcomingDate}>Tomorrow at 10:00 AM</Text>
            </View>
          </Card>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  notificationButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
  },
  childProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 24,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
  },
  childInfo: {
    flex: 1,
  },
  childName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
  },
  childAge: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  memoriesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  memoryCard: {
    width: 200,
    marginRight: 16,
    borderRadius: 12,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  memoryImage: {
    width: '100%',
    height: 150,
  },
  memoryCaption: {
    padding: 12,
    fontSize: 14,
    color: '#4b5563',
  },
  upcomingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 12,
  },
  upcomingInfo: {
    marginLeft: 16,
  },
  upcomingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  upcomingDate: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
});