import { useState } from 'react';
import { Alert } from 'react-native';
import { View, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { launchImageLibraryAsync, MediaTypeOptions, requestMediaLibraryPermissionsAsync } from 'expo-image-picker';
import { Image } from 'expo-image';
import { Text } from '../../../components/Text';
import { useStore } from '../../../lib/store';

const MOODS = ['Happy', 'Excited', 'Proud', 'Silly', 'Tired', 'Sad'];

export default function NewMemoryScreen() {
  const { selectedChild, addMemory } = useStore();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'photo' | 'video' | null>(null);
  const [mediaUri, setMediaUri] = useState<string | undefined>();
  const [mood, setMood] = useState<string | undefined>();


  const pickMedia = async (type: 'photo' | 'video') => {
    try {
      // Request media library permissions
      const { status } = await requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please grant permission to access your media library.');
        return;
      }

      const result = await launchImageLibraryAsync({
        mediaTypes: type === 'photo' ? MediaTypeOptions.Images : MediaTypeOptions.Videos,
        allowsEditing: true,
        quality: 0.8,
        videoMaxDuration: 60,
      });

      if (!result.canceled) {
        setMediaType(type);
        setMediaUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking media:', error);
      Alert.alert('Error', 'Failed to select media. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!selectedChild) {
      Alert.alert('Error', 'Please select a child first');
      return;
    }

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title');
      return;
    }

    try {

      await addMemory({
        childId: selectedChild.id,
        type: mediaType || 'text',
        title: title.trim(),
        content: content.trim(),
        mediaUrl: mediaUri,
        mood,
      });

      router.back();
    } catch (error) {
      console.error('Failed to save memory:', error);
      Alert.alert('Error', 'Failed to save memory. Please try again.');
    } finally {

    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4b5563" />
        </Pressable>
        <Text style={styles.title}>New Memory</Text>
        <Pressable
          style={[styles.saveButton, !title && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!title}>
          <Text
            style={[styles.saveText, !title && styles.saveTextDisabled]}>
            Save
          </Text>
        </Pressable>
      </View>

      <ScrollView style={styles.content}>
        <TextInput
          style={styles.titleInput}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
          placeholderTextColor="#9ca3af"
        />

        <TextInput
          style={styles.contentInput}
          placeholder="Write about this memory..."
          value={content}
          onChangeText={setContent}
          multiline
          placeholderTextColor="#9ca3af"
        />

        <View style={styles.mediaButtons}>
          <Pressable
            style={styles.mediaButton}
            onPress={() => pickMedia('photo')}>
            <Ionicons name="camera" size={24} color="#7c3aed" />
            <Text style={styles.mediaButtonText}>Add Photo</Text>
          </Pressable>
          <Pressable
            style={styles.mediaButton}
            onPress={() => pickMedia('video')}>
            <Ionicons name="videocam" size={24} color="#7c3aed" />
            <Text style={styles.mediaButtonText}>Add Video</Text>
          </Pressable>
        </View>

        {mediaUri && mediaType === 'photo' && (
          <Image
            source={mediaUri}
            style={styles.mediaPreview}
            contentFit="cover"
          />
        )}

        <Text style={styles.sectionTitle}>How are they feeling?</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.moods}>
          {MOODS.map((m) => (
            <Pressable
              key={m}
              style={[styles.moodButton, mood === m && styles.moodButtonActive]}
              onPress={() => setMood(m)}>
              <Text
                style={[
                  styles.moodButtonText,
                  mood === m && styles.moodButtonTextActive,
                ]}>
                {m}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
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
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    padding: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  saveButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#7c3aed',
  },
  saveButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  saveText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
  },
  saveTextDisabled: {
    color: '#9ca3af',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  titleInput: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  contentInput: {
    fontSize: 16,
    color: '#4b5563',
    minHeight: 100,
    marginBottom: 24,
  },
  mediaButtons: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f5f3ff',
    marginRight: 8,
  },
  mediaButtonText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#7c3aed',
  },
  mediaPreview: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  moods: {
    marginBottom: 24,
  },
  moodButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    marginRight: 8,
  },
  moodButtonActive: {
    backgroundColor: '#7c3aed',
  },
  moodButtonText: {
    fontSize: 14,
    color: '#4b5563',
  },
  moodButtonTextActive: {
    color: '#ffffff',
  },
});