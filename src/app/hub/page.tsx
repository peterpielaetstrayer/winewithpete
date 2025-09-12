'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { Star, Crown, Check, Package, Wine, Users, BookOpen, ArrowRight, Sparkles } from 'lucide-react';

export default function HubPage() {
  const { member, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('packages');

  console.log('HubPage: member:', member, 'loading:', loading);

  if (loading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="text-center">
          <h1 className="text-display animate-fade-in">Loading Hub...</h1>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'packages', label: 'Packages', href: '/packages', icon: Package, description: 'Open-fire recipes' },
    { id: 'pairings', label: 'Pairing Studio', disabled: true, icon: Wine, description: 'AI wine pairings' },
    { id: 'gatherings', label: 'Gathering Designer', disabled: true, icon: Users, description: 'Event planning' },
    { id: 'journal', label: 'My Journal', disabled: true, icon: BookOpen, description: 'Personal notes' }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Welcome Section */}
      <div className="text-center mb-16 relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/2 w-32 h-32 bg-ember rounded-full -translate-x-16 -translate-y-16"></div>
          <div className="absolute bottom-0 right-1/4 w-24 h-24 bg-amber-400 rounded-full translate-x-12 translate-y-12"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-ember/30 rounded-full -translate-x-8 -translate-y-8"></div>
        </div>
        
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-ember/10 text-ember rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            Member Hub
          </div>
          
          <h1 className="text-5xl font-serif font-bold mb-6 bg-gradient-to-r from-ember via-amber-600 to-ember bg-clip-text text-transparent">
            Welcome to the Hub
          </h1>
          
          <p className="text-xl text-black/80 max-w-3xl mx-auto leading-relaxed">
            Your personal space for fire-cooked recipes, wine pairings, and gathering design.
            {member && (
              <span className="block mt-3 text-lg font-medium text-ember">
                Welcome back, {member.name || 'friend'}! 👋
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-12">
        <nav className="flex flex-wrap gap-2 justify-center">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Link
                key={tab.id}
                href={tab.disabled ? '#' : tab.href}
                className={`group relative flex items-center gap-3 px-6 py-4 rounded-2xl font-medium text-sm transition-all duration-300 ${
                  tab.id === activeTab
                    ? 'bg-ember text-white shadow-lg shadow-ember/25'
                    : tab.disabled
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-700 hover:bg-ember/5 hover:text-ember hover:shadow-md border border-gray-200'
                }`}
                onClick={(e) => {
                  if (tab.disabled) {
                    e.preventDefault();
                  } else {
                    setActiveTab(tab.id);
                  }
                }}
              >
                <Icon className={`w-5 h-5 ${tab.id === activeTab ? 'text-white' : tab.disabled ? 'text-gray-400' : 'text-ember'}`} />
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{tab.label}</span>
                  <span className={`text-xs ${tab.id === activeTab ? 'text-white/80' : 'text-gray-500'}`}>
                    {tab.description}
                  </span>
                </div>
                {tab.disabled && (
                  <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full font-medium">
                    Coming Soon
                  </span>
                )}
                {!tab.disabled && tab.id === activeTab && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full"></div>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Phase 1 Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Packages */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-ember/5 via-white to-amber-50/50 rounded-3xl border border-ember/20 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
            <div className="absolute top-0 right-0 w-24 h-24 bg-ember rounded-full translate-x-12 -translate-y-12"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 bg-amber-400 rounded-full -translate-x-8 translate-y-8"></div>
          </div>
          
          <div className="relative p-8">
            <div className="flex items-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-ember to-ember/80 rounded-2xl flex items-center justify-center mr-6 shadow-lg">
                <Package className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-serif font-bold text-gray-900">Open-Fire Packages</h3>
                <p className="text-ember font-medium">Curated menu collections</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
              Complete open-fire menu packages with recipes, shopping lists, and wine pairings. 
              Scale servings and print everything you need for your gathering.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                href="/packages" 
                className="group/btn relative px-8 py-4 bg-ember text-white rounded-xl font-semibold hover:bg-ember/90 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-ember/25 flex items-center justify-center gap-2"
              >
                <Package className="w-5 h-5" />
                <span>Browse Packages</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Print Ready</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="w-4 h-4 text-green-500" />
                  <span>Wine Pairings</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="space-y-6">
          <div className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex items-center justify-center mr-4">
                <Wine className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-lg font-bold text-gray-900">Pairing Studio</h4>
                  <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold">
                    Phase 2
                  </span>
                </div>
                <p className="text-sm text-gray-600">AI-powered wine pairings</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              AI-powered wine and cocktail pairing suggestions based on your meal descriptions.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Coming Soon</span>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-lg font-bold text-gray-900">Gathering Designer</h4>
                  <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold">
                    Phase 3
                  </span>
                </div>
                <p className="text-sm text-gray-600">Event planning tools</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Custom gathering planning with guest coordination and live task boards.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Coming Soon</span>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex items-center justify-center mr-4">
                <BookOpen className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h4 className="text-lg font-bold text-gray-900">My Journal</h4>
                  <span className="text-xs bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold">
                    Phase 4
                  </span>
                </div>
                <p className="text-sm text-gray-600">Personal notes & memories</p>
              </div>
            </div>
            <p className="text-gray-700 mb-4">
              Document your cooking adventures, wine discoveries, and gathering memories.
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>Coming Soon</span>
            </div>
          </div>
        </div>
      </div>

      {/* Member Status */}
      {member && (
        <div className="mt-16 relative overflow-hidden">
          <div className="bg-gradient-to-br from-ember/5 via-amber-50/50 to-ember/10 rounded-3xl p-12 border border-ember/20 shadow-lg">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-32 h-32 bg-ember rounded-full -translate-x-16 -translate-y-16"></div>
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-amber-400 rounded-full translate-x-12 translate-y-12"></div>
              <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-ember/30 rounded-full -translate-x-8 -translate-y-8"></div>
            </div>
            
            <div className="relative text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-ember/10 text-ember rounded-full text-sm font-medium mb-6">
                <Crown className="w-4 h-4" />
                Member Status
              </div>
              
              <h3 className="text-3xl font-serif font-bold mb-8 bg-gradient-to-r from-ember to-amber-600 bg-clip-text text-transparent">
                Your Membership
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="group">
                  <div className="w-16 h-16 bg-gradient-to-br from-ember to-ember/80 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    {member.subscription_tier === 'free' ? (
                      <Check className="w-8 h-8 text-white" />
                    ) : member.subscription_tier === 'premium' ? (
                      <Star className="w-8 h-8 text-white" />
                    ) : (
                      <Crown className="w-8 h-8 text-white" />
                    )}
                  </div>
                  <div className="text-2xl font-bold text-gray-900 capitalize mb-1">
                    {member.subscription_tier}
                  </div>
                  <div className="text-gray-600 font-medium">Tier</div>
                </div>
                
                <div className="group">
                  <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">∞</div>
                  <div className="text-gray-600 font-medium">Packages</div>
                </div>
                
                <div className="group">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {new Date(member.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                  <div className="text-gray-600 font-medium">Member Since</div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-ember/20">
                <p className="text-gray-600 mb-4">
                  Thank you for being part of the Wine With Pete community!
                </p>
                <Link 
                  href="/subscription" 
                  className="inline-flex items-center gap-2 px-6 py-3 bg-ember text-white rounded-xl font-semibold hover:bg-ember/90 transition-colors"
                >
                  <Crown className="w-4 h-4" />
                  Manage Subscription
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
