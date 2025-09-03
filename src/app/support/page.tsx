import { Button } from '@/components/ui/button';

export default function SupportPage(){
  const Tier = ({title, price, note}:{title:string; price:string; note:string}) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border flex items-center justify-between">
      <div>
        <div className="font-medium">{title}</div>
        <div className="text-sm opacity-70">{price} — {note}</div>
      </div>
      <Button className="rounded-full">Give</Button>
    </div>
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-serif">Support Wine With Pete</h1>
      <p className="mt-4 text-black/80 italic">
        This work is built on stories, sips, firelight, and real support.
      </p>
      <div className="mt-10 grid gap-4">
        <Tier title="Buy me a coffee" price="$5 one-time" note="A small gesture, a big boost." />
        <Tier title="Buy me a glass of wine" price="$7/month" note="Support weekly essays and community." />
        <Tier title="Buy me a bottle" price="$30 one-time" note="Covers time, research, and firewood." />
      </div>
      <p className="mt-6 text-sm opacity-70">Stripe links coming next.</p>
    </div>
  );
}
