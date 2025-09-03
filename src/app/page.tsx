import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <section>
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="mx-auto max-w-6xl px-4 py-24 text-center">
          <blockquote className="mx-auto max-w-3xl text-2xl md:text-3xl font-serif text-[var(--wwp-gold)]">
            "If our small minds… divide this glass of wine… remember: <em>nature</em> does not know it."
            <div className="mt-4 text-base text-black/70">— Richard Feynman</div>
          </blockquote>
          <div className="mt-8">
            <Link href="/events">
              <Button className="bg-[var(--wwp-ember)] hover:opacity-90 rounded-full px-6">
                Join us at the fire
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Three cards */}
      <div className="mx-auto max-w-6xl px-4 py-16 grid sm:grid-cols-3 gap-6">
        {[
          { title:'Events', desc:'Find or host open-fire gatherings.', href:'/events' },
          { title:'Essays', desc:'Read the latest from the fire.', href:'/archive' },
          { title:'Join', desc:'Invites + hosting tools.', href:'/join' },
        ].map((c)=>(
          <div key={c.title} className="bg-white rounded-2xl p-6 shadow-sm border">
            <div className="text-lg font-medium">{c.title}</div>
            <p className="mt-2 text-sm opacity-80">{c.desc}</p>
            <Link className="mt-4 inline-block text-[var(--wwp-ember)]" href={c.href}>Explore →</Link>
          </div>
        ))}
      </div>
    </section>
  );
}
