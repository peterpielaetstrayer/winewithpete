import Image from 'next/image';
import Link from 'next/link';

const journalItems = [
  {
    eyebrow: 'Essay',
    title: 'Why the Table Still Matters',
    copy: 'On belonging, ritual, and one of the oldest social technologies we have.',
    href: '/essays',
    image: '/images/about/about-pete-beach-fire.png.png',
  },
  {
    eyebrow: 'Recipe',
    title: 'Chipotle-Lime Fire Wings',
    copy: 'Smoke, lime, chipotle, agave, and cilantro — food built to be eaten outside.',
    href: '/recipes/chipotle-lime-fire-wings',
    image: '/images/hero/hero-campfire.png.png',
  },
  {
    eyebrow: 'Table',
    title: 'From the Table',
    copy: 'A growing record of the meals, fires, menus, and conversations behind Wine With Pete.',
    href: '/gatherings',
    image: '/images/events/events-community-gathering.png.png',
  },
];

export default function Home() {
  return (
    <div className="bg-[#f4efe7] text-[#211d19]">
      {/* Opening */}
      <section className="relative min-h-[86svh] overflow-hidden bg-black text-white md:min-h-[92vh]">
        <Image
          src="/images/hero/hero-campfire.png.png"
          alt="A Wine With Pete gathering around fire"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,8,6,.88)_0%,rgba(10,8,6,.58)_42%,rgba(10,8,6,.18)_72%,rgba(10,8,6,.25)_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/55 to-transparent" />

        <div className="relative z-10 mx-auto flex min-h-[86svh] max-w-7xl items-end px-5 pb-16 pt-32 sm:px-8 md:min-h-[92vh] md:items-center md:px-12 md:pb-10 md:pt-28 lg:px-16">
          <div className="max-w-3xl">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.28em] text-[#d78959] md:text-xs">
              Wine With Pete
            </p>
            <h1 className="max-w-[14ch] font-serif text-[clamp(2.8rem,6.2vw,5.8rem)] font-medium leading-[0.98] tracking-[-0.035em] text-white">
              Rebuilding the table in an age that keeps teaching us to leave it.
            </h1>
            <p className="mt-7 max-w-xl text-base leading-7 text-white/82 sm:text-lg md:mt-8 md:text-xl md:leading-8">
              Gatherings, stories, and objects shaped around food, wine, fire, hospitality, and conversation.
            </p>
            <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center md:mt-10">
              <Link
                href="#gather"
                className="inline-flex min-h-12 items-center justify-center bg-[#a64225] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#85351f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Gather with us <span className="ml-3" aria-hidden>→</span>
              </Link>
              <Link
                href="#journal"
                className="border-b border-[#d78959] pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:text-[#e3a078] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
              >
                Enter the Journal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why the table */}
      <section className="border-b border-black/10 bg-[#f4efe7] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-[1.05fr_.95fr] md:items-center md:gap-16 lg:gap-24">
          <div className="max-w-2xl">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Why the table</p>
            <h2 className="font-serif text-4xl font-medium leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
              The table is one of humanity&apos;s oldest social technologies.
            </h2>
            <div className="mt-8 max-w-xl space-y-5 font-crimson text-xl leading-8 text-black/72 sm:text-[1.35rem]">
              <p>We eat there. Argue there. Celebrate there. Pass things down there. Learn who each other are there.</p>
              <p>Wine With Pete is an attempt to make that space matter again.</p>
            </div>
          </div>

          <figure className="relative mx-auto aspect-[4/5] w-full max-w-xl overflow-hidden md:mx-0">
            <Image
              src="/images/about/about-pete-beach-fire.png.png"
              alt="Wine With Pete around the fire"
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-cover"
            />
          </figure>
        </div>
      </section>

      {/* Around the table */}
      <section className="border-b border-black/10 bg-[#f4efe7] px-5 py-20 sm:px-8 md:px-12 md:py-24 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[.72fr_1.28fr] lg:gap-16">
            <div className="max-w-md lg:sticky lg:top-10 lg:self-start">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Around the table</p>
              <h2 className="font-serif text-4xl font-medium leading-[1.08] tracking-[-0.025em] sm:text-5xl">
                A growing record of the meals, fires, and conversations that make up Wine With Pete.
              </h2>
              <Link href="/gatherings" className="mt-8 inline-block border-b border-[#9c3d24] pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9c3d24]">
                Explore the tables →
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <article className="sm:col-span-2">
                <div className="relative aspect-[16/9] overflow-hidden bg-black">
                  <Image
                    src="/images/events/events-community-gathering.png.png"
                    alt="A Wine With Pete gathering"
                    fill
                    sizes="(max-width: 1024px) 100vw, 65vw"
                    className="object-cover transition-transform duration-700 hover:scale-[1.015]"
                  />
                </div>
                <div className="mt-4 border-t border-black/15 pt-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9c3d24]">Table notes</p>
                  <h3 className="mt-2 font-serif text-2xl">Gatherings with a reason to exist.</h3>
                </div>
              </article>

              <article>
                <div className="relative aspect-[4/5] overflow-hidden bg-black">
                  <Image
                    src="/images/hero/hero-campfire.png.png"
                    alt="Cooking over fire"
                    fill
                    sizes="(max-width: 640px) 100vw, 32vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">From the fire</p>
                <h3 className="mt-1 font-serif text-xl">Fire changes the pace of an evening.</h3>
              </article>

              <article className="sm:pt-16">
                <div className="relative aspect-[4/5] overflow-hidden bg-black">
                  <Image
                    src="/images/about/about-pete-beach-fire.png.png"
                    alt="A gathering shaped around fire and conversation"
                    fill
                    sizes="(max-width: 640px) 100vw, 32vw"
                    className="object-cover"
                  />
                </div>
                <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.22em] text-black/50">The work</p>
                <h3 className="mt-1 font-serif text-xl">Food is part of it. The table is the point.</h3>
              </article>
            </div>
          </div>
        </div>
      </section>

      {/* Gather */}
      <section id="gather" className="scroll-mt-20 border-b border-black/10 bg-[#eee4d7] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 max-w-3xl md:mb-16">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Gather</p>
            <h2 className="font-serif text-4xl font-medium leading-[1.05] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
              Bring people together. We&apos;ll help shape what happens around the table.
            </h2>
          </div>

          <div className="grid gap-px bg-black/15 lg:grid-cols-2">
            <article className="grid bg-[#f4efe7] md:grid-cols-[1.02fr_.98fr] lg:grid-cols-1 xl:grid-cols-[1.02fr_.98fr]">
              <div className="relative min-h-[340px] md:min-h-[460px] lg:min-h-[390px] xl:min-h-[500px]">
                <Image
                  src="/images/events/events-community-gathering.png.png"
                  alt="A privately hosted Wine With Pete table"
                  fill
                  sizes="(max-width: 1024px) 100vw, 32vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between p-7 sm:p-9">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9c3d24]">Signature Table</p>
                  <h3 className="mt-5 font-serif text-3xl leading-tight">Pete designs and hosts the table.</h3>
                  <p className="mt-5 leading-7 text-black/65">
                    A privately hosted Wine With Pete evening shaped around your people, place, food, wine, and reason for gathering.
                  </p>
                </div>
                <Link href="/signature-table" className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-[#9c3d24]">
                  Host a Signature Table →
                </Link>
              </div>
            </article>

            <article className="grid bg-[#f4efe7] md:grid-cols-[1.02fr_.98fr] lg:grid-cols-1 xl:grid-cols-[1.02fr_.98fr]">
              <div className="relative min-h-[340px] md:min-h-[460px] lg:min-h-[390px] xl:min-h-[500px]">
                <Image
                  src="/images/about/about-pete-beach-fire.png.png"
                  alt="Planning a gathering with Wine With Pete"
                  fill
                  sizes="(max-width: 1024px) 100vw, 32vw"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col justify-between p-7 sm:p-9">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9c3d24]">Gathering Blueprint</p>
                  <h3 className="mt-5 font-serif text-3xl leading-tight">Your table. Your people. A plan built for the evening.</h3>
                  <p className="mt-5 leading-7 text-black/65">
                    Wine With Pete designs the menu direction, wine, flow, atmosphere, and gathering structure. You bring it to life.
                  </p>
                </div>
                <Link href="/plan" className="mt-8 text-xs font-semibold uppercase tracking-[0.16em] text-[#9c3d24]">
                  Plan your gathering →
                </Link>
              </div>
            </article>
          </div>

          <p className="mt-8 text-sm text-black/60">
            Not every table is private. From time to time, we open the table.{' '}
            <Link href="/gatherings" className="border-b border-black/35 text-black/80">Explore community tables →</Link>
          </p>
        </div>
      </section>

      {/* Journal */}
      <section id="journal" className="scroll-mt-20 border-b border-black/10 bg-[#f4efe7] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[.68fr_1.32fr] lg:gap-16">
            <div className="max-w-lg">
              <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">The Journal</p>
              <h2 className="font-serif text-4xl font-medium leading-[1.07] tracking-[-0.025em] sm:text-5xl">
                Food, wine, fire, places, people — and what happens when we gather around them.
              </h2>
              <Link href="/essays" className="mt-8 inline-block border-b border-[#9c3d24] pb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#9c3d24]">
                Enter the Journal →
              </Link>
            </div>

            <div className="divide-y divide-black/15 border-y border-black/15">
              {journalItems.map((item) => (
                <Link key={item.title} href={item.href} className="group grid gap-5 py-5 sm:grid-cols-[180px_1fr] sm:items-center md:grid-cols-[220px_1fr]">
                  <div className="relative aspect-[16/10] overflow-hidden bg-black">
                    <Image src={item.image} alt="" fill sizes="220px" className="object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#9c3d24]">{item.eyebrow}</p>
                    <h3 className="mt-2 font-serif text-2xl transition-colors group-hover:text-[#9c3d24]">{item.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-6 text-black/58">{item.copy}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Manifesto */}
      <section className="relative isolate overflow-hidden bg-black px-5 py-24 text-white sm:px-8 md:px-12 md:py-32 lg:px-16">
        <Image
          src="/images/hero/hero-campfire.png.png"
          alt=""
          fill
          sizes="100vw"
          className="-z-20 object-cover opacity-55"
        />
        <div className="absolute inset-0 -z-10 bg-black/55" />
        <blockquote className="mx-auto max-w-5xl text-center font-serif text-4xl leading-[1.08] tracking-[-0.02em] sm:text-5xl md:text-6xl">
          The point was never dinner.
          <br />
          The point was what dinner made possible.
        </blockquote>
      </section>

      {/* Founding Table */}
      <section className="bg-[#f4efe7] px-5 py-20 sm:px-8 md:px-12 md:py-28 lg:px-16">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:gap-20">
          <div className="relative aspect-[4/3] overflow-hidden bg-black">
            <Image
              src="/images/events/events-community-gathering.png.png"
              alt="A place at the Wine With Pete table"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div className="max-w-2xl">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">Founding Table</p>
            <h2 className="font-serif text-5xl font-medium leading-none tracking-[-0.025em] sm:text-6xl">Pull up a chair.</h2>
            <p className="mt-7 max-w-xl font-crimson text-xl leading-8 text-black/68">
              The Founding Table is the closer circle around Wine With Pete — new tables, invitations, field notes, essays, recipes, and things we&apos;re building before they reach everyone else.
            </p>
            <Link
              href="/join"
              className="mt-9 inline-flex min-h-12 items-center justify-center bg-[#9c3d24] px-6 text-xs font-semibold uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#7f301d]"
            >
              Join the Founding Table <span className="ml-3" aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
