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
            <span className="absolute -left-2 md:-left-4 -top-1 md:-top-2 text-4xl md:text-6xl text-ember/20 font-bold select-none">"</span>
            &ldquo;If our small minds, for some convenience,<br className="hidden sm:block"/>
            <span className="sm:hidden"> </span>divide this glass of <span className="text-[var(--wwp-gold)]">wine</span>—this universe—<br className="hidden sm:block"/>
            <span className="sm:hidden"> </span>into parts: physics, biology, geology, astronomy, psychology...<br className="hidden sm:block"/>
            <span className="sm:hidden"> </span>remember: <span className="text-[var(--wwp-gold)]">nature</span> does not know it.&rdquo;
            <div className="mt-6 text-base md:text-lg lg:text-xl text-white/80 animate-slide-up">— Richard Feynman</div>
          </blockquote>
          
          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center animate-slide-up">
            <Link href="/join">
              <Button size="lg" className="group relative px-10 py-5 bg-gradient-to-r from-ember to-ember-light text-white rounded-2xl text-lg font-semibold focus-ring hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-ember/25">
                <span className="relative z-10 flex items-center gap-2">
                  JOIN THE CIRCLE
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </Button>
            </Link>
            <Link href="/events">
              <Button variant="outline" size="lg" className="group relative px-10 py-5 bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-ember rounded-2xl text-lg font-semibold focus-ring hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <span className="relative z-10 flex items-center gap-2">
                  SEE EVENTS
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </span>
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
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {/* Read - Essays */}
            <Link href="/archive" className="group animate-scale-in">
              <div className="card-premium rounded-3xl p-6 md:p-8 text-center relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-ember rounded-full translate-x-10 -translate-y-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-gold rounded-full -translate-x-8 translate-y-8"></div>
                </div>
                
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 flex items-center justify-center bg-gradient-to-br from-ember to-ember-light rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Image src="/images/icons/icon-writing.png" alt="Writing" width={48} height={48} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-ember to-gold bg-clip-text text-transparent">Read</h3>
                  <p className="text-gray-700 leading-relaxed mb-4 md:mb-6 text-base md:text-lg">
                    Weekly essays on Substack exploring philosophy, connection, and the stories we tell.
                  </p>
                  <Button variant="ghost" className="inline-flex items-center gap-2 text-ember font-semibold group-hover:text-ember-light transition-colors duration-300 p-0 h-auto">
                    Read Essays
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </div>
              </div>
            </Link>

            {/* Attend - Events */}
            <Link href="/events" className="group animate-scale-in">
              <div className="card-premium rounded-3xl p-6 md:p-8 text-center relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-amber-500 rounded-full translate-x-10 -translate-y-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-ember rounded-full -translate-x-8 translate-y-8"></div>
                </div>
                
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 flex items-center justify-center bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Image src="/images/icons/icon-fire.png" alt="Fire" width={48} height={48} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-ember to-gold bg-clip-text text-transparent">Attend</h3>
                  <p className="text-gray-700 leading-relaxed mb-4 md:mb-6 text-base md:text-lg">
                    Open Fire Sundays and curated salon events. Bring food, share stories, slow down.
                  </p>
                  <Button variant="ghost" className="inline-flex items-center gap-2 text-ember font-semibold group-hover:text-ember-light transition-colors duration-300 p-0 h-auto">
                    See Events
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </div>
              </div>
            </Link>

            {/* Support - Store & Donations */}
            <Link href="/store" className="group animate-scale-in">
              <div className="card-premium rounded-3xl p-6 md:p-8 text-center relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-green-500 rounded-full translate-x-10 -translate-y-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-amber-500 rounded-full -translate-x-8 translate-y-8"></div>
                </div>
                
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 flex items-center justify-center bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Image src="/images/icons/icon-wine.png" alt="Wine" width={48} height={48} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-ember to-gold bg-clip-text text-transparent">Support</h3>
                  <p className="text-gray-700 leading-relaxed mb-4 md:mb-6 text-base md:text-lg">
                    Recipe cards, guides, and digital products. Help keep the fire burning.
                  </p>
                  <Button variant="ghost" className="inline-flex items-center gap-2 text-ember font-semibold group-hover:text-ember-light transition-colors duration-300 p-0 h-auto">
                    Visit Store
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
                </div>
              </div>
            </Link>

            {/* Join - Newsletter */}
            <Link href="/join" className="group animate-scale-in">
              <div className="card-premium rounded-3xl p-6 md:p-8 text-center relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500 rounded-full translate-x-10 -translate-y-10"></div>
                  <div className="absolute bottom-0 left-0 w-16 h-16 bg-ember rounded-full -translate-x-8 translate-y-8"></div>
                </div>
                
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-4 md:mb-6 flex items-center justify-center bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Image src="/images/icons/icon-connection.png" alt="Connection" width={48} height={48} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-3 md:mb-4 bg-gradient-to-r from-ember to-gold bg-clip-text text-transparent">Join</h3>
                  <p className="text-gray-700 leading-relaxed mb-4 md:mb-6 text-base md:text-lg">
                    Weekly philosophical newsletter. Recipes, musings, and invitations to gather.
                  </p>
                  <Button variant="ghost" className="inline-flex items-center gap-2 text-ember font-semibold group-hover:text-ember-light transition-colors duration-300 p-0 h-auto">
                    Join Circle
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Button>
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
