import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage(){
  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-serif font-semibold mb-6">About Wine With Pete</h1>
        <p className="text-lg text-black/80 max-w-2xl mx-auto">
          A movement toward slower, more meaningful connections in a world that moves too fast.
        </p>
      </div>

      {/* Main Content */}
      <div className="prose prose-lg max-w-none">
        <div className="bg-white rounded-2xl p-8 shadow-sm border mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">The Mission</h2>
          <p className="text-black/80 leading-relaxed mb-4">
            In a world of endless notifications, surface-level interactions, and rushed conversations, 
            Wine With Pete exists to create space for something different. We believe in the power 
            of slowing down, of gathering around fire and food, and of having the kinds of conversations 
            that matter.
          </p>
          <p className="text-black/80 leading-relaxed">
            Our community is built on the simple idea that the best connections happen when we 
            pause, listen deeply, and share what&apos;s real. Whether it&apos;s around a campfire on the beach 
            or at an intimate dinner table, we create environments where authentic conversation can flourish.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border mb-8">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-2xl font-serif font-semibold mb-4">Who is Pete?</h2>
              <p className="text-black/80 leading-relaxed mb-4">
                After years of feeling disconnected in a hyper-connected world, I started hosting 
                small gatherings around fire and food, where people could share stories, ask hard questions, 
                and build genuine connections.
              </p>
              <p className="text-black/80 leading-relaxed mb-4">
                What began as informal beach fires with friends has grown into a community of people 
                who value depth over breadth, quality over quantity, and the kind of conversations that 
                stay with you long after the fire burns out.
              </p>
              <p className="text-black/80 leading-relaxed">
                I&apos;m a writer, community builder, and believer in the power of slow conversation. 
                This project is my attempt to create spaces where we can pause, listen deeply, and turn toward what matters.
              </p>
            </div>
            <div className="aspect-[4/3] rounded-xl overflow-hidden">
              <img 
                src="/images/about/about-pete-beach-fire.png.png" 
                alt="Pete by a beach fire at sunset, cooking and contemplating"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">What We Do</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-lg font-medium mb-2">🔥 Open Fire Sundays</h3>
              <p className="text-black/70 text-sm">
                Casual, coastal gatherings where we cook over fire, share stories, and connect with 
                nature and each other. No agenda, just good food and real conversation.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">🍷 Salon Dinners</h3>
              <p className="text-black/70 text-sm">
                Intimate, curated dinners around hard questions and honest conversation. 
                Smaller groups, deeper discussions, lasting connections.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">What We&apos;re Becoming</h2>
          <p className="text-black/80 leading-relaxed mb-4">
            Wine With Pete is evolving into a platform for essays, gatherings, recipes, and media that support slow living and genuine connection. 
            We&apos;re building something that extends beyond individual events into a movement toward more meaningful relationships.
          </p>
          <p className="text-black/80 leading-relaxed">
            Through weekly essays, curated gatherings, fire-friendly recipes, and thoughtful content, 
            we&apos;re creating resources and experiences that help people slow down, connect authentically, 
            and build communities around what truly matters.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-sm border mb-8">
          <h2 className="text-2xl font-serif font-semibold mb-4">Our Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <img src="/images/icons/icon-fire.png" alt="Authenticity" className="w-10 h-10" />
              </div>
              <h3 className="font-medium mb-2">Authenticity</h3>
              <p className="text-sm text-black/70">We create spaces where people can be their real selves, not their social media personas.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <img src="/images/icons/icon-growth.png" alt="Slow Connection" className="w-10 h-10" />
              </div>
              <h3 className="font-medium mb-2">Slow Connection</h3>
              <p className="text-sm text-black/70">We believe the best relationships develop over time, not in quick interactions.</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-3 flex items-center justify-center">
                <img src="/images/icons/icon-community.png" alt="Community" className="w-10 h-10" />
              </div>
              <h3 className="font-medium mb-2">Community</h3>
              <p className="text-sm text-black/70">We build lasting connections that extend beyond individual events.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="text-center bg-white rounded-2xl p-12 border">
        <h3 className="text-2xl font-serif font-semibold mb-4">Ready to Join Us?</h3>
        <p className="text-black/70 mb-6 max-w-lg mx-auto">
          Whether you&apos;re looking for deeper connections, want to host your own gathering, 
          or simply believe in the power of slow conversation, we&apos;d love to have you.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/join">
            <Button className="bg-[var(--wwp-ember)] hover:opacity-90 text-white rounded-full px-8">
              Join the Circle
            </Button>
          </Link>
          <Link href="/wine-with">
            <Button variant="outline" className="border-[var(--wwp-ember)] text-[var(--wwp-ember)] hover:bg-[var(--wwp-ember)] hover:text-white rounded-full px-8">
              Become a Host
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
