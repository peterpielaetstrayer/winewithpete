import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Mail } from 'lucide-react';
import { buildInquiryMailto, contactEmail } from '@/lib/inquiry-mailto';

const inquiryMailto = buildInquiryMailto('Signature Table Inquiry');

export const metadata: Metadata = {
  title: 'Book a Signature Table | Wine With Pete',
  description:
    'Privately hosted signature table experiences with Pete—in host homes and chosen spaces. Gathering design, hosting, and conversation shaped around your setting.',
  alternates: { canonical: '/signature-table' },
  openGraph: {
    title: 'Book a Signature Table | Wine With Pete',
    description:
      'Privately hosted Wine With Pete signature table experiences in host homes and chosen spaces.',
    url: 'https://winewithpete.me/signature-table',
  },
};

export default function SignatureTablePage() {
  return (
    <div className="min-h-screen bg-cream">
      {/* Hero */}
      <div className="relative bg-white py-16 md:py-20 overflow-hidden">
        <div className="mx-auto max-w-4xl px-4 text-center animate-fade-in relative z-10">
          <h1 className="text-4xl md:text-5xl font-serif font-medium text-charcoal mb-6">
            Book a Signature Table
          </h1>
          <p className="text-xl text-black/70 leading-relaxed max-w-2xl mx-auto mb-4">
            A privately hosted table experience shaped around your space, your people, and the kind
            of conversation you want to make possible.
          </p>
          <p className="text-lg text-black/60 max-w-2xl mx-auto">
            Pete designs the flow, food direction, wine arc, atmosphere, and conversation structure
            around the host setting—prepared and brought together as appropriate for your space.
          </p>
        </div>
      </div>

      {/* Experience */}
      <div className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden relative shadow-sm">
              <Image
                src="/images/about/about-pete-beach-fire.png.png"
                alt="Intimate gathering with fire, wine, and conversation"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <h2 className="text-section mb-6 text-charcoal">The Experience</h2>
              <p className="text-black/70 leading-relaxed mb-4">
                Signature tables are small by design—typically 6 to 12 guests—so conversation can go
                deep and the evening can breathe. Pete arrives with a plan shaped for your space,
                your people, and the tone you want.
              </p>
              <p className="text-black/70 leading-relaxed">
                Expect thoughtful wine direction, food planned around your setting, and salon-style
                dialogue that doesn&apos;t feel forced. You provide the home or chosen space; Pete
                brings gathering design, hosting, and facilitation—and helps the evening come
                together in a way that fits the room.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* What to expect */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-section text-center mb-12 text-charcoal">What to Expect</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: '/images/icons/icon-wine.png',
                title: 'Menu & Wine Direction',
                body: 'Food and wine shaped around your guests and setting—a cohesive arc for the evening.',
              },
              {
                icon: '/images/icons/icon-connection.png',
                title: 'Hosted Conversation',
                body: 'Pete guides the flow so the night opens up without feeling like a performance.',
              },
              {
                icon: '/images/icons/icon-fire.png',
                title: 'Your Space, Elevated',
                body: 'Host homes and chosen spaces become the setting for a one-of-a-kind evening.',
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Image src={item.icon} alt="" width={48} height={48} aria-hidden />
                </div>
                <h3 className="text-lg font-medium mb-3 text-charcoal">{item.title}</h3>
                <p className="text-black/70 text-sm leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Ideal for */}
      <div className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <div className="card-enhanced bg-white rounded-2xl p-8 md:p-12 shadow-sm border">
            <h2 className="text-2xl font-serif font-medium mb-4 text-charcoal text-center">
              Ideal For
            </h2>
            <ul className="space-y-3 text-black/70 max-w-lg mx-auto">
              <li>• Milestone dinners with close friends or family</li>
              <li>• Leadership or founder gatherings that need real conversation</li>
              <li>• Couples or small groups who want a privately hosted evening with Pete</li>
              <li>• Hosts with a home or chosen space ready for something memorable</li>
            </ul>
            <p className="text-sm text-black/60 text-center mt-6">
              Availability is limited and location-dependent. Inquiries help us confirm fit before
              we schedule.
            </p>
            <p className="text-sm text-black/50 text-center mt-4 max-w-md mx-auto leading-relaxed">
              Signature tables are gathering design and hosting for host homes and chosen spaces—a
              curated evening, not a drop-off menu.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-white py-16">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <div className="bg-cream rounded-2xl p-10 shadow-sm border">
            <h2 className="text-2xl font-serif font-medium mb-4 text-charcoal">
              Inquire about a Signature Table
            </h2>
            <p className="text-black/70 mb-8 leading-relaxed">
              Share your preferred dates, location, guest count, and what you&apos;re hoping the
              evening becomes. We&apos;ll reply with next steps.
            </p>
            <a
              href={inquiryMailto}
              className="btn-ember focus-ring inline-flex items-center gap-2 px-8 py-4 rounded-full text-lg font-medium"
            >
              <Mail className="w-5 h-5" aria-hidden="true" />
              Email Pete
            </a>
            <p className="text-sm text-black/50 mt-4">{contactEmail}</p>
          </div>
          <p className="mt-8 text-black/60 text-sm">
            Prefer to host yourself with a custom plan?{' '}
            <Link href="/plan" className="text-ember hover:text-ember-light underline">
              Plan a Gathering
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
