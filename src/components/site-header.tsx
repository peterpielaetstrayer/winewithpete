'use client';
import Link from 'next/link';

export function SiteHeader(){
  const link = (href:string, label:string) => (
    <Link href={href} className="text-sm tracking-wide hover:opacity-80">{label}</Link>
  );
  return (
    <header className="w-full bg-white/80 backdrop-blur border-b border-black/5">
      <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-serif">Wine With Pete</Link>
        <nav className="flex gap-6">
          {link('/events','Events')}
          {link('/archive','Archive')}
          {link('/join','Join')}
          {link('/store','Store')}
          {link('/support','Support')}
          {link('/wine-with','Wine With')}
        </nav>
      </div>
    </header>
  );
}
