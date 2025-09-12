'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Check, Star, Crown, Zap } from 'lucide-react';
import Link from 'next/link';

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
    borderColor: 'border-gray-200',
    icon: Check
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
    borderColor: 'border-ember',
    icon: Star
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
    borderColor: 'border-amber-200',
    icon: Crown
  }
};

export default function SubscriptionPage() {
  const { member, refreshMember } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const currentTier = member?.subscription_tier || 'free';
  const currentTierInfo = tierInfo[currentTier];

  const handleUpgrade = async (tier: 'premium' | 'founder') => {
    if (tier === currentTier) return;
    
    setIsLoading(true);
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

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      console.error('Upgrade error:', error);
      alert('Failed to upgrade subscription. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    // This would typically redirect to Stripe customer portal
    // For now, we'll just show an alert
    alert('To cancel your subscription, please contact support or visit your Stripe customer portal.');
  };

  if (!member) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-display animate-fade-in">Subscription Management</h1>
          <p className="mt-4 text-black/80 animate-fade-in">
            Please <Link href="/join" className="text-ember underline hover:no-underline">join as a member</Link> to manage your subscription.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-display animate-fade-in">Subscription Management</h1>
        <p className="mt-4 text-black/80 animate-fade-in">
          Manage your Wine With Pete subscription and access levels.
        </p>
      </div>

      {/* Current Subscription */}
      <div className="mb-12">
        <h2 className="text-2xl font-serif font-medium mb-6">Current Subscription</h2>
        <Card className={`p-6 border-2 ${currentTierInfo.bgColor} ${currentTierInfo.borderColor}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-full ${currentTierInfo.bgColor}`}>
                <currentTierInfo.icon className={`w-6 h-6 ${currentTierInfo.color}`} />
              </div>
              <div>
                <h3 className={`text-xl font-medium ${currentTierInfo.color}`}>
                  {currentTierInfo.name}
                </h3>
                <p className="text-gray-600">{currentTierInfo.description}</p>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-2xl font-bold ${currentTierInfo.color}`}>
                {currentTierInfo.price}
              </div>
              {currentTier !== 'free' && (
                <Button
                  onClick={handleCancel}
                  variant="outline"
                  size="sm"
                  className="mt-2"
                >
                  Cancel
                </Button>
              )}
            </div>
          </div>
        </Card>
      </div>

      {/* Available Upgrades */}
      {currentTier === 'free' && (
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-medium mb-6">Available Upgrades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(tierInfo).filter(([tier]) => tier !== 'free').map(([tier, info]) => (
              <Card key={tier} className={`p-6 border-2 ${info.bgColor} ${info.borderColor} hover:shadow-lg transition-shadow`}>
                <div className="text-center">
                  <div className={`inline-flex p-3 rounded-full ${info.bgColor} mb-4`}>
                    <info.icon className={`w-8 h-8 ${info.color}`} />
                  </div>
                  <h3 className={`text-xl font-medium ${info.color} mb-2`}>
                    {info.name}
                  </h3>
                  <div className={`text-3xl font-bold ${info.color} mb-2`}>
                    {info.price}
                  </div>
                  <p className="text-gray-600 mb-6">{info.description}</p>
                  
                  <div className="space-y-3 mb-6">
                    {info.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => handleUpgrade(tier as 'premium' | 'founder')}
                    disabled={isLoading}
                    className={`w-full ${info.color === 'text-ember' ? 'bg-ember hover:bg-ember/90 text-white' : 'bg-amber-500 hover:bg-amber-600 text-white'}`}
                  >
                    {isLoading ? 'Processing...' : `Upgrade to ${info.name}`}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Features Comparison */}
      <div className="mb-12">
        <h2 className="text-2xl font-serif font-medium mb-6">Feature Comparison</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-4 px-4 font-medium text-gray-900">Features</th>
                <th className="text-center py-4 px-4 font-medium text-gray-900">Free</th>
                <th className="text-center py-4 px-4 font-medium text-ember">Premium</th>
                <th className="text-center py-4 px-4 font-medium text-amber-600">Founder</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-700">Beginner packages</td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-700">Intermediate packages</td>
                <td className="text-center py-4 px-4">
                  <span className="text-gray-400">—</span>
                </td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-700">Advanced packages</td>
                <td className="text-center py-4 px-4">
                  <span className="text-gray-400">—</span>
                </td>
                <td className="text-center py-4 px-4">
                  <span className="text-gray-400">—</span>
                </td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-700">Max serving size</td>
                <td className="text-center py-4 px-4 text-gray-700">4</td>
                <td className="text-center py-4 px-4 text-ember font-medium">8</td>
                <td className="text-center py-4 px-4 text-amber-600 font-medium">12</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-700">Wine pairings</td>
                <td className="text-center py-4 px-4 text-gray-700">Basic</td>
                <td className="text-center py-4 px-4 text-ember font-medium">Advanced</td>
                <td className="text-center py-4 px-4 text-amber-600 font-medium">Premium</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 px-4 text-gray-700">Priority support</td>
                <td className="text-center py-4 px-4">
                  <span className="text-gray-400">—</span>
                </td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
              <tr>
                <td className="py-4 px-4 text-gray-700">Direct access to Pete</td>
                <td className="text-center py-4 px-4">
                  <span className="text-gray-400">—</span>
                </td>
                <td className="text-center py-4 px-4">
                  <span className="text-gray-400">—</span>
                </td>
                <td className="text-center py-4 px-4">
                  <Check className="w-5 h-5 text-green-600 mx-auto" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <Link href="/packages" className="btn-ember">
          View All Packages
        </Link>
      </div>
    </div>
  );
}
