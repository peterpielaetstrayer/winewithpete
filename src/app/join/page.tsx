'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function JoinPage(){
  const [email, setEmail] = useState('');
  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-serif">Join the Circle</h1>
      <p className="mt-2 text-black/70">Occasional invites, rituals, and tools for hosting slower nights.</p>
      <div className="mt-6 flex flex-col sm:flex-row gap-2">
        <Input placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)} className="flex-1" />
        <Button className="bg-[var(--wwp-ember)] sm:px-8">I'm in</Button>
      </div>
      <p className="mt-2 text-xs opacity-60">We respect your privacy. Unsubscribe anytime.</p>
    </div>
  );
}
