import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Pressable } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../../components/Text';
import { MemoryCard } from '../../../components/MemoryCard';
import { useStore } from '../../../lib/store';

export default function MemoriesScreen() {
  const { memories, isLoading, error, selectedChild, fetchMemories } = useStore();

  useEffect(() => {
    if (selectedChild) {
      fetchMemories(selectedChild.id);
    }
  }, [selectedChild]);
  const [filter, setFilter] = useState<'all' | 'photo' | 'video' | 'text' | 'voice'>('all');

  const filteredMemories = memories.filter((memory) => {
    if (filter === 'all') return true;
    return memory.type === filter as 'photo' | 'video' | 'text' | 'voice';
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Memories</Text>
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/memories/new')}>
          <Ionicons name="add" size={24} color="#ffffff" />
        </Pressable>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filters}
        contentContainerStyle={styles.filtersContent}>
        <Pressable
          style={[
            styles.filterButton,
            filter === 'all' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('all')}>
          <Text
            style={[
              styles.filterText,
              filter === 'all' && styles.filterTextActive,
            ]}>
            All
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterButton,
            filter === 'photo' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('photo')}>
          <Text
            style={[
              styles.filterText,
              filter === 'photo' && styles.filterTextActive,
            ]}>
            Photos
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterButton,
            filter === 'video' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('video')}>
          <Text
            style={[
              styles.filterText,
              filter === 'video' && styles.filterTextActive,
            ]}>
            Videos
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.filterButton,
            filter === 'text' && styles.filterButtonActive,
          ]}
          onPress={() => setFilter('text')}>
          <Text
            style={[
              styles.filterText,
              filter === 'text' && styles.filterTextActive,
            ]}>
            Journal
          </Text>
        </Pressable>
      </ScrollView>

      <ScrollView
        style={styles.memories}
        contentContainerStyle={styles.memoriesContent}>
        {isLoading ? (
          <Text style={styles.message}>Loading memories...</Text>
        ) : error ? (
          <Text style={styles.message}>{error}</Text>
        ) : filteredMemories.length === 0 ? (
          <Text style={styles.message}>No memories found</Text>
        ) : (
          filteredMemories.map((memory) => (
            <MemoryCard
              key={memory.id}
              id={memory.id}
              type={memory.type as 'text' | 'photo' | 'video' | 'voice'}
              title={memory.title}
              content={memory.content}
              mediaUrl={memory.mediaUrl}
              mood={memory.mood}
              createdAt={memory.createdAt}
            />
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
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
  filters: {
    marginBottom: 16,
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#7c3aed',
  },
  filterText: {
    fontSize: 14,
    color: '#4b5563',
  },
  filterTextActive: {
    color: '#ffffff',
  },
  memories: {
    flex: 1,
  },
  memoriesContent: {
    padding: 16,
  },
  message: {
    textAlign: 'center',
    color: '#6b7280',
    marginTop: 24,
  },
});