'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';

export function SiteHeader(){
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  useEffect(() => {
    if (isMenuOpen && menuRef.current) {
      const focusableElements = menuRef.current.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      );
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      
      const handleTab = (e: KeyboardEvent) => {
        if (e.key !== 'Tab') return;
        
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      };
      
      menuRef.current.addEventListener('keydown', handleTab);
      firstElement?.focus();
      
      return () => {
        menuRef.current?.removeEventListener('keydown', handleTab);
      };
    }
  }, [isMenuOpen]);

  const link = (href: string, label: string, onClick?: () => void) => (
    <Link
      href={href}
      className="text-sm tracking-wide hover:opacity-80 transition-opacity focus-ring rounded-md px-2 py-1"
      onClick={onClick}
    >
      {label}
    </Link>
  );
  
  return (
    <header className="w-full bg-white/80 backdrop-blur border-b border-black/5 relative z-50">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-serif font-semibold">Wine With Pete</Link>
        
        <nav className="hidden md:flex gap-5 items-center">
          {link('/plan', 'Plan a Gathering')}
          {link('/signature-table', 'Signature Table')}
          {link('/join', 'Founding Table')}
          {link('/essays', 'Essays')}
          {link('/about', 'About')}
        </nav>
        
        <button 
          ref={menuButtonRef}
          className="md:hidden flex flex-col gap-1 w-6 h-6 focus-ring rounded-md p-1"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
        >
          <div className={`w-full h-0.5 bg-black transition-transform ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
          <div className={`w-full h-0.5 bg-black transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`}></div>
          <div className={`w-full h-0.5 bg-black transition-transform ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
        </button>
      </div>
      
      {isMenuOpen && (
        <div 
          id="mobile-menu"
          ref={menuRef}
          className="md:hidden bg-white border-t border-black/5"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <nav className="px-4 py-4 flex flex-col gap-4">
            {link('/plan', 'Plan a Gathering', () => setIsMenuOpen(false))}
            {link('/signature-table', 'Signature Table', () => setIsMenuOpen(false))}
            {link('/join', 'Founding Table', () => setIsMenuOpen(false))}
            {link('/essays', 'Essays', () => setIsMenuOpen(false))}
            {link('/about', 'About', () => setIsMenuOpen(false))}
          </nav>
        </div>
      )}
    </header>
  );
}
