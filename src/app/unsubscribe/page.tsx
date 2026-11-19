import { UnsubscribeForm } from './unsubscribe-form';

export const metadata = { robots: { index: false, follow: false } };

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string | string[]; token?: string | string[] }>;
}) {
  const { id, token } = await searchParams;

  return (
    <div className="min-h-[70vh] bg-[#f4efe7] px-5 py-20 text-[#211d19] sm:px-8 md:px-12">
      <section className="mx-auto max-w-2xl border-y border-black/15 py-12 sm:py-16">
        <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[#9c3d24]">The Founding Table</p>
        <h1 className="mt-6 font-serif text-5xl leading-tight tracking-[-0.035em] sm:text-6xl">Leave the list</h1>
        <p className="mt-6 font-crimson text-2xl leading-9 text-black/65">
          You&apos;re always welcome at the table, with or without the emails.
        </p>
        <UnsubscribeForm
          subscriberId={typeof id === 'string' ? id : ''}
          token={typeof token === 'string' ? token : ''}
        />
      </section>
    </div>
  );
}
