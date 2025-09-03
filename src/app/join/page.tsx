'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function JoinPage(){
  const [email, setEmail] = useState('');
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6">Join the Circle</h1>
        <p className="text-lg text-black/80 max-w-xl mx-auto">
          Get invites to intimate gatherings, weekly essays on slow living, and tools for hosting your own meaningful conversations.
        </p>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border">
        <div className="text-center mb-8">
          <div className="aspect-[16/9] rounded-xl overflow-hidden mb-6">
            <img 
              src="/images/events/events-community-gathering.png.png" 
              alt="Join our community of people who value slow conversation and meaningful connections"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-xl font-serif font-semibold mb-4">What You'll Get</h2>
          <div className="grid md:grid-cols-3 gap-6 text-sm">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <img src="/images/icons/icon-fire.png" alt="Event Invites" className="w-10 h-10" />
              </div>
              <h3 className="font-medium mb-2">Event Invites</h3>
              <p className="text-black/70">Exclusive invites to Open Fire Sundays and Salon Dinners in your area.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <img src="/images/icons/icon-writing.png" alt="Weekly Essays" className="w-10 h-10" />
              </div>
              <h3 className="font-medium mb-2">Weekly Essays</h3>
              <p className="text-black/70">Thoughtful writing on slow living, community, and meaningful connection.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <img src="/images/icons/icon-connection.png" alt="Hosting Tools" className="w-10 h-10" />
              </div>
              <h3 className="font-medium mb-2">Hosting Tools</h3>
              <p className="text-black/70">Conversation starters, event guides, and resources for hosting your own gatherings.</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Input placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} className="flex-1" />
          <Button className="bg-[var(--wwp-ember)] sm:px-8">I'm in</Button>
        </div>
        <p className="mt-2 text-xs opacity-60 text-center">We respect your privacy. Unsubscribe anytime.</p>
      </div>
    </div>
  );
}
