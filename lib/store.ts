import { create } from 'zustand';
import { mockChildren, mockMemories, mockHealthRecords, mockMedications, mockStories, mockTimeCapsules, mockUpcomingEvents } from './mockData';
import { supabase } from './supabase';

interface Child {
  id: string;
  name: string;
  birthDate: string;
  avatarUrl?: string;
}

export interface Memory {
  id: string;
  childId: string;
  type: 'text' | 'photo' | 'video' | 'voice' | string;
  title: string;
  content?: string;
  mediaUrl?: string;
  mood?: string;
  tags?: string[];
  createdAt: string;
}

export interface HealthRecord {
  id: string;
  childId: string;
  type: 'checkup' | 'vaccination' | 'measurement' | 'symptom' | string;
  date: string;
  title: string;
  notes?: string;
  height?: number;
  weight?: number;
  temperature?: number;
}

interface Medication {
  id: string;
  childId: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
}

interface Story {
  id: string;
  childId: string;
  title: string;
  content: string;
  theme: string;
  characters: string[];
  illustrations: string[];
}

export interface TimeCapsule {
  id: string;
  childId: string;
  type: 'text' | 'photo' | 'video' | 'voice' | string;
  title: string;
  content?: string;
  mediaUrl?: string;
  unlockDate: string;
}

interface Event {
  id: string;
  childId: string;
  title: string;
  date: string;
  type: string;
}

interface AppState {
  user: any;
  children: Child[];
  selectedChild: Child | null;
  memories: Memory[];
  healthRecords: HealthRecord[];
  medications: Medication[];
  stories: Story[];
  timeCapsules: TimeCapsule[];
  upcomingEvents: Event[];
  isLoading: boolean;
  error: string | null;
  setUser: (user: any) => void;
  setChildren: (children: Child[]) => void;
  setSelectedChild: (child: Child | null) => void;
  setMemories: (memories: Memory[]) => void;
  setHealthRecords: (records: HealthRecord[]) => void;
  setMedications: (medications: Medication[]) => void;
  setStories: (stories: Story[]) => void;
  setTimeCapsules: (capsules: TimeCapsule[]) => void;
  setUpcomingEvents: (events: Event[]) => void;
  setIsLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  fetchChildren: () => Promise<void>;
  fetchMemories: (childId: string) => Promise<void>;
  fetchHealthRecords: (childId: string) => Promise<void>;
  fetchStories: (childId: string) => Promise<void>;
  fetchTimeCapsules: (childId: string) => Promise<void>;
  fetchUpcomingEvents: (childId: string) => Promise<void>;
  addMemory: (memory: Omit<Memory, 'id' | 'createdAt'>) => Promise<void>;
  addHealthRecord: (record: Omit<HealthRecord, 'id'>) => Promise<void>;
  addStory: (story: Omit<Story, 'id'>) => Promise<void>;
  addTimeCapsule: (capsule: Omit<TimeCapsule, 'id'>) => Promise<void>
  signOut: () => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  user: null,
  children: mockChildren,
  selectedChild: mockChildren[0],
  memories: mockMemories,
  healthRecords: mockHealthRecords,
  medications: mockMedications,
  stories: mockStories,
  timeCapsules: mockTimeCapsules,
  upcomingEvents: mockUpcomingEvents,
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),
  setChildren: (children) => set({ children }),
  setSelectedChild: (child) => set({ selectedChild: child }),
  setMemories: (memories) => set({ memories }),
  setHealthRecords: (records) => set({ healthRecords: records }),
  setMedications: (medications) => set({ medications }),
  setStories: (stories) => set({ stories }),
  setTimeCapsules: (capsules) => set({ timeCapsules: capsules }),
  setUpcomingEvents: (events) => set({ upcomingEvents: events }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error }),

  fetchChildren: async () => {
    set({ isLoading: true, error: null });
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ children: mockChildren, isLoading: false });
  },

  fetchMemories: async (childId: string) => {
    set({ isLoading: true, error: null });
    await new Promise(resolve => setTimeout(resolve, 500));
    const filtered = mockMemories.filter(m => m.childId === childId);
    set({ memories: filtered, isLoading: false });
  },

  fetchHealthRecords: async (childId: string) => {
    set({ isLoading: true, error: null });
    await new Promise(resolve => setTimeout(resolve, 500));
    const filtered = mockHealthRecords.filter(r => r.childId === childId);
    set({ healthRecords: filtered, isLoading: false });
  },

  fetchStories: async (childId: string) => {
    set({ isLoading: true, error: null });
    await new Promise(resolve => setTimeout(resolve, 500));
    const filtered = mockStories.filter(s => s.childId === childId);
    set({ stories: filtered, isLoading: false });
  },

  fetchTimeCapsules: async (childId: string) => {
    set({ isLoading: true, error: null });
    await new Promise(resolve => setTimeout(resolve, 500));
    const filtered = mockTimeCapsules.filter(t => t.childId === childId);
    set({ timeCapsules: filtered, isLoading: false });
  },

  fetchUpcomingEvents: async (childId: string) => {
    set({ isLoading: true, error: null });
    await new Promise(resolve => setTimeout(resolve, 500));
    const filtered = mockUpcomingEvents.filter(e => e.childId === childId);
    set({ upcomingEvents: filtered, isLoading: false });
  },

  addMemory: async (memory) => {
    set({ isLoading: true, error: null });
    await new Promise(resolve => setTimeout(resolve, 500));
    const newMemory = {
      ...memory,
      id: Math.random().toString(),
      createdAt: new Date().toISOString(),
    };
    set(state => ({
      memories: [newMemory, ...state.memories],
      isLoading: false,
    }));
  },

  addHealthRecord: async (record) => {
    set({ isLoading: true, error: null });
    await new Promise(resolve => setTimeout(resolve, 500));
    const newRecord = {
      ...record,
      id: Math.random().toString(),
    };
    set(state => ({
      healthRecords: [newRecord, ...state.healthRecords],
      isLoading: false,
    }));
  },

  addStory: async (story) => {
    set({ isLoading: true, error: null });
    await new Promise(resolve => setTimeout(resolve, 500));
    const newStory = {
      ...story,
      id: Math.random().toString(),
    };
    set(state => ({
      stories: [newStory, ...state.stories],
      isLoading: false,
    }));
  },

  addTimeCapsule: async (capsule) => {
    set({ isLoading: true, error: null });
    await new Promise(resolve => setTimeout(resolve, 500));
    const newCapsule = {
      ...capsule,
      id: Math.random().toString(),
    };
    set(state => ({
      timeCapsules: [newCapsule, ...state.timeCapsules],
      isLoading: false,
    }));
  },

  signOut: async () => {
    try {
      set({ isLoading: true, error: null });
      await supabase.auth.signOut();
      set({
        user: null,
        children: [],
        selectedChild: null,
        memories: [],
        healthRecords: [],
        medications: [],
        stories: [],
        timeCapsules: [],
        upcomingEvents: [],
        isLoading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error signing out:', error);
      set({ error: 'Failed to sign out', isLoading: false });
      throw error;
    }
  },
}));