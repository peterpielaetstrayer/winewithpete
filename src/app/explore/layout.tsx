import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore | Wine With Pete',
  description: 'Discover real Wine With Pete recipes, dinners, stories and optional field guides in one curated collection.',
  alternates: { canonical: '/explore' },
  robots: { index: true, follow: true },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
