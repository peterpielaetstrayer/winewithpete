import type { Metadata } from 'next';
import { ConvertKitForm } from '@/components/convertkit-form';
import { Button } from '@/components/ui/button';
import { ScrollToFormButton } from '@/components/scroll-to-form-button';

export const metadata: Metadata = {
  title: 'The December Reset | Wine With Pete',
  description: 'A gentle, structured reset to rebuild the clarity, stability, and presence you\'ve been missing.',
  keywords: 'reset, baseline, wellness, mindfulness, december reset, self-care, routine',
  authors: [{ name: 'Pete' }],
  creator: 'Wine With Pete',
  publisher: 'Wine With Pete',
  metadataBase: new URL('https://winewithpete.me'),
  alternates: {
    canonical: '/december-reset',
  },
  openGraph: {
    title: 'The December Reset | Wine With Pete',
    description: 'A gentle, structured reset to rebuild the clarity, stability, and presence you\'ve been missing.',
    url: 'https://winewithpete.me/december-reset',
    siteName: 'Wine With Pete',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The December Reset | Wine With Pete',
    description: 'A gentle, structured reset to rebuild the clarity, stability, and presence you\'ve been missing.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Using Kit.co for email capture (form ID: 7051ff142e)
// Gumroad product URL
const GUMROAD_PRODUCT_URL = process.env.NEXT_PUBLIC_GUMROAD_PRODUCT_URL || 'https://gumroad.com/l/december-reset';

export default function DecemberResetPage() {

  return (
    <div className="min-h-screen bg-dr-cream">
      {/* Hero Section */}
      <section className="relative bg-dr-cream bg-gradient-to-b from-dr-cream via-dr-cream to-dr-sage/10 py-20 md:py-32">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl text-dr-headline font-bold text-dr-charcoal mb-6 leading-tight">
            RETURN TO YOUR BASELINE
          </h1>
          <p className="text-xl md:text-2xl text-dr-charcoal/80 mb-12 font-medium">
            A gentle, structured reset to rebuild the clarity, stability, and presence you&apos;ve been missing.
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
              The December Reset is a 4-week method to return to your baseline—the foundation your life stands on. 
              Not through force. Not through perfection. But through simple, daily anchors that bring you back to yourself.
            </p>
          </div>

          <div className="space-y-4">
            <ScrollToFormButton className="bg-dr-terracotta hover:bg-dr-terracotta/90 text-white text-lg px-10 py-6 rounded-lg font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl min-h-[56px]">
              Start Your Reset — Get the Free Quick Start Guide
            </ScrollToFormButton>
            <p className="text-sm text-dr-charcoal/60">
              No spam. No pressure. Just a clear path back to yourself.
            </p>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl md:text-4xl text-dr-headline font-semibold text-dr-charcoal text-center mb-12">
            This is for you if you&apos;ve been feeling...
          </h2>
          <ul className="space-y-4 text-lg text-dr-charcoal/80 max-w-2xl mx-auto mb-8">
            <li className="flex items-start gap-3">
              <span className="text-dr-terracotta mt-1">•</span>
              <span>You wake up and immediately reach for your phone</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-dr-terracotta mt-1">•</span>
              <span>You feel tired in ways that sleep alone can&apos;t fix</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-dr-terracotta mt-1">•</span>
              <span>Your cravings—for sugar, scrolling, alcohol—feel stronger than usual</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-dr-terracotta mt-1">•</span>
              <span>You&apos;re reactive instead of intentional</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-dr-terracotta mt-1">•</span>
              <span>Small stressors feel overwhelming</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-dr-terracotta mt-1">•</span>
              <span>You don&apos;t recognize yourself lately</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-dr-terracotta mt-1">•</span>
              <span>You know you need to reset, but rigid programs feel punishing</span>
            </li>
          </ul>
          <p className="text-center text-lg text-dr-charcoal/80 max-w-2xl mx-auto">
            The December Reset meets you exactly where you are—without shame, without extremes—and gives you a rhythm you can actually follow.
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-dr-cream py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="text-3xl md:text-4xl text-dr-headline font-semibold text-dr-charcoal text-center mb-6">
            How The December Reset Works
          </h2>
          <p className="text-lg text-dr-charcoal/80 text-center max-w-3xl mx-auto mb-16">
            This isn&apos;t a challenge. It&apos;s not a detox. It&apos;s not another rigid rulebook you&apos;ll abandon by January. 
            The December Reset is a structured way to reconnect with yourself through three simple practices:
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
                  <span><strong>Night</strong> (15-30 min)</span>
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
                  <span><strong>Dopamine</strong> (gentle phone boundaries)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-dr-sage mt-1">•</span>
                  <span><strong>Check-ins</strong> (build awareness)</span>
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
            </div>
          </div>

          <p className="text-center text-lg text-dr-charcoal/80 mt-12 max-w-2xl mx-auto">
            These aren&apos;t hard. They&apos;re simple. And when you repeat them, your baseline stabilizes—slowly, then suddenly.
          </p>
        </div>
      </section>

      {/* What You'll Experience */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl md:text-4xl text-dr-headline font-semibold text-dr-charcoal text-center mb-12">
            What Changes in 4 Weeks
          </h2>
          <ul className="space-y-5 text-lg text-dr-charcoal/80 max-w-2xl mx-auto mb-8">
            <li className="flex items-start gap-4">
              <span className="text-dr-sage text-2xl mt-1">✓</span>
              <span><strong>Better sleep</strong> — Deeper, more restorative rest</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-dr-sage text-2xl mt-1">✓</span>
              <span><strong>Clearer thinking</strong> — Less fog, more focus</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-dr-sage text-2xl mt-1">✓</span>
              <span><strong>Calmer mood</strong> — Less reactive, more grounded</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-dr-sage text-2xl mt-1">✓</span>
              <span><strong>Fewer cravings</strong> — For dopamine, sugar, alcohol, distraction</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-dr-sage text-2xl mt-1">✓</span>
              <span><strong>More energy</strong> — Sustained, not borrowed</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-dr-sage text-2xl mt-1">✓</span>
              <span><strong>Quiet confidence</strong> — You trust yourself again</span>
            </li>
            <li className="flex items-start gap-4">
              <span className="text-dr-sage text-2xl mt-1">✓</span>
              <span><strong>A rhythm you can follow</strong> — For life, not just December</span>
            </li>
          </ul>
          <p className="text-center text-lg text-dr-charcoal/80 max-w-2xl mx-auto">
            This isn&apos;t temporary. This is a way back to yourself—one you can return to anytime.
          </p>
        </div>
      </section>

      {/* What You Get */}
      <section className="bg-dr-cream py-16 md:py-24" id="email-form">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-3xl md:text-4xl text-dr-headline font-semibold text-dr-charcoal text-center mb-4">
            What&apos;s Inside The December Reset
          </h2>
          <p className="text-lg text-dr-charcoal/80 text-center mb-12 max-w-2xl mx-auto">
            Start with the free Quick Start Guide. Upgrade to the complete method when you&apos;re ready.
          </p>

          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            {/* Free Guide */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg">
              <div className="mb-6">
                <span className="inline-block bg-dr-sage/20 text-dr-sage px-4 py-1 rounded-full text-sm font-medium mb-4">
                  FREE
                </span>
                <h3 className="text-2xl text-dr-headline font-semibold text-dr-charcoal mb-4">
                  The Quick Start Guide
                </h3>
                <p className="text-dr-charcoal/70 mb-6">18 pages</p>
              </div>
              <ul className="space-y-3 text-dr-charcoal/80 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-dr-sage mt-1">•</span>
                  <span>Why your baseline drifts</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dr-sage mt-1">•</span>
                  <span>The 3 daily anchors explained</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dr-sage mt-1">•</span>
                  <span>7-day starter protocol</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dr-sage mt-1">•</span>
                  <span>The Baseline Quick Map checklist</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dr-sage mt-1">•</span>
                  <span>When days get hard protocol</span>
                </li>
              </ul>
              <ConvertKitForm
                buttonText="Get the Free Quick Start Guide"
                className="mt-auto"
              />
            </div>

            {/* Complete Guide */}
            <div className="bg-white rounded-2xl p-8 md:p-10 shadow-lg border-2 border-dr-terracotta/20">
              <div className="mb-6">
                <span className="inline-block bg-dr-terracotta/20 text-dr-terracotta px-4 py-1 rounded-full text-sm font-medium mb-4">
                  $37
                </span>
                <h3 className="text-2xl text-dr-headline font-semibold text-dr-charcoal mb-4">
                  The Complete Guide
                </h3>
                <p className="text-dr-charcoal/70 mb-6">112 pages</p>
              </div>
              <ul className="space-y-3 text-dr-charcoal/80 mb-8">
                <li className="flex items-start gap-3">
                  <span className="text-dr-terracotta mt-1">•</span>
                  <span>All 3 daily anchors (with options for every energy level)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dr-terracotta mt-1">•</span>
                  <span>4 choice menus</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dr-terracotta mt-1">•</span>
                  <span>3 weekly rhythms</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dr-terracotta mt-1">•</span>
                  <span>Hard days protocol</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dr-terracotta mt-1">•</span>
                  <span>Travel method</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dr-terracotta mt-1">•</span>
                  <span>Alcohol reset (3 paths)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dr-terracotta mt-1">•</span>
                  <span>Psychology of momentum</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-dr-terracotta mt-1">•</span>
                  <span>Complete appendix</span>
                </li>
              </ul>
              <a
                href="https://gumroad.com/l/december-reset"
                target="_blank"
                rel="noopener noreferrer"
                data-gumroad-single-product="true"
                className="cta-button block w-full bg-dr-terracotta hover:bg-dr-terracotta/90 text-white text-lg py-6 rounded-lg font-medium transition-all hover:scale-105 shadow-lg hover:shadow-xl min-h-[56px] text-center"
              >
                Get the Complete Guide — $37
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* The Philosophy */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl md:text-4xl text-dr-headline font-semibold text-dr-charcoal text-center mb-12">
            The Baseline Philosophy
          </h2>
          <div className="space-y-8 text-lg text-dr-charcoal/80 leading-relaxed">
            <p className="text-xl font-medium text-dr-charcoal">
              Your baseline is the foundation everything else stands on. It&apos;s not your peak day. It&apos;s your average day.
            </p>

            <div className="grid md:grid-cols-2 gap-8 my-12">
              <div className="bg-dr-cream rounded-xl p-6">
                <h3 className="font-semibold text-dr-charcoal mb-4">When baseline is steady:</h3>
                <ul className="space-y-2">
                  <li>• Choices feel easier</li>
                  <li>• Energy sustains</li>
                  <li>• Mood stabilizes</li>
                  <li>• Mind clears</li>
                  <li>• Cravings soften</li>
                  <li>• Life feels navigable</li>
                </ul>
              </div>
              <div className="bg-dr-cream rounded-xl p-6">
                <h3 className="font-semibold text-dr-charcoal mb-4">When baseline erodes:</h3>
                <ul className="space-y-2">
                  <li>• Everything feels harder</li>
                  <li>• You reach for quick fixes</li>
                  <li>• You lose your rhythm</li>
                  <li>• You don&apos;t recognize yourself</li>
                </ul>
              </div>
            </div>

            <div className="space-y-6 mt-12">
              <h3 className="text-2xl text-dr-headline font-semibold text-dr-charcoal">
                Four principles:
              </h3>
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
        </div>
      </section>

      {/* About Pete */}
      <section className="bg-dr-cream py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-3xl md:text-4xl text-dr-headline font-semibold text-dr-charcoal text-center mb-12">
            About the Creator
          </h2>
          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm max-w-3xl mx-auto">
            <div className="space-y-6 text-lg text-dr-charcoal/80 leading-relaxed">
              <p>
                I&apos;m Pete—the creator of Wine With Pete, where I explore what it means to be human through food, fire, and conversation.
              </p>
              <p>
                The December Reset grew from my own need for a repeatable way to regain clarity when life felt chaotic. Not a challenge. Not punishment. Just a grounded system to return to myself.
              </p>
              <p>
                I built this method over years of trial and refinement—testing what actually works when you&apos;re tired, overwhelmed, or simply drifting. It&apos;s helped me rebuild steadiness when I needed it most.
              </p>
              <p>
                I&apos;m not here to claim expertise over your life. I&apos;m here to share a framework that works—one you can return to whenever you feel yourself losing center.
              </p>
            </div>
            {/* TODO: Add professional photo of Pete when available */}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-white py-16 md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl md:text-4xl text-dr-headline font-semibold text-dr-charcoal mb-8">
            Start Your Reset
          </h2>
          <div className="space-y-6 text-lg text-dr-charcoal/80 leading-relaxed max-w-2xl mx-auto mb-12">
            <p>You don&apos;t need a perfect plan.</p>
            <p>You don&apos;t need to wait for January.</p>
            <p>You don&apos;t need a burst of motivation.</p>
            <p className="font-medium text-dr-charcoal">
              You just need a clear starting point—a way to come back to the ground beneath your feet.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
            <ConvertKitForm
              buttonText="Get the Free Quick Start Guide"
              className="flex-1 w-full sm:w-auto"
            />
            <a
              href="https://gumroad.com/l/december-reset"
              target="_blank"
              rel="noopener noreferrer"
              data-gumroad-single-product="true"
              className="cta-button w-full sm:w-auto border-2 border-dr-terracotta text-dr-terracotta hover:bg-dr-terracotta hover:text-white text-lg px-8 py-6 rounded-lg font-medium transition-all hover:scale-105 min-h-[56px] inline-flex items-center justify-center"
            >
              Get the Complete Method — $37
            </a>
          </div>

          <p className="mt-12 text-lg text-dr-charcoal/70 italic">
            The baseline always welcomes you back.
          </p>
        </div>
      </section>
    </div>
  );
}

