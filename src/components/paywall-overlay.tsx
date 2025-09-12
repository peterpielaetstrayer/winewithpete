'use client';

import { useState } from 'react';
import { Lock, Star, Crown, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SubscriptionTier } from '@/lib/access-control';

interface PaywallOverlayProps {
  currentTier: SubscriptionTier;
  requiredTier: SubscriptionTier;
  contentName: string;
  onUpgrade: (tier: SubscriptionTier) => void;
}

const tierInfo = {
  free: {
    name: 'Free',
    price: '$0',
    icon: Check,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50'
  },
  premium: {
    name: 'Premium',
    price: '$19/month',
    icon: Star,
    color: 'text-ember',
    bgColor: 'bg-ember/5'
  },
  founder: {
    name: 'Founder',
    price: '$39/month',
    icon: Crown,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50'
  }
};

export default function PaywallOverlay({
  currentTier,
  requiredTier,
  contentName,
  onUpgrade
}: PaywallOverlayProps) {
  const currentTierInfo = tierInfo[currentTier];
  const requiredTierInfo = tierInfo[requiredTier];

  return (
    <div className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 text-center">
        {/* Lock Icon */}
        <div className="w-16 h-16 bg-ember/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <Lock className="w-8 h-8 text-ember" />
        </div>

        {/* Content */}
        <h3 className="text-xl font-serif font-medium text-gray-900 mb-2">
          Premium Content
        </h3>
        <p className="text-gray-600 mb-6">
          "{contentName}" requires {requiredTierInfo.name} membership
        </p>

        {/* Current vs Required */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className={`px-3 py-2 rounded-full ${currentTierInfo.bgColor}`}>
            <span className={`text-sm font-medium ${currentTierInfo.color}`}>
              {currentTierInfo.name}
            </span>
          </div>
          <span className="text-gray-400">→</span>
          <div className={`px-3 py-2 rounded-full ${requiredTierInfo.bgColor}`}>
            <span className={`text-sm font-medium ${requiredTierInfo.color}`}>
              {requiredTierInfo.name}
            </span>
          </div>
        </div>

        {/* Upgrade Button */}
        <Button
          onClick={() => onUpgrade(requiredTier)}
          className={`w-full ${
            requiredTier === 'premium' 
              ? 'bg-ember hover:bg-ember/90 text-white' 
              : 'bg-amber-500 hover:bg-amber-600 text-white'
          }`}
        >
          <requiredTierInfo.icon className="w-4 h-4 mr-2" />
          Upgrade to {requiredTierInfo.name} - {requiredTierInfo.price}
        </Button>

        <p className="text-xs text-gray-500 mt-3">
          Cancel anytime. No commitment required.
        </p>
      </div>
    </div>
  );
}
