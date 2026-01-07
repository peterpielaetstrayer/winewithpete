'use client';
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';

export function SiteHeader(){
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  
  // Close menu on Escape key
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

  // Focus trap when menu is open
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

  const link = (href:string, label:string) => (
    <Link href={href} className="text-sm tracking-wide hover:opacity-80 transition-opacity focus-ring rounded-md px-2 py-1">{label}</Link>
  );
  
  return (
    <header className="w-full bg-white/80 backdrop-blur border-b border-black/5 relative z-50">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-serif font-semibold">Wine With Pete</Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          {link('/start-here','Start Here')}
          {link('/essays','Essays')}
          {link('/gatherings','Gatherings')}
          
          {/* Shop Dropdown */}
          <NavigationMenu viewport={false} className="relative z-50">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm tracking-wide hover:opacity-80 transition-opacity focus-ring rounded-md px-2 py-1 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                  Shop
                </NavigationMenuTrigger>
                <NavigationMenuContent className="z-50">
                  <div className="w-48 p-2">
                    <NavigationMenuLink asChild>
                      <Link
                        href="/recipes"
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
                          "hover:bg-cream hover:text-charcoal focus:bg-cream focus:text-charcoal"
                        )}
                      >
                        <div className="text-sm font-medium leading-none">Recipes & Guides</div>
                        <p className="line-clamp-2 text-sm leading-snug text-black/70 mt-1">
                          Digital resources for fire cooking
                        </p>
                      </Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link
                        href="/store"
                        className={cn(
                          "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
                          "hover:bg-cream hover:text-charcoal focus:bg-cream focus:text-charcoal"
                        )}
                      >
                        <div className="text-sm font-medium leading-none">Merch</div>
                        <p className="line-clamp-2 text-sm leading-snug text-black/70 mt-1">
                          Physical products and apparel
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          {link('/about','About')}
          {link('/join','Join')}
        </nav>
        
        {/* Mobile Menu Button */}
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
      
      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div 
          id="mobile-menu"
          ref={menuRef}
          className="md:hidden bg-white border-t border-black/5"
          role="navigation"
          aria-label="Mobile navigation"
        >
          <nav className="px-4 py-4 flex flex-col gap-4">
            {link('/start-here','Start Here')}
            {link('/essays','Essays')}
            {link('/gatherings','Gatherings')}
            
            {/* Mobile Shop Section */}
            <div className="flex flex-col gap-2">
              <div className="text-sm font-medium text-charcoal px-2 py-1">Shop</div>
              <Link 
                href="/recipes" 
                className="text-sm tracking-wide hover:opacity-80 transition-opacity focus-ring rounded-md px-4 py-2 text-black/70"
                onClick={() => setIsMenuOpen(false)}
              >
                Recipes & Guides
              </Link>
              <Link 
                href="/store" 
                className="text-sm tracking-wide hover:opacity-80 transition-opacity focus-ring rounded-md px-4 py-2 text-black/70"
                onClick={() => setIsMenuOpen(false)}
              >
                Merch
              </Link>
            </div>
            
            {link('/about','About')}
            {link('/join','Join')}
          </nav>
        </div>
      )}
    </header>
  );
}
