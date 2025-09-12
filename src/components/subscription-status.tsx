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
    bgColor: 'bg-gray-100',
    borderColor: 'border-gray-200'
  },
  premium: {
    name: 'Premium',
    icon: Star,
    color: 'text-ember',
    bgColor: 'bg-ember/10',
    borderColor: 'border-ember'
  },
  founder: {
    name: 'Founder',
    icon: Crown,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
    borderColor: 'border-amber-200'
  }
};

export default function SubscriptionStatus() {
  const { member } = useAuth();

  if (!member) {
    return (
      <Link href="/join" className="text-ember hover:text-ember/80 text-sm font-medium">
        Join Now
      </Link>
    );
  }

  const tier = member.subscription_tier;
  const tierInfo = tierInfo[tier];

  return (
    <Link href="/subscription" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
      <tierInfo.icon className={`w-4 h-4 ${tierInfo.color}`} />
      <Badge 
        variant="outline" 
        className={`${tierInfo.bgColor} ${tierInfo.color} ${tierInfo.borderColor} border`}
      >
        {tierInfo.name}
      </Badge>
    </Link>
  );
}
