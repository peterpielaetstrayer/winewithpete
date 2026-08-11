import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About | Wine With Pete',
  description:
    'Why Wine With Pete exists, the path that led Pete to the table, and the gathering culture project growing around food, wine, fire, hospitality, and conversation.',
  alternates: { canonical: '/about' },
};

export default function AboutPage() {
  return (
    <main className="bg-[#f4efe7] text-[#211d19]">
      <section className="border-b border-black/10 px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">About Wine With Pete</p>
          <div className="mt-5 grid gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-end lg:gap-20">
            <h1 className="max-w-[11ch] font-serif text-5xl font-medium leading-[.98] tracking-[-0.035em] sm:text-6xl md:text-7xl">
              It began with a simple suspicion: the table still matters.
            </h1>
            <p className="max-w-xl font-crimson text-2xl leading-9 text-black/68 sm:text-[1.6rem] sm:leading-10">
              Wine With Pete is an attempt to rebuild some of the human infrastructure that modern life keeps making easier to neglect.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.78fr_1.22fr] lg:gap-20">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Why the table</p>
          </div>
          <div className="max-w-4xl">
            <p className="font-serif text-4xl leading-[1.08] tracking-[-0.02em] sm:text-5xl">
              We have spent centuries building technologies that help us move faster, travel farther, and communicate instantly. None of that guarantees that we know how to be together.
            </p>
            <div className="mt-9 max-w-3xl space-y-6 font-crimson text-xl leading-8 text-black/66 sm:text-2xl sm:leading-9">
              <p>
                The table is ordinary enough to overlook. But people have used it to feed one another, argue, celebrate, teach, grieve, negotiate, flirt, tell stories, pass traditions down, and make sense of the world.
              </p>
              <p>
                Wine With Pete takes that ordinary technology seriously. Food matters. Wine matters. Fire matters. Atmosphere matters. But they matter because of what they can make possible between people.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/10 bg-[#eee4d7] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:gap-20">
          <div className="relative min-h-[520px] overflow-hidden bg-black sm:min-h-[650px]">
            <Image
              src="/images/about/about-pete-beach-fire.png.png"
              alt="Pete around an outdoor fire"
              fill
              sizes="(max-width: 1024px) 100vw, 52vw"
              className="object-cover"
            />
          </div>

          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Pete</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] tracking-[-0.025em] sm:text-5xl">A winding path back to the table.</h2>
            <div className="mt-7 space-y-5 text-lg leading-8 text-black/64">
              <p>
                I studied psychology, spent time teaching in Korea, and eventually found my way into the wine world, where I spent years learning how history, place, taste, hospitality, and people can meet in a glass.
              </p>
              <p>
                Along the way I kept returning to cooking, fire, writing, and bringing people together. Those interests did not look like one project at first. Over time they began to converge around the same question: what happens when we put real intention into the spaces where people meet?
              </p>
              <p>
                Wine With Pete grew out of that question. The dinners, essays, fire gatherings, recipes, and experiments are all different ways of working on the same thing.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.7fr_1.3fr] lg:gap-20">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">What Wine With Pete is becoming</p>
              <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">One world, expressed in different forms.</h2>
            </div>

            <div className="border-y border-black/15">
              {[
                ['Gather', 'Signature Tables, Gathering Blueprints, community tables, and the real-world experiences at the center of the work.', '/gather'],
                ['Journal', 'Tables, essays, recipes, guides, films, and field notes that document and think through the world around the table.', '/journal'],
                ['Founding Table', 'The closer circle for invitations, new work, experiments, and the things still taking shape.', '/join'],
                ['Objects', 'A future layer for useful and beautiful things that genuinely belong around the table—not merchandise for its own sake.', '/store'],
              ].map(([title, body, href]) => (
                <Link key={title} href={href} className="group grid gap-4 border-b border-black/10 py-8 last:border-b-0 sm:grid-cols-[170px_1fr] sm:gap-8">
                  <h3 className="font-serif text-2xl transition-colors group-hover:text-[#9c3d24]">{title}</h3>
                  <p className="max-w-2xl text-base leading-7 text-black/58">{body}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-black px-5 py-24 text-white sm:px-8 md:px-12 md:py-32 lg:px-16">
        <Image src="/images/hero/hero-campfire.png.png" alt="" fill sizes="100vw" className="-z-20 object-cover opacity-42" />
        <div className="absolute inset-0 -z-10 bg-black/60" />
        <div className="mx-auto max-w-5xl text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#e5a17b]">The thesis</p>
          <p className="mt-7 font-serif text-4xl leading-[1.08] tracking-[-0.025em] sm:text-5xl md:text-6xl">
            Rebuilding the table in an age that keeps teaching us to leave it.
          </p>
        </div>
      </section>

      <section className="px-5 py-20 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Come closer</p>
            <h2 className="mt-5 font-serif text-4xl leading-[1.05] sm:text-5xl">The best way to understand the project is to enter it.</h2>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/gather" className="inline-flex min-h-12 items-center justify-center bg-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white">
              Gather with us
            </Link>
            <Link href="/journal" className="inline-flex min-h-12 items-center justify-center border border-black/30 px-6 text-xs font-semibold uppercase tracking-[0.18em] text-[#211d19]">
              Enter the Journal
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
