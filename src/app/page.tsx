import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Campfire Background */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Campfire Background */}
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero-campfire.png.png"
            alt="Community gathering around campfire"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto animate-fade-in">
          <blockquote className="text-hero text-white leading-relaxed mb-8 relative">
            <span className="absolute -left-4 -top-2 text-6xl text-ember/20 font-bold select-none">"</span>
            &ldquo;If our small minds, for some convenience,<br/>
            divide this glass of <span className="text-[var(--wwp-gold)]">wine</span>—this universe—<br/>
            into parts: physics, biology, geology, astronomy, psychology...<br/>
            remember: <span className="text-[var(--wwp-gold)]">nature</span> does not know it.&rdquo;
            <div className="mt-6 text-lg md:text-xl text-white/80 animate-slide-up">— Richard Feynman</div>
          </blockquote>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link href="/join">
              <Button className="btn-ember text-white rounded-full px-8 py-4 text-lg font-medium focus-ring">
                JOIN THE CIRCLE
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" className="btn-ember bg-ember/20 border-ember text-ember hover:bg-ember hover:text-white rounded-full px-8 py-4 text-lg font-medium focus-ring">
                SEE EVENTS
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Curved bottom edge */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[var(--wwp-cream)] to-transparent"></div>
      </div>

      {/* Mission Statement */}
      <div className="bg-[var(--wwp-cream)] space-section">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <p className="text-section text-[var(--wwp-charcoal)] leading-relaxed animate-fade-in">
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

      {/* Four Main Pathways */}
      <div className="bg-[var(--wwp-cream)] space-content">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="text-section text-center mb-16 text-charcoal animate-fade-in">
            Choose Your Path
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Read - Essays */}
            <Link href="/archive" className="group animate-scale-in">
              <div className="card-enhanced bg-white rounded-2xl p-8 shadow-sm border text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Image src="/images/icons/icon-writing.png" alt="Writing" width={48} height={48} />
                </div>
                <h3 className="text-xl font-medium mb-4 text-charcoal">Read</h3>
                <p className="text-black/70 leading-relaxed mb-4">
                  Weekly essays on Substack exploring philosophy, connection, and the stories we tell.
                </p>
                <div className="text-sm text-ember font-medium group-hover:text-ember-light transition-colors duration-300">
                  Read Essays →
                </div>
              </div>
            </Link>

            {/* Attend - Events */}
            <Link href="/events" className="group animate-scale-in">
              <div className="card-enhanced bg-white rounded-2xl p-8 shadow-sm border text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Image src="/images/icons/icon-fire.png" alt="Fire" width={48} height={48} />
                </div>
                <h3 className="text-xl font-medium mb-4 text-charcoal">Attend</h3>
                <p className="text-black/70 leading-relaxed mb-4">
                  Open Fire Sundays and curated salon events. Bring food, share stories, slow down.
                </p>
                <div className="text-sm text-ember font-medium group-hover:text-ember-light transition-colors duration-300">
                  See Events →
                </div>
              </div>
            </Link>

            {/* Support - Store & Donations */}
            <Link href="/store" className="group animate-scale-in">
              <div className="card-enhanced bg-white rounded-2xl p-8 shadow-sm border text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Image src="/images/icons/icon-wine.png" alt="Wine" width={48} height={48} />
                </div>
                <h3 className="text-xl font-medium mb-4 text-charcoal">Support</h3>
                <p className="text-black/70 leading-relaxed mb-4">
                  Recipe cards, guides, and digital products. Help keep the fire burning.
                </p>
                <div className="text-sm text-ember font-medium group-hover:text-ember-light transition-colors duration-300">
                  Visit Store →
                </div>
              </div>
            </Link>

            {/* Join - Newsletter */}
            <Link href="/join" className="group animate-scale-in">
              <div className="card-enhanced bg-white rounded-2xl p-8 shadow-sm border text-center">
                <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <Image src="/images/icons/icon-connection.png" alt="Connection" width={48} height={48} />
                </div>
                <h3 className="text-xl font-medium mb-4 text-charcoal">Join</h3>
                <p className="text-black/70 leading-relaxed mb-4">
                  Weekly philosophical newsletter. Recipes, musings, and invitations to gather.
                </p>
                <div className="text-sm text-ember font-medium group-hover:text-ember-light transition-colors duration-300">
                  Join Circle →
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* What to Expect Section */}
      <div className="bg-white space-section">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="text-section text-center mb-16 text-charcoal animate-fade-in">
            What to Expect
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-medium mb-4 text-ember">Substack Essays</h3>
              <p className="text-black/70 leading-relaxed mb-6">
                Weekly philosophical essays exploring disconnection, truth, and the search for something real. 
                Deep dives into the stories we tell and the beliefs we inherit.
              </p>
              
              <h3 className="text-xl font-medium mb-4 text-ember">Newsletter</h3>
              <p className="text-black/70 leading-relaxed">
                Curated insights, recipe cards, event updates, and personal musings. 
                A more intimate space for those who want to stay connected to the community.
              </p>
            </div>
            
            <div>
              <h3 className="text-xl font-medium mb-4 text-ember">Open Fire Sundays</h3>
              <p className="text-black/70 leading-relaxed mb-6">
                Pop-up gatherings in different cities. I bring the fire, you bring your food. 
                Pick from recipe cards, share stories, slow down together.
              </p>
              
              <h3 className="text-xl font-medium mb-4 text-ember">Salon Events</h3>
              <p className="text-black/70 leading-relaxed">
                Curated, invite-only gatherings for deeper conversation. 
                Application-based selection for those ready to engage more deeply.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
