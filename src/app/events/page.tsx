import Link from 'next/link';

export default function EventsPage(){
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-serif">Events</h1>
      <p className="mt-4 max-w-2xl">
        Wine With Pete events are an invitation to slow down. We host two types of gatherings:
      </p>

      <div className="mt-10 grid md:grid-cols-2 gap-6">
        <CardBlock title="🔥 Open Fire Sundays"
          desc="Casual, coastal, community-driven. We meet early, cook over fire, and share what's real."
        />
        <CardBlock title="🍷 Salon Dinners"
          desc="Curated, intimate, slower still. A shared meal around hard questions and honest conversation."
        />
      </div>

      <div className="mt-12 text-black/70">
        No upcoming events scheduled. Join the circle to be notified or <Link className="underline" href="/wine-with">become a host</Link>.
      </div>
    </div>
  );
}

function CardBlock({title, desc}:{title:string; desc:string}){
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border">
      <div className="text-lg font-medium">{title}</div>
      <p className="mt-2 text-sm opacity-80">{desc}</p>
    </div>
  );
}
