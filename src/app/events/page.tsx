import Link from 'next/link';

export default function EventsPage(){
  return (
    <div className="mx-auto max-w-7xl px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6">Events</h1>
        <p className="text-lg text-black/80 max-w-2xl mx-auto">
          Wine With Pete events are an invitation to slow down.
        </p>
        <p className="text-lg text-black/80 max-w-2xl mx-auto mt-2">
          We host two types of gatherings:
        </p>
      </div>

      {/* Event Types */}
      <div className="space-y-16 mb-16">
        {/* Open Fire Sundays */}
        <div className="relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-2 lg:order-1">
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h2 className="text-2xl font-medium mb-4">🔥 Open Fire Sundays</h2>
                <p className="text-black/80 mb-2">Casual. Coastal. Community-driven.</p>
                <p className="text-black/80">We meet early, cook over fire, and share what's real.</p>
              </div>
            </div>
            <div className="order-1 lg:order-2">
              <div className="aspect-[4/3] bg-gradient-to-br from-orange-100 to-amber-200 rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-orange-200 via-amber-300 to-yellow-400 flex items-center justify-center">
                  <div className="text-center text-white/80">
                    <div className="text-6xl mb-4">🔥</div>
                    <div className="text-sm">Beach Fire Scene</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Salon Dinners */}
        <div className="relative">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div className="order-1">
              <div className="aspect-[4/3] bg-gradient-to-br from-purple-100 to-indigo-200 rounded-2xl overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-purple-200 via-indigo-300 to-blue-400 flex items-center justify-center">
                  <div className="text-center text-white/80">
                    <div className="text-6xl mb-4">🍷</div>
                    <div className="text-sm">Intimate Dining Scene</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="order-2">
              <div className="bg-white rounded-2xl p-8 shadow-sm border">
                <h2 className="text-2xl font-medium mb-4">🍷 Salon Dinners</h2>
                <p className="text-black/80 mb-2">Curated. Intimate. Slower still.</p>
                <p className="text-black/80">A shared meal around hard questions and honest conversation.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* No Events Message */}
      <div className="text-center bg-white rounded-2xl p-12 border">
        <h3 className="text-xl font-serif mb-4">No upcoming events scheduled.</h3>
        <p className="text-black/70 mb-6 max-w-lg mx-auto">
          Join the circle to be notified or contact us if you'd like to host one in your space.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/join">
            <button className="bg-[var(--wwp-ember)] hover:opacity-90 text-white rounded-full px-8 py-3 font-medium">
              Join the Circle
            </button>
          </Link>
          <Link href="/wine-with">
            <button className="border border-[var(--wwp-ember)] text-[var(--wwp-ember)] hover:bg-[var(--wwp-ember)] hover:text-white rounded-full px-8 py-3 font-medium transition-colors">
              Become a Host
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
