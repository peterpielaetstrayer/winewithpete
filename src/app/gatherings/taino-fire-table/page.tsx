import type { Metadata } from 'next';
import Link from 'next/link';

import { TainoFireTableInterestForm } from './taino-fire-table-interest-form';

export const metadata: Metadata = {
  title: 'Taíno Fire Table | Wine With Pete',
  description:
    'A Puerto Rican–Nordic feast by Wine With Pete. Join the interest list for future recipes, dinner notes, and invitation updates.',
  alternates: { canonical: '/gatherings/taino-fire-table' },
  openGraph: {
    title: 'Taíno Fire Table | Wine With Pete',
    description:
      'An experimental private table rooted in fire, food, wine, ancestry, and conversation.',
    url: 'https://winewithpete.me/gatherings/taino-fire-table',
    siteName: 'Wine With Pete',
    type: 'website',
  },
};

const tableCards = [
  {
    title: 'Fire & Smoke',
    body: 'Live-fire cooking, char, ember, and the kind of food that feels tied to the elements.',
  },
  {
    title: 'Roots & Sea',
    body: 'A Puerto Rican–Nordic direction built around achiote, roots, seafood, preserved flavors, and shared plates.',
  },
  {
    title: 'Curated Wines',
    body: 'Bottles chosen to support the arc of the meal, not just pair with individual dishes.',
  },
  {
    title: 'Conversation',
    body: 'A table designed for presence, memory, and the kind of conversation people carry home.',
  },
];

const links = [
  { href: '/gatherings', label: 'Back to Gatherings' },
  { href: '/plan', label: 'Plan a Gathering' },
  { href: '/signature-table', label: 'Signature Table' },
  { href: '/join', label: 'Join the Founding Table' },
];

export default function TainoFireTablePage() {
  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-white border-b border-ember/5">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <Link
            href="/gatherings"
            className="text-sm text-ember hover:text-ember-light transition-colors font-medium"
          >
            ← Back to Gatherings
          </Link>
        </div>
      </div>

      <section className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-5xl px-4 text-center animate-fade-in">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-ember/80 mb-5">
            Upcoming Featured Table
          </p>
          <h1 className="text-4xl md:text-6xl font-serif font-medium text-charcoal mb-5">
            Taíno Fire Table
          </h1>
          <p className="text-xl md:text-2xl text-black/75 leading-relaxed mb-6 max-w-3xl mx-auto">
            A Puerto Rican–Nordic feast by Wine With Pete
          </p>
          <p className="text-sm md:text-base uppercase tracking-[0.18em] text-black/55 mb-8 max-w-4xl mx-auto leading-relaxed">
            Achiote · Live-fire Cooking · Roots &amp; Sea · Shared Plates · Curated Wines · Conversation
          </p>
          <p className="text-lg text-black/70 leading-relaxed max-w-2xl mx-auto">
            An experimental private table rooted in fire, food, wine, ancestry, and conversation.
          </p>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="card-enhanced bg-white rounded-2xl p-8 md:p-12 shadow-sm border">
            <h2 className="text-section text-charcoal mb-6 text-center">What this is</h2>
            <p className="text-black/75 leading-relaxed text-lg max-w-3xl mx-auto text-center mb-6">
              Wine With Pete is building a private dinner series around fire, wine, shared plates,
              and meaningful conversation. Taíno Fire Table is one of the first featured concepts:
              a limited-seat, invitation-based table exploring Puerto Rican and Nordic flavors
              through live-fire cooking, curated wines, and communal conversation.
            </p>
            <p className="text-black/60 leading-relaxed text-center max-w-2xl mx-auto">
              Joining the interest list does not guarantee a seat, but it tells me you want to be
              considered when invitations go out.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-section text-center mb-12 text-charcoal">The Table</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tableCards.map((card) => (
              <div key={card.title} className="card-enhanced bg-cream rounded-2xl p-8 shadow-sm border">
                <h3 className="text-xl font-serif font-medium text-charcoal mb-3">{card.title}</h3>
                <p className="text-black/70 leading-relaxed">{card.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <TainoFireTableInterestForm />
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="mx-auto max-w-5xl px-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="card-enhanced bg-cream rounded-2xl p-5 border text-center text-charcoal hover:text-ember transition-colors"
              >
                <span className="font-medium">{link.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
