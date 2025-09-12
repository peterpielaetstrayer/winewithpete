'use client';

import { useState, useCallback } from 'react';
import { useAuth } from '@/components/auth-provider';
import type { SubscriptionTier } from '@/lib/access-control';

interface UpgradeResponse {
  sessionId: string;
  url: string;
}

export function useSubscription() {
  const { member, refreshMember } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upgradeSubscription = useCallback(async (tier: SubscriptionTier) => {
    if (tier === 'free') {
      setError('Cannot upgrade to free tier');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/subscription/upgrade', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier,
          email: member?.email,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upgrade subscription');
      }

      const data: UpgradeResponse = await response.json();
      
      // Redirect to Stripe checkout
      window.location.href = data.url;
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upgrade subscription';
      setError(errorMessage);
      console.error('Subscription upgrade error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [member?.email]);

  const getRequiredTier = useCallback((packageData: any): SubscriptionTier => {
    if (packageData.difficulty_level === 'beginner') {
      return 'free';
    }
    if (packageData.difficulty_level === 'intermediate') {
      return 'premium';
    }
    return 'founder';
  }, []);

  const canAccessContent = useCallback((packageData: any): boolean => {
    if (!member) return false;
    
    const requiredTier = getRequiredTier(packageData);
    const currentTier = member.subscription_tier;
    
    const tierHierarchy = { free: 0, premium: 1, founder: 2 };
    return tierHierarchy[currentTier] >= tierHierarchy[requiredTier];
  }, [member, getRequiredTier]);

  return {
    member,
    isLoading,
    error,
    upgradeSubscription,
    getRequiredTier,
    canAccessContent,
    refreshMember,
  };
}
