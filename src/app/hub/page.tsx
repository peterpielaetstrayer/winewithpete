'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';

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
    { id: 'packages', label: 'Packages', href: '/packages' },
    { id: 'pairings', label: 'Pairing Studio', disabled: true },
    { id: 'gatherings', label: 'Gathering Designer', disabled: true },
    { id: 'journal', label: 'My Journal', disabled: true }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        <h1 className="text-display animate-fade-in">Welcome to the Hub</h1>
        <p className="mt-4 text-black/80 animate-fade-in max-w-2xl mx-auto">
          Your personal space for fire-cooked recipes, wine pairings, and gathering design.
          {member ? ` Welcome back, ${member.name || 'friend'}.` : ''}
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8 border-b border-black/10">
          {tabs.map((tab) => (
            <Link
              key={tab.id}
              href={tab.disabled ? '#' : tab.href}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                tab.id === activeTab
                  ? 'border-ember text-ember'
                  : tab.disabled
                  ? 'border-transparent text-black/40 cursor-not-allowed'
                  : 'border-transparent text-black/70 hover:text-ember hover:border-ember/50'
              }`}
              onClick={(e) => {
                if (tab.disabled) {
                  e.preventDefault();
                } else {
                  setActiveTab(tab.id);
                }
              }}
            >
              {tab.label}
              {tab.disabled && (
                <span className="ml-2 text-xs bg-black/10 px-2 py-1 rounded">
                  Coming Soon
                </span>
              )}
            </Link>
          ))}
        </nav>
      </div>

      {/* Phase 1 Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Packages */}
        <div className="card-enhanced">
          <div className="p-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-ember/10 rounded-full flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-ember" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-serif font-medium">Open-Fire Packages</h3>
                <p className="text-black/70 text-sm">Curated menu collections</p>
              </div>
            </div>
            <p className="text-black/80 mb-6">
              Complete open-fire menu packages with recipes, shopping lists, and wine pairings. 
              Scale servings and print everything you need for your gathering.
            </p>
            <Link 
              href="/packages" 
              className="btn-ember inline-flex items-center"
            >
              Browse Packages
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Coming Soon Features */}
        <div className="space-y-6">
          <div className="card p-6 opacity-60">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Pairing Studio</h4>
                <span className="text-xs bg-black/10 px-2 py-1 rounded">Phase 2</span>
              </div>
            </div>
            <p className="text-sm text-black/70">
              AI-powered wine and cocktail pairing suggestions based on your meal descriptions.
            </p>
          </div>

          <div className="card p-6 opacity-60">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-black/10 rounded-full flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-black/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-medium">Gathering Designer</h4>
                <span className="text-xs bg-black/10 px-2 py-1 rounded">Phase 3</span>
              </div>
            </div>
            <p className="text-sm text-black/70">
              Custom gathering planning with guest coordination and live task boards.
            </p>
          </div>
        </div>
      </div>

      {/* Member Status */}
      {member && (
        <div className="mt-12 bg-cream rounded-2xl p-8 text-center">
          <h3 className="text-section mb-4">Member Status</h3>
          <div className="flex justify-center items-center space-x-8">
            <div>
              <div className="text-2xl font-semibold capitalize">{member.subscription_tier}</div>
              <div className="text-sm text-black/70">Tier</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">∞</div>
              <div className="text-sm text-black/70">Packages</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">
                {new Date(member.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
              <div className="text-sm text-black/70">Member Since</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
