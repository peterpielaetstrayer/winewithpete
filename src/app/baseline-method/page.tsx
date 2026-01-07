import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BaselineMethodForm } from '@/components/baseline-method-form';

export const metadata: Metadata = {
  title: 'The Baseline Method | Wine With Pete',
  description: 'An evergreen guide to rebuild your physical and mental baseline through small, repeatable daily anchors.',
  keywords: 'baseline, wellness, mindfulness, self-care, routine, daily anchors, mental health, physical health',
  authors: [{ name: 'Pete' }],
  creator: 'Wine With Pete',
  publisher: 'Wine With Pete',
  metadataBase: new URL('https://winewithpete.me'),
  alternates: {
    canonical: '/baseline-method',
  },
  openGraph: {
    title: 'The Baseline Method | Wine With Pete',
    description: 'An evergreen guide to rebuild your physical and mental baseline through small, repeatable daily anchors.',
    url: 'https://winewithpete.me/baseline-method',
    siteName: 'Wine With Pete',
    type: 'website',
    images: [
      {
        url: '/images/hero/hero-campfire.png.png',
        width: 1200,
        height: 630,
        alt: 'The Baseline Method - Return to Your Foundation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Baseline Method | Wine With Pete',
    description: 'An evergreen guide to rebuild your physical and mental baseline through small, repeatable daily anchors.',
    images: ['/images/hero/hero-campfire.png.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function BaselineMethodPage() {
  return (
    <div className="min-h-screen bg-dr-cream">
      {/* Hero Section */}
      <section className="relative bg-dr-cream bg-gradient-to-b from-dr-cream via-dr-cream to-dr-sage/10 py-20 md:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-dr-headline font-bold text-dr-charcoal mb-6 leading-tight">
            THE BASELINE METHOD
          </h1>
          <p className="text-xl md:text-2xl text-dr-charcoal/80 mb-12 font-medium">
            An evergreen guide to rebuild your physical and mental baseline through small, repeatable daily anchors.
          </p>
          
          <div className="space-y-6 text-lg md:text-xl text-dr-charcoal/90 leading-relaxed max-w-3xl mx-auto mb-12">
            <p>Life pulls you in too many directions.</p>
            <p>
              Your sleep suffers. Your mind gets noisy. Your energy scatters. Small decisions feel heavy. 
              You reach for quick dopamine because you&apos;re tired, overwhelmed, or simply moving too fast to catch your breath.
            </p>
            <p className="text-2xl md:text-3xl font-semibold text-dr-charcoal">
              You haven&apos;t failed. You&apos;ve drifted.
            </p>
            <p>
              The Baseline Method is a 4-week structure to return to your baseline—the foundation your life stands on. 
              Not through force. Not through perfection. But through simple, daily anchors that bring you back to yourself.
            </p>
            <p className="text-lg text-dr-charcoal/70 italic">
              This is not a challenge. This is not a detox. This is not tied to any season. 
              It&apos;s something you can start any day of the year, especially during moments of drift.
            </p>
          </div>

          <div className="space-y-4">
            <BaselineMethodForm />
          </div>
        </div>
      </section>

      {/* Quick Start Teaser */}
      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-4xl px-4">
          <div className="bg-dr-cream rounded-2xl p-8 md:p-12 border border-dr-charcoal/10">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl md:text-3xl font-serif font-semibold text-dr-charcoal mb-4">
                  New to the Baseline Method?
                </h2>
                <p className="text-lg text-dr-charcoal/80 mb-6 leading-relaxed">
                  Start with our <strong>Quick Start Guide</strong>—a condensed version 
                  you can view right now, no download needed. Perfect for getting oriented 
                  before diving into the full 4-week structure.
                </p>
                <Link href="/baseline-method/quickstart">
                  <Button className="bg-dr-terracotta hover:bg-dr-terracotta/90 text-white px-6 py-4 text-base font-medium">
                    View Quick Start Guide →
                  </Button>
                </Link>
              </div>
              <div className="relative aspect-[8.5/11] rounded-lg overflow-hidden shadow-lg border border-dr-charcoal/10">
                <Image
                  src="/images/baseline-method/quickstart/1.png"
                  alt="Baseline Method Quick Start Preview"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Baseline Means */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl md:text-4xl text-dr-headline font-semibold text-dr-charcoal text-center mb-12">
            What &quot;Baseline&quot; Means
          </h2>
          <div className="space-y-6 text-lg text-dr-charcoal/80 leading-relaxed">
            <p className="text-xl font-medium text-dr-charcoal">
              Baseline = the foundation your life stands on.
            </p>
            <p>Not your best day. Not your worst day. Your average day.</p>
            
            <div className="grid md:grid-cols-2 gap-8 my-12">
              <div className="bg-dr-cream rounded-xl p-6">
                <h3 className="font-semibold text-dr-charcoal mb-4">When baseline erodes:</h3>
                <ul className="space-y-2 text-dr-charcoal/80">
                  <li>• Sleep slips</li>
                  <li>• Energy becomes unstable</li>
                  <li>• Cravings increase</li>
                  <li>• Mood becomes reactive</li>
                  <li>• Small stressors feel heavier</li>
                  <li>• Self-trust weakens</li>
                </ul>
              </div>
              <div className="bg-dr-cream rounded-xl p-6">
                <h3 className="font-semibold text-dr-charcoal mb-4">When baseline is steady:</h3>
                <ul className="space-y-2 text-dr-charcoal/80">
                  <li>• Choices feel easier</li>
                  <li>• Energy sustains</li>
                  <li>• Mood stabilizes</li>
                  <li>• Mind clears</li>
                  <li>• Cravings soften</li>
                  <li>• Life feels navigable</li>
                </ul>
              </div>
            </div>

            <p>
              The Baseline Method helps restore that foundation through physical anchors, mental check-ins, 
              and gentle structure with personal agency.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-dr-cream py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl md:text-4xl text-dr-headline font-semibold text-dr-charcoal text-center mb-6">
            How It Works
          </h2>
          <p className="text-lg text-dr-charcoal/80 text-center max-w-3xl mx-auto mb-16">
            A 4-week structure (that you can reuse indefinitely) built around simple, daily anchors:
          </p>

          <div className="grid md:grid-cols-3 gap-8 md:gap-12">
            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl text-dr-headline font-semibold text-dr-charcoal mb-4">
                Daily Anchors
              </h3>
              <ul className="space-y-3 text-dr-charcoal/80">
                <li className="flex items-start gap-2">
                  <span className="text-dr-sage mt-1">•</span>
                  <span><strong>Morning</strong> (5-15 min)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dr-sage mt-1">•</span>
                  <span><strong>Midday</strong> (10-20 min)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dr-sage mt-1">•</span>
                  <span><strong>Evening</strong> (15-30 min)</span>
                </li>
              </ul>
              <p className="mt-4 text-dr-charcoal/70 italic">
                Choose from simple options based on your energy and capacity.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl text-dr-headline font-semibold text-dr-charcoal mb-4">
                Choice Menus
              </h3>
              <ul className="space-y-3 text-dr-charcoal/80">
                <li className="flex items-start gap-2">
                  <span className="text-dr-sage mt-1">•</span>
                  <span><strong>Movement</strong> (match exercise to energy)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dr-sage mt-1">•</span>
                  <span><strong>Food</strong> (eat to support clarity)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dr-sage mt-1">•</span>
                  <span><strong>Dopamine / stimulation</strong> (gentle boundaries)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dr-sage mt-1">•</span>
                  <span><strong>Reflection & check-ins</strong> (build awareness)</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-sm">
              <h3 className="text-2xl text-dr-headline font-semibold text-dr-charcoal mb-4">
                Weekly Rhythms
              </h3>
              <ul className="space-y-3 text-dr-charcoal/80">
                <li className="flex items-start gap-2">
                  <span className="text-dr-sage mt-1">•</span>
                  <span>One meaningful workout</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dr-sage mt-1">•</span>
                  <span>One reflection walk</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dr-sage mt-1">•</span>
                  <span>One self-respect ritual</span>
                </li>
              </ul>
              <p className="mt-4 text-dr-charcoal/70 italic">
                Not rigid schedules. Gentle rhythms.
              </p>
            </div>
          </div>

          <p className="text-center text-lg text-dr-charcoal/80 mt-12 max-w-2xl mx-auto">
            These aren&apos;t hard. They&apos;re simple. And when you repeat them, your baseline stabilizes—slowly, then suddenly.
          </p>
        </div>
      </section>

      {/* What's Inside */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl md:text-4xl text-dr-headline font-semibold text-dr-charcoal text-center mb-12">
            What&apos;s Inside
          </h2>
          <div className="space-y-6 text-lg text-dr-charcoal/80 leading-relaxed max-w-2xl mx-auto">
            <p>
              The guide includes a 4-week structure (but can be reused indefinitely) with daily anchors for morning, midday, and evening.
            </p>
            <p>
              You&apos;ll find choice-based menus for movement, food, dopamine/stimulation, and reflection & check-ins. 
              Weekly rhythms (not rigid schedules), &quot;hard days&quot; adaptations, and a travel-friendly structure.
            </p>
            <p>
              Throughout, you&apos;ll find the psychology of momentum and a calm, non-punitive tone that meets you where you are.
            </p>
            <p className="text-dr-charcoal/70 italic">
              This should feel reassuring, not overwhelming.
            </p>
          </div>
        </div>
      </section>

      {/* The Philosophy */}
      <section className="bg-dr-cream py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl md:text-4xl text-dr-headline font-semibold text-dr-charcoal text-center mb-12">
            The Baseline Philosophy
          </h2>
          <div className="space-y-8 text-lg text-dr-charcoal/80 leading-relaxed">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-dr-charcoal mb-2">1. Identity before discipline</h4>
                <p className="text-dr-charcoal/70">Who you are matters more than what you do.</p>
              </div>
              <div>
                <h4 className="font-semibold text-dr-charcoal mb-2">2. Rhythms over rules</h4>
                <p className="text-dr-charcoal/70">Flexible patterns beat rigid restrictions.</p>
              </div>
              <div>
                <h4 className="font-semibold text-dr-charcoal mb-2">3. Minimums first</h4>
                <p className="text-dr-charcoal/70">Start small. Build from there.</p>
              </div>
              <div>
                <h4 className="font-semibold text-dr-charcoal mb-2">4. Returning is the practice</h4>
                <p className="text-dr-charcoal/70">Coming back matters more than never leaving.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Pete */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl md:text-4xl text-dr-headline font-semibold text-dr-charcoal text-center mb-12">
            About the Creator
          </h2>
          <div className="bg-dr-cream rounded-2xl p-8 md:p-12 shadow-sm max-w-3xl mx-auto">
            <div className="space-y-6 text-lg text-dr-charcoal/80 leading-relaxed">
              <p>
                I&apos;m Pete—the creator of Wine With Pete, where I explore what it means to be human through food, fire, and conversation.
              </p>
              <p>
                The Baseline Method grew from my own need for a repeatable way to regain clarity when life felt chaotic. Not a challenge. Not punishment. Just a grounded system to return to myself.
              </p>
              <p>
                I built this method over years of trial and refinement—testing what actually works when you&apos;re tired, overwhelmed, or simply drifting. It&apos;s helped me rebuild steadiness when I needed it most.
              </p>
              <p>
                I&apos;m not here to claim expertise over your life. I&apos;m here to share a framework that works—one you can return to whenever you feel yourself losing center.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-dr-cream py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl text-dr-headline font-semibold text-dr-charcoal mb-8">
            Start the Baseline Method
          </h2>
          <div className="space-y-6 text-lg text-dr-charcoal/80 leading-relaxed max-w-2xl mx-auto mb-12">
            <p>You don&apos;t need a perfect plan.</p>
            <p>You don&apos;t need to wait for a new year or a Monday.</p>
            <p>You don&apos;t need a burst of motivation.</p>
            <p className="font-medium text-dr-charcoal">
              You just need a clear starting point—a way to come back to the ground beneath your feet.
            </p>
          </div>

          <div className="flex flex-col items-center gap-4 max-w-2xl mx-auto">
            <BaselineMethodForm />
          </div>

          <p className="mt-12 text-lg text-dr-charcoal/70 italic">
            The baseline always welcomes you back.
          </p>
        </div>
      </section>
    </div>
  );
}

