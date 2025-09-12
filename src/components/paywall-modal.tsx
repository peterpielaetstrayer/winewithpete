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
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-in fade-in-0 zoom-in-95 duration-300">
        {/* Header */}
        <div className="relative p-8 border-b border-gray-200 bg-gradient-to-r from-ember/5 to-amber-50/50">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-24 h-24 bg-ember rounded-full translate-x-12 -translate-y-12"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-amber-400 rounded-full -translate-x-8 translate-y-8"></div>
          </div>
          
          <div className="relative flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-ember/10 rounded-lg">
                  <Star className="w-6 h-6 text-ember" />
                </div>
                <h2 className="text-3xl font-serif font-bold text-gray-900">
                  Upgrade Required
                </h2>
              </div>
              <p className="text-gray-600 text-lg">
                Access to <span className="font-semibold text-ember">"{contentName}"</span> requires {requiredTierInfo.name} membership
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-white/80 rounded-full transition-colors shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current vs Required */}
        <div className="p-8 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className={`relative p-6 rounded-2xl border-2 ${currentTierInfo.bgColor} ${currentTierInfo.borderColor} shadow-sm`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${currentTierInfo.bgColor}`}>
                  <currentTierInfo.icon className={`w-5 h-5 ${currentTierInfo.color}`} />
                </div>
                <h3 className={`text-lg font-bold ${currentTierInfo.color}`}>
                  Current: {currentTierInfo.name}
                </h3>
              </div>
              <div className={`text-2xl font-bold ${currentTierInfo.color} mb-2`}>
                {currentTierInfo.price}
              </div>
              <p className="text-gray-600">{currentTierInfo.description}</p>
            </div>
            
            <div className={`relative p-6 rounded-2xl border-2 ${requiredTierInfo.bgColor} ${requiredTierInfo.borderColor} shadow-lg ring-2 ring-ember/20`}>
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${requiredTierInfo.bgColor}`}>
                  <requiredTierInfo.icon className={`w-5 h-5 ${requiredTierInfo.color}`} />
                </div>
                <h3 className={`text-lg font-bold ${requiredTierInfo.color}`}>
                  Required: {requiredTierInfo.name}
                </h3>
                <div className="px-2 py-1 bg-ember/10 text-ember text-xs font-semibold rounded-full">
                  Recommended
                </div>
              </div>
              <div className={`text-2xl font-bold ${requiredTierInfo.color} mb-2`}>
                {requiredTierInfo.price}
              </div>
              <p className="text-gray-600">{requiredTierInfo.description}</p>
            </div>
          </div>
        </div>

        {/* Features Comparison */}
        <div className="p-8">
          <h3 className="text-xl font-bold mb-6 text-center">What you'll get with {requiredTierInfo.name}:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requiredTierInfo.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                  <Check className="w-4 h-4 text-green-600" />
                </div>
                <span className="text-gray-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-8 bg-gradient-to-r from-gray-50 to-gray-100 rounded-b-3xl">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={() => onUpgrade(requiredTier)}
              className={`flex-1 py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 ${
                requiredTierInfo.color === 'text-ember' 
                  ? 'bg-ember hover:bg-ember/90 text-white hover:shadow-xl hover:shadow-ember/25' 
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white hover:shadow-xl hover:shadow-amber-500/25'
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <Star className="w-5 h-5" />
                <span>Upgrade to {requiredTierInfo.name}</span>
              </div>
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1 py-4 text-lg font-semibold hover:bg-gray-50"
            >
              Maybe Later
            </Button>
          </div>
          <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500">
            <Check className="w-4 h-4 text-green-500" />
            <span>Cancel anytime. No commitment required.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
