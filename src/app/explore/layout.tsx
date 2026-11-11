import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore | Wine With Pete',
  description: 'Discover real Wine With Pete recipes, dinners, stories and optional field guides in one curated collection.',
  robots: { index: false, follow: false },
};

export default function ExploreLayout({ children }: { children: React.ReactNode }) {
  return children;
}
