import { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, TextInput } from 'react-native';
import { Image } from 'expo-image';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../../components/Text';
import { Card } from '../../../components/Card';
import { useStore } from '../../../lib/store';

const THEMES = [
  { id: 'space', label: 'Space Adventure', icon: 'planet' },
  { id: 'fantasy', label: 'Magical Kingdom', icon: 'color-wand' },
  { id: 'ocean', label: 'Ocean Explorer', icon: 'boat' },
  { id: 'jungle', label: 'Jungle Safari', icon: 'leaf' },
  { id: 'dinosaur', label: 'Dinosaur World', icon: 'footsteps' },
];

export default function AIStoriesScreen() {
  const { selectedChild, stories } = useStore();
  const [activeTheme, setActiveTheme] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateStory = () => {
    setIsGenerating(true);
    // Simulate story generation
    setTimeout(() => {
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Stories</Text>
        <Link href="/ai-stories/new" asChild>
          <Pressable style={styles.addButton}>
            <Ionicons name="add" size={24} color="#ffffff" />
          </Pressable>
        </Link>
      </View>

      {/* Story Generator */}
      <Card style={styles.generatorCard}>
        <Text style={styles.generatorTitle}>Create a New Story</Text>
        <Text style={styles.generatorSubtitle}>
          Generate a personalized story for {selectedChild?.name}
        </Text>

        <Text style={styles.label}>Choose a Theme</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.themes}>
          {THEMES.map((theme) => (
            <Pressable
              key={theme.id}
              style={[
                styles.themeButton,
                activeTheme === theme.id && styles.themeButtonActive,
              ]}
              onPress={() => setActiveTheme(theme.id)}>
              <Ionicons
                name={theme.icon as any}
                size={24}
                color={activeTheme === theme.id ? '#ffffff' : '#7c3aed'}
              />
              <Text
                style={[
                  styles.themeText,
                  activeTheme === theme.id && styles.themeTextActive,
                ]}>
                {theme.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Pressable
          style={[styles.generateButton, !activeTheme && styles.generateButtonDisabled]}
          onPress={handleGenerateStory}
          disabled={!activeTheme || isGenerating}>
          <Ionicons
            name={isGenerating ? 'reload' : 'create'}
            size={20}
            color="#ffffff"
          />
          <Text style={styles.generateButtonText}>
            {isGenerating ? 'Creating Story...' : 'Generate Story'}
          </Text>
        </Pressable>
      </Card>

      {/* Story Library */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Story Library</Text>
        {stories.map((story) => (
          <Link href={`/ai-stories/${story.id}`} key={story.id} asChild>
            <Pressable>
              <Card style={styles.storyCard}>
                {story.illustrations[0] && (
                  <Image
                    source={story.illustrations[0]}
                    style={styles.storyImage}
                    contentFit="cover"
                    transition={1000}
                  />
                )}
                <View style={styles.storyContent}>
                  <Text style={styles.storyTitle}>{story.title}</Text>
                  <Text style={styles.storyPreview} numberOfLines={2}>
                    {story.content}
                  </Text>
                  <View style={styles.storyMeta}>
                    <View style={styles.storyTheme}>
                      <Ionicons
                        name={
                          THEMES.find((t) => t.id === story.theme)?.icon || 'book'
                        }
                        size={16}
                        color="#7c3aed"
                      />
                      <Text style={styles.storyThemeText}>
                        {THEMES.find((t) => t.id === story.theme)?.label || story.theme}
                      </Text>
                    </View>
                    <View style={styles.storyActions}>
                      <Pressable style={styles.actionButton}>
                        <Ionicons name="play" size={16} color="#7c3aed" />
                      </Pressable>
                      <Pressable style={styles.actionButton}>
                        <Ionicons name="download" size={16} color="#7c3aed" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              </Card>
            </Pressable>
          </Link>
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
    paddingTop: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111827',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#7c3aed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  generatorCard: {
    padding: 20,
    marginBottom: 24,
  },
  generatorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  generatorSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  themes: {
    marginBottom: 20,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f5f3ff',
    marginRight: 12,
  },
  themeButtonActive: {
    backgroundColor: '#7c3aed',
  },
  themeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#7c3aed',
    marginLeft: 8,
  },
  themeTextActive: {
    color: '#ffffff',
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#7c3aed',
    paddingVertical: 12,
    borderRadius: 12,
  },
  generateButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#ffffff',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
  },
  storyCard: {
    overflow: 'hidden',
    marginBottom: 16,
  },
  storyImage: {
    width: '100%',
    height: 200,
  },
  storyContent: {
    padding: 16,
  },
  storyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  storyPreview: {
    fontSize: 14,
    color: '#4b5563',
    marginBottom: 12,
  },
  storyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  storyTheme: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f3ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  storyThemeText: {
    fontSize: 12,
    color: '#7c3aed',
    marginLeft: 6,
  },
  storyActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f5f3ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});