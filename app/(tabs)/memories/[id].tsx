import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { format } from 'date-fns';
import { Text } from '../../../components/Text';
import { useStore } from '../../../lib/store';
import { supabase } from '../../../lib/supabase';
import { ResizeMode, Video, AVPlaybackStatus } from 'expo-av';

export default function MemoryDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { memories, selectedChild, fetchMemories } = useStore();
  const deleteMemory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('memories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      router.back();
    } catch (error) {
      console.error('Failed to delete memory:', error);
      Alert.alert('Error', 'Failed to delete memory. Please try again.');
    }
  };

  useEffect(() => {
    if (selectedChild) {
      fetchMemories(selectedChild.id);
    }
  }, [selectedChild]);
  const memory = memories.find((m) => m.id === id);
  const [isPlaying, setIsPlaying] = useState(false);

  if (!memory) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Memory not found</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Memory',
      'Are you sure you want to delete this memory? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMemory(memory.id);
              router.back();
            } catch (error) {
              console.error('Failed to delete memory:', error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4b5563" />
        </Pressable>
        <Pressable onPress={handleDelete} style={styles.deleteButton}>
          <Ionicons name="trash-outline" size={24} color="#ef4444" />
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        {memory.mediaUrl && memory.type === 'photo' && (
          <Image
            source={memory.mediaUrl}
            style={styles.media}
            contentFit="cover"
            transition={1000}
          />
        )}

        {memory.mediaUrl && memory.type === 'video' && (
          <View style={styles.videoContainer}>
            <Video
              source={{ uri: memory.mediaUrl }}
              style={styles.media}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              isLooping
              shouldPlay={isPlaying}
              onPlaybackStatusUpdate={(status: AVPlaybackStatus) => 
                setIsPlaying(status.isLoaded && status.isPlaying)
              }
            />
          </View>
        )}

        <View style={styles.details}>
          <Text style={styles.title}>{memory.title}</Text>
          <Text style={styles.date}>
            {format(new Date(memory.createdAt), 'MMMM d, yyyy')}
          </Text>

          {memory.content && (
            <Text style={styles.memoryContent}>{memory.content}</Text>
          )}

          {memory.mood && (
            <View style={styles.moodContainer}>
              <Text style={styles.moodLabel}>Mood</Text>
              <View style={styles.mood}>
                <Text style={styles.moodText}>{memory.mood}</Text>
              </View>
            </View>
          )}



          {memory.tags && memory.tags.length > 0 && (
            <View style={styles.tags}>
              {memory.tags.map((tag) => (
                <View key={tag} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 24,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
  error: {
    textAlign: 'center',
    color: '#ef4444',
    marginTop: 24,
  },
  content: {
    flex: 1,
  },
  media: {
    width: '100%',
    height: 300,
  },
  videoContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#000000',
  },
  details: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  memoryContent: {
    fontSize: 16,
    color: '#4b5563',
    lineHeight: 24,
    marginBottom: 24,
  },
  moodContainer: {
    marginBottom: 24,
  },
  moodLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6b7280',
    marginBottom: 8,
  },
  mood: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  moodText: {
    fontSize: 14,
    color: '#4b5563',
  },

  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#4b5563',
  },
});
