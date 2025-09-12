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
        <Card className={`relative overflow-hidden border-2 ${currentTierInfo.bgColor} ${currentTierInfo.borderColor} shadow-lg`}>
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-0 right-0 w-32 h-32 bg-ember rounded-full translate-x-16 -translate-y-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-amber-400 rounded-full -translate-x-12 translate-y-12"></div>
          </div>
          
          <div className="relative p-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`p-4 rounded-2xl ${currentTierInfo.bgColor} shadow-md`}>
                  <currentTierInfo.icon className={`w-8 h-8 ${currentTierInfo.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`text-2xl font-bold ${currentTierInfo.color}`}>
                      {currentTierInfo.name}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${currentTierInfo.bgColor} ${currentTierInfo.color}`}>
                      Active
                    </div>
                  </div>
                  <p className="text-gray-600 text-lg">{currentTierInfo.description}</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold ${currentTierInfo.color} mb-2`}>
                  {currentTierInfo.price}
                </div>
                {currentTier !== 'free' && (
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    size="sm"
                    className="hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
                  >
                    Cancel Subscription
                  </Button>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Available Upgrades */}
      {currentTier === 'free' && (
        <div className="mb-12">
          <h2 className="text-2xl font-serif font-medium mb-6">Available Upgrades</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(tierInfo).filter(([tier]) => tier !== 'free').map(([tier, info]) => (
              <Card key={tier} className={`relative overflow-hidden border-2 ${info.bgColor} ${info.borderColor} hover:shadow-xl transition-all duration-300 hover:scale-105 group`}>
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-ember rounded-full translate-x-12 -translate-y-12"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-amber-400 rounded-full -translate-x-8 translate-y-8"></div>
                </div>
                
                <div className="relative p-8 text-center">
                  <div className={`inline-flex p-4 rounded-2xl ${info.bgColor} mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <info.icon className={`w-10 h-10 ${info.color}`} />
                  </div>
                  
                  <h3 className={`text-2xl font-bold ${info.color} mb-3`}>
                    {info.name}
                  </h3>
                  
                  <div className={`text-4xl font-bold ${info.color} mb-4`}>
                    {info.price}
                  </div>
                  
                  <p className="text-gray-600 mb-8 text-lg">{info.description}</p>
                  
                  <div className="space-y-4 mb-8">
                    {info.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 text-left">
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-green-600" />
                        </div>
                        <span className="text-gray-700 font-medium">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button
                    onClick={() => handleUpgrade(tier as 'premium' | 'founder')}
                    disabled={isLoading}
                    className={`w-full py-4 text-lg font-semibold transition-all duration-300 hover:scale-105 ${
                      info.color === 'text-ember' 
                        ? 'bg-ember hover:bg-ember/90 text-white hover:shadow-xl hover:shadow-ember/25' 
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white hover:shadow-xl hover:shadow-amber-500/25'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <info.icon className="w-5 h-5" />
                        Upgrade to {info.name}
                      </div>
                    )}
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
