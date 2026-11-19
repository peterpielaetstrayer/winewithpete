import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Community Gatherings | Wine With Pete',
  description: 'Explore community tables, fire gatherings, and collaborative Wine With Pete experiences.',
  alternates: { canonical: '/gatherings' },
};

export default function GatheringsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
