'use client';

import Link from 'next/link';
import { Instagram, Mail } from 'lucide-react';

export function SiteFooter() {
  return (
    <footer className="border-t border-black/10 bg-[#211d19] text-[#f4efe7]">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 md:px-12 md:py-16 lg:px-16">
        <div className="grid gap-12 md:grid-cols-[1.2fr_.8fr_.8fr]">
          <div className="max-w-sm">
            <Link href="/" className="font-serif text-2xl font-semibold tracking-[0.01em]">
              Wine With Pete
            </Link>
            <p className="mt-5 font-crimson text-lg leading-7 text-white/65">
              Rebuilding the table in an age that keeps teaching us to leave it.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="space-y-3 text-sm text-white/68">
            <Link href="/#gather" className="block transition-colors hover:text-white">Gather</Link>
            <Link href="/#journal" className="block transition-colors hover:text-white">Journal</Link>
            <Link href="/about" className="block transition-colors hover:text-white">About</Link>
            <Link href="/join" className="block transition-colors hover:text-white">Founding Table</Link>
          </nav>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d78959]">Stay close</p>
            <div className="mt-5 flex items-center gap-5">
              {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-white/65 transition-colors hover:text-white"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'pete@winewithpete.me'}`}
                aria-label="Email Wine With Pete"
                className="text-white/65 transition-colors hover:text-white"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-[11px] text-white/42 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Wine With Pete</p>
          <p>Food · wine · fire · hospitality · conversation</p>
        </div>
      </div>
    </footer>
  );
}
