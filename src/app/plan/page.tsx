import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Mail } from 'lucide-react';

const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'pete@winewithpete.me';
const inquiryMailto = `mailto:${contactEmail}?subject=${encodeURIComponent('Plan a Gathering — Blueprint Inquiry')}`;

export const metadata: Metadata = {
  title: 'Plan a Gathering | Wine With Pete',
  description:
    'A custom gathering blueprint for privately hosted dinners in host homes and chosen spaces. Design-only guidance for meaningful gatherings.',
  alternates: { canonical: '/plan' },
  openGraph: {
    title: 'Plan a Gathering | Wine With Pete',
    description:
      'Custom gathering design for privately hosted experiences in host homes and chosen spaces.',
    url: 'https://winewithpete.me/plan',
  },
};

export default function PlanPage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="bg-white py-16 md:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Plan a Gathering
          </h1>
          <p className="text-xl text-black/70 leading-relaxed max-w-2xl mx-auto mb-4">
            A custom gathering blueprint for privately hosted dinners in host homes and chosen spaces.
          </p>
          <p className="text-lg text-black/60 max-w-2xl mx-auto">
            This is gathering design—not catering. You receive a thoughtful plan for flow, menu,
            wine, conversation, and atmosphere. You host; we help you shape the evening.
          </p>
        </div>
      </div>

      {/* What's included */}
      <div className="py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-section text-center mb-12 text-charcoal">What&apos;s Included</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                title: 'Gathering Blueprint',
                body: 'A tailored plan for your space, guest count, and the kind of evening you want to create.',
              },
              {
                title: 'Menu & Wine Direction',
                body: 'Fire-friendly or kitchen-friendly menu framing, wine pairings, and prep guidance—designed for you to execute.',
              },
              {
                title: 'Conversation Architecture',
                body: 'Prompts, pacing, and salon-style structure so the night unfolds with intention, not awkwardness.',
              },
              {
                title: 'Atmosphere Notes',
                body: 'Lighting, table flow, and small details that turn a dinner into a signature table experience.',
              },
            ].map((item) => (
              <div key={item.title} className="card-enhanced bg-white rounded-2xl p-8 shadow-sm border">
                <h3 className="text-xl font-serif font-medium mb-3 text-charcoal">{item.title}</h3>
                <p className="text-black/70 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="text-section text-center mb-12 text-charcoal">How It Works</h2>
          <ol className="space-y-8">
            {[
              {
                step: '1',
                title: 'Share your vision',
                body: 'Tell us about your space, your guests, and the gathering you want to create.',
              },
              {
                step: '2',
                title: 'We design the blueprint',
                body: 'Pete shapes a custom plan—menu direction, wine, flow, and conversation—for your privately hosted evening.',
              },
              {
                step: '3',
                title: 'You host in your space',
                body: 'You bring it to life in your home or chosen space. The blueprint is yours to keep and reuse.',
              },
            ].map((item) => (
              <li key={item.step} className="flex items-start gap-6">
                <div className="flex-shrink-0 w-12 h-12 bg-ember/10 rounded-full flex items-center justify-center">
                  <span className="text-xl font-serif font-semibold text-ember">{item.step}</span>
                </div>
                <div>
                  <h3 className="text-xl font-serif font-medium mb-2 text-charcoal">{item.title}</h3>
                  <p className="text-black/70 leading-relaxed">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Who it's for */}
      <div className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="card-enhanced bg-white rounded-2xl p-8 md:p-12 shadow-sm border text-center">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <Image src="/images/icons/icon-fire.png" alt="" width={48} height={48} aria-hidden />
            </div>
            <h2 className="text-2xl font-serif font-medium mb-4 text-charcoal">Who It&apos;s For</h2>
            <p className="text-black/70 leading-relaxed max-w-xl mx-auto">
              Hosts who want a privately hosted gathering with real depth—anniversaries, small friend
              groups, leadership dinners, or a first salon at home—and want expert gathering design
              without handing the evening over to a caterer.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="bg-cream rounded-2xl p-10 shadow-sm border">
            <h2 className="text-2xl font-serif font-medium mb-4 text-charcoal">
              Start a blueprint inquiry
            </h2>
            <p className="text-black/70 mb-8 leading-relaxed">
              Email Pete with a few lines about your space, guest count, and the evening you have in mind.
              We&apos;ll follow up to see if gathering design is the right fit.
            </p>
            <a
              href={inquiryMailto}
              className="btn-ember inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-medium"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
              Email Pete
            </a>
            <p className="text-sm text-black/50 mt-4">{contactEmail}</p>
          </div>
          <p className="mt-8 text-black/60 text-sm">
            Want Pete to host the evening?{' '}
            <Link href="/signature-table" className="text-ember hover:text-ember-light underline">
              Book a Signature Table
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
