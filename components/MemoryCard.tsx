import { View, StyleSheet, Pressable } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { format } from 'date-fns';
import { Text } from './Text';
import { Card } from './Card';

interface MemoryCardProps {
  id: string;
  type: 'text' | 'photo' | 'video' | 'voice';
  title: string;
  content?: string;
  mediaUrl?: string;
  mood?: string;
  createdAt: string;
}

export function MemoryCard({
  id,
  type,
  title,
  content,
  mediaUrl,
  mood,
  createdAt,
}: MemoryCardProps) {
  return (
    <Link href={`/memories/${id}`} asChild>
      <Pressable>
        <Card style={styles.container}>
          {mediaUrl && type === 'photo' && (
            <Image
              source={mediaUrl}
              style={styles.image}
              contentFit="cover"
              transition={1000}
            />
          )}
          <View style={styles.content}>
            <Text style={styles.title}>{title}</Text>
            {content && (
              <Text style={styles.description} numberOfLines={2}>
                {content}
              </Text>
            )}
            <View style={styles.footer}>
              {mood && (
                <Text style={styles.mood}>{mood}</Text>
              )}
              <Text style={styles.date}>
                {format(new Date(createdAt), 'MMM d, yyyy')}
              </Text>
            </View>
          </View>
        </Card>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mood: {
    fontSize: 12,
    color: '#6b7280',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  date: {
    fontSize: 12,
    color: '#6b7280',
  },
});