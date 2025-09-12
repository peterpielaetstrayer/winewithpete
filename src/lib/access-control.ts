import type { Member, Package } from '@/lib/types';

export type SubscriptionTier = 'free' | 'premium' | 'founder';

export interface AccessLevel {
  canAccessPackage: boolean;
  maxServingSize: number;
  canAccessAdvanced: boolean;
  canAccessPremium: boolean;
}

export function getAccessLevel(member: Member | null): AccessLevel {
  if (!member) {
    return {
      canAccessPackage: false,
      maxServingSize: 0,
      canAccessAdvanced: false,
      canAccessPremium: false,
    };
  }

  switch (member.subscription_tier) {
    case 'free':
      return {
        canAccessPackage: true,
        maxServingSize: 4, // Free users limited to 4 servings
        canAccessAdvanced: false,
        canAccessPremium: false,
      };
    case 'premium':
      return {
        canAccessPackage: true,
        maxServingSize: 8, // Premium users get full serving sizes
        canAccessAdvanced: true,
        canAccessPremium: true,
      };
    case 'founder':
      return {
        canAccessPackage: true,
        maxServingSize: 12, // Founders get extended serving sizes
        canAccessAdvanced: true,
        canAccessPremium: true,
      };
    default:
      return {
        canAccessPackage: false,
        maxServingSize: 0,
        canAccessAdvanced: false,
        canAccessPremium: false,
      };
  }
}

export function canAccessPackage(packageData: Package, member: Member | null): boolean {
  const access = getAccessLevel(member);
  
  // Free users can only access beginner packages
  if (packageData.difficulty_level !== 'beginner' && member?.subscription_tier === 'free') {
    return false;
  }
  
  return access.canAccessPackage;
}

export function getAvailableServingSizes(packageData: Package, member: Member | null): number[] {
  const access = getAccessLevel(member);
  
  if (!member || member.subscription_tier === 'free') {
    return packageData.free_serving_sizes.filter(size => size <= access.maxServingSize);
  }
  
  return packageData.serving_sizes.filter(size => size <= access.maxServingSize);
}

export function isPremiumContent(packageData: Package): boolean {
  return packageData.difficulty_level !== 'beginner';
}
