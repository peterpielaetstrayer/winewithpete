'use client';

import Link from 'next/link';
import { Instagram, Twitter, Mail } from 'lucide-react';

export function SiteFooter(){
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <h3 className="text-xl font-serif font-semibold mb-4 text-charcoal">Wine With Pete</h3>
            <p className="text-black/70 leading-relaxed mb-4">
              Privately hosted gatherings and gathering design—in host homes and chosen spaces.
            </p>
            <p className="text-sm text-black/60">© {new Date().getFullYear()} Wine With Pete</p>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-charcoal">Gatherings</h4>
            <div className="space-y-2 text-sm">
              <Link href="/plan" className="block text-black/70 hover:text-ember transition-colors">Plan a Gathering</Link>
              <Link href="/signature-table" className="block text-black/70 hover:text-ember transition-colors">Signature Table</Link>
              <Link href="/join" className="block text-black/70 hover:text-ember transition-colors">Founding Table</Link>
              <Link href="/gatherings" className="block text-black/70 hover:text-ember transition-colors">Community Gatherings</Link>
              <Link href="/essays" className="block text-black/70 hover:text-ember transition-colors">Essays</Link>
              <Link href="/about" className="block text-black/70 hover:text-ember transition-colors">About</Link>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-4 text-charcoal">More</h4>
            <div className="space-y-2 text-sm">
              <Link href="/recipes" className="block text-black/70 hover:text-ember transition-colors">Recipes & Guides</Link>
              <Link href="/store" className="block text-black/70 hover:text-ember transition-colors">Shop Merch</Link>
              <Link href="/support" className="block text-black/70 hover:text-ember transition-colors">Support</Link>
              <a href="mailto:pete@winewithpete.me" className="block text-black/70 hover:text-ember transition-colors">Contact</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-black/5 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-black/60 text-center md:text-left">
              Gathering design · Signature tables · Founding Table
            </p>
            <div className="flex items-center gap-4">
              {process.env.NEXT_PUBLIC_INSTAGRAM_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black/60 hover:text-ember transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {process.env.NEXT_PUBLIC_TWITTER_URL && (
                <a
                  href={process.env.NEXT_PUBLIC_TWITTER_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black/60 hover:text-ember transition-colors"
                  aria-label="Twitter / X"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              <a
                href={`mailto:${process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'pete@winewithpete.me'}`}
                className="text-black/60 hover:text-ember transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
