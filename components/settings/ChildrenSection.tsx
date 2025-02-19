import { useState } from 'react';
import { View, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '../Text';
import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../../lib/supabase';
import { useStore } from '../../lib/store';

export interface Child {
  id: string;
  name: string;
  birth_date: string;
  avatar_url?: string;
  parent_id: string;
}

interface ChildrenSectionProps {
  children: Child[];
  onAddChild: () => void;
  onEditChild: (child: Child) => void;
}

export function ChildrenSection({ children, onAddChild, onEditChild }: ChildrenSectionProps) {
  return (
    <View style={styles.children}>
      <Text style={styles.childrenTitle}>Children</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.childrenList}>
        {children.map((child) => (
          <Pressable 
            key={child.id} 
            style={styles.childCard}
            onPress={() => onEditChild(child)}
          >
            <Image
              source={child.avatar_url || 'https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y'}
              style={styles.childAvatar}
              contentFit="cover"
              transition={1000}
            />
            <Text style={styles.childName}>{child.name}</Text>
          </Pressable>
        ))}
        <Pressable 
          style={styles.addChildCard}
          onPress={onAddChild}
        >
          <Ionicons name="add" size={24} color="#7c3aed" />
          <Text style={styles.addChildText}>Add Child</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  children: {
    marginTop: 16,
  },
  childrenTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  childrenList: {
    flexGrow: 0,
  },
  childCard: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  childAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 8,
  },
  childName: {
    fontSize: 14,
    textAlign: 'center',
  },
  addChildCard: {
    width: 80,
    height: 88,
    borderWidth: 2,
    borderColor: '#7c3aed20',
    borderStyle: 'dashed',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addChildText: {
    fontSize: 12,
    color: '#7c3aed',
    marginTop: 4,
  },
});
