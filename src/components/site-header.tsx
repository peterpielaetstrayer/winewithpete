'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from './auth-provider';
import SubscriptionStatus from './subscription-status';

export function SiteHeader(){
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { member, signOut, loading } = useAuth();
  
  console.log('SiteHeader - member:', member, 'loading:', loading);
  
  const link = (href:string, label:string) => (
    <Link href={href} className="text-sm tracking-wide hover:opacity-80 transition-opacity focus-ring rounded-md px-2 py-1">{label}</Link>
  );
  
  return (
    <header className="w-full bg-white/80 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-6xl px-4 py-3 md:py-4 flex items-center justify-between">
        <Link href="/" className="text-lg md:text-xl font-serif font-semibold">Wine With Pete</Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          {link('/about','About')}
          {link('/events','Events')}
          {link('/archive','Essays')}
          {link('/art','Art')}
          {member ? link('/hub','Hub') : null}
          {link('/store','Store')}
          {link('/support','Support')}
          {member && <SubscriptionStatus />}
          {member ? (
            <button 
              onClick={signOut}
              className="text-sm tracking-wide hover:opacity-80 transition-opacity focus-ring rounded-md px-2 py-1"
            >
              Sign Out
            </button>
          ) : (
            link('/join','Join')
          )}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex flex-col gap-1 w-6 h-6 focus-ring rounded-md p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className={`w-full h-0.5 bg-black transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
          <div className={`w-full h-0.5 bg-black transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-full h-0.5 bg-black transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-black/5">
          <nav className="px-4 py-4 flex flex-col gap-4">
            {link('/about','About')}
            {link('/events','Events')}
            {link('/archive','Essays')}
            {link('/art','Art')}
            {member ? link('/hub','Hub') : null}
            {link('/store','Store')}
            {link('/support','Support')}
            {member && (
              <div className="py-2">
                <SubscriptionStatus />
              </div>
            )}
            {member ? (
              <button 
                onClick={signOut}
                className="text-sm tracking-wide hover:opacity-80 transition-opacity focus-ring rounded-md px-2 py-1 text-left"
              >
                Sign Out
              </button>
            ) : (
              link('/join','Join')
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
