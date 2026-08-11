'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === '/';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMenuOpen]);

  const linkClass = isHome
    ? 'text-white/90 hover:text-white'
    : 'text-[#211d19]/75 hover:text-[#9c3d24]';

  return (
    <header
      className={`${isHome ? 'absolute inset-x-0 top-0 border-white/15 bg-black/10 text-white' : 'relative border-black/10 bg-[#f4efe7] text-[#211d19]'} z-50 border-b`}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 md:px-12 lg:px-16">
        <Link
          href="/"
          className="font-serif text-xl font-semibold tracking-[0.02em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#9c3d24]"
          aria-label="Wine With Pete home"
        >
          Wine With Pete
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          <Link href={isHome ? '#gather' : '/#gather'} className={`text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${linkClass}`}>
            Gather
          </Link>
          <Link href={isHome ? '#journal' : '/#journal'} className={`text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${linkClass}`}>
            Journal
          </Link>
          <Link href="/about" className={`text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${linkClass}`}>
            About
          </Link>
          <Link
            href="/join"
            className={`border-b pb-1 text-[11px] font-semibold uppercase tracking-[0.18em] transition-colors ${isHome ? 'border-[#d78959] text-[#e5a17b] hover:text-white' : 'border-[#9c3d24] text-[#9c3d24] hover:text-[#6f2819]'}`}
          >
            Join the Table
          </Link>
        </nav>

        <button
          ref={menuButtonRef}
          type="button"
          className="flex h-10 w-10 items-center justify-center md:hidden"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          <span className="sr-only">Menu</span>
          <span className="relative block h-4 w-6">
            <span className={`absolute left-0 top-0 h-px w-6 bg-current transition-transform ${isMenuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
            <span className={`absolute left-0 top-[7px] h-px w-6 bg-current transition-opacity ${isMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`absolute left-0 top-[14px] h-px w-6 bg-current transition-transform ${isMenuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
          </span>
        </button>
      </div>

      {isMenuOpen && (
        <div
          id="mobile-navigation"
          ref={menuRef}
          className="absolute inset-x-0 top-[72px] border-b border-black/10 bg-[#f4efe7] px-5 py-8 text-[#211d19] shadow-[0_20px_50px_rgba(0,0,0,.12)] sm:px-8 md:hidden"
        >
          <nav className="mx-auto flex max-w-7xl flex-col" aria-label="Mobile navigation">
            <Link href={isHome ? '#gather' : '/#gather'} className="border-b border-black/10 py-4 font-serif text-3xl" onClick={() => setIsMenuOpen(false)}>
              Gather
            </Link>
            <Link href={isHome ? '#journal' : '/#journal'} className="border-b border-black/10 py-4 font-serif text-3xl" onClick={() => setIsMenuOpen(false)}>
              Journal
            </Link>
            <Link href="/about" className="border-b border-black/10 py-4 font-serif text-3xl" onClick={() => setIsMenuOpen(false)}>
              About
            </Link>
            <Link href="/join" className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#9c3d24]" onClick={() => setIsMenuOpen(false)}>
              Join the Founding Table →
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
