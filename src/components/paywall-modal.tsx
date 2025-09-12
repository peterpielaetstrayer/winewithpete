'use client';

import { useState } from 'react';
import { X, Check, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { SubscriptionTier } from '@/lib/access-control';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTier: SubscriptionTier;
  requiredTier: SubscriptionTier;
  contentName: string;
  onUpgrade: (tier: SubscriptionTier) => void;
}

const tierInfo = {
  free: {
    name: 'Free',
    price: '$0',
    description: 'Basic access to beginner packages',
    features: [
      'Access to beginner packages',
      'Up to 4 servings per recipe',
      'Basic wine pairings',
      'Community access'
    ],
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200'
  },
  premium: {
    name: 'Premium',
    price: '$19/month',
    description: 'Full access to all packages and features',
    features: [
      'All package types',
      'Up to 8 servings per recipe',
      'Advanced wine pairings',
      'Exclusive recipes',
      'Priority support'
    ],
    color: 'text-ember',
    bgColor: 'bg-ember/5',
    borderColor: 'border-ember'
  },
  founder: {
    name: 'Founder',
    price: '$39/month',
    description: 'Ultimate access with extended serving sizes',
    features: [
      'All package types',
      'Up to 12 servings per recipe',
      'Premium wine pairings',
      'Exclusive founder content',
      'Direct access to Pete',
      'Early access to new features'
    ],
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200'
  }
};

export default function PaywallModal({
  isOpen,
  onClose,
  currentTier,
  requiredTier,
  contentName,
  onUpgrade
}: PaywallModalProps) {
  if (!isOpen) return null;

  const currentTierInfo = tierInfo[currentTier];
  const requiredTierInfo = tierInfo[requiredTier];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-serif font-medium text-gray-900">
              Upgrade Required
            </h2>
            <p className="text-gray-600 mt-1">
              Access to "{contentName}" requires {requiredTierInfo.name} membership
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current vs Required */}
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className={`p-4 rounded-lg border-2 ${currentTierInfo.bgColor} ${currentTierInfo.borderColor}`}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`font-medium ${currentTierInfo.color}`}>
                  Current: {currentTierInfo.name}
                </h3>
                <Badge variant="outline" className={currentTierInfo.color}>
                  {currentTierInfo.price}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{currentTierInfo.description}</p>
            </div>
            
            <div className={`p-4 rounded-lg border-2 ${requiredTierInfo.bgColor} ${requiredTierInfo.borderColor}`}>
              <div className="flex items-center gap-2 mb-2">
                <h3 className={`font-medium ${requiredTierInfo.color}`}>
                  Required: {requiredTierInfo.name}
                </h3>
                <Badge className={requiredTierInfo.color === 'text-ember' ? 'bg-ember text-white' : 'bg-amber-500 text-white'}>
                  {requiredTierInfo.price}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{requiredTierInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="p-6">
          <h3 className="text-lg font-medium mb-4">What you'll get with {requiredTierInfo.name}:</h3>
          <div className="space-y-3">
            {requiredTierInfo.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center mt-0.5">
                  <Check className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 bg-gray-50 rounded-b-2xl">
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => onUpgrade(requiredTier)}
              className="flex-1 bg-ember hover:bg-ember/90 text-white"
            >
              <Star className="w-4 h-4 mr-2" />
              Upgrade to {requiredTierInfo.name}
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              Maybe Later
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3 text-center">
            Cancel anytime. No commitment required.
          </p>
        </div>
      </div>
    </div>
  );
}
