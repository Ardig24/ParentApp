import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User } from '@supabase/supabase-js';
import { supabase } from './supabase';

// Types
export interface Child {
  id: string;
  name: string;
  birthDate: string;
  avatarUrl?: string;
  parent_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecordData {
  vaccineId?: string;
  doseNumber?: number;
  height?: number;
  weight?: number;
  appointmentDate?: string;
  location?: string;
}

export interface HealthRecord {
  id: string;
  type: 'checkup' | 'vaccination' | 'measurement' | 'symptom';
  title: string;
  notes?: string;
  data?: HealthRecordData;
  childId: string;
  createdAt: string;
  updatedAt: string;
}

export interface HealthRecord {
  id: string;
  type: 'checkup' | 'vaccination' | 'measurement' | 'symptom';
  title: string;
  notes?: string;
  data?: HealthRecordData;
  childId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  notes?: string;
  active: boolean;
  reminders: boolean;
  childId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Memory {
  id: string;
  type: 'text' | 'photo' | 'video' | 'voice';
  title: string;
  content?: string;
  mediaUrl?: string;
  mood?: string;
  tags?: string[];
  location?: string;
  metadata?: Record<string, any>;
  childId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  date: string;
  type: 'health' | 'milestone' | 'activity' | 'other';
  childId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppState {
  // State
  memories: Memory[];
  healthRecords: HealthRecord[];
  medications: Medication[];
  user: User | null;
  children: Child[];
  selectedChild: Child | null;
  upcomingEvents: Event[];
  isLoading: boolean;
  error: string | null;

  // Auth Actions
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;

  // Health Record Actions
  fetchHealthRecords: (childId: string) => Promise<void>;
  addHealthRecord: (record: Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt'>) => Promise<HealthRecord>;
  updateHealthRecord: (id: string, record: Partial<HealthRecord>) => Promise<void>;
  deleteHealthRecord: (id: string) => Promise<void>;

  // Medication Actions
  fetchMedications: (childId: string) => Promise<void>;
  addMedication: (medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Medication>;
  updateMedication: (id: string, medication: Partial<Medication>) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;

  // Child Actions
  fetchChildren: () => Promise<void>;
  setSelectedChild: (child: Child | null) => void;

  // Event Actions
  fetchEvents: (childId: string) => Promise<void>;

  // Memory Actions
  fetchMemories: (childId: string) => Promise<void>;
  addMemory: (memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  deleteMemory: (id: string) => Promise<void>;
}

// Create store
export type StoreState = AppState;
export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      memories: [],
      healthRecords: [],
      medications: [],
      user: null,
      children: [],
      selectedChild: null,
      upcomingEvents: [],
      isLoading: false,
      error: null,

      // Auth Actions
      signIn: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          if (error) throw error;
          set({ user: data.user });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      signOut: async () => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          set({ user: null });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      // Health Record Actions
      fetchHealthRecords: async (childId: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase
            .from('health_records')
            .select('*')
            .eq('childId', childId)
            .order('createdAt', { ascending: false });
          if (error) throw error;
          set({ healthRecords: data as HealthRecord[] });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      addHealthRecord: async (record: Omit<HealthRecord, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase
            .from('health_records')
            .insert([record])
            .select()
            .single();
          if (error) throw error;
          const newRecord = data as HealthRecord;
          set((state) => ({
            healthRecords: [newRecord, ...state.healthRecords],
          }));
          return newRecord;
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateHealthRecord: async (id: string, record: Partial<HealthRecord>) => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase
            .from('health_records')
            .update(record)
            .eq('id', id);
          if (error) throw error;
          set((state) => ({
            healthRecords: state.healthRecords.map((r) =>
              r.id === id ? { ...r, ...record } : r
            ),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteHealthRecord: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase
            .from('health_records')
            .delete()
            .eq('id', id);
          if (error) throw error;
          set((state) => ({
            healthRecords: state.healthRecords.filter((r) => r.id !== id),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      // Medication Actions
      fetchMedications: async (childId: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase
            .from('medications')
            .select('*')
            .eq('childId', childId)
            .order('createdAt', { ascending: false });
          if (error) throw error;
          set({ medications: data as Medication[] });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      addMedication: async (medication: Omit<Medication, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase
            .from('medications')
            .insert([medication])
            .select()
            .single();
          if (error) throw error;
          const newMedication = data as Medication;
          set((state) => ({
            medications: [newMedication, ...state.medications],
          }));
          return newMedication;
        } catch (error) {
          set({ error: (error as Error).message });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },

      updateMedication: async (id: string, medication: Partial<Medication>) => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase
            .from('medications')
            .update(medication)
            .eq('id', id);
          if (error) throw error;
          set((state) => ({
            medications: state.medications.map((m) =>
              m.id === id ? { ...m, ...medication } : m
            ),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteMedication: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase
            .from('medications')
            .delete()
            .eq('id', id);
          if (error) throw error;
          set((state) => ({
            medications: state.medications.filter((m) => m.id !== id),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      // Child Actions
      fetchChildren: async () => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase
            .from('children')
            .select('*')
            .order('createdAt', { ascending: false });
          if (error) throw error;
          set({ children: data as Child[] });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      setSelectedChild: (child: Child | null) => {
        set({ selectedChild: child });
      },

      // Event Actions
      fetchEvents: async (childId: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase
            .from('events')
            .select('*')
            .eq('childId', childId)
            .order('date', { ascending: true });
          if (error) throw error;
          set({ upcomingEvents: data as Event[] });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      // Memory Actions
      fetchMemories: async (childId: string) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase
            .from('memories')
            .select('*')
            .eq('childId', childId)
            .order('createdAt', { ascending: false });
          if (error) throw error;
          set({ memories: data as Memory[] });
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      addMemory: async (memory: Omit<Memory, 'id' | 'createdAt' | 'updatedAt'>) => {
        try {
          set({ isLoading: true, error: null });
          const { data, error } = await supabase
            .from('memories')
            .insert([memory])
            .select()
            .single();
          if (error) throw error;
          const newMemory = data as Memory;
          set((state) => ({
            memories: [newMemory, ...state.memories],
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },

      deleteMemory: async (id: string) => {
        try {
          set({ isLoading: true, error: null });
          const { error } = await supabase
            .from('memories')
            .delete()
            .eq('id', id);
          if (error) throw error;
          set((state) => ({
            memories: state.memories.filter((m) => m.id !== id),
          }));
        } catch (error) {
          set({ error: (error as Error).message });
        } finally {
          set({ isLoading: false });
        }
      },
    }),
    {
      name: 'parent-app-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        selectedChild: state.selectedChild,
      }),
    }
  )
);
