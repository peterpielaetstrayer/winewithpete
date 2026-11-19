import type { Metadata } from 'next';
import RejoinForm from './rejoin-form';

export const metadata: Metadata = {
  title: 'Confirm your return | Wine With Pete',
  robots: { index: false, follow: false },
};

export default async function RejoinPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string; token?: string }>;
}) {
  const { id, token } = await searchParams;
  return <RejoinForm id={id ?? ''} token={token ?? ''} />;
}
