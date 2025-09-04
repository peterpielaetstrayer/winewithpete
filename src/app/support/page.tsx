import { Button } from '@/components/ui/button';

export default function SupportPage(){
  const Tier = ({title, price, note, buttonText}:{title:string; price:string; note:string; buttonText:string}) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 border-b border-black/10 last:border-b-0 gap-4">
      <div className="flex items-center gap-4">
        <div className="w-3 h-3 rounded-full bg-[var(--wwp-ember)] flex-shrink-0"></div>
        <div>
          <div className="font-medium">{title}</div>
          <div className="text-sm text-black/70">{price}</div>
          <div className="text-sm italic text-black/60 mt-1">{note}</div>
        </div>
      </div>
      <Button className="bg-black hover:bg-black/80 text-white rounded-full px-6 self-start sm:self-auto">
        {buttonText}
      </Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-serif font-semibold">Support Wine With Pete</h1>
      <p className="mt-4 text-black/80 italic">
        This work is built on stories, sips, firelight, and real support.
      </p>
      
      <div className="mt-8 space-y-2 text-black/80">
        <p>If you&apos;ve ever read something here that made you pause, breathe, or feel a little less alone — thank you. That means we met.</p>
        <p>You can help this project grow by supporting it financially, one glass at a time. Whether it&apos;s a single cup of coffee or a deep investment in the long-term vision, every bit fuels the writing, the conversations, and the future.</p>
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
            note="A small gesture that helps keep the fire burning. Supports one community gathering."
            buttonText="Give $5"
          />
          <Tier 
            title="Buy Me a Glass of Wine" 
            price="$7/month – Recurring" 
            note="Monthly support for the community. Enables weekly essays, event planning, and keeps the conversation flowing."
            buttonText="Give Monthly"
          />
          <Tier 
            title="Support the Vision" 
            price="$50 – One-Time" 
            note="For those who believe in building something lasting. Helps fund larger events, partnerships, and community growth."
            buttonText="Give $50"
          />
        </div>
      </div>
    </div>
  );
}
