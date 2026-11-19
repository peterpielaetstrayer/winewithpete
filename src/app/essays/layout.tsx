import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Essays | Wine With Pete',
  description: 'Writing about gathering, attention, hospitality, culture, and the ideas underneath the table.',
  alternates: { canonical: '/essays' },
};

export default function EssaysLayout({ children }: { children: React.ReactNode }) {
  return children;
}
