'use client';
import Link from 'next/link';
import { useState } from 'react';
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
  
  const link = (href:string, label:string) => (
    <Link href={href} className="text-sm tracking-wide hover:opacity-80 transition-opacity focus-ring rounded-md px-2 py-1">{label}</Link>
  );
  
  return (
    <header className="w-full bg-white/80 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-serif font-semibold">Wine With Pete</Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 items-center">
          {link('/start-here','Start Here')}
          {link('/essays','Essays')}
          {link('/gatherings','Gatherings')}
          
          {/* Shop Dropdown */}
          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-sm tracking-wide hover:opacity-80 transition-opacity focus-ring rounded-md px-2 py-1 bg-transparent hover:bg-transparent data-[state=open]:bg-transparent">
                  Shop
                </NavigationMenuTrigger>
                <NavigationMenuContent>
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
