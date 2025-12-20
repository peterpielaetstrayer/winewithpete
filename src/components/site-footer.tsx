import Link from 'next/link';

export function SiteFooter(){
  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-xl font-serif font-semibold mb-4 text-charcoal">Wine With Pete</h3>
            <p className="text-black/70 leading-relaxed mb-4">
              Fire, food, and the slow unfolding of conversation. 
              Join us as we pause and turn toward the things that matter.
            </p>
            <p className="text-sm text-black/60">© {new Date().getFullYear()} Wine With Pete</p>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="font-medium mb-4 text-charcoal">Explore</h4>
            <div className="space-y-2 text-sm">
              <Link href="/start-here" className="block text-black/70 hover:text-ember transition-colors">Start Here</Link>
              <Link href="/essays" className="block text-black/70 hover:text-ember transition-colors">Essays</Link>
              <Link href="/gatherings" className="block text-black/70 hover:text-ember transition-colors">Gatherings</Link>
              <Link href="/recipes" className="block text-black/70 hover:text-ember transition-colors">Recipes</Link>
              <Link href="/about" className="block text-black/70 hover:text-ember transition-colors">About</Link>
            </div>
          </div>
          
          {/* Connect */}
          <div>
            <h4 className="font-medium mb-4 text-charcoal">Connect</h4>
            <div className="space-y-2 text-sm">
              <Link href="/join" className="block text-black/70 hover:text-ember transition-colors">Join Newsletter</Link>
              <Link href="/support" className="block text-black/70 hover:text-ember transition-colors">Support</Link>
              <a href="mailto:pete@winewithpete.me" className="block text-black/70 hover:text-ember transition-colors">Contact</a>
            </div>
          </div>
        </div>
        
        <div className="border-t border-black/5 mt-8 pt-8 text-center text-sm text-black/60">
          <p>Fire • Food • Slow conversation</p>
        </div>
      </div>
    </footer>
  );
}
