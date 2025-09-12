'use client';

import { useAuth } from '@/components/auth-provider';
import { Badge } from '@/components/ui/badge';
import { Star, Crown, Check } from 'lucide-react';
import Link from 'next/link';

const tierInfo = {
  free: {
    name: 'Free',
    icon: Check,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    iconBg: 'bg-gray-100',
    iconColor: 'text-gray-500'
  },
  premium: {
    name: 'Premium',
    icon: Star,
    color: 'text-ember',
    bgColor: 'bg-ember/5',
    borderColor: 'border-ember/30',
    iconBg: 'bg-ember/10',
    iconColor: 'text-ember'
  },
  founder: {
    name: 'Founder',
    icon: Crown,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-600'
  }
};

export default function SubscriptionStatus() {
  const { member } = useAuth();

  if (!member) {
    return (
      <Link 
        href="/join" 
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-ember text-white text-sm font-medium rounded-lg hover:bg-ember/90 transition-colors"
      >
        <Star className="w-4 h-4" />
        Join Now
      </Link>
    );
  }

  const tier = member.subscription_tier;
  const currentTierInfo = tierInfo[tier];

  return (
    <Link 
      href="/subscription" 
      className="group flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-black/5 transition-all duration-200"
    >
      <div className={`p-1.5 rounded-md ${currentTierInfo.iconBg}`}>
        <currentTierInfo.icon className={`w-3.5 h-3.5 ${currentTierInfo.iconColor}`} />
      </div>
      <div className="flex flex-col items-start">
        <span className={`text-xs font-medium ${currentTierInfo.color}`}>
          {currentTierInfo.name}
        </span>
        <span className="text-xs text-gray-500 group-hover:text-gray-700">
          Manage
        </span>
      </div>
    </Link>
  );
}
