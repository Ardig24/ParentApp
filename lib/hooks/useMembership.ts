import { useEffect, useState } from 'react';
import { useAuth } from '../auth';
import { supabase } from '../supabase';

export type MembershipType = 'free' | 'premium';
export type SubscriptionStatus = 'inactive' | 'active' | 'past_due' | 'canceled';

interface MembershipDetails {
  type: MembershipType;
  status: SubscriptionStatus;
  startDate?: Date;
  endDate?: Date;
}

export const FEATURE_ACCESS = {
  // Free features
  basicJournal: ['free', 'premium'],
  basicHealth: ['free', 'premium'],
  limitedStorage: ['free', 'premium'],
  basicMilestones: ['free', 'premium'],
  
  // Premium features
  aiInsights: ['premium'],
  advancedHealth: ['premium'],
  unlimitedStorage: ['premium'],
  aiStories: ['premium'],
  developmentAnalysis: ['premium'],
  dataExport: ['premium'],
} as const;

export function useMembership() {
  const { user } = useAuth();
  const [membership, setMembership] = useState<MembershipDetails>({
    type: 'free',
    status: 'inactive',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembership() {
      if (!user) {
        setMembership({ type: 'free', status: 'inactive' });
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('membership_type, subscription_status, membership_start_date, membership_end_date')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching membership:', error);
        return;
      }

      setMembership({
        type: data.membership_type,
        status: data.subscription_status,
        startDate: data.membership_start_date ? new Date(data.membership_start_date) : undefined,
        endDate: data.membership_end_date ? new Date(data.membership_end_date) : undefined,
      });
      setLoading(false);
    }

    fetchMembership();
  }, [user]);

  const canAccess = (feature: keyof typeof FEATURE_ACCESS): boolean => {
    return FEATURE_ACCESS[feature].includes(membership.type) && membership.status === 'active';
  };

  const isPremium = (): boolean => {
    return membership.type === 'premium' && membership.status === 'active';
  };

  return {
    membership,
    loading,
    canAccess,
    isPremium,
  };
}
