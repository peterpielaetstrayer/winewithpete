import { Button } from '@/components/ui/button';

export default function SupportPage(){
  const Tier = ({title, price, note, buttonText}:{title:string; price:string; note:string; buttonText:string}) => (
    <div className="flex items-center justify-between py-4 border-b border-black/10 last:border-b-0">
      <div className="flex items-center gap-4">
        <div className="w-3 h-3 rounded-full bg-[var(--wwp-ember)]"></div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-black/70">{price}</div>
          <div className="text-sm italic text-black/60 mt-1">{note}</div>
        </div>
      </div>
      <Button className="bg-black hover:bg-black/80 text-white rounded-full px-6">
        {buttonText}
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-serif">Support Wine With Pete</h1>
      <p className="mt-4 text-black/80 italic">
        This work is built on stories, sips, firelight, and real support.
      </p>
      
      <div className="mt-8 space-y-2 text-black/80">
        <p>If you've ever read something here that made you pause, breathe, or feel a little less alone — thank you. That means we met.</p>
        <p>You can help this project grow by supporting it financially, one glass at a time. Whether it's a single cup of coffee or a deep investment in the long-term vision, every bit fuels the writing, the conversations, and the future.</p>
      </div>

      <div className="mt-12">
        <div className="text-center mb-8">
          <div className="inline-block border-t border-black/20 w-full max-w-xs">
            <span className="bg-[var(--wwp-cream)] px-4 text-sm font-medium">Ways to Support</span>
          </div>
        </div>
        
        <div className="space-y-0">
          <Tier 
            title="Buy Me a Coffee" 
            price="$5 – One-Time" 
            note="A small gesture, a big boost."
            buttonText="Give $5"
          />
          <Tier 
            title="Buy Me a Glass of Wine" 
            price="$7/month – Recurring" 
            note="Support the weekly essays every month, like subscribing to a conversation that matters."
            buttonText="Give Monthly"
          />
          <Tier 
            title="Buy Me a Bottle of Wine" 
            price="$30 – One-Time" 
            note="A deeper thank you. Helps cover time, research, and the firewood that keeps this going."
            buttonText="Give $30"
          />
          <Tier 
            title="Buy Me a Really Nice Bottle" 
            price="$50 – One-Time" 
            note="For when you feel this work in your bones and want to honor it."
            buttonText="Give $50"
          />
          <Tier 
            title="Support the Long-Term Vision" 
            price="$250 – One-Time" 
            note="For those who believe in the deeper mission and want to help build something lasting."
            buttonText="Give $250"
          />
        </div>
      </div>
    </div>
  );
}
