'use client';
import Link from 'next/link';
import { useState } from 'react';

export function SiteHeader(){
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const link = (href:string, label:string) => (
    <Link href={href} className="text-sm tracking-wide hover:opacity-80 transition-opacity">{label}</Link>
  );
  
  return (
    <header className="w-full bg-white/80 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-serif font-semibold">Wine With Pete</Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6">
          {link('/events','Events')}
          {link('/archive','Archive')}
          {link('/join','Join')}
          {link('/store','Store')}
          {link('/support','Support')}
          {link('/wine-with','Wine With')}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex flex-col gap-1 w-6 h-6"
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
            {link('/events','Events')}
            {link('/archive','Archive')}
            {link('/join','Join')}
            {link('/store','Store')}
            {link('/support','Support')}
            {link('/wine-with','Wine With')}
          </nav>
        </div>
      )}
    </header>
  );
}
