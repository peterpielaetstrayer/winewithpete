import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Campfire Background */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Campfire Background */}
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('/images/hero/hero-campfire.png.png')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <blockquote className="text-2xl md:text-4xl lg:text-5xl font-serif font-medium text-white leading-relaxed mb-8">
            "If our small minds, for some convenience,<br/>
            divide this glass of <span className="text-[var(--wwp-gold)]">wine</span>—this universe—<br/>
            into parts: physics, biology, geology, astronomy, psychology...<br/>
            remember: <span className="text-[var(--wwp-gold)]">nature</span> does not know it."
            <div className="mt-6 text-lg md:text-xl text-white/80">— Richard Feynman</div>
          </blockquote>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/join">
              <Button className="bg-[var(--wwp-ember)] hover:opacity-90 text-white rounded-full px-8 py-4 text-lg font-medium">
                JOIN THE CIRCLE
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-[var(--wwp-ember)] rounded-full px-8 py-4 text-lg font-medium">
                SEE EVENTS
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--wwp-cream)] to-transparent"></div>
      </div>

      {/* Mission Statement */}
      <div className="bg-[var(--wwp-cream)] py-24">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-2xl md:text-3xl font-serif font-medium text-[var(--wwp-charcoal)] leading-relaxed">
            We gather around food, fire, and the slow unfolding of conversation.<br/>
            Together, we pause and turn ourselves toward the things that matter.
          </p>
          
          {/* Social Proof */}
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-black/60">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-semibold text-[var(--wwp-ember)]">200+</span>
              <span>community members</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-semibold text-[var(--wwp-ember)]">50+</span>
              <span>events hosted</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-semibold text-[var(--wwp-ember)]">12</span>
              <span>cities</span>
            </div>
          </div>
        </div>
      </div>

      {/* Three Feature Cards */}
      <div className="bg-[var(--wwp-cream)] pb-24">
        <div className="mx-auto max-w-6xl px-4 grid md:grid-cols-3 gap-8">
          {/* Events Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <img src="/images/icons/icon-fire.png" alt="Fire" className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-medium mb-4 text-[var(--wwp-charcoal)]">Events</h3>
            <p className="text-black/70 leading-relaxed">
              Open Fire Sundays. Salon-style dinners. We gather to share food and slow conversation.
            </p>
          </div>

          {/* Essays Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <img src="/images/icons/icon-writing.png" alt="Writing" className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-medium mb-4 text-[var(--wwp-charcoal)]">Essays</h3>
            <p className="text-black/70 leading-relaxed">
              Writings and threads exploring disconnection, truth, and the search for something real.
            </p>
          </div>

          {/* Join the Circle Card */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border text-center">
            <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
              <img src="/images/icons/icon-connection.png" alt="Connection" className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-medium mb-4 text-[var(--wwp-charcoal)]">Join the Circle</h3>
            <p className="text-black/70 leading-relaxed">
              Thoughtful notes now and then. Invitations to show up, slow down, and connect.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
